import { NextRequest } from "next/server";
import { getAiModelChain, isAiConfigured, streamChatCompletion, type AiMessage } from "@/lib/ai";
import { buildSystemPrompt, getKnowledgeContext } from "@/lib/ai-knowledge";
import { checkAiRateLimit } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Each fallback model may run for up to 20s; keep the whole handler inside the
// Hobby-plan function limit so a slow model degrades instead of timing out.
export const maxDuration = 60;

const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CHARS = 12_000;

// Reasoning models spend part of the budget on hidden thinking before they
// emit any visible text, so a low budget truncates answers mid-sentence.
const MAX_TOKENS = 1_200;
const MODEL_TIMEOUT_MS = 20_000;
// Stay inside the 60s function limit even when every model is slow.
const TOTAL_BUDGET_MS = 50_000;

const SSE_HEADERS = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
};

function jsonError(status: number, code: string, message: string) {
    return Response.json({ error: message, code }, { status });
}

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
    return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Converts a non-streaming JSON completion into an SSE stream. */
function toSseStream(text: string): Response {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            const payload = JSON.stringify({ choices: [{ delta: { content: text } }] });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
        },
    });
    return new Response(stream, { headers: SSE_HEADERS });
}

interface CollectedCompletion {
    text: string;
    finishReason: string | null;
}

/**
 * Reassembles a provider response into plain text so the handler can tell an
 * empty answer from a real one. Providers normally stream SSE, but some
 * (and some fallbacks) ignore `stream: true` and return a single JSON body.
 */
function collectCompletion(raw: string, contentType: string): CollectedCompletion {
    if (contentType.includes("application/json")) {
        try {
            const data = JSON.parse(raw) as {
                choices?: Array<{ message?: { content?: string }; finish_reason?: string | null }>;
            };
            const choice = data.choices?.[0];
            return { text: choice?.message?.content ?? "", finishReason: choice?.finish_reason ?? null };
        } catch {
            return { text: "", finishReason: null };
        }
    }

    let text = "";
    let finishReason: string | null = null;

    for (const line of raw.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;

        try {
            const chunk = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string }; finish_reason?: string | null }>;
            };
            const choice = chunk.choices?.[0];
            if (choice?.delta?.content) text += choice.delta.content;
            if (choice?.finish_reason) finishReason = choice.finish_reason;
        } catch {
            // Keep-alive comment or buffer boundary; nothing to add.
        }
    }

    return { text, finishReason };
}

function parseMessages(value: unknown): AiMessage[] | null {
    if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
        return null;
    }

    const messages: AiMessage[] = [];
    let totalChars = 0;

    for (const item of value) {
        if (typeof item !== "object" || item === null) return null;
        const { role, content } = item as { role?: unknown; content?: unknown };
        if (role !== "user" && role !== "assistant") return null;
        if (typeof content !== "string") return null;

        const trimmed = content.trim();
        if (!trimmed || trimmed.length > MAX_MESSAGE_CHARS) return null;

        totalChars += trimmed.length;
        if (totalChars > MAX_TOTAL_CHARS) return null;

        messages.push({ role, content: trimmed });
    }

    // The conversation must end with a user turn.
    return messages[messages.length - 1]?.role === "user" ? messages : null;
}

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const limit = checkAiRateLimit(ip);

    if (!limit.allowed) {
        return jsonError(
            429,
            "rate_limited",
            `You're sending messages too quickly. Please try again in ${Math.ceil((limit.retryAfter ?? 60) / 60)} minute(s).`
        );
    }

    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return jsonError(400, "invalid_request", "Invalid request body.");
    }

    const history = parseMessages((payload as { messages?: unknown })?.messages);
    if (!history) {
        return jsonError(400, "invalid_request", "Please send a valid conversation.");
    }

    if (!isAiConfigured()) {
        return jsonError(503, "not_configured", "The AI assistant is being set up. Please use WhatsApp or call us for now.");
    }

    try {
        // Retrieve FAQ entries relevant to the latest visitor message only.
        const lastUserMessage = [...history].reverse().find((message) => message.role === "user")?.content ?? "";
        const context = await getKnowledgeContext(lastUserMessage);
        const messages: AiMessage[] = [{ role: "system", content: buildSystemPrompt(context) }, ...history];

        const models = getAiModelChain();
        const deadline = Date.now() + TOTAL_BUDGET_MS;

        let lastStatus: number | undefined;
        let sawRateLimit = false;

        // A free model can be rate-limited, time out, or spend its whole token
        // budget on hidden reasoning and return no visible text. Try the next
        // model instead of showing the visitor an error.
        for (const model of models) {
            const remaining = deadline - Date.now();
            if (remaining < 2_000) break;

            let upstream: Response;
            try {
                upstream = await streamChatCompletion(messages, {
                    temperature: 0.4,
                    maxTokens: MAX_TOKENS,
                    model,
                    signal: AbortSignal.timeout(Math.min(MODEL_TIMEOUT_MS, remaining)),
                });
            } catch (error) {
                console.warn(
                    `AI assistant: ${model} request failed:`,
                    error instanceof Error ? error.message : error
                );
                continue;
            }

            if (!upstream.ok) {
                lastStatus = upstream.status;
                if (upstream.status === 429) sawRateLimit = true;
                const detail = await upstream.text().catch(() => "");
                console.error(`AI assistant: ${model} returned ${upstream.status}`, detail.slice(0, 500));

                // Only a different model can rescue a rate limit or provider fault.
                if (upstream.status === 429 || upstream.status >= 500) continue;
                break;
            }

            const contentType = upstream.headers.get("content-type") || "";
            const raw = await upstream.text().catch(() => "");
            const { text, finishReason } = collectCompletion(raw, contentType);

            if (!text.trim()) {
                console.warn(`AI assistant: ${model} returned no content (finish_reason=${finishReason})`);
                continue;
            }

            if (finishReason === "length") {
                console.warn(`AI assistant: ${model} answer truncated at ${MAX_TOKENS} tokens`);
            }

            // Re-emit normalized SSE so the client always receives the shape it parses.
            return contentType.includes("application/json") ? toSseStream(text) : new Response(raw, { headers: SSE_HEADERS });
        }

        if (sawRateLimit) {
            return jsonError(429, "rate_limited", "The assistant is busy right now. Please try again in a minute, or WhatsApp us.");
        }

        if (lastStatus !== undefined) {
            return jsonError(502, "upstream_error", "The assistant is unavailable right now. Please try again or WhatsApp us.");
        }

        return jsonError(
            502,
            "empty_response",
            "Sorry, I couldn't put an answer together. Please try rephrasing, or WhatsApp us and our team will help."
        );
    } catch (error) {
        console.error("AI assistant request failed:", error instanceof Error ? error.message : error);
        return jsonError(504, "timeout", "The assistant took too long to respond. Please try again.");
    }
}

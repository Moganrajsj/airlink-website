import { NextRequest } from "next/server";
import { isAiConfigured, streamChatCompletion, type AiMessage } from "@/lib/ai";
import { buildSystemPrompt, getKnowledgeContext } from "@/lib/ai-knowledge";
import { checkAiRateLimit } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CHARS = 12_000;

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

        const upstream = await streamChatCompletion(messages, {
            temperature: 0.4,
            maxTokens: 500,
            signal: AbortSignal.timeout(45_000),
        });

        if (!upstream.ok) {
            const detail = await upstream.text().catch(() => "");
            console.error("AI upstream error:", upstream.status, detail.slice(0, 500));
            return jsonError(502, "upstream_error", "The assistant is unavailable right now. Please try again or WhatsApp us.");
        }

        const contentType = upstream.headers.get("content-type") || "";

        // Some providers ignore stream:true and return a single JSON payload.
        if (contentType.includes("application/json")) {
            const data = await upstream.json().catch(() => null);
            const text: string = data?.choices?.[0]?.message?.content ?? "";
            if (!text) {
                return jsonError(502, "empty_response", "The assistant could not answer that. Please try rephrasing.");
            }
            return toSseStream(text);
        }

        if (!upstream.body) {
            return jsonError(502, "empty_response", "The assistant could not answer that. Please try again.");
        }

        return new Response(upstream.body, { headers: SSE_HEADERS });
    } catch (error) {
        console.error("AI assistant request failed:", error instanceof Error ? error.message : error);
        return jsonError(504, "timeout", "The assistant took too long to respond. Please try again.");
    }
}

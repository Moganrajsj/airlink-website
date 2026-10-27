/**
 * Provider-agnostic client for OpenAI-compatible chat completion APIs.
 *
 * Works with OpenRouter (default) or Groq by changing only env vars:
 *   OpenRouter: AI_BASE_URL=https://openrouter.ai/api/v1  AI_MODEL=openai/gpt-4o-mini
 *   Groq:       AI_BASE_URL=https://api.groq.com/openai/v1  AI_MODEL=llama-3.3-70b-versatile
 *
 * The API key is only ever read on the server. Never import this file from a
 * client component.
 */

export type AiRole = "system" | "user" | "assistant";

export interface AiMessage {
    role: AiRole;
    content: string;
}

const DEFAULT_OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const GROQ_BASE = "https://api.groq.com/openai/v1";

/** Accepts AI_API_KEY, or GROQ_API_KEY as a convenience alias. */
function getApiKey(): string | undefined {
    return process.env.AI_API_KEY?.trim() || process.env.GROQ_API_KEY?.trim() || undefined;
}

function getBaseUrl(): string {
    const explicit = process.env.AI_BASE_URL?.trim();
    if (explicit) return explicit.replace(/\/+$/, "");

    // If only a Groq key is present, default to Groq.
    if (!process.env.AI_API_KEY && process.env.GROQ_API_KEY) return GROQ_BASE;
    return DEFAULT_OPENROUTER_BASE;
}

function getDefaultModel(baseUrl: string): string {
    if (baseUrl.includes("groq.com")) return "openai/gpt-oss-20b";
    return "openai/gpt-4o-mini";
}

export function getAiModel(): string {
    const baseUrl = getBaseUrl();
    return process.env.AI_MODEL || getDefaultModel(baseUrl);
}

export function isAiConfigured(): boolean {
    return Boolean(getApiKey());
}

/**
 * The primary model plus any fallbacks configured in `AI_MODEL_FALLBACKS`.
 * Used when the free tier is rate-limiting one model but another still works.
 */
export function getAiModelChain(): string[] {
    const primary = getAiModel();
    const configured = (process.env.AI_MODEL_FALLBACKS || "")
        .split(",")
        .map((model) => model.trim())
        .filter(Boolean);
    return [primary, ...configured].filter((model, index, all) => all.indexOf(model) === index);
}

function buildHeaders(apiKey: string, baseUrl: string): Record<string, string> {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
    };

    // OpenRouter attribution headers (ignored by other providers).
    if (baseUrl.includes("openrouter.ai")) {
        headers["HTTP-Referer"] = process.env.APP_URL || "https://www.srirambroadband.com";
        headers["X-Title"] = "Airlink Broadband Assistant";
    }

    return headers;
}

/**
 * Calls the upstream chat completions endpoint with streaming enabled and
 * returns the raw Response so the caller can pipe the SSE stream to the client.
 */
export async function streamChatCompletion(
    messages: AiMessage[],
    options?: { temperature?: number; maxTokens?: number; signal?: AbortSignal }
): Promise<Response> {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("AI_API_KEY is not configured");
    }

    const baseUrl = getBaseUrl();
    const headers = buildHeaders(apiKey, baseUrl);

    return fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            model: getAiModel(),
            messages,
            temperature: options?.temperature ?? 0.4,
            max_tokens: options?.maxTokens ?? 500,
            stream: true,
        }),
        signal: options?.signal ?? AbortSignal.timeout(45_000),
    });
}

export interface AiCompletionUsage {
    tokensIn: number;
    tokensOut: number;
}

export type AiCompletionResult =
    | { ok: true; content: string; model: string; usage: AiCompletionUsage }
    | { ok: false; error: string; status?: number; quotaExhausted: boolean };

/**
 * Non-streaming completion for background jobs (lead enrichment). Tries the
 * primary model first and then each fallback model, so a single rate-limited
 * free model does not break the feature.
 */
export async function createChatCompletion(
    messages: AiMessage[],
    options?: {
        temperature?: number;
        maxTokens?: number;
        json?: boolean;
        timeoutMs?: number;
        models?: string[];
    }
): Promise<AiCompletionResult> {
    const apiKey = getApiKey();
    if (!apiKey) {
        return { ok: false, error: "AI_API_KEY is not configured", quotaExhausted: false };
    }

    const baseUrl = getBaseUrl();
    const headers = buildHeaders(apiKey, baseUrl);
    const models = options?.models?.length ? options.models : getAiModelChain();
    const timeoutMs = options?.timeoutMs ?? 10_000;

    let lastError = "No model available";
    let lastStatus: number | undefined;
    let quotaExhausted = false;

    for (const model of models) {
        try {
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    model,
                    messages,
                    temperature: options?.temperature ?? 0.2,
                    max_tokens: options?.maxTokens ?? 300,
                    ...(options?.json ? { response_format: { type: "json_object" } } : {}),
                }),
                signal: AbortSignal.timeout(timeoutMs),
            });

            if (!response.ok) {
                const body = await response.text().catch(() => "");
                lastStatus = response.status;
                lastError = `HTTP ${response.status}: ${body.slice(0, 300)}`;
                if (response.status === 429) quotaExhausted = true;
                console.warn(`AI completion failed on ${model} (${response.status})`);
                continue;
            }

            const payload = (await response.json()) as {
                model?: string;
                choices?: Array<{ message?: { content?: string } }>;
                usage?: { prompt_tokens?: number; completion_tokens?: number };
            };

            const content = payload?.choices?.[0]?.message?.content;
            if (typeof content !== "string" || !content.trim()) {
                lastError = "Empty completion";
                continue;
            }

            return {
                ok: true,
                content,
                model: payload.model || model,
                usage: {
                    tokensIn: payload?.usage?.prompt_tokens ?? 0,
                    tokensOut: payload?.usage?.completion_tokens ?? 0,
                },
            };
        } catch (error) {
            lastError = error instanceof Error ? error.message : "AI request failed";
            console.warn(`AI completion error on ${model}: ${lastError}`);
        }
    }

    return { ok: false, error: lastError, status: lastStatus, quotaExhausted };
}

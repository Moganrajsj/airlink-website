// Simple in-memory rate limiter for lead submissions
// Max 3 submissions per IP per hour

const ipSubmissions = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxRequests = 3;

    const record = ipSubmissions.get(ip);

    if (!record || now > record.resetAt) {
        // New window
        ipSubmissions.set(ip, { count: 1, resetAt: now + windowMs });
        return { allowed: true };
    }

    if (record.count >= maxRequests) {
        const retryAfter = Math.ceil((record.resetAt - now) / 1000);
        return { allowed: false, retryAfter };
    }

    record.count++;
    return { allowed: true };
}

// Separate limiter for the AI assistant: chat is chattier than lead forms,
// but each request costs money, so cap it per IP.
const aiRequests = new Map<string, { count: number; resetAt: number }>();
const AI_WINDOW_MS = 10 * 60 * 1000;
const AI_MAX_REQUESTS = 25;

export function checkAiRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = aiRequests.get(ip);

    if (!record || now > record.resetAt) {
        aiRequests.set(ip, { count: 1, resetAt: now + AI_WINDOW_MS });
        return { allowed: true };
    }

    if (record.count >= AI_MAX_REQUESTS) {
        return { allowed: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
    }

    record.count++;
    return { allowed: true };
}

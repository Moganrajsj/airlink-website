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

import { prisma } from "@/lib/prisma";

/**
 * Durable, configurable rate limiting.
 *
 * Counters live in MySQL (`RateLimitBucket`) so limits survive restarts and are
 * shared by every Passenger worker. If the database is unreachable the limiter
 * fails open — a database outage must not take lead capture down with it.
 */

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}

export function envInt(name: string, fallback: number): number {
    const parsed = Number(process.env[name]);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export async function consumeRateLimit(
    key: string,
    limit: number,
    windowMs: number
): Promise<RateLimitResult> {
    const now = new Date();

    try {
        const existing = await prisma.rateLimitBucket.findUnique({ where: { key } });

        if (!existing || now.getTime() - existing.windowStart.getTime() >= windowMs) {
            await prisma.rateLimitBucket.upsert({
                where: { key },
                create: { key, count: 1, windowStart: now },
                update: { count: 1, windowStart: now },
            });
            return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 };
        }

        if (existing.count >= limit) {
            const retryAfterSeconds = Math.max(
                1,
                Math.ceil((existing.windowStart.getTime() + windowMs - now.getTime()) / 1000)
            );
            return { allowed: false, remaining: 0, retryAfterSeconds };
        }

        await prisma.rateLimitBucket.update({
            where: { key },
            data: { count: { increment: 1 } },
        });
        return { allowed: true, remaining: Math.max(0, limit - existing.count - 1), retryAfterSeconds: 0 };
    } catch (error) {
        console.warn("Rate limiting unavailable, allowing request:", error instanceof Error ? error.message : error);
        return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
    }
}

/** Housekeeping: drop buckets whose window ended more than a day ago. */
export async function pruneRateLimitBuckets(): Promise<void> {
    try {
        await prisma.rateLimitBucket.deleteMany({
            where: { windowStart: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        });
    } catch {
        // Best effort only.
    }
}

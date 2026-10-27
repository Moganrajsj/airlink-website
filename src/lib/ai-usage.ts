import { prisma } from "@/lib/prisma";

/**
 * DB-backed daily quota for AI calls.
 *
 * The counter lives in MySQL (not in memory) so it survives restarts and stays
 * accurate when the app runs as several Passenger processes. It protects the
 * free-tier budget: when the daily limit is reached, lead scoring quietly falls
 * back to heuristics instead of failing.
 */

const DEFAULT_DAILY_LIMIT = 150;

export interface AiUsageSnapshot {
    requests: number;
    failures: number;
    tokensIn: number;
    tokensOut: number;
    limit: number;
    remaining: number;
}

export interface AiQuotaReservation extends AiUsageSnapshot {
    allowed: boolean;
}

export function getAiDailyLimit(): number {
    const configured = Number(process.env.AI_SCORE_DAILY_LIMIT);
    if (Number.isFinite(configured) && configured > 0) return Math.floor(configured);
    return DEFAULT_DAILY_LIMIT;
}

/** Quota days are UTC days, matching `@db.Date` semantics in MySQL. */
function today(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function toSnapshot(row: { requests: number; failures: number; tokensIn: number; tokensOut: number } | null): AiUsageSnapshot {
    const limit = getAiDailyLimit();
    const requests = row?.requests ?? 0;
    return {
        requests,
        failures: row?.failures ?? 0,
        tokensIn: row?.tokensIn ?? 0,
        tokensOut: row?.tokensOut ?? 0,
        limit,
        remaining: Math.max(0, limit - requests),
    };
}

export async function getAiUsage(): Promise<AiUsageSnapshot> {
    try {
        const row = await prisma.aiUsage.findUnique({ where: { day: today() } });
        return toSnapshot(row);
    } catch (error) {
        console.warn("getAiUsage failed:", error instanceof Error ? error.message : error);
        return toSnapshot(null);
    }
}

/**
 * Reserves one request against today's quota.
 * Returns `allowed: false` when the free-tier budget for the day is used up.
 */
export async function reserveAiRequest(): Promise<AiQuotaReservation> {
    const day = today();
    const limit = getAiDailyLimit();

    try {
        const existing = await prisma.aiUsage.findUnique({ where: { day } });
        if ((existing?.requests ?? 0) >= limit) {
            return { ...toSnapshot(existing), allowed: false };
        }

        const row = await prisma.aiUsage.upsert({
            where: { day },
            create: { day, requests: 1 },
            update: { requests: { increment: 1 } },
        });
        return { ...toSnapshot(row), allowed: true };
    } catch (error) {
        // Never let a quota-table problem take down lead capture. Allow the call
        // but log loudly so the table can be checked.
        console.error("AiUsage quota check failed:", error instanceof Error ? error.message : error);
        return { ...toSnapshot(null), allowed: true };
    }
}

export async function recordAiFailure(): Promise<void> {
    try {
        await prisma.aiUsage.upsert({
            where: { day: today() },
            create: { day: today(), failures: 1 },
            update: { failures: { increment: 1 } },
        });
    } catch (error) {
        console.warn("recordAiFailure failed:", error instanceof Error ? error.message : error);
    }
}

export async function recordAiTokens(tokensIn: number, tokensOut: number): Promise<void> {
    if (!Number.isFinite(tokensIn) && !Number.isFinite(tokensOut)) return;
    const safeIn = Number.isFinite(tokensIn) && tokensIn > 0 ? Math.floor(tokensIn) : 0;
    const safeOut = Number.isFinite(tokensOut) && tokensOut > 0 ? Math.floor(tokensOut) : 0;
    if (safeIn === 0 && safeOut === 0) return;

    try {
        await prisma.aiUsage.upsert({
            where: { day: today() },
            create: { day: today(), tokensIn: safeIn, tokensOut: safeOut },
            update: { tokensIn: { increment: safeIn }, tokensOut: { increment: safeOut } },
        });
    } catch (error) {
        console.warn("recordAiTokens failed:", error instanceof Error ? error.message : error);
    }
}

import { prisma } from "@/lib/prisma";

/**
 * Data-retention housekeeping.
 *
 * Retention is deliberately conservative: no lead is ever deleted here. The
 * job drops only the technical abuse signals that stopped being useful
 * (`ipHash`, `userAgentHash`) and expires short-lived operational rows. The
 * customer's own submission, validation result and review history stay intact
 * so a genuine enquiry is never lost.
 *
 * All windows are configurable so the policy in the privacy notice can be
 * matched without a code change.
 */

function daysFromEnv(name: string, fallback: number): number {
    const raw = Number(process.env[name]);
    if (!Number.isFinite(raw) || raw <= 0) return fallback;
    return Math.floor(raw);
}

export interface RetentionResult {
    ranAt: string;
    piiScrubbed: number;
    rateLimitBuckets: number;
    securityEvents: number;
    windows: {
        piiDays: number;
        securityEventDays: number;
    };
}

export async function runRetention(): Promise<RetentionResult> {
    const piiDays = daysFromEnv("LEAD_PII_RETENTION_DAYS", 90);
    const securityEventDays = daysFromEnv("SECURITY_EVENT_RETENTION_DAYS", 180);

    const piiCutoff = new Date(Date.now() - piiDays * 24 * 60 * 60 * 1000);
    const securityCutoff = new Date(Date.now() - securityEventDays * 24 * 60 * 60 * 1000);

    // Rate-limit windows are at most a few hours long; anything older than a day
    // is dead weight.
    const bucketCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [pii, buckets, events] = await Promise.all([
        prisma.lead.updateMany({
            where: {
                createdAt: { lt: piiCutoff },
                OR: [{ ipHash: { not: null } }, { userAgentHash: { not: null } }],
            },
            data: { ipHash: null, userAgentHash: null },
        }),
        prisma.rateLimitBucket.deleteMany({ where: { windowStart: { lt: bucketCutoff } } }),
        prisma.securityEvent.deleteMany({ where: { createdAt: { lt: securityCutoff } } }),
    ]);

    const result: RetentionResult = {
        ranAt: new Date().toISOString(),
        piiScrubbed: pii.count,
        rateLimitBuckets: buckets.count,
        securityEvents: events.count,
        windows: { piiDays, securityEventDays },
    };

    // Record that the job ran. This row contains no customer data.
    await prisma.securityEvent
        .create({
            data: {
                kind: "retention_run",
                detail: JSON.stringify(result),
            },
        })
        .catch(() => {});

    return result;
}

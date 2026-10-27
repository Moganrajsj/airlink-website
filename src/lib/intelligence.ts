import { prisma } from "@/lib/prisma";

/**
 * Admin intelligence analytics.
 *
 * Every number here is computed from the live database with Prisma queries.
 * Nothing is estimated, sampled or hard-coded: when there is not enough data to
 * compute a rate honestly the functions return `null` and the UI shows "—"
 * instead of inventing a figure.
 *
 * Sales quality (`qualityScore`, `classification`) and abuse risk (`spamRisk`,
 * `botRisk`) are reported separately on purpose. A lead can be a poor sales fit
 * without being spam, and vice versa.
 */

export const LIVE_COVERAGE = /live|active|available|covered|serviceable|^yes$/i;
export const PLANNED_COVERAGE = /coming|soon|planned|expansion/i;

export interface MetricCounts {
    total: number;
    valid: number;
    invalid: number;
    suspicious: number;
    spam: number;
    duplicates: number;
    qualified: number;
    serviceable: number;
    contacted: number;
    converted: number;
    phoneFormatValid: number;
    phoneVerified: number;
    unverifiedPhone: number;
    scaled: number;
}

export interface TrendPoint {
    date: string;
    total: number;
    spam: number;
    converted: number;
}

export interface OutcomeMetrics {
    /** Leads a human has actually reviewed. */
    reviewed: number;
    confirmedSpam: number;
    confirmedGenuine: number;
    invalidContact: number;
    outOfCoverage: number;
    unreachable: number;
    /**
     * Share of abuse-flagged leads that a human later marked genuine.
     * `null` until at least one flagged lead has been reviewed.
     */
    falsePositiveRate: number | null;
    /** Share of human-reviewed leads that were confirmed spam. */
    spamDetectionRate: number | null;
    /** 1 - falsePositiveRate. */
    genuineRetention: number | null;
    validContactRate: number;
    qualifiedRate: number;
    conversionRate: number;
    followUp: {
        contacted: number;
        convertedAfterContact: number;
        conversionAfterContactRate: number | null;
        averageHoursToFirstContact: number | null;
    };
}

export interface IntelligenceMetrics {
    counts: MetricCounts;
    rates: {
        spamRate: number;
        conversionRate: number;
        validRate: number;
    };
    observationMode: boolean;
    trends: TrendPoint[];
    outcomes: OutcomeMetrics;
    aiUsage: { requests: number; limit: number };
    coverageAreas: { live: number; planned: number };
}

function ratio(numerator: number, denominator: number): number | null {
    if (denominator <= 0) return null;
    return numerator / denominator;
}

function dayKey(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function liveAreaNames(rows: { cityName: string; status: string }[]): string[] {
    return rows.filter((row) => LIVE_COVERAGE.test(row.status)).map((row) => row.cityName);
}

export function observationMode(): boolean {
    return process.env.AI_OBSERVATION_MODE !== "false";
}

export async function getIntelligenceMetrics(days = 30): Promise<IntelligenceMetrics> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [total, validationGroups, verificationGroups, spamCount, duplicateCount, coverageRows, statusGroups, recent, usage] =
        await Promise.all([
            prisma.lead.count(),
            prisma.lead.groupBy({ by: ["validationStatus"], _count: { _all: true } }),
            prisma.lead.groupBy({ by: ["verificationStatus"], _count: { _all: true } }),
            prisma.lead.count({ where: { status: "spam" } }),
            prisma.lead.count({ where: { duplicateOfId: { not: null } } }),
            prisma.coverage.findMany({ select: { cityName: true, status: true } }),
            prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
            prisma.lead.findMany({
                where: { createdAt: { gte: since } },
                select: { createdAt: true, status: true, validationStatus: true, aiScore: true },
            }),
            prisma.aiUsage.findFirst({ orderBy: { day: "desc" } }).catch(() => null),
        ]);

    const byValidation = new Map(validationGroups.map((row) => [row.validationStatus, row._count._all]));
    const byVerification = new Map(verificationGroups.map((row) => [row.verificationStatus, row._count._all]));
    const byStatus = new Map(statusGroups.map((row) => [row.status, row._count._all]));

    const live = liveAreaNames(coverageRows);
    const serviceable = live.length
        ? await prisma.lead.count({ where: { city: { in: live } } })
        : 0;

    const qualified = await prisma.lead.count({
        where: { OR: [{ classification: "qualified" }, { aiScore: { gte: 70 } }] },
    });

    const phoneFormatValid = (byVerification.get("format_valid") ?? 0) + (byVerification.get("otp_verified") ?? 0);
    const phoneVerified = byVerification.get("otp_verified") ?? 0;

    const counts: MetricCounts = {
        total,
        valid: byValidation.get("valid") ?? 0,
        invalid: byValidation.get("invalid") ?? 0,
        suspicious: byValidation.get("suspicious") ?? 0,
        spam: spamCount,
        duplicates: duplicateCount,
        qualified,
        serviceable,
        contacted: byStatus.get("contacted") ?? 0,
        converted: byStatus.get("converted") ?? 0,
        phoneFormatValid,
        phoneVerified,
        unverifiedPhone: Math.max(0, total - phoneVerified),
        scaled: 0,
    };

    // ── Trends, bucketed from real creation timestamps ───────────────────────
    const buckets = new Map<string, TrendPoint>();
    for (let offset = days - 1; offset >= 0; offset -= 1) {
        const key = dayKey(new Date(Date.now() - offset * 24 * 60 * 60 * 1000));
        buckets.set(key, { date: key, total: 0, spam: 0, converted: 0 });
    }
    for (const lead of recent) {
        const key = dayKey(lead.createdAt);
        const bucket = buckets.get(key);
        if (!bucket) continue;
        bucket.total += 1;
        if (lead.status === "spam" || lead.validationStatus === "invalid") bucket.spam += 1;
        if (lead.status === "converted") bucket.converted += 1;
    }

    // ── Outcome labels ───────────────────────────────────────────────────────
    const [reviewGroups, reviewedLeads, contactedLeads] = await Promise.all([
        prisma.lead.groupBy({ by: ["reviewOutcome"], _count: { _all: true } }),
        prisma.lead.findMany({
            where: { reviewOutcome: { not: null } },
            select: { reviewOutcome: true, spamRisk: true, botRisk: true, status: true },
        }),
        prisma.lead.findMany({
            where: { status: { in: ["contacted", "converted"] } },
            select: { status: true, createdAt: true, lastContactAt: true },
        }),
    ]);

    const byOutcome = new Map(reviewGroups.map((row) => [row.reviewOutcome, row._count._all]));
    const reviewed = reviewedLeads.length;

    const flagged = reviewedLeads.filter(
        (lead) => lead.status === "spam" || (lead.botRisk ?? 0) >= 60 || (lead.spamRisk ?? 0) >= 70
    );
    const flaggedButGenuine = flagged.filter(
        (lead) => lead.reviewOutcome === "genuine" || lead.reviewOutcome === "qualified" || lead.reviewOutcome === "converted"
    );

    const contactGaps = contactedLeads
        .filter((lead) => lead.lastContactAt)
        .map((lead) => (lead.lastContactAt!.getTime() - lead.createdAt.getTime()) / (60 * 60 * 1000))
        .filter((hours) => hours >= 0);

    const outcomes: OutcomeMetrics = {
        reviewed,
        confirmedSpam: byOutcome.get("confirmed_spam") ?? 0,
        confirmedGenuine: (byOutcome.get("genuine") ?? 0) + (byOutcome.get("qualified") ?? 0),
        invalidContact: byOutcome.get("invalid_contact") ?? 0,
        outOfCoverage: byOutcome.get("out_of_coverage") ?? 0,
        unreachable: byOutcome.get("unreachable") ?? 0,
        falsePositiveRate: ratio(flaggedButGenuine.length, flagged.length),
        spamDetectionRate: ratio(byOutcome.get("confirmed_spam") ?? 0, reviewed),
        genuineRetention:
            flagged.length > 0 ? 1 - (flaggedButGenuine.length / flagged.length) : null,
        validContactRate: total > 0 ? phoneFormatValid / total : 0,
        qualifiedRate: total > 0 ? qualified / total : 0,
        conversionRate: total > 0 ? (byStatus.get("converted") ?? 0) / total : 0,
        followUp: {
            contacted: contactedLeads.length,
            convertedAfterContact: contactedLeads.filter((lead) => lead.status === "converted").length,
            conversionAfterContactRate: ratio(
                contactedLeads.filter((lead) => lead.status === "converted").length,
                contactedLeads.length
            ),
            averageHoursToFirstContact:
                contactGaps.length > 0
                    ? contactGaps.reduce((sum, value) => sum + value, 0) / contactGaps.length
                    : null,
        },
    };

    return {
        counts,
        rates: {
            spamRate: total > 0 ? spamCount / total : 0,
            conversionRate: total > 0 ? (byStatus.get("converted") ?? 0) / total : 0,
            validRate: total > 0 ? (byValidation.get("valid") ?? 0) / total : 0,
        },
        observationMode: observationMode(),
        trends: [...buckets.values()],
        outcomes,
        aiUsage: { requests: usage?.requests ?? 0, limit: Number(process.env.AI_DAILY_LIMIT) || 150 },
        coverageAreas: {
            live: coverageRows.filter((row) => LIVE_COVERAGE.test(row.status)).length,
            planned: coverageRows.filter((row) => PLANNED_COVERAGE.test(row.status)).length,
        },
    };
}

// ─── Business intelligence questions ─────────────────────────────────────────

export interface BiAnswer {
    question: string;
    /** Human-readable description of the query that produced the answer. */
    source: string;
    answer: string;
    rows: { label: string; value: number }[];
    /** True when no matching data exists, so the UI can say so honestly. */
    empty: boolean;
}

type Intent =
    | "total"
    | "spam"
    | "converted"
    | "qualified"
    | "suspicious"
    | "unverified"
    | "duplicates"
    | "serviceable"
    | "top_city"
    | "top_source"
    | "followup"
    | "campaign"
    | "trend"
    | "unknown";

const INTENTS: { intent: Intent; patterns: RegExp[] }[] = [
    { intent: "spam", patterns: [/\bspam\b/i, /\bbot/i, /\bfake/i] },
    { intent: "converted", patterns: [/\bconvers/i, /\bsigned\b/i, /\bclosed won\b/i, /\bsales\b/i] },
    { intent: "qualified", patterns: [/\bqualif/i, /\bhot\b/i, /\bhigh.intent\b/i, /\bbest leads?\b/i] },
    { intent: "suspicious", patterns: [/\bsuspicious\b/i, /\bflagged\b/i, /\bneeds? review\b/i] },
    { intent: "unverified", patterns: [/\bunverified\b/i, /\bverified\b/i, /\botp\b/i] },
    { intent: "duplicates", patterns: [/\bduplicate/i, /\brepeat/i] },
    { intent: "serviceable", patterns: [/\bserviceable\b/i, /\bcoverage\b/i, /\bcovered\b/i] },
    { intent: "top_city", patterns: [/\bcity\b/i, /\bcities\b/i, /\barea\b/i, /\blocation/i, /\bwhere\b/i] },
    { intent: "top_source", patterns: [/\bsource\b/i, /\bchannel\b/i, /\bform\b/i, /\bpage\b/i] },
    { intent: "campaign", patterns: [/\bcampaign\b/i, /\battribution\b/i] },
    { intent: "followup", patterns: [/\bfollow.?up\b/i, /\bcontacted\b/i, /\bcall(ed)?\b/i, /\bstale\b/i] },
    { intent: "trend", patterns: [/\btrend\b/i, /\bover time\b/i, /\bthis (week|month)\b/i, /\blast (week|month|7|30)\b/i, /\bdaily\b/i] },
    { intent: "total", patterns: [/\bhow many\b/i, /\btotal\b/i, /\bleads?\b/i, /\benquir/i] },
];

function detectIntent(question: string): Intent {
    for (const { intent, patterns } of INTENTS) {
        if (patterns.some((pattern) => pattern.test(question))) return intent;
    }
    return "unknown";
}

const WINDOW_PATTERNS: { pattern: RegExp; days: number | null; label: string }[] = [
    { pattern: /\btoday\b/i, days: 1, label: "today" },
    { pattern: /\byesterday\b/i, days: 2, label: "since yesterday" },
    { pattern: /\bthis week\b/i, days: 7, label: "in the last 7 days" },
    { pattern: /\blast week\b/i, days: 14, label: "in the last 14 days" },
    { pattern: /\bthis month\b/i, days: 30, label: "in the last 30 days" },
    { pattern: /\blast month\b/i, days: 60, label: "in the last 60 days" },
    { pattern: /\b\d+\s*days?\b/i, days: 30, label: "in the requested window" },
    { pattern: /\ball time\b|\bever\b|\boverall\b/i, days: null, label: "all time" },
];

function detectWindow(question: string): { days: number | null; label: string } {
    for (const entry of WINDOW_PATTERNS) {
        if (entry.pattern.test(question)) return { days: entry.days, label: entry.label };
    }
    return { days: null, label: "all time" };
}

function pct(value: number | null): string {
    if (value === null) return "not enough data";
    return `${(value * 100).toFixed(1)}%`;
}

/**
 * Answers a business question using parameterized Prisma queries only. There is
 * no text-to-SQL and no LLM call, so a malformed question can never read or
 * mutate data outside these hand-written queries.
 */
export async function answerBusinessQuestion(rawQuestion: string): Promise<BiAnswer> {
    const question = (rawQuestion || "").trim().slice(0, 300);
    if (!question) {
        return {
            question,
            source: "none",
            answer: "Ask a question about leads, spam, coverage or conversions.",
            rows: [],
            empty: true,
        };
    }

    const intent = detectIntent(question);
    const { days, label } = detectWindow(question);
    const since = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined;
    const where = since ? { createdAt: { gte: since } } : {};
    const source = `Prisma aggregate over Lead${since ? ` where createdAt >= ${since.toISOString().slice(0, 10)}` : ""}`;

    const total = await prisma.lead.count({ where });

    if (total === 0) {
        return {
            question,
            source,
            answer: `There are no leads recorded ${label}.`,
            rows: [],
            empty: true,
        };
    }

    switch (intent) {
        case "spam": {
            const spam = await prisma.lead.count({ where: { ...where, status: "spam" } });
            const flagged = await prisma.lead.count({ where: { ...where, validationStatus: "suspicious" } });
            const highRisk = await prisma.lead.count({ where: { ...where, botRisk: { gte: 60 } } });
            return {
                question,
                source,
                answer: `${spam} of ${total} leads ${label} are marked spam (${pct(spam / total)}). ${flagged} are flagged suspicious and ${highRisk} have a bot-risk score of 60 or above.`,
                rows: [
                    { label: "Spam", value: spam },
                    { label: "Suspicious", value: flagged },
                    { label: "Bot risk ≥ 60", value: highRisk },
                    { label: "All leads", value: total },
                ],
                empty: false,
            };
        }
        case "converted": {
            const converted = await prisma.lead.count({ where: { ...where, status: "converted" } });
            const contacted = await prisma.lead.count({ where: { ...where, status: "contacted" } });
            return {
                question,
                source,
                answer: `${converted} leads ${label} converted, from ${total} total (${pct(converted / total)}). ${contacted} are currently marked contacted.`,
                rows: [
                    { label: "Converted", value: converted },
                    { label: "Contacted", value: contacted },
                    { label: "All leads", value: total },
                ],
                empty: false,
            };
        }
        case "qualified": {
            const qualified = await prisma.lead.count({
                where: { ...where, OR: [{ classification: "qualified" }, { aiScore: { gte: 70 } }] },
            });
            return {
                question,
                source,
                answer: `${qualified} leads ${label} are qualified (score 70+) — ${pct(qualified / total)} of all leads in the period.`,
                rows: [{ label: "Qualified", value: qualified }, { label: "All leads", value: total }],
                empty: false,
            };
        }
        case "suspicious": {
            const suspicious = await prisma.lead.count({ where: { ...where, validationStatus: "suspicious" } });
            const invalid = await prisma.lead.count({ where: { ...where, validationStatus: "invalid" } });
            return {
                question,
                source,
                answer: `${suspicious} leads ${label} carry validation flags and need review. ${invalid} failed validation outright.`,
                rows: [
                    { label: "Suspicious", value: suspicious },
                    { label: "Invalid", value: invalid },
                ],
                empty: false,
            };
        }
        case "unverified": {
            const formatValid = await prisma.lead.count({
                where: { ...where, verificationStatus: { in: ["format_valid", "otp_verified"] } },
            });
            const verified = await prisma.lead.count({ where: { ...where, verificationStatus: "otp_verified" } });
            return {
                question,
                source,
                answer: `${formatValid} of ${total} leads ${label} have a format-valid phone number. ${verified} are OTP-verified — no OTP provider is connected yet, so that number is expected to be zero.`,
                rows: [
                    { label: "Format-valid phone", value: formatValid },
                    { label: "OTP-verified", value: verified },
                    { label: "All leads", value: total },
                ],
                empty: false,
            };
        }
        case "duplicates": {
            const duplicates = await prisma.lead.count({ where: { ...where, duplicateOfId: { not: null } } });
            return {
                question,
                source,
                answer: `${duplicates} leads ${label} are linked to an earlier enquiry from the same number, ${pct(duplicates / total)} of the period.`,
                rows: [{ label: "Duplicates", value: duplicates }, { label: "All leads", value: total }],
                empty: false,
            };
        }
        case "serviceable": {
            const coverage = await prisma.coverage.findMany({ select: { cityName: true, status: true } });
            const live = liveAreaNames(coverage);
            const serviceable = live.length
                ? await prisma.lead.count({ where: { ...where, city: { in: live } } })
                : 0;
            return {
                question,
                source: `${source} joined against live Coverage areas`,
                answer: live.length
                    ? `${serviceable} of ${total} leads ${label} are in a live coverage area (${live.slice(0, 6).join(", ")}${live.length > 6 ? ", …" : ""}). Area-level only — an address still needs a site survey.`
                    : `${serviceable} of ${total} leads ${label} map to a live coverage area. No areas are currently marked live.`,
                rows: [
                    { label: "In live area", value: serviceable },
                    { label: "All leads", value: total },
                    { label: "Live areas", value: live.length },
                ],
                empty: false,
            };
        }
        case "top_city": {
            const rows = await prisma.lead.groupBy({
                by: ["city"],
                where,
                _count: { _all: true },
                orderBy: { _count: { city: "desc" } },
                take: 8,
            });
            return {
                question,
                source,
                answer: `${rows.length} distinct cities recorded ${label}. The highest is ${rows[0]?.city ?? "—"} with ${rows[0]?._count._all ?? 0} leads.`,
                rows: rows.map((row) => ({ label: row.city || "Not specified", value: row._count._all })),
                empty: rows.length === 0,
            };
        }
        case "top_source": {
            const rows = await prisma.lead.groupBy({
                by: ["source"],
                where,
                _count: { _all: true },
                orderBy: { _count: { source: "desc" } },
                take: 8,
            });
            return {
                question,
                source,
                answer: `The busiest source ${label} is ${(rows[0]?.source ?? "—").replace(/_/g, " ")} with ${rows[0]?._count._all ?? 0} leads.`,
                rows: rows.map((row) => ({ label: (row.source || "unknown").replace(/_/g, " "), value: row._count._all })),
                empty: rows.length === 0,
            };
        }
        case "campaign": {
            const rows = await prisma.lead.groupBy({
                by: ["campaign"],
                where: { ...where, campaign: { not: null } },
                _count: { _all: true },
                orderBy: { _count: { campaign: "desc" } },
                take: 8,
            });
            return {
                question,
                source,
                answer: rows.length
                    ? `${rows[0].campaign} is the leading campaign ${label} with ${rows[0]._count._all} leads. Only leads that arrived with a campaign tag are counted.`
                    : `No leads ${label} carried a campaign tag.`,
                rows: rows.map((row) => ({ label: row.campaign || "untagged", value: row._count._all })),
                empty: rows.length === 0,
            };
        }
        case "followup": {
            const contacted = await prisma.lead.count({ where: { ...where, status: "contacted" } });
            const converted = await prisma.lead.count({ where: { ...where, status: "converted" } });
            const neverContacted = await prisma.lead.count({
                where: { ...where, status: "new", lastContactAt: null },
            });
            return {
                question,
                source,
                answer: `${contacted} leads ${label} are marked contacted and ${converted} converted. ${neverContacted} new leads have no recorded contact yet.`,
                rows: [
                    { label: "Contacted", value: contacted },
                    { label: "Never contacted", value: neverContacted },
                    { label: "Converted", value: converted },
                ],
                empty: false,
            };
        }
        case "trend": {
            const windowDays = Math.min(Math.max(days ?? 14, 7), 60);
            const from = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
            const recent = await prisma.lead.findMany({
                where: { createdAt: { gte: from } },
                select: { createdAt: true, status: true },
            });
            const buckets = new Map<string, number>();
            for (const lead of recent) {
                const key = dayKey(lead.createdAt);
                buckets.set(key, (buckets.get(key) ?? 0) + 1);
            }
            const rows = [...buckets.entries()]
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, value]) => ({ label: date, value }));
            const spam = recent.filter((lead) => lead.status === "spam").length;
            return {
                question,
                source: `Prisma daily bucket over Lead where createdAt >= ${from.toISOString().slice(0, 10)}`,
                answer: `${recent.length} leads arrived in the last ${windowDays} days, ${spam} of them spam. Daily counts are listed below.`,
                rows,
                empty: rows.length === 0,
            };
        }
        case "total":
        default: {
            const spam = await prisma.lead.count({ where: { ...where, status: "spam" } });
            const converted = await prisma.lead.count({ where: { ...where, status: "converted" } });
            const qualified = await prisma.lead.count({
                where: { ...where, OR: [{ classification: "qualified" }, { aiScore: { gte: 70 } }] },
            });
            return {
                question,
                source,
                answer: `${total} leads ${label}: ${qualified} qualified, ${converted} converted and ${spam} marked spam.`,
                rows: [
                    { label: "All leads", value: total },
                    { label: "Qualified", value: qualified },
                    { label: "Converted", value: converted },
                    { label: "Spam", value: spam },
                ],
                empty: false,
            };
        }
    }
}

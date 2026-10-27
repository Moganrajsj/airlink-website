import type { Lead, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { enrichLead, isLeadScoringEnabled } from "@/lib/ai-leads";
import { isAiConfigured } from "@/lib/ai";
import { getAiUsage } from "@/lib/ai-usage";
import { sendLeadNotification } from "@/lib/mailer";
import {
    HOT_THRESHOLD,
    WARM_THRESHOLD,
    scoreLead,
    shouldEnrichWithAi,
    tierForScore,
    type LeadTier,
} from "@/lib/lead-scoring";

/**
 * Orchestrates lead intelligence: heuristics always run, the free LLM is an
 * optional bonus, and the admin email is sent exactly once per new lead.
 *
 * Imported by server actions only — never by a client component.
 */

const SKIP_AI_STATUSES = ["converted", "closed"];
const PENDING_BATCH_STATUSES = ["pending", "failed", "heuristic"];

export interface ScoreAndSaveOptions {
    allowAi?: boolean;
}

export interface ScoredLead {
    id: string;
    score: number;
    tier: LeadTier;
    aiStatus: string;
    summary: string | null;
    intent: string | null;
    recommendedPlan: string | null;
    nextAction: string | null;
    tags: string | null;
    reasons: string;
    model: string | null;
    enriched: boolean;
    enrichmentReason?: string;
}

function leadMobile(lead: Lead): string {
    return lead.mobile || lead.phone || "";
}

async function findCoverageStatus(city: string): Promise<string | null> {
    if (!city) return null;
    try {
        const coverage = await prisma.coverage.findFirst({
            where: { cityName: city },
            select: { status: true },
        });
        return coverage?.status ?? null;
    } catch (error) {
        console.warn("Lead scoring: coverage lookup failed:", error instanceof Error ? error.message : error);
        return null;
    }
}

async function countRecentDuplicates(lead: Lead): Promise<number> {
    const mobile = leadMobile(lead);
    if (!mobile) return 0;
    try {
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return await prisma.lead.count({
            where: {
                id: { not: lead.id },
                createdAt: { gte: since },
                OR: [
                    { phoneNormalized: mobile },
                    { mobile },
                    { phone: mobile },
                ],
            },
        });
    } catch {
        return 0;
    }
}

function observationMode(): boolean {
    // Observation mode is the safe default: AI never changes the score until an
    // administrator explicitly turns it off after reviewing outcomes.
    return process.env.AI_OBSERVATION_MODE !== "false";
}

function classifyLead(input: {
    qualityScore: number;
    spamRisk: number;
    validationStatus: string | null;
}): { classification: string; confidence: "high" | "medium" | "low" } {
    if (input.spamRisk >= 70) return { classification: "spam", confidence: "high" };
    if (input.validationStatus === "suspicious") return { classification: "needs_review", confidence: "medium" };
    if (input.qualityScore >= HOT_THRESHOLD) return { classification: "qualified", confidence: "high" };
    if (input.qualityScore >= WARM_THRESHOLD) return { classification: "contactable", confidence: "medium" };
    return { classification: "low_intent", confidence: "low" };
}

async function loadPlans() {
    try {
        const plans = await prisma.plan.findMany({
            where: { status: true },
            select: { title: true, speed: true, price: true, isBusiness: true },
            orderBy: { price: "asc" },
        });
        return plans;
    } catch {
        return [];
    }
}

/**
 * Scores a lead and persists the result. Never throws: on failure it returns
 * null and the caller decides what to do.
 */
export async function scoreAndSaveLead(
    lead: Lead,
    options: ScoreAndSaveOptions = {}
): Promise<ScoredLead | null> {
    const mobile = leadMobile(lead);
    const [coverageStatus, duplicatePhoneCount] = await Promise.all([
        findCoverageStatus(lead.city),
        countRecentDuplicates(lead),
    ]);

    const heuristic = scoreLead(
        {
            name: lead.name,
            mobile,
            email: lead.email,
            city: lead.city,
            pincode: lead.pincode,
            interest: lead.interest,
            source: lead.source,
            status: lead.status,
            message: lead.message,
            createdAt: lead.createdAt,
        },
        { coverageStatus, duplicatePhoneCount }
    );

    const allowAi =
        options.allowAi !== false &&
        isLeadScoringEnabled() &&
        isAiConfigured() &&
        !SKIP_AI_STATUSES.includes(lead.status.toLowerCase()) &&
        shouldEnrichWithAi(heuristic.score);

    let aiStatus = "heuristic";
    let summary: string | null = null;
    let intent: string | null = null;
    let recommendedPlan: string | null = null;
    let nextAction: string | null = null;
    let tags: string | null = null;
    let model: string | null = null;
    let enriched = false;
    let enrichmentReason: string | undefined;

    if (SKIP_AI_STATUSES.includes(lead.status.toLowerCase())) {
        aiStatus = "skipped";
    } else if (allowAi) {
        const plans = await loadPlans();
        const result = await enrichLead({
            name: lead.name,
            city: lead.city,
            pincode: lead.pincode,
            company: lead.company,
            interest: lead.interest,
            source: lead.source,
            status: lead.status,
            message: lead.message,
            createdAt: lead.createdAt,
            coverageStatus,
            heuristicScore: heuristic.score,
            heuristicReasons: heuristic.reasons,
            plans,
        });

        if (result.ok) {
            enriched = true;
            aiStatus = "scored";
            summary = result.data.summary;
            intent = result.data.intent;
            recommendedPlan = result.data.recommendedPlan;
            nextAction = result.data.nextAction;
            tags = result.data.tags.length > 0 ? result.data.tags.join(", ") : null;
            model = result.model;
        } else {
            enrichmentReason = result.reason;
            aiStatus = result.reason === "failed" ? "failed" : "heuristic";
        }
    }

    // A strong rule-based score should not be thrown away because one model
    // disliked the wording. In observation mode the AI opinion is recorded but
    // never changes the score or the tier.
    let finalScore = heuristic.score;
    let finalTier = heuristic.tier;
    const reasons = [...heuristic.reasons];
    const observe = observationMode();

    if (enriched && intent === "spam" && !observe && finalScore < HOT_THRESHOLD && finalScore > 20) {
        reasons.push(`AI flagged this enquiry as spam (−${finalScore - 20})`);
        finalScore = 20;
        finalTier = "cold";
    } else if (enriched && intent === "spam" && observe) {
        reasons.push("AI suggested spam — recorded for review, score unchanged (observation mode)");
    }

    const spamRisk = Math.max(0, Math.min(100, lead.botRisk ?? 0));
    const validationFlags: string[] = (() => {
        try {
            const parsed = JSON.parse(lead.validationFlags ?? "[]");
            return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
        } catch {
            return [];
        }
    })();
    if (validationFlags.length > 0) {
        reasons.push(`Validation flags: ${validationFlags.slice(0, 4).join(", ")}`);
    }

    const { classification, confidence } = classifyLead({
        qualityScore: finalScore,
        spamRisk,
        validationStatus: lead.validationStatus ?? null,
    });

    const data: Prisma.LeadUpdateInput = {
        aiScore: finalScore,
        aiTier: finalTier,
        aiReasons: reasons.join(" · "),
        aiStatus,
        aiScoredAt: new Date(),
        qualityScore: finalScore,
        spamRisk,
        classification,
        confidence,
    };

    // Only overwrite the AI-written fields when we actually have fresh output,
    // so a quota outage never erases a good summary.
    if (enriched) {
        Object.assign(data, {
            aiSummary: summary,
            aiIntent: intent,
            aiRecommendedPlan: recommendedPlan,
            aiNextAction: nextAction,
            aiTags: tags,
            aiModel: model,
        });
    }
    try {
        await prisma.lead.update({ where: { id: lead.id }, data });
        await prisma.leadEvent.create({
            data: {
                leadId: lead.id,
                type: enriched ? "scored_ai" : "scored_heuristic",
                actor: "system",
                payload: JSON.stringify({
                    qualityScore: finalScore,
                    spamRisk,
                    classification,
                    confidence,
                    tier: finalTier,
                    aiSuggestion: intent,
                    observationMode: observe,
                    model,
                }),
            },
        }).catch(() => {});
    } catch (error) {
        console.error(
            "Lead scoring: could not save score for",
            lead.id,
            error instanceof Error ? error.message : error
        );
        return null;
    }

    return {
        id: lead.id,
        score: finalScore,
        tier: finalTier,
        aiStatus,
        summary,
        intent,
        recommendedPlan,
        nextAction,
        tags,
        reasons: reasons.join(" · "),
        model,
        enriched,
        enrichmentReason,
    };
}

/** Scores a freshly captured lead and emails the admin the enriched summary. */
export async function processNewLead(leadId: string): Promise<void> {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } }).catch((error) => {
        console.error("processNewLead: could not load lead", leadId, error);
        return null;
    });
    if (!lead) return;

    let scored: ScoredLead | null = null;
    try {
        scored = await scoreAndSaveLead(lead, { allowAi: true });
    } catch (error) {
        console.error("processNewLead: scoring failed for", leadId, error);
    }

    try {
        // Bots and high-confidence abusive submissions never trigger an email.
        // Genuine repeats (duplicate phone) still do, unless risk is high.
        const suppress =
            lead.status === "spam" ||
            (lead.botRisk ?? 0) >= 60 ||
            lead.validationStatus === "invalid";

        if (!suppress) {
            await sendLeadNotification({
                id: lead.id,
                name: lead.name,
                mobile: leadMobile(lead),
                email: lead.email,
                company: lead.company,
                city: lead.city,
                pincode: lead.pincode,
                interest: lead.interest,
                source: lead.source,
                message: lead.message,
                aiScore: scored?.score ?? null,
                aiTier: scored?.tier ?? null,
                aiSummary: scored?.summary ?? null,
                aiIntent: scored?.intent ?? null,
                aiRecommendedPlan: scored?.recommendedPlan ?? null,
                aiNextAction: scored?.nextAction ?? null,
                aiReasons: scored?.reasons ?? null,
            });
        }
    } catch (error) {
        console.error("processNewLead: notification failed for", leadId, error);
    }
}

export interface BatchScoreResult {
    scored: number;
    enriched: number;
    remaining: number;
    stoppedByQuota: boolean;
}

/**
 * Backfills unscored / previously-failed leads, newest first but oldest-scored
 * first so repeated clicks rotate through the backlog instead of re-scoring the
 * same lead forever.
 */
export async function scorePendingLeads(limit = 5): Promise<BatchScoreResult> {
    const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 10);

    const leads = await prisma.lead.findMany({
        where: {
            status: { notIn: SKIP_AI_STATUSES },
            OR: [
                { aiScoredAt: null },
                { aiStatus: { in: PENDING_BATCH_STATUSES } },
            ],
        },
        orderBy: [{ aiScoredAt: "asc" }, { createdAt: "desc" }],
        take: safeLimit,
    });

    let scored = 0;
    let enriched = 0;
    let stoppedByQuota = false;
    const attempted = new Set<string>();

    for (const lead of leads) {
        if (attempted.has(lead.id)) continue;
        attempted.add(lead.id);

        const result = await scoreAndSaveLead(lead, { allowAi: true });
        if (!result) continue;
        scored += 1;
        if (result.enriched) enriched += 1;
        if (result.enrichmentReason === "quota") {
            stoppedByQuota = true;
            break;
        }
    }

    let remaining = 0;
    try {
        remaining = await prisma.lead.count({
            where: {
                status: { notIn: SKIP_AI_STATUSES },
                OR: [
                    { aiScoredAt: null },
                    { aiStatus: { in: PENDING_BATCH_STATUSES } },
                ],
            },
        });
    } catch {
        remaining = 0;
    }

    return { scored, enriched, remaining, stoppedByQuota };
}

export interface LeadAiStats {
    requestsToday: number;
    dailyLimit: number;
    remaining: number;
    hotCount: number;
    unscoredCount: number;
    avgScore: number | null;
    scoringEnabled: boolean;
    aiConfigured: boolean;
}

export async function getLeadAiStats(): Promise<LeadAiStats> {
    const usage = await getAiUsage();

    const [hotCount, unscoredCount, aggregate] = await Promise.all([
        prisma.lead
            .count({ where: { aiTier: "hot", status: { notIn: SKIP_AI_STATUSES } } })
            .catch(() => 0),
        prisma.lead
            .count({ where: { aiScoredAt: null, status: { notIn: SKIP_AI_STATUSES } } })
            .catch(() => 0),
        prisma.lead
            .aggregate({ _avg: { aiScore: true }, where: { aiScore: { not: null } } })
            .catch(() => ({ _avg: { aiScore: null } })),
    ]);

    const avg = aggregate?._avg?.aiScore;

    return {
        requestsToday: usage.requests,
        dailyLimit: usage.limit,
        remaining: usage.remaining,
        hotCount,
        unscoredCount,
        avgScore: typeof avg === "number" ? Math.round(avg) : null,
        scoringEnabled: isLeadScoringEnabled(),
        aiConfigured: isAiConfigured(),
    };
}

/** Re-export for callers that only need the tier helper. */
export { tierForScore };

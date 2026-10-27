"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth/admin-session";
import {
    getLeadAiStats,
    scoreAndSaveLead,
    scorePendingLeads,
    type BatchScoreResult,
    type LeadAiStats,
    type ScoredLead,
} from "@/lib/lead-intelligence";

/**
 * Server actions are reachable directly by POST, so they verify the admin
 * session themselves instead of relying only on the /admin middleware.
 */
async function assertAdmin(): Promise<boolean> {
    return Boolean(await requireAdminAction("admin"));
}

export type ScoreLeadActionResult =
    | { ok: true; lead: ScoredLead }
    | { ok: false; error: string };

export async function scoreLeadById(leadId: string): Promise<ScoreLeadActionResult> {
    if (!(await assertAdmin())) return { ok: false, error: "Not authorised." };

    try {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) return { ok: false, error: "Lead not found." };

        const result = await scoreAndSaveLead(lead, { allowAi: true });
        if (!result) return { ok: false, error: "Could not score this lead." };

        revalidatePath("/admin/leads");
        revalidatePath("/admin");
        return { ok: true, lead: result };
    } catch (error) {
        console.error("scoreLeadById failed:", error);
        return { ok: false, error: "Could not score this lead." };
    }
}

export type ScoreBatchActionResult =
    | ({ ok: true } & BatchScoreResult)
    | { ok: false; error: string };

export async function scoreUnscoredLeads(limit = 5): Promise<ScoreBatchActionResult> {
    if (!(await assertAdmin())) return { ok: false, error: "Not authorised." };

    try {
        const result = await scorePendingLeads(limit);
        revalidatePath("/admin/leads");
        revalidatePath("/admin");
        return { ok: true, ...result };
    } catch (error) {
        console.error("scoreUnscoredLeads failed:", error);
        return { ok: false, error: "Could not score the lead backlog." };
    }
}

export type LeadStatsActionResult =
    | { ok: true; stats: LeadAiStats }
    | { ok: false; error: string };

export async function getLeadIntelligenceStats(): Promise<LeadStatsActionResult> {
    if (!(await assertAdmin())) return { ok: false, error: "Not authorised." };

    try {
        return { ok: true, stats: await getLeadAiStats() };
    } catch (error) {
        console.error("getLeadIntelligenceStats failed:", error);
        return { ok: false, error: "Could not load AI stats." };
    }
}

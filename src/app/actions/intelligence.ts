"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-session";
import { answerBusinessQuestion, getIntelligenceMetrics, type BiAnswer, type IntelligenceMetrics } from "@/lib/intelligence";
import { OUTCOME_LABELS, type OutcomeLabel } from "@/lib/review-labels";

/**
 * Admin actions for lead review, duplicate handling and business questions.
 * Every mutation is guarded, attributed to the signed-in administrator in the
 * immutable `LeadEvent` trail, and never deletes a customer record.
 *
 * `OUTCOME_LABELS` lives in `@/lib/review-labels`: a `"use server"` module may
 * only export async functions.
 */

const NOT_AUTHORISED = { success: false as const, error: "Not authorised." };

function revalidateLeads() {
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    revalidatePath("/admin/intelligence");
}

export interface ReviewInput {
    leadId: string;
    /** Admin's decision, which may override the AI classification. */
    outcome: OutcomeLabel | null;
    /** Optional manual classification: spam | needs_review | qualified | contactable | low_intent. */
    classification?: string | null;
    followUpOwner?: string | null;
    note?: string | null;
    markContacted?: boolean;
}

export async function reviewLead(input: ReviewInput) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    if (input.outcome && !OUTCOME_LABELS.includes(input.outcome)) {
        return { success: false as const, error: "Unknown outcome." };
    }
    const classification = input.classification ?? null;
    const allowedClassifications = ["spam", "needs_review", "qualified", "contactable", "low_intent"];
    if (classification && !allowedClassifications.includes(classification)) {
        return { success: false as const, error: "Unknown classification." };
    }

    try {
        const before = await prisma.lead.findUnique({
            where: { id: input.leadId },
            select: { status: true, classification: true, reviewOutcome: true, spamRisk: true, botRisk: true },
        });
        if (!before) return { success: false as const, error: "Lead not found." };

        const now = new Date();
        const data: Record<string, unknown> = {
            reviewedBy: session.email,
            reviewedAt: now,
            reviewOutcome: input.outcome,
            followUpOwner: (input.followUpOwner ?? "").trim().slice(0, 80) || null,
        };

        if (classification) data.classification = classification;
        if (input.note) {
            data.notes = `[${now.toISOString().slice(0, 10)} ${session.email}] ${input.note.trim().slice(0, 1000)}`;
        }

        // A confirmed-spam decision is the only review outcome allowed to change
        // the lead's status automatically, because an admin made it by hand.
        if (input.outcome === "confirmed_spam") data.status = "spam";
        if (input.outcome === "converted") data.status = "converted";
        if (input.markContacted) {
            data.lastContactAt = now;
            if (before.status === "new") data.status = "contacted";
        }

        await prisma.lead.update({ where: { id: input.leadId }, data });

        await prisma.leadEvent.create({
            data: {
                leadId: input.leadId,
                type: "reviewed",
                actor: session.email,
                payload: JSON.stringify({
                    before: {
                        status: before.status,
                        classification: before.classification,
                        reviewOutcome: before.reviewOutcome,
                    },
                    after: {
                        outcome: input.outcome,
                        classification: classification ?? before.classification,
                        followUpOwner: data.followUpOwner,
                        markContacted: Boolean(input.markContacted),
                    },
                    note: input.note ?? null,
                }),
            },
        });

        revalidateLeads();
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not save this review." };
    }
}

export async function bulkUpdateLeadStatus(leadIds: string[], status: string) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    const allowed = ["new", "contacted", "qualified", "closed", "converted", "spam"];
    if (!allowed.includes(status)) return { success: false as const, error: "Unknown status." };
    const ids = [...new Set(leadIds)].filter(Boolean).slice(0, 500);
    if (ids.length === 0) return { success: false as const, error: "Select at least one lead." };

    try {
        const result = await prisma.lead.updateMany({
            where: { id: { in: ids } },
            data: status === "spam" ? { status, reviewOutcome: "confirmed_spam" } : { status },
        });
        await prisma.leadEvent.createMany({
            data: ids.map((id) => ({
                leadId: id,
                type: "bulk_status_changed",
                actor: session.email,
                payload: JSON.stringify({ to: status }),
            })),
        });
        revalidateLeads();
        return { success: true as const, updated: result.count };
    } catch {
        return { success: false as const, error: "Could not update the selected leads." };
    }
}

export async function linkDuplicate(leadId: string, canonicalId: string) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;
    if (leadId === canonicalId) return { success: false as const, error: "A lead cannot duplicate itself." };

    try {
        const canonical = await prisma.lead.findUnique({ where: { id: canonicalId }, select: { id: true } });
        if (!canonical) return { success: false as const, error: "Original lead not found." };

        await prisma.lead.update({ where: { id: leadId }, data: { duplicateOfId: canonicalId } });
        await prisma.leadEvent.create({
            data: {
                leadId,
                type: "duplicate_linked",
                actor: session.email,
                payload: JSON.stringify({ duplicateOfId: canonicalId }),
            },
        });
        revalidateLeads();
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not link this duplicate." };
    }
}

export async function unlinkDuplicate(leadId: string) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    try {
        await prisma.lead.update({ where: { id: leadId }, data: { duplicateOfId: null } });
        await prisma.leadEvent.create({
            data: {
                leadId,
                type: "duplicate_unlinked",
                actor: session.email,
                payload: JSON.stringify({ reason: "admin_kept_separate" }),
            },
        });
        revalidateLeads();
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not unlink this duplicate." };
    }
}

/** Marks a linked duplicate as its own genuine enquiry. */
export async function keepDuplicateAsSeparate(leadId: string) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    try {
        await prisma.lead.update({
            where: { id: leadId },
            data: { duplicateOfId: null, reviewOutcome: "genuine", reviewedBy: session.email, reviewedAt: new Date() },
        });
        await prisma.leadEvent.create({
            data: {
                leadId,
                type: "duplicate_kept_separate",
                actor: session.email,
                payload: JSON.stringify({ reviewOutcome: "genuine" }),
            },
        });
        revalidateLeads();
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not update this duplicate." };
    }
}

export interface DuplicateGroup {
    key: string;
    phone: string;
    leads: {
        id: string;
        name: string;
        status: string;
        source: string;
        createdAt: Date;
        duplicateOfId: string | null;
        validationStatus: string;
        spamRisk: number | null;
    }[];
}

/**
 * Groups leads that share a normalised phone number. Duplicates are surfaced
 * for a human decision — nothing is deleted or merged automatically.
 */
export async function getDuplicateGroups(): Promise<DuplicateGroup[]> {
    if (!(await requireAdminAction("viewer"))) return [];
    try {
        const rows = await prisma.lead.groupBy({
            by: ["phoneNormalized"],
            where: { phoneNormalized: { not: null } },
            _count: { _all: true },
            having: { phoneNormalized: { _count: { gt: 1 } } },
            orderBy: { _count: { phoneNormalized: "desc" } },
            take: 40,
        });

        if (rows.length === 0) return [];

        const numbers = rows.map((row) => row.phoneNormalized!).filter(Boolean);
        const leads = await prisma.lead.findMany({
            where: { phoneNormalized: { in: numbers } },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                name: true,
                status: true,
                source: true,
                createdAt: true,
                duplicateOfId: true,
                validationStatus: true,
                spamRisk: true,
                phoneNormalized: true,
            },
        });

        return rows.map((row) => ({
            key: row.phoneNormalized!,
            phone: row.phoneNormalized!,
            leads: leads
                .filter((lead) => lead.phoneNormalized === row.phoneNormalized)
                .map((lead) => ({
                    id: lead.id,
                    name: lead.name,
                    status: lead.status,
                    source: lead.source,
                    createdAt: lead.createdAt,
                    duplicateOfId: lead.duplicateOfId,
                    validationStatus: lead.validationStatus,
                    spamRisk: lead.spamRisk,
                })),
        }));
    } catch {
        return [];
    }
}

export async function getMetrics(): Promise<IntelligenceMetrics | null> {
    if (!(await requireAdminAction("viewer"))) return null;
    try {
        return await getIntelligenceMetrics();
    } catch {
        return null;
    }
}

export async function askBusinessQuestion(question: string): Promise<BiAnswer> {
    if (!(await requireAdminAction("viewer"))) {
        return {
            question,
            source: "authorisation",
            answer: "Not authorised.",
            rows: [],
            empty: true,
        };
    }
    try {
        return await answerBusinessQuestion(question);
    } catch {
        return {
            question,
            source: "database",
            answer: "That question could not be answered from the database right now. Please try again.",
            rows: [],
            empty: true,
        };
    }
}

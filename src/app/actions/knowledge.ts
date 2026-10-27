"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-session";
import { invalidateKnowledgeCache } from "@/lib/knowledge";

/**
 * Admin CRUD for the assistant knowledge base.
 *
 * Only approved entries are ever exposed to the public assistant. Every write
 * is attributed to the signed-in administrator via `updatedBy`, and the public
 * prompt is deliberately NOT revalidated here — the assistant picks up changes
 * within the cache TTL (60s) without a redeploy.
 *
 * `KNOWLEDGE_CATEGORIES` lives in `@/lib/knowledge-categories`: a `"use server"`
 * module may only export async functions.
 */

export interface KnowledgeEntryInput {
    category: string;
    question: string;
    answer: string;
    keywords?: string;
    priority?: number;
    isActive?: boolean;
}

export interface KnowledgeEntryView {
    id: string;
    category: string;
    question: string;
    answer: string;
    keywords: string | null;
    priority: number;
    isActive: boolean;
    updatedBy: string | null;
    updatedAt: Date;
}

const NOT_AUTHORISED = { success: false as const, error: "Not authorised." };

export async function getKnowledgeEntries(): Promise<KnowledgeEntryView[]> {
    if (!(await requireAdminAction("viewer"))) return [];
    try {
        const rows = await prisma.knowledgeEntry.findMany({
            orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
        });
        return rows.map((row) => ({
            id: row.id,
            category: row.category,
            question: row.question,
            answer: row.answer,
            keywords: row.keywords,
            priority: row.priority,
            isActive: row.isActive,
            updatedBy: row.updatedBy,
            updatedAt: row.updatedAt,
        }));
    } catch {
        return [];
    }
}

function clean(value: unknown, max: number): string {
    return (typeof value === "string" ? value : "").trim().slice(0, max);
}

function validate(input: KnowledgeEntryInput): string | null {
    if (!clean(input.question, 300)) return "Question is required.";
    if (!clean(input.answer, 4000)) return "Answer is required.";
    if (!clean(input.category, 60)) return "Category is required.";
    if (input.priority !== undefined && !Number.isFinite(input.priority)) return "Priority must be a number.";
    return null;
}

export async function createKnowledgeEntry(input: KnowledgeEntryInput) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    const error = validate(input);
    if (error) return { success: false as const, error };

    try {
        await prisma.knowledgeEntry.create({
            data: {
                category: clean(input.category, 60),
                question: clean(input.question, 300),
                answer: clean(input.answer, 4000),
                keywords: clean(input.keywords, 600) || null,
                priority: Math.max(-100, Math.min(100, Math.trunc(input.priority ?? 0))),
                isActive: input.isActive !== false,
                updatedBy: session.email,
            },
        });
        invalidateKnowledgeCache();
        revalidatePath("/admin/knowledge");
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not save this entry." };
    }
}

export async function updateKnowledgeEntry(id: string, input: KnowledgeEntryInput) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    const error = validate(input);
    if (error) return { success: false as const, error };

    try {
        await prisma.knowledgeEntry.update({
            where: { id },
            data: {
                category: clean(input.category, 60),
                question: clean(input.question, 300),
                answer: clean(input.answer, 4000),
                keywords: clean(input.keywords, 600) || null,
                priority: Math.max(-100, Math.min(100, Math.trunc(input.priority ?? 0))),
                isActive: input.isActive !== false,
                updatedBy: session.email,
            },
        });
        invalidateKnowledgeCache();
        revalidatePath("/admin/knowledge");
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not update this entry." };
    }
}

export async function toggleKnowledgeEntry(id: string, isActive: boolean) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    try {
        await prisma.knowledgeEntry.update({
            where: { id },
            data: { isActive, updatedBy: session.email },
        });
        invalidateKnowledgeCache();
        revalidatePath("/admin/knowledge");
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not change this entry." };
    }
}

export async function deleteKnowledgeEntry(id: string) {
    const session = await requireAdminAction("admin");
    if (!session) return NOT_AUTHORISED;

    try {
        await prisma.knowledgeEntry.delete({ where: { id } });
        invalidateKnowledgeCache();
        revalidatePath("/admin/knowledge");
        return { success: true as const };
    } catch {
        return { success: false as const, error: "Could not delete this entry." };
    }
}

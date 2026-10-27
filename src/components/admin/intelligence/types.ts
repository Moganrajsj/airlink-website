import type { IntelligenceMetrics } from "@/lib/intelligence";

export interface IntelligenceLead {
    id: string;
    name: string;
    mobile: string;
    email?: string | null;
    company?: string | null;
    city: string;
    pincode?: string | null;
    interest?: string | null;
    source?: string | null;
    status: string;
    message?: string | null;
    createdAt: string | Date;
    aiScore?: number | null;
    aiTier?: string | null;
    aiSummary?: string | null;
    aiIntent?: string | null;
    aiRecommendedPlan?: string | null;
    aiNextAction?: string | null;
    aiTags?: string | null;
    aiReasons?: string | null;
    aiStatus?: string | null;
    aiScoredAt?: string | Date | null;
    aiModel?: string | null;
    qualityScore?: number | null;
    spamRisk?: number | null;
    classification?: string | null;
    confidence?: string | null;
    validationStatus?: string | null;
    verificationStatus?: string | null;
    validationFlags?: string | null;
    botRisk?: number | null;
    botSignals?: string | null;
    reviewOutcome?: string | null;
    followUpOwner?: string | null;
    lastContactAt?: string | Date | null;
    duplicateOfId?: string | null;
    campaign?: string | null;
}

export interface DuplicateGroupView {
    key: string;
    phone: string;
    leads: {
        id: string;
        name: string;
        status: string;
        source: string;
        createdAt: string | Date;
        duplicateOfId: string | null;
        validationStatus: string;
        spamRisk: number | null;
    }[];
}

export type { IntelligenceMetrics };

export const STATUS_OPTIONS = ["new", "contacted", "qualified", "closed", "converted", "spam"];

// Review vocabulary is shared with the server actions; it lives in a plain
// module because `"use server"` files may only export async functions.
export { OUTCOME_LABELS } from "@/lib/review-labels";
export type { OutcomeLabel } from "@/lib/review-labels";

export const OUTCOME_STYLES: Record<string, string> = {
    genuine: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    confirmed_spam: "bg-red-500/15 text-red-300 border border-red-500/30",
    invalid_contact: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    unverified: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    out_of_coverage: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
    qualified: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    converted: "bg-green-500/15 text-green-300 border border-green-500/30",
    unreachable: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
};

export function parseFlags(value: string | null | undefined): string[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
    } catch {
        return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
}

export function formatDate(value: string | Date | null | undefined, withTime = false): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-IN", withTime
        ? { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
        : { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Knowledge-base vocabulary shared by the admin UI and server actions.
 * Kept outside `"use server"` modules because those may only export async
 * functions — a plain array export breaks the build.
 */

export const KNOWLEDGE_CATEGORIES = [
    "Plans & Pricing",
    "Coverage",
    "Installation",
    "Billing & Payment",
    "Support",
    "Business Services",
    "Policies",
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number];

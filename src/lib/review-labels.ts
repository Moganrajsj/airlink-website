/**
 * Review vocabulary shared by the admin UI and server actions.
 * Kept outside `"use server"` modules because those may only export async
 * functions — a plain array export breaks the build.
 */

export const OUTCOME_LABELS = [
    "genuine",
    "confirmed_spam",
    "invalid_contact",
    "unverified",
    "out_of_coverage",
    "qualified",
    "converted",
    "unreachable",
] as const;

export type OutcomeLabel = (typeof OUTCOME_LABELS)[number];

export const CLASSIFICATION_OPTIONS = [
    "spam",
    "needs_review",
    "qualified",
    "contactable",
    "low_intent",
] as const;

export type ClassificationLabel = (typeof CLASSIFICATION_OPTIONS)[number];

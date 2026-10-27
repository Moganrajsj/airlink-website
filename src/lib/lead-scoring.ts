/**
 * Deterministic, zero-cost lead scoring.
 *
 * This runs for every lead and never calls an AI provider, so it always works
 * even when the free-tier quota is exhausted. The LLM (see ai-leads.ts) only
 * adds a summary / next action on top of this score.
 *
 * Every point that is added or removed is recorded in `reasons`, so admins can
 * see *why* a lead scored the way it did instead of trusting a black box.
 */

export type LeadTier = "hot" | "warm" | "cold";

export const HOT_THRESHOLD = 70;
export const WARM_THRESHOLD = 40;

export interface LeadScoringInput {
    name?: string | null;
    mobile?: string | null;
    email?: string | null;
    city?: string | null;
    pincode?: string | null;
    interest?: string | null;
    source?: string | null;
    status?: string | null;
    message?: string | null;
    createdAt?: Date | string | null;
}

export interface LeadScoringContext {
    /** Status of the lead's city in the Coverage table ("Available", "Coming Soon"...). */
    coverageStatus?: string | null;
    /** How many other leads used this phone number in the last 7 days. */
    duplicatePhoneCount?: number;
    now?: Date;
}

export interface LeadScoreResult {
    score: number;
    tier: LeadTier;
    reasons: string[];
}

export function tierForScore(score: number): LeadTier {
    if (score >= HOT_THRESHOLD) return "hot";
    if (score >= WARM_THRESHOLD) return "warm";
    return "cold";
}

const SOURCE_WEIGHTS: Record<string, number> = {
    ai_assistant: 12,
    plans_page: 12,
    check_availability: 11,
    contact_form: 10,
    speed_test: 9,
    popup_multi_step: 8,
    popup_lead: 6,
    shop_page: 6,
};

const INTENT_WORDS = [
    "install", "installation", "connection", "book", "booking", "subscribe", "buy",
    "price", "pricing", "cost", "quote", "plan", "offer", "trial", "port", "shift",
    "migrate", "upgrade", "today", "tomorrow", "urgent", "immediate", "asap",
    "interested", "need", "want", "available", "availability", "router", "wifi",
];

const BUSINESS_WORDS = [
    "business", "office", "company", "corporate", "gst", "bulk", "leased",
    "dedicated", "startup", "hotel", "school", "college", "hospital", "factory",
];

const SPAM_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
    { label: 'test', pattern: /\btest(?:ing)?\b/ },
    { label: 'asdf', pattern: /\basdf\b/ },
    { label: 'qwerty', pattern: /\bqwerty\b/ },
    { label: 'dummy', pattern: /\bdummy\b/ },
    { label: 'spam', pattern: /\bspam\b/ },
    { label: 'fake', pattern: /\bfake\b/ },
    { label: 'xxxx', pattern: /\bxxxx+\b/ },
    { label: 'sample', pattern: /\bsample\b/ },
    { label: 'no thanks', pattern: /\bno thanks\b/ },
    { label: 'not interested', pattern: /\bnot interested\b/ },
    { label: 'wrong number', pattern: /\bwrong number\b/ },
    { label: 'abcdef', pattern: /\babcdef\b/ },
];

const LIVE_COVERAGE = /live|active|available|covered|serviceable|^yes$/;

const PLACEHOLDER_NAMES = ["test", "testing", "admin", "user", "na", "n/a", "none", "abc", "demo"];

function normalize(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

function containsAny(haystack: string, needles: string[]): string[] {
    return needles.filter((needle) => haystack.includes(needle));
}

function ageInHours(createdAt: Date | string | null | undefined, now: Date): number | null {
    if (!createdAt) return null;
    const created = createdAt instanceof Date ? createdAt : new Date(createdAt);
    if (Number.isNaN(created.getTime())) return null;
    return (now.getTime() - created.getTime()) / 3_600_000;
}

/** True when the value looks like a real Indian mobile number. */
export function isValidIndianMobile(mobile: string): boolean {
    const digits = mobile.replace(/\D/g, "");
    const last10 = digits.slice(-10);
    return last10.length === 10 && /^[6-9]/.test(last10);
}

/**
 * Scores a lead from 0-100 using only data already stored in the database.
 * Pure function: no network, no database, safe to unit test.
 */
export function scoreLead(input: LeadScoringInput, context: LeadScoringContext = {}): LeadScoreResult {
    const now = context.now ?? new Date();
    const reasons: string[] = [];
    let score = 0;

    const name = normalize(input.name);
    const mobile = normalize(input.mobile);
    const email = normalize(input.email);
    const city = normalize(input.city);
    const pincode = normalize(input.pincode);
    const interest = normalize(input.interest).toLowerCase();
    const source = normalize(input.source).toLowerCase();
    const status = normalize(input.status).toLowerCase();
    const message = normalize(input.message);
    const messageLower = message.toLowerCase();
    const combined = `${interest} ${messageLower}`;

    // ── Contactability ────────────────────────────────────────────────────────
    if (isValidIndianMobile(mobile)) {
        score += 10;
        reasons.push("Valid Indian mobile number (+10)");
    } else {
        score -= 25;
        reasons.push("Mobile number looks invalid (−25)");
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        score += 8;
        reasons.push("Email address provided (+8)");
    }

    if (/^\d{6}$/.test(pincode)) {
        score += 5;
        reasons.push("Pincode provided (+5)");
    }

    // ── Location ─────────────────────────────────────────────────────────────
    const coverage = normalize(context.coverageStatus).toLowerCase();
    if (city) {
        if (LIVE_COVERAGE.test(coverage)) {
            score += 20;
            reasons.push(`City in service area: ${city} (+20)`);
        } else if (coverage.includes("coming") || coverage.includes("soon")) {
            score += 8;
            reasons.push(`${city} is coming soon — needs a coverage follow-up (+8)`);
        } else {
            reasons.push(`City not in coverage list: ${city} — verify before promising service`);
        }
    } else {
        reasons.push("No city provided — qualify location on the call");
    }

    // ── Intent ───────────────────────────────────────────────────────────────
    if (interest) {
        score += 4;
        if (interest.includes("business") || interest.includes("lease") || interest.includes("dedicated")) {
            score += 15;
            reasons.push("Business / leased-line enquiry (+19)");
        } else if (interest.includes("home") || interest.includes("broadband")) {
            score += 12;
            reasons.push("Residential broadband enquiry (+16)");
        } else if (interest.includes("coverage") || interest.includes("availability") || interest.includes("fiber")) {
            score += 8;
            reasons.push("Coverage / availability check (+12)");
        } else if (interest.includes("support") || interest.includes("router") || interest.includes("cctv") || interest.includes("wifi")) {
            score += 6;
            reasons.push("Service / support enquiry (+10)");
        } else {
            reasons.push("Interest captured (+4)");
        }
    }

    if (BUSINESS_WORDS.some((word) => combined.includes(word))) {
        score += 5;
        reasons.push("Business keywords in the enquiry (+5)");
    }

    // ── Source quality ───────────────────────────────────────────────────────
    const sourceWeight = SOURCE_WEIGHTS[source];
    if (typeof sourceWeight === "number") {
        score += sourceWeight;
        reasons.push(`High-intent source: ${source.replace(/_/g, " ")} (+${sourceWeight})`);
    } else if (source) {
        score += 5;
        reasons.push(`Lead source: ${source.replace(/_/g, " ")} (+5)`);
    }

    // ── Message strength ─────────────────────────────────────────────────────
    if (message.length >= 80) {
        score += 12;
        reasons.push("Detailed enquiry message (+12)");
    } else if (message.length >= 30) {
        score += 8;
        reasons.push("Enquiry message provided (+8)");
    } else if (message.length > 0) {
        score += 4;
        reasons.push("Short message provided (+4)");
    }

    const intentHits = containsAny(combined, INTENT_WORDS);
    if (intentHits.length > 0) {
        score += 10;
        reasons.push(`Buying intent detected: ${intentHits.slice(0, 3).join(", ")} (+10)`);
    }

    // ── Freshness ────────────────────────────────────────────────────────────
    const ageHours = ageInHours(input.createdAt, now);
    if (ageHours !== null) {
        if (ageHours <= 1) {
            score += 10;
            reasons.push("Submitted within the last hour (+10)");
        } else if (ageHours <= 24) {
            score += 8;
            reasons.push("Submitted within 24 hours (+8)");
        } else if (ageHours <= 72) {
            score += 4;
            reasons.push("Submitted within 3 days (+4)");
        } else if (ageHours <= 24 * 7) {
            score += 2;
            reasons.push("Submitted this week (+2)");
        }
    }

    // ── Penalties ────────────────────────────────────────────────────────────
    const spamHits = SPAM_PATTERNS
        .filter((entry) => entry.pattern.test(`${name.toLowerCase()} ${combined}`))
        .map((entry) => entry.label);
    if (spamHits.length > 0) {
        score -= 35;
        reasons.push(`Looks like a test / spam entry: ${spamHits.slice(0, 3).join(", ")} (−35)`);
    }

    const nameLower = name.toLowerCase();
    if (
        name.length < 3 ||
        /^\d+$/.test(name) ||
        PLACEHOLDER_NAMES.includes(nameLower)
    ) {
        score -= 15;
        reasons.push("Placeholder or incomplete name (−15)");
    }

    const duplicates = Math.max(0, Math.min(context.duplicatePhoneCount ?? 0, 2));
    if (duplicates > 0) {
        score -= 10 * duplicates;
        reasons.push(`Same phone submitted ${duplicates} other time(s) in 7 days (−${10 * duplicates})`);
    }

    if (status === "closed") {
        score -= 20;
        reasons.push("Lead already closed (−20)");
    }

    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    return { score: clamped, tier: tierForScore(clamped), reasons };
}

/** Rough heuristic used to decide whether an LLM call is worth spending quota on. */
export function shouldEnrichWithAi(score: number): boolean {
    const configured = Number(process.env.AI_ENRICH_MIN_SCORE);
    const threshold = Number.isFinite(configured) && configured >= 0 ? configured : WARM_THRESHOLD;
    return score >= threshold;
}

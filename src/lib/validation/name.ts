/**
 * Name validation that works for Indian and international names.
 *
 * Design rules:
 * - Never reject a name merely because it is unfamiliar, non-English, or uses
 *   an unusual script. Only deterministic failures (empty, too short, too long,
 *   no letters at all) are rejected.
 * - Suspicious patterns (keyboard smashes, repeated characters) are recorded as
 *   flags so the lead can be reviewed. The original submission is preserved by
 *   the caller in `Lead.rawName`.
 */

export interface NameValidationResult {
    raw: string;
    /** Trimmed value with collapsed internal whitespace. */
    value: string;
    /** Lower-cased, accent-free-ish key used for duplicate matching. */
    normalized: string;
    valid: boolean;
    flags: string[];
    reason?: string;
}

const ALLOWED = /^[\p{L}\p{M}\s.'’-]+$/u;
const HAS_LETTER = /\p{L}/u;
const KEYBOARD_SMASHES = [
    "asdf", "sdfg", "dfgh", "fghj", "ghjk", "hjkl",
    "qwer", "wert", "erty", "rtyu", "tyui", "yuio",
    "zxcv", "xcvb", "cvbn", "vbnm", "qazwsx", "wsxedc",
];
const PLACEHOLDER_NAMES = new Set([
    "test", "testing", "testuser", "admin", "user", "username", "guest",
    "na", "n/a", "none", "null", "abc", "abcd", "demo", "sample", "unknown",
]);

function envInt(name: string, fallback: number): number {
    const parsed = Number(process.env[name]);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function nameLimits(): { min: number; max: number } {
    return {
        min: envInt("LEAD_NAME_MIN", 2),
        max: envInt("LEAD_NAME_MAX", 80),
    };
}

export function validateName(rawInput: string): NameValidationResult {
    const raw = typeof rawInput === "string" ? rawInput : "";
    const value = raw.trim().replace(/\s+/g, " ");
    const normalized = value.toLocaleLowerCase("en-IN");
    const { min, max } = nameLimits();
    const flags: string[] = [];

    const fail = (reason: string): NameValidationResult => ({
        raw, value, normalized, valid: false, flags, reason,
    });

    if (!value) return fail("Please enter your name.");
    if (value.length < min) return fail(`Name must be at least ${min} characters.`);
    if (value.length > max) return fail(`Name must be ${max} characters or fewer.`);
    if (!HAS_LETTER.test(value)) return fail("Please enter a valid name.");

    if (!ALLOWED.test(value)) flags.push("unexpected_characters");
    if (/\d/.test(value)) flags.push("contains_digits");

    // Same character repeated four or more times ("aaaa", "!!!!").
    if (/(.)\1{3,}/u.test(value)) flags.push("repeated_characters");

    const compact = value.toLowerCase().replace(/[^a-z]/g, "");
    if (compact.length >= 4 && KEYBOARD_SMASHES.some((smash) => compact.includes(smash))) {
        flags.push("keyboard_smash");
    }

    if (PLACEHOLDER_NAMES.has(normalized.replace(/[^a-z/]/g, ""))) {
        flags.push("placeholder_name");
    }

    // Consonant-only runs longer than six characters are almost always noise.
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(compact)) flags.push("consonant_run");

    if (compact.length >= 6) {
        const vowels = (compact.match(/[aeiou]/g) ?? []).length;
        if (vowels / compact.length < 0.15) flags.push("low_vowel_ratio");
    }

    return { raw, value, normalized, valid: true, flags };
}

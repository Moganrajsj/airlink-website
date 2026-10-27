import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Signed "when was this form rendered" token.
 *
 * Purpose: detection, not prevention. A bot can fetch the token too, but
 * combined with the honeypot and rate limits it catches the common cases. A
 * missing token is only a signal (some users block scripts), never a rejection.
 */

const MIN_FILL_MS = 2_500;
const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

function secret(): string {
    return process.env.FORM_TOKEN_SECRET || process.env.JWT_SECRET || "dev-form-secret";
}

function sign(payload: string): string {
    return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function issueFormToken(now: number = Date.now()): string {
    const payload = `${now}.${randomBytes(9).toString("base64url")}`;
    return `${payload}.${sign(payload)}`;
}

export interface FormTokenCheck {
    present: boolean;
    valid: boolean;
    ageMs: number | null;
    reason?: "missing" | "malformed" | "bad_signature" | "future" | "expired";
}

export function verifyFormToken(token: string | undefined | null, now: number = Date.now()): FormTokenCheck {
    if (!token) return { present: false, valid: false, ageMs: null, reason: "missing" };

    const parts = token.split(".");
    if (parts.length !== 3) return { present: true, valid: false, ageMs: null, reason: "malformed" };

    const [issuedAtRaw, nonce, signature] = parts;
    const expected = sign(`${issuedAtRaw}.${nonce}`);

    // Constant-time compare, guarding against length mismatch throwing.
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return { present: true, valid: false, ageMs: null, reason: "bad_signature" };
    }

    const issuedAt = Number(issuedAtRaw);
    if (!Number.isFinite(issuedAt)) {
        return { present: true, valid: false, ageMs: null, reason: "malformed" };
    }

    const ageMs = now - issuedAt;
    if (ageMs < -60_000) return { present: true, valid: false, ageMs, reason: "future" };
    if (ageMs > MAX_TOKEN_AGE_MS) return { present: true, valid: false, ageMs, reason: "expired" };

    return { present: true, valid: true, ageMs };
}

export function isTooFast(ageMs: number | null): boolean {
    return ageMs !== null && ageMs >= 0 && ageMs < MIN_FILL_MS;
}

export const FORM_TIMING_LIMITS = { minFillMs: MIN_FILL_MS, maxAgeMs: MAX_TOKEN_AGE_MS };

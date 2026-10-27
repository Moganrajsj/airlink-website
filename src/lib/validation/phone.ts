/**
 * Indian mobile number normalisation and validation.
 *
 * Accepts the formats customers actually type (+91, 0-prefix, spaces, dashes,
 * brackets, dots) and returns a canonical +91XXXXXXXXXX value.
 *
 * IMPORTANT: a valid result means "format-valid" only. It does NOT prove the
 * number exists, is reachable, or belongs to the person submitting the form.
 * Only an OTP flow may ever set `verificationStatus = "otp_verified"`.
 */

export interface PhoneValidationResult {
    raw: string;
    digits: string;
    /** +91XXXXXXXXXX when valid. */
    e164: string | null;
    /** 10-digit national number when valid. */
    local: string | null;
    valid: boolean;
    reason?: string;
}

const ALLOWED_CHARS = /^[0-9+\-().\s/]+$/;

export function normalizeIndianMobile(rawInput: string): PhoneValidationResult {
    const raw = typeof rawInput === "string" ? rawInput.trim() : "";

    if (!raw) {
        return { raw, digits: "", e164: null, local: null, valid: false, reason: "Mobile number is required." };
    }

    if (!ALLOWED_CHARS.test(raw)) {
        return { raw, digits: raw.replace(/\D/g, ""), e164: null, local: null, valid: false, reason: "Mobile number contains invalid characters." };
    }

    let digits = raw.replace(/\D/g, "");

    // Strip IDD prefix (00) and country code, then a local trunk 0.
    if (digits.startsWith("00")) digits = digits.slice(2);
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

    if (digits.length !== 10) {
        return { raw, digits, e164: null, local: null, valid: false, reason: "Enter a 10-digit Indian mobile number." };
    }

    if (!/^[6-9]\d{9}$/.test(digits)) {
        return { raw, digits, e164: null, local: null, valid: false, reason: "Indian mobile numbers start with 6, 7, 8 or 9." };
    }

    return { raw, digits, e164: `+91${digits}`, local: digits, valid: true };
}

export function isValidIndianMobile(value: string): boolean {
    return normalizeIndianMobile(value).valid;
}

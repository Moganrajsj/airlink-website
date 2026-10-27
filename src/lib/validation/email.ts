export interface EmailValidationResult {
    raw: string;
    value: string | null;
    valid: boolean;
    reason?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

/**
 * Email is optional on every form. A blank value is valid (no email supplied);
 * a malformed value is rejected because the field is user-correctable.
 */
export function normalizeEmail(rawInput?: string | null): EmailValidationResult {
    const raw = typeof rawInput === "string" ? rawInput.trim() : "";
    if (!raw) return { raw, value: null, valid: true };

    if (raw.length > 254) {
        return { raw, value: null, valid: false, reason: "Email address is too long." };
    }
    if (!EMAIL_RE.test(raw)) {
        return { raw, value: null, valid: false, reason: "Enter a valid email address, or leave it blank." };
    }

    const [localPart, domain] = raw.split("@");
    return { raw, value: `${localPart}@${domain.toLowerCase()}`, valid: true };
}

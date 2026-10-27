export interface PincodeValidationResult {
    raw: string;
    value: string | null;
    valid: boolean;
    reason?: string;
}

/** Indian PIN codes are six digits and never start with zero. */
export function normalizePincode(rawInput?: string | null): PincodeValidationResult {
    const raw = typeof rawInput === "string" ? rawInput.trim() : "";
    if (!raw) return { raw, value: null, valid: true };

    const digits = raw.replace(/\s/g, "");
    if (!/^[1-9]\d{5}$/.test(digits)) {
        return { raw, value: null, valid: false, reason: "Enter a valid 6-digit PIN code." };
    }
    return { raw, value: digits, valid: true };
}

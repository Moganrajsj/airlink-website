import { describe, expect, it } from "vitest";
import { normalizeEmail } from "@/lib/validation/email";
import { normalizePincode } from "@/lib/validation/pincode";

describe("normalizeEmail", () => {
    it("treats a blank email as valid because it is optional", () => {
        expect(normalizeEmail("")).toEqual({ raw: "", value: null, valid: true });
        expect(normalizeEmail(null)).toEqual({ raw: "", value: null, valid: true });
        expect(normalizeEmail("   ")).toEqual({ raw: "", value: null, valid: true });
    });

    it("lower-cases the domain only", () => {
        const result = normalizeEmail("  User.Name@Example.COM  ");
        expect(result.valid).toBe(true);
        expect(result.value).toBe("User.Name@example.com");
    });

    it.each(["bad", "a@b", "a@b.", "@example.com", "a b@example.com", "a@@example.com"])(
        "rejects malformed address %s",
        (input) => {
            const result = normalizeEmail(input);
            expect(result.valid).toBe(false);
            expect(result.value).toBeNull();
            expect(result.reason).toBeTruthy();
        }
    );

    it("rejects an over-long address", () => {
        const result = normalizeEmail(`${"a".repeat(250)}@example.com`);
        expect(result.valid).toBe(false);
        expect(result.reason).toContain("too long");
    });
});

describe("normalizePincode", () => {
    it("treats a blank pincode as valid because it is optional", () => {
        expect(normalizePincode("")).toEqual({ raw: "", value: null, valid: true });
        expect(normalizePincode(null)).toEqual({ raw: "", value: null, valid: true });
    });

    it("strips spaces from a six-digit code", () => {
        expect(normalizePincode("600 001")).toEqual({ raw: "600 001", value: "600001", valid: true });
    });

    it.each(["060001", "60001", "6000012", "ABCDEF", "12345"])("rejects %s", (input) => {
        const result = normalizePincode(input);
        expect(result.valid).toBe(false);
        expect(result.value).toBeNull();
        expect(result.reason).toContain("6-digit PIN");
    });
});

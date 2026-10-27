import { describe, expect, it } from "vitest";
import { isValidIndianMobile, normalizeIndianMobile } from "@/lib/validation/phone";

describe("normalizeIndianMobile", () => {
    it.each([
        ["9876543210", "+919876543210", "9876543210"],
        ["+91 98765 43210", "+919876543210", "9876543210"],
        ["+91-98765-43210", "+919876543210", "9876543210"],
        ["09876543210", "+919876543210", "9876543210"],
        ["0091 9876543210", "+919876543210", "9876543210"],
        ["919876543210", "+919876543210", "9876543210"],
        ["(98765) 43210", "+919876543210", "9876543210"],
        ["6000000000", "+916000000000", "6000000000"],
        ["7000000000", "+917000000000", "7000000000"],
        ["8000000000", "+918000000000", "8000000000"],
        ["9000000000", "+919000000000", "9000000000"],
    ])("normalises %s to %s", (input, e164, local) => {
        const result = normalizeIndianMobile(input);
        expect(result.valid).toBe(true);
        expect(result.e164).toBe(e164);
        expect(result.local).toBe(local);
        expect(result.raw).toBe(input.trim());
    });

    it.each([
        ["", "required"],
        ["   ", "required"],
        ["1234567890", "Indian mobile numbers start with 6, 7, 8 or 9"],
        ["5876543210", "Indian mobile numbers start with 6, 7, 8 or 9"],
        ["98765 4321", "10-digit"],
        ["98765432101", "10-digit"],
        ["987654321", "10-digit"],
        ["98765abc10", "invalid characters"],
        ["+91 98765 4321x", "invalid characters"],
    ])("rejects %s", (input, reasonFragment) => {
        const result = normalizeIndianMobile(input);
        expect(result.valid).toBe(false);
        expect(result.e164).toBeNull();
        expect(result.local).toBeNull();
        expect(result.reason).toContain(reasonFragment);
    });

    it("keeps the original submission untouched", () => {
        const input = "  +91 (98765) 43210  ";
        expect(normalizeIndianMobile(input).raw).toBe("+91 (98765) 43210");
    });

    it("never claims a number is verified, only format-valid", () => {
        const result = normalizeIndianMobile("9876543210");
        expect(result).not.toHaveProperty("verified");
        expect(result.valid).toBe(true);
    });

    it("exposes the boolean helper", () => {
        expect(isValidIndianMobile("9876543210")).toBe(true);
        expect(isValidIndianMobile("12345")).toBe(false);
    });
});

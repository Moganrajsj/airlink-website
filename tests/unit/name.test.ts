import { describe, expect, it } from "vitest";
import { nameLimits, validateName } from "@/lib/validation/name";

describe("validateName", () => {
    it("trims and collapses whitespace without changing the original", () => {
        const result = validateName("  Priya   Raman  ");
        expect(result.valid).toBe(true);
        expect(result.value).toBe("Priya Raman");
        expect(result.normalized).toBe("priya raman");
        expect(result.raw).toBe("  Priya   Raman  ");
        expect(result.flags).toEqual([]);
    });

    it("accepts Tamil names with combining marks", () => {
        const result = validateName("முருகேசன்");
        expect(result.valid).toBe(true);
        expect(result.flags).toEqual([]);
    });

    it("accepts common international name punctuation", () => {
        for (const name of ["John O'Brien", "Anne-Marie D'Souza", "Dr. A. Kumar", "J. R. R. Tolkien"]) {
            expect(validateName(name).valid, name).toBe(true);
        }
    });

    it("rejects only deterministic failures", () => {
        expect(validateName("").valid).toBe(false);
        expect(validateName("   ").valid).toBe(false);
        expect(validateName("A").valid).toBe(false);
        expect(validateName("x".repeat(81)).valid).toBe(false);
        expect(validateName("12345").valid).toBe(false);
    });

    it("respects configurable limits", () => {
        const limits = nameLimits();
        expect(limits).toEqual({ min: 2, max: 80 });
    });

    it("flags suspicious names instead of rejecting them", () => {
        expect(validateName("Test").valid).toBe(true);
        expect(validateName("Test").flags).toContain("placeholder_name");

        expect(validateName("Asdfgh").valid).toBe(true);
        expect(validateName("Asdfgh").flags).toContain("keyboard_smash");

        expect(validateName("Rahul123").valid).toBe(true);
        expect(validateName("Rahul123").flags).toContain("contains_digits");

        expect(validateName("Aaaaaaaa").valid).toBe(true);
        expect(validateName("Aaaaaaaa").flags).toContain("repeated_characters");

        expect(validateName("Rahul@Kumar").valid).toBe(true);
        expect(validateName("Rahul@Kumar").flags).toContain("unexpected_characters");
    });

    it("preserves every valid lead even when flags are present", () => {
        const result = validateName("Test User 123");
        expect(result.valid).toBe(true);
        expect(result.raw).toBe("Test User 123");
        expect(result.flags.length).toBeGreaterThan(0);
    });
});

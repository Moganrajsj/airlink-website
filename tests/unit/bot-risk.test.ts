import { describe, expect, it } from "vitest";
import { assessBotRisk, spamBand, type BotRiskInput } from "@/lib/anti-abuse/bot-risk";

const genuine: BotRiskInput = {
    honeypotFilled: false,
    tokenPresent: true,
    tokenValid: true,
    tokenAgeMs: 8_000,
    duplicatePhoneCount: 0,
    nameFlags: [],
    phoneValid: true,
    userAgentPresent: true,
    message: "I would like a new fibre connection at my home in Dharmapuri.",
};

describe("assessBotRisk", () => {
    it("gives a genuine enquiry a zero risk score", () => {
        const result = assessBotRisk(genuine);
        expect(result.score).toBe(0);
        expect(result.signals).toEqual([]);
        expect(result.deterministicAbuse).toBe(false);
    });

    it("treats a filled honeypot as deterministic abuse", () => {
        const result = assessBotRisk({ ...genuine, honeypotFilled: true });
        expect(result.score).toBe(80);
        expect(result.signals).toContain("honeypot_filled");
        expect(result.deterministicAbuse).toBe(true);
    });

    it("scores a scripted submission with no token, no UA and an instant submit", () => {
        const result = assessBotRisk({
            ...genuine,
            tokenPresent: false,
            tokenValid: false,
            tokenAgeMs: 400,
            userAgentPresent: false,
            phoneValid: false,
            message: "buy now http://spam.example",
        });
        // 25 missing token + 35 too fast + 10 no UA + 20 invalid phone + 15 link
        expect(result.score).toBe(100);
        expect(result.signals).toEqual(
            expect.arrayContaining([
                "missing_form_token",
                "submitted_too_fast",
                "missing_user_agent",
                "invalid_phone",
                "link_in_message",
            ])
        );
        expect(result.deterministicAbuse).toBe(false);
    });

    it("caps duplicate and name-flag penalties so a real repeat is not auto-rejected", () => {
        const duplicates = assessBotRisk({ ...genuine, duplicatePhoneCount: 5 });
        expect(duplicates.score).toBe(30);
        expect(duplicates.signals).toContain("duplicate_phone_x5");
        expect(duplicates.deterministicAbuse).toBe(false);

        const flags = assessBotRisk({
            ...genuine,
            nameFlags: ["placeholder_name", "keyboard_smash", "contains_digits", "repeated_characters"],
        });
        expect(flags.score).toBe(30);
        expect(flags.signals).toContain("name_placeholder_name");
    });

    it("rewards a missing token as a signal, not a rejection", () => {
        const result = assessBotRisk({ ...genuine, tokenPresent: false });
        expect(result.score).toBe(25);
        expect(result.deterministicAbuse).toBe(false);
        expect(result.signals).toEqual(["missing_form_token"]);
    });

    it("clamps the score to 100", () => {
        const result = assessBotRisk({
            ...genuine,
            honeypotFilled: true,
            tokenPresent: false,
            tokenAgeMs: 10,
            duplicatePhoneCount: 4,
            nameFlags: ["keyboard_smash", "placeholder_name"],
            phoneValid: false,
            userAgentPresent: false,
            message: "www.example.com",
            submittedFieldsMismatch: true,
        });
        expect(result.score).toBe(100);
    });

    it("bands the score", () => {
        expect(spamBand(0)).toBe("low");
        expect(spamBand(39)).toBe("low");
        expect(spamBand(40)).toBe("elevated");
        expect(spamBand(69)).toBe("elevated");
        expect(spamBand(70)).toBe("high");
    });
});

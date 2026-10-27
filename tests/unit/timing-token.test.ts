import { describe, expect, it } from "vitest";
import {
    FORM_TIMING_LIMITS,
    isTooFast,
    issueFormToken,
    verifyFormToken,
} from "@/lib/anti-abuse/timing-token";

describe("form timing token", () => {
    it("round-trips a fresh token", () => {
        const now = 1_700_000_000_000;
        const token = issueFormToken(now);
        const result = verifyFormToken(token, now + 5_000);
        expect(result.present).toBe(true);
        expect(result.valid).toBe(true);
        expect(result.ageMs).toBe(5_000);
    });

    it("reports a missing token without throwing", () => {
        expect(verifyFormToken(undefined)).toMatchObject({ present: false, valid: false, reason: "missing" });
        expect(verifyFormToken("")).toMatchObject({ present: false, valid: false, reason: "missing" });
    });

    it("rejects a malformed token", () => {
        expect(verifyFormToken("abc")).toMatchObject({ present: true, valid: false, reason: "malformed" });
        expect(verifyFormToken("1.2.3.4")).toMatchObject({ present: true, valid: false, reason: "malformed" });
    });

    it("rejects a tampered signature", () => {
        const token = issueFormToken(1_700_000_000_000);
        const tampered = `${token.slice(0, -2)}aa`;
        expect(verifyFormToken(tampered, 1_700_000_005_000)).toMatchObject({
            present: true,
            valid: false,
            reason: "bad_signature",
        });
    });

    it("expires after the configured window", () => {
        const now = 1_700_000_000_000;
        const token = issueFormToken(now);
        const result = verifyFormToken(token, now + FORM_TIMING_LIMITS.maxAgeMs + 1);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe("expired");
    });

    it("rejects a token issued well into the future", () => {
        const now = 1_700_000_000_000;
        const token = issueFormToken(now + 120_000);
        expect(verifyFormToken(token, now)).toMatchObject({ valid: false, reason: "future" });
    });

    it("flags submissions faster than a human can type", () => {
        expect(isTooFast(500)).toBe(true);
        expect(isTooFast(2_499)).toBe(true);
        expect(isTooFast(2_500)).toBe(false);
        expect(isTooFast(null)).toBe(false);
    });
});

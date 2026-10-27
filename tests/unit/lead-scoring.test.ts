import { afterEach, describe, expect, it } from "vitest";
import {
    HOT_THRESHOLD,
    WARM_THRESHOLD,
    scoreLead,
    shouldEnrichWithAi,
    tierForScore,
} from "@/lib/lead-scoring";

const now = new Date("2026-10-27T10:00:00.000Z");

const genuineInput = {
    name: "Priya Raman",
    mobile: "9876543210",
    email: "priya@example.com",
    city: "Dharmapuri",
    pincode: "636701",
    interest: "Home Broadband",
    source: "plans_page",
    status: "new",
    message:
        "I need a new fibre connection installed at my home this week. Please share the plan price and whether a router is included.",
    createdAt: now,
};

afterEach(() => {
    delete process.env.AI_ENRICH_MIN_SCORE;
});

describe("scoreLead", () => {
    it("scores a complete, in-area enquiry as hot and explains why", () => {
        const result = scoreLead(genuineInput, {
            coverageStatus: "Live",
            now,
        });
        expect(result.tier).toBe("hot");
        expect(result.score).toBeGreaterThanOrEqual(HOT_THRESHOLD);
        expect(result.score).toBeLessThanOrEqual(100);
        expect(result.reasons.join(" ")).toContain("Valid Indian mobile number");
        expect(result.reasons.join(" ")).toContain("City in service area");
        expect(result.reasons.join(" ")).toContain("Buying intent detected");
    });

    it("is deterministic for the same input and context", () => {
        const first = scoreLead(genuineInput, { coverageStatus: "Live", now });
        const second = scoreLead(genuineInput, { coverageStatus: "Live", now });
        expect(second).toEqual(first);
    });

    it("penalises an invalid phone number but still returns a lead", () => {
        const result = scoreLead({ ...genuineInput, mobile: "12345" }, { now });
        expect(result.reasons.join(" ")).toContain("looks invalid");
        expect(result.score).toBeLessThan(HOT_THRESHOLD);
    });

    it("marks test / spam wording as a penalty", () => {
        const result = scoreLead(
            { ...genuineInput, name: "test user", message: "test asdf qwerty dummy" },
            { now }
        );
        expect(result.reasons.join(" ")).toContain("test / spam entry");
        expect(result.tier).not.toBe("hot");
    });

    it("reduces the score for repeated phone submissions", () => {
        const base = { ...genuineInput, email: "", source: "popup_lead", message: "Need a connection" };
        const clean = scoreLead(base, { coverageStatus: "Live", now });
        expect(clean.score).toBeLessThan(100);
        const duplicate = scoreLead(base, {
            coverageStatus: "Live",
            now,
            duplicatePhoneCount: 2,
        });
        expect(duplicate.score).toBe(clean.score - 20);
        expect(duplicate.reasons.join(" ")).toContain("Same phone submitted 2 other time(s)");
    });

    it("reduces the score for a closed lead", () => {
        const base = { ...genuineInput, email: "", source: "popup_lead", message: "Need a connection" };
        const open = scoreLead(base, { coverageStatus: "Live", now });
        expect(open.score).toBeLessThan(100);
        const closed = scoreLead(
            { ...base, status: "closed" },
            { coverageStatus: "Live", now }
        );
        expect(closed.score).toBe(open.score - 20);
    });

    it("does not promise service for a city missing from coverage", () => {
        const result = scoreLead({ ...genuineInput, city: "Chennai" }, { now });
        expect(result.reasons.join(" ")).toContain("not in coverage list");
    });

    it("never exceeds the 0-100 range", () => {
        const maxed = scoreLead(
            {
                ...genuineInput,
                interest: "Business leased line",
                source: "ai_assistant",
                message: `${genuineInput.message} ${"install ".repeat(20)}`,
            },
            { coverageStatus: "Live", now }
        );
        expect(maxed.score).toBeLessThanOrEqual(100);

        const minimal = scoreLead(
            {
                name: "Al",
                mobile: "",
                city: "",
                status: "closed",
                message: "test asdf",
                createdAt: "2020-01-01T00:00:00.000Z",
            },
            { now }
        );
        expect(minimal.score).toBeGreaterThanOrEqual(0);
    });
});

describe("tierForScore", () => {
    it("uses the documented thresholds", () => {
        expect(tierForScore(100)).toBe("hot");
        expect(tierForScore(HOT_THRESHOLD)).toBe("hot");
        expect(tierForScore(HOT_THRESHOLD - 1)).toBe("warm");
        expect(tierForScore(WARM_THRESHOLD)).toBe("warm");
        expect(tierForScore(WARM_THRESHOLD - 1)).toBe("cold");
    });
});

describe("shouldEnrichWithAi", () => {
    it("defaults to the warm threshold", () => {
        expect(shouldEnrichWithAi(WARM_THRESHOLD)).toBe(true);
        expect(shouldEnrichWithAi(WARM_THRESHOLD - 1)).toBe(false);
    });

    it("respects AI_ENRICH_MIN_SCORE", () => {
        process.env.AI_ENRICH_MIN_SCORE = "0";
        expect(shouldEnrichWithAi(0)).toBe(true);
        process.env.AI_ENRICH_MIN_SCORE = "80";
        expect(shouldEnrichWithAi(79)).toBe(false);
        expect(shouldEnrichWithAi(80)).toBe(true);
    });
});

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { issueFormToken } from "@/lib/anti-abuse/timing-token";
import { hashIp } from "@/lib/anti-abuse/ip";

/**
 * End-to-end intake test against the real database.
 *
 * The server action is executed for real (validation, rate limits, duplicate
 * detection, persistence). Only the request-scoped Next.js primitives are
 * stubbed: `headers()`, `revalidatePath()` and `after()`. The `after` stub is
 * intentional — it stops the AI scoring and the admin email, so a test never
 * spends Groq quota or notifies a real person.
 *
 * Every phone number below is a reserved-looking 90000001xx value and every IP
 * is in the TEST-NET-3 documentation range (203.0.113.0/24). Rows created here
 * are deleted in afterAll; nothing pre-existing is touched.
 */

const h = vi.hoisted(() => ({ current: new Headers() }));

vi.mock("next/headers", () => ({ headers: async () => h.current }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("next/server", () => ({ after: () => {} }));

import { createLead } from "@/app/actions/leads";
import { prisma } from "@/lib/prisma";
import { scoreAndSaveLead } from "@/lib/lead-intelligence";
import { getIntelligenceMetrics } from "@/lib/intelligence";

const RUN = process.env.RUN_DB_TESTS === "1";

const createdIds: string[] = [];
const testIps = ["203.0.113.11", "203.0.113.12", "203.0.113.13", "203.0.113.14", "203.0.113.15", "203.0.113.16"];
const testPhones = ["9000000101", "9000000102", "9000000103", "9000000104", "9000000105", "9000000106"];

function useRequest(ip: string, userAgent = "AirlinkIntegrationTest/1.0") {
    h.current = new Headers({
        "x-forwarded-for": ip,
        "user-agent": userAgent,
    });
}

function submit(overrides: Record<string, unknown> & { name: string; mobile: string }) {
    return createLead({
        formToken: issueFormToken(Date.now() - 6_000),
        city: "Dharmapuri",
        pincode: "636701",
        interest: "Home Broadband",
        source: "integration_test",
        // Avoid the word "test" in the customer-visible text: it is a spam
        // signal in the scoring rules and would make assertions noisy.
        ...overrides,
    } as Parameters<typeof createLead>[0]);
}

beforeAll(async () => {
    if (!RUN) return;
    // Fail fast with a clear message rather than a wall of Prisma errors.
    await prisma.$queryRaw`SELECT 1`;
});

afterAll(async () => {
    if (!RUN) return;
    if (createdIds.length > 0) {
        await prisma.leadEvent.deleteMany({ where: { leadId: { in: createdIds } } });
        await prisma.lead.deleteMany({ where: { id: { in: createdIds } } });
    }

    const ipHashes = testIps.map((ip) => hashIp(ip)).filter((value): value is string => Boolean(value));
    if (ipHashes.length > 0) {
        await prisma.rateLimitBucket.deleteMany({
            where: { key: { in: ipHashes.map((hash) => `lead:ip:${hash}`) } },
        });
    }
    await prisma.rateLimitBucket.deleteMany({
        where: { key: { in: testPhones.map((phone) => `lead:phone:${phone}`) } },
    });
    await prisma.securityEvent.deleteMany({
        where: { OR: createdIds.map((id) => ({ detail: { contains: id } })) },
    });

    await prisma.$disconnect();
});

describe.runIf(RUN)("real lead intake", () => {
    it("stores a genuine enquiry with normalised contact data and the original submission", async () => {
        useRequest(testIps[0]);
        const result = await submit({
            name: "Priya Raman",
            mobile: "+91 90000 00101",
            email: "Priya@Example.COM",
            city: "Dharmapuri",
            pincode: "636 701",
            message: "I need a new fibre connection installed at my home this week.",
        });

        expect(result.success).toBe(true);
        if (!result.success) return;
        createdIds.push(result.leadId);

        const lead = await prisma.lead.findUniqueOrThrow({ where: { id: result.leadId } });
        expect(lead.name).toBe("Priya Raman");
        expect(lead.rawName).toBe("Priya Raman");
        expect(lead.mobile).toBe("9000000101");
        expect(lead.phoneNormalized).toBe("9000000101");
        expect(lead.rawPhone).toBe("+91 90000 00101");
        expect(lead.email).toBe("Priya@example.com");
        expect(lead.pincode).toBe("636701");
        expect(lead.validationStatus).toBe("valid");
        expect(lead.verificationStatus).toBe("format_valid");
        expect(lead.status).toBe("new");
        expect(lead.duplicateOfId).toBeNull();
        expect(lead.ipHash).toBe(hashIp(testIps[0]));
        expect(lead.userAgentHash).toBeTruthy();

        const events = await prisma.leadEvent.findMany({ where: { leadId: lead.id } });
        expect(events.map((event) => event.type)).toContain("created");
    });

    it("rejects an invalid phone number before writing anything", async () => {
        const before = await prisma.lead.count();
        useRequest(testIps[1]);
        const result = await createLead({
            name: "Priya Raman",
            mobile: "12345",
            formToken: issueFormToken(Date.now() - 6_000),
            source: "integration_test",
        } as Parameters<typeof createLead>[0]);

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.field).toBe("phone");
        expect(await prisma.lead.count()).toBe(before);
    });

    it("stores a suspicious name as flagged, not rejected or marked spam", async () => {
        useRequest(testIps[2]);
        const result = await submit({
            name: "Asdfgh Qwerty",
            mobile: testPhones[2],
            message: "Please share plan details for my home.",
        });

        expect(result.success).toBe(true);
        if (!result.success) return;
        createdIds.push(result.leadId);

        const lead = await prisma.lead.findUniqueOrThrow({ where: { id: result.leadId } });
        expect(lead.validationStatus).toBe("suspicious");
        expect(lead.status).not.toBe("spam");
        expect(lead.status).toBe("new");
        expect(lead.botRisk).toBeGreaterThan(0);
        expect(lead.botRisk).toBeLessThan(60);

        const flags = JSON.parse(lead.validationFlags ?? "[]") as string[];
        expect(flags).toContain("name_keyboard_smash");
    });

    it("accepts a PIN code typed into the locality field and flags it for review", async () => {
        useRequest(testIps[5]);
        const result = await submit({
            name: "Meena Raj",
            mobile: testPhones[5],
            city: "636701",
            pincode: "",
            message: "Please check if a connection is possible at this address.",
        });

        expect(result.success).toBe(true);
        if (!result.success) return;
        createdIds.push(result.leadId);

        const lead = await prisma.lead.findUniqueOrThrow({ where: { id: result.leadId } });
        expect(lead.pincode).toBe("636701");
        const flags = JSON.parse(lead.validationFlags ?? "[]") as string[];
        expect(flags).toContain("pincode_in_locality_field");
    });

    it("links a repeat number to the earlier lead instead of deleting it", async () => {
        useRequest(testIps[0]);
        const result = await submit({
            name: "Priya Raman",
            mobile: testPhones[0],
            message: "Following up on my earlier enquiry about installation.",
        });

        expect(result.success).toBe(true);
        if (!result.success) return;
        createdIds.push(result.leadId);

        const lead = await prisma.lead.findUniqueOrThrow({ where: { id: result.leadId } });
        expect(lead.duplicateOfId).toBeTruthy();
        expect(lead.duplicateOfId).not.toBe(lead.id);

        const signals = JSON.parse(lead.botSignals ?? "[]") as string[];
        expect(signals.some((signal) => signal.startsWith("duplicate_phone"))).toBe(true);

        const events = await prisma.leadEvent.findMany({ where: { leadId: lead.id } });
        expect(events.map((event) => event.type)).toContain("duplicate_linked");
    });

    it("stores a honeypot submission as spam without rejecting or emailing", async () => {
        useRequest(testIps[3]);
        const result = await submit({
            name: "Priya Raman",
            mobile: testPhones[3],
            message: "Visit http://spam.example for cheap offers",
            honeypot: "http://spam.example",
        });

        expect(result.success).toBe(true);
        if (!result.success) return;
        createdIds.push(result.leadId);

        const lead = await prisma.lead.findUniqueOrThrow({ where: { id: result.leadId } });
        expect(lead.status).toBe("spam");
        expect(lead.validationStatus).toBe("suspicious");
        expect(lead.botRisk).toBeGreaterThanOrEqual(80);

        const events = await prisma.leadEvent.findMany({ where: { leadId: lead.id } });
        expect(events.map((event) => event.type)).toContain("spam_detected");
    });

    it("scores a stored lead deterministically and explains the result", async () => {
        useRequest(testIps[4]);
        const result = await submit({
            name: "Karthik Selvam",
            mobile: testPhones[4],
            email: "karthik@example.com",
            message:
                "I want to book a new broadband connection. Please confirm availability and the installation cost.",
            campaign: "integration",
        });

        expect(result.success).toBe(true);
        if (!result.success) return;
        createdIds.push(result.leadId);

        const lead = await prisma.lead.findUniqueOrThrow({ where: { id: result.leadId } });
        const scored = await scoreAndSaveLead(lead, { allowAi: false });

        expect(scored).not.toBeNull();
        expect(scored?.aiStatus).toBe("heuristic");
        expect(scored?.enriched).toBe(false);
        expect(scored?.score).toBeGreaterThanOrEqual(0);
        expect(scored?.score).toBeLessThanOrEqual(100);
        expect(scored?.reasons.length).toBeGreaterThan(0);

        const saved = await prisma.lead.findUniqueOrThrow({ where: { id: lead.id } });
        expect(saved.qualityScore).toBe(scored?.score);
        expect(saved.aiScore).toBe(scored?.score);
        expect(saved.spamRisk).toBe(saved.botRisk);
        expect(["qualified", "contactable", "needs_review", "low_intent", "spam"]).toContain(saved.classification);
        expect(["high", "medium", "low"]).toContain(saved.confidence);
        expect(saved.aiReasons).toBeTruthy();

        const events = await prisma.leadEvent.findMany({ where: { leadId: lead.id } });
        expect(events.map((event) => event.type)).toContain("scored_heuristic");

        // Re-running must not produce a different score for unchanged data.
        const rescored = await scoreAndSaveLead(
            await prisma.lead.findUniqueOrThrow({ where: { id: lead.id } }),
            { allowAi: false }
        );
        expect(rescored?.score).toBe(scored?.score);
    });
});

describe.runIf(RUN)("intelligence metrics against the live database", () => {
    it("reports counts that match direct queries", async () => {
        const metrics = await getIntelligenceMetrics(30);
        const total = await prisma.lead.count();
        const spam = await prisma.lead.count({ where: { status: "spam" } });
        const converted = await prisma.lead.count({ where: { status: "converted" } });

        expect(metrics.counts.total).toBe(total);
        expect(metrics.counts.spam).toBe(spam);
        expect(metrics.counts.converted).toBe(converted);
        expect(metrics.trends).toHaveLength(30);
        expect(metrics.counts.phoneFormatValid).toBeLessThanOrEqual(total);
        expect(metrics.counts.phoneVerified).toBe(0);
        expect(metrics.counts.valid + metrics.counts.suspicious + metrics.counts.invalid).toBe(total);

        // A rate is a fraction or unknown, never a fabricated percentage.
        for (const rate of [metrics.rates.spamRate, metrics.rates.validRate, metrics.rates.conversionRate]) {
            expect(rate).toBeGreaterThanOrEqual(0);
            expect(rate).toBeLessThanOrEqual(1);
        }
        if (metrics.outcomes.falsePositiveRate !== null) {
            expect(metrics.outcomes.falsePositiveRate).toBeGreaterThanOrEqual(0);
            expect(metrics.outcomes.falsePositiveRate).toBeLessThanOrEqual(1);
        }
    });
});

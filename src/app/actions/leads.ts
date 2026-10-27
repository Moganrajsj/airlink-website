"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { processNewLead } from "@/lib/lead-intelligence";
import { requireAdminAction } from "@/lib/auth/admin-session";
import { normalizeIndianMobile } from "@/lib/validation/phone";
import { validateLeadSubmission, type LeadSubmission } from "@/lib/lead-validation";
import { hashIp, hashUserAgent, getClientIpFromHeaders } from "@/lib/anti-abuse/ip";
import { consumeRateLimit, envInt } from "@/lib/anti-abuse/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";

/**
 * Public lead capture. Every submission is validated server-side; nothing the
 * browser sends is trusted. Suspicious submissions are stored and flagged for
 * human review — they are never silently deleted.
 */

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export type CreateLeadResult =
    | { success: true; leadId: string }
    | { success: false; error: string; field?: string; retryAfter?: number };

export async function createLead(formData: LeadSubmission): Promise<CreateLeadResult> {
    // Reject malformed contact details before touching rate-limit tables.
    const phoneCheck = normalizeIndianMobile(formData.mobile || formData.phone || "");
    if (!phoneCheck.valid) {
        return { success: false, field: "phone", error: phoneCheck.reason ?? "Please enter a valid 10-digit mobile number." };
    }

    const requestHeaders = await headers();
    const ipHash = hashIp(getClientIpFromHeaders(requestHeaders));
    const userAgent = requestHeaders.get("user-agent");
    const userAgentHash = hashUserAgent(userAgent);

    // ── Rate limits (configurable, durable) ──────────────────────────────────
    const ipLimit = envInt("LEAD_RATE_LIMIT_PER_HOUR", 5);
    const phoneLimit = envInt("LEAD_PHONE_LIMIT_PER_DAY", 3);

    if (ipHash) {
        const ipBudget = await consumeRateLimit(`lead:ip:${ipHash}`, ipLimit, HOUR_MS);
        if (!ipBudget.allowed) {
            await logSecurityEvent("lead_rate_limit_ip", ipHash, { retryAfterSeconds: ipBudget.retryAfterSeconds });
            return {
                success: false,
                error: "Too many requests from this connection. Please try again later or call us on +91 93445 84000.",
                retryAfter: ipBudget.retryAfterSeconds,
            };
        }
    }

    const phoneBudget = await consumeRateLimit(`lead:phone:${phoneCheck.local}`, phoneLimit, DAY_MS);
    if (!phoneBudget.allowed) {
        await logSecurityEvent("lead_rate_limit_phone", ipHash, { retryAfterSeconds: phoneBudget.retryAfterSeconds });
        return {
            success: false,
            error: "This number has already submitted several enquiries. Please call us on +91 93445 84000 so we can help directly.",
            retryAfter: phoneBudget.retryAfterSeconds,
        };
    }

    // ── Full validation ──────────────────────────────────────────────────────
    const validation = await validateLeadSubmission(formData, {
        ipHash,
        userAgentHash,
        userAgentPresent: Boolean(userAgent),
    });

    if (!validation.ok) {
        return { success: false, field: validation.field, error: validation.error };
    }

    const lead = validation.lead;
    const isSpam = lead.isDeterministicAbuse;

    try {
        const created = await prisma.lead.create({
            data: {
                name: lead.name,
                rawName: lead.rawName,
                nameNormalized: lead.nameNormalized,
                mobile: lead.mobile,
                phone: lead.phone,
                rawPhone: lead.rawPhone,
                phoneNormalized: lead.phoneNormalized,
                email: lead.email,
                company: lead.company,
                city: lead.city,
                pincode: lead.pincode,
                interest: lead.interest,
                source: lead.source,
                message: lead.message,
                campaign: lead.campaign,
                status: isSpam ? "spam" : "new",
                validationStatus: lead.validationStatus,
                validationFlags: lead.validationFlags.length ? JSON.stringify(lead.validationFlags) : null,
                verificationStatus: lead.verificationStatus,
                botRisk: lead.botRisk,
                botSignals: lead.botSignals.length ? JSON.stringify(lead.botSignals) : null,
                duplicateOfId: lead.duplicateOfId,
                ipHash: lead.ipHash,
                userAgentHash: lead.userAgentHash,
            },
        });

        await prisma.leadEvent.create({
            data: {
                leadId: created.id,
                type: isSpam ? "spam_detected" : "created",
                actor: "system",
                payload: JSON.stringify({
                    validationStatus: lead.validationStatus,
                    verificationStatus: lead.verificationStatus,
                    botRisk: lead.botRisk,
                    signals: lead.validationFlags,
                    duplicateOfId: lead.duplicateOfId,
                    source: lead.source,
                }),
            },
        });

        if (lead.duplicateOfId) {
            await prisma.leadEvent.create({
                data: {
                    leadId: created.id,
                    type: "duplicate_linked",
                    actor: "system",
                    payload: JSON.stringify({ duplicateOfId: lead.duplicateOfId }),
                },
            });
        }

        if (lead.isDeterministicAbuse) {
            await logSecurityEvent("lead_honeypot", ipHash, { leadId: created.id });
        }

        // Bots get a normal-looking success so they do not retry. No notification
        // is ever sent for honeypot submissions.
        if (!isSpam) {
            after(async () => {
                try {
                    await processNewLead(created.id);
                } catch (error) {
                    console.error("Lead intelligence failed:", error);
                }
            });
        }

        revalidatePath("/admin");
        revalidatePath("/admin/leads");

        return { success: true, leadId: created.id };
    } catch (error) {
        console.error("Failed to create lead:", error instanceof Error ? error.message : error);
        return { success: false, error: "Something went wrong. Please try again later." };
    }
}

export async function updateLeadStatus(leadId: string, status: string) {
    const session = await requireAdminAction("admin");
    if (!session) return { success: false, error: "Not authorised." };

    const allowed = ["new", "contacted", "qualified", "closed", "converted", "spam"];
    if (!allowed.includes(status)) return { success: false, error: "Unknown status." };

    try {
        const current = await prisma.lead.findUnique({ where: { id: leadId }, select: { status: true } });
        await prisma.lead.update({ where: { id: leadId }, data: { status } });
        await prisma.leadEvent.create({
            data: {
                leadId,
                type: "status_changed",
                actor: session.email,
                payload: JSON.stringify({ from: current?.status ?? null, to: status }),
            },
        });
        revalidatePath("/admin/leads");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("updateLeadStatus failed:", error instanceof Error ? error.message : error);
        return { success: false, error: "Could not update this lead." };
    }
}

export async function getRecentLeads(limit = 10) {
    if (!(await requireAdminAction("viewer"))) return [];
    try {
        return await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
            take: Math.min(Math.max(1, limit), 50),
        });
    } catch {
        return [];
    }
}

export async function getAllLeads(search?: string, interest?: string, status?: string, city?: string) {
    if (!(await requireAdminAction("viewer"))) return [];
    try {
        const all = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
        return all.filter((l) => {
            const q = (search || '').toLowerCase();
            const matchSearch = !q ||
                String(l.name).toLowerCase().includes(q) ||
                String(l.email || '').toLowerCase().includes(q) ||
                String(l.mobile || l.phone || '').includes(q);
            const matchInterest = !interest || l.interest === interest;
            const matchStatus = !status || l.status === status;
            const matchCity = !city || String(l.city).toLowerCase().includes(city.toLowerCase());
            return matchSearch && matchInterest && matchStatus && matchCity;
        });
    } catch {
        return [];
    }
}

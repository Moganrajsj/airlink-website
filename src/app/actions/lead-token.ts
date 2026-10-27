"use server";

import { issueFormToken } from "@/lib/anti-abuse/timing-token";
import { prisma } from "@/lib/prisma";

/**
 * Issues a signed "form opened at" token. The public forms call this on mount
 * and send the token back with the submission so the server can measure how
 * long the form was on screen.
 */
export async function getLeadFormToken(): Promise<string> {
    return issueFormToken();
}

export interface CoverageLookupResult {
    status: "covered" | "planned" | "unknown";
    area: string | null;
    message: string;
}

const LIVE = /live|active|available|covered|serviceable|^yes$/i;
const PLANNED = /coming|soon|planned|expansion/i;

/**
 * Looks up a locality or PIN code against the Coverage table.
 * Never claims address-level serviceability: the result is always described as
 * area-level and subject to a physical survey.
 */
export async function checkCoverage(locality: string, pincode?: string): Promise<CoverageLookupResult> {
    const query = (locality || "").trim().slice(0, 80);
    if (!query) {
        return { status: "unknown", area: null, message: "Enter your area or PIN code so we can check coverage." };
    }

    try {
        const rows = await prisma.coverage.findMany({
            select: { cityName: true, status: true, pincodes: true },
        }).catch(() => [] as Array<{ cityName: string; status: string; pincodes: string | null }>);

        const needle = query.toLowerCase();
        const match = rows.find((row) => {
            const byName = row.cityName?.toLowerCase() === needle || row.cityName?.toLowerCase().includes(needle);
            const pinList = (row.pincodes ?? "").split(/[,\s]+/).filter(Boolean);
            const byPin = Boolean(pincode && pinList.includes(pincode));
            return byName || byPin;
        });

        if (!match) {
            return {
                status: "unknown",
                area: query,
                message: `We do not have "${query}" in our published coverage list yet. Our team can confirm after a quick check.`,
            };
        }

        if (PLANNED.test(match.status)) {
            return {
                status: "planned",
                area: match.cityName,
                message: `${match.cityName} is planned but not live yet. Register your interest and we will contact you when the network reaches you.`,
            };
        }

        if (LIVE.test(match.status)) {
            return {
                status: "covered",
                area: match.cityName,
                message: `Airlink is available in ${match.cityName}. Coverage at your exact address is confirmed by a free site survey.`,
            };
        }

        return {
            status: "unknown",
            area: match.cityName,
            message: `We have ${match.cityName} on file, but availability needs a manual check. Our team will confirm.`,
        };
    } catch {
        return {
            status: "unknown",
            area: query,
            message: "Coverage lookup is temporarily unavailable. Leave your number and our team will confirm.",
        };
    }
}

import { normalizeIndianMobile } from "@/lib/validation/phone";
import { validateName } from "@/lib/validation/name";
import { normalizeEmail } from "@/lib/validation/email";
import { normalizePincode } from "@/lib/validation/pincode";
import { assessBotRisk } from "@/lib/anti-abuse/bot-risk";
import { verifyFormToken } from "@/lib/anti-abuse/timing-token";
import { findNameCityDuplicate, findRecentDuplicate } from "@/lib/anti-abuse/duplicate";

/**
 * Server-side validation for every public lead form.
 *
 * This module is the only place allowed to decide whether a submission is
 * stored. It never trusts the browser, and it never uses an AI judgement to
 * reject a lead. Deterministic failures (bad phone, empty name, malformed
 * email/PIN) are refused with a safe message; everything suspicious is stored
 * and flagged for review.
 */

export interface LeadSubmission {
    name: string;
    mobile?: string;
    phone?: string;
    email?: string;
    company?: string;
    city?: string;
    pincode?: string;
    interest?: string;
    source?: string;
    message?: string;
    campaign?: string;
    /** Hidden honeypot field. Humans never see it; bots fill it. */
    honeypot?: string;
    /** Signed timestamp issued when the form was rendered. */
    formToken?: string;
}

export interface LeadValidationContext {
    ipHash: string | null;
    userAgentHash: string | null;
    userAgentPresent: boolean;
}

export interface ValidatedLead {
    name: string;
    rawName: string;
    nameNormalized: string;
    mobile: string;
    phone: string;
    rawPhone: string;
    phoneNormalized: string;
    email: string | null;
    company: string | null;
    city: string;
    pincode: string | null;
    interest: string | null;
    source: string;
    message: string | null;
    campaign: string | null;
    validationStatus: "valid" | "suspicious";
    validationFlags: string[];
    verificationStatus: "format_valid" | "unverified";
    botRisk: number;
    botSignals: string[];
    duplicateOfId: string | null;
    isDeterministicAbuse: boolean;
    ipHash: string | null;
    userAgentHash: string | null;
}

export type LeadValidationOutcome =
    | { ok: false; field: "name" | "phone" | "email" | "pincode" | "message"; error: string }
    | { ok: true; lead: ValidatedLead };

const MAX_MESSAGE = 2_000;
const MAX_INTEREST = 80;
const MAX_CITY = 80;
const MAX_SOURCE = 40;

function clean(value: string | undefined | null, max: number): string {
    return (typeof value === "string" ? value : "").trim().slice(0, max);
}

/**
 * Indian PIN codes are also accepted in the locality field of the coverage form.
 * `inferred` distinguishes "the customer typed only a PIN as their locality"
 * (worth flagging for review) from "a PIN was supplied in its own field"
 * (perfectly normal, never suspicious).
 */
export function extractPincode(
    city: string,
    explicit?: string
): { city: string; pincode: string | null; inferred: boolean } {
    const explicitCheck = normalizePincode(explicit);
    if (explicitCheck.value) return { city, pincode: explicitCheck.value, inferred: false };

    const match = city.match(/\b([1-9]\d{5})\b/);
    if (match) {
        return {
            city: city.replace(match[0], "").replace(/\s{2,}/g, " ").trim() || city,
            pincode: match[1],
            inferred: true,
        };
    }
    return { city, pincode: null, inferred: false };
}

export async function validateLeadSubmission(
    input: LeadSubmission,
    context: LeadValidationContext
): Promise<LeadValidationOutcome> {
    const nameResult = validateName(input.name ?? "");
    if (!nameResult.valid) {
        return { ok: false, field: "name", error: nameResult.reason ?? "Please enter your name." };
    }

    const phoneResult = normalizeIndianMobile(input.mobile || input.phone || "");
    if (!phoneResult.valid) {
        return { ok: false, field: "phone", error: phoneResult.reason ?? "Please enter a valid mobile number." };
    }

    const emailResult = normalizeEmail(input.email);
    if (!emailResult.valid) {
        return { ok: false, field: "email", error: emailResult.reason ?? "Enter a valid email address." };
    }

    const rawCity = clean(input.city, MAX_CITY);
    const { city: cityWithoutPin, pincode: inferredPin, inferred: pinWasInLocality } = extractPincode(
        rawCity,
        input.pincode
    );
    const pincodeResult = normalizePincode(input.pincode);
    if (!pincodeResult.valid) {
        return { ok: false, field: "pincode", error: pincodeResult.reason ?? "Enter a valid PIN code." };
    }

    const message = clean(input.message, MAX_MESSAGE) || null;
    const city = cityWithoutPin && !/^n\/?a$/i.test(cityWithoutPin) ? cityWithoutPin : "Not Specified";

    const token = verifyFormToken(input.formToken);
    const duplicate = await findRecentDuplicate(phoneResult.local, 24).catch(() => ({ count: 0, original: null }));
    const sameNameSameCity = await findNameCityDuplicate(
        nameResult.normalized,
        city === "Not Specified" ? null : city,
        1
    ).catch(() => null);

    const bot = assessBotRisk({
        honeypotFilled: clean(input.honeypot, 200).length > 0,
        tokenPresent: token.present,
        tokenValid: token.valid,
        tokenAgeMs: token.ageMs,
        duplicatePhoneCount: duplicate.count,
        nameFlags: nameResult.flags,
        phoneValid: phoneResult.valid,
        userAgentPresent: context.userAgentPresent,
        message: message ?? "",
    });

    const flags = [...new Set([
        ...nameResult.flags,
        ...bot.signals,
        ...(city === "Not Specified" ? ["missing_locality"] : []),
        ...(pinWasInLocality ? ["pincode_in_locality_field"] : []),
    ])];

    const validationStatus: ValidatedLead["validationStatus"] =
        flags.length > 0 || bot.score >= 40 ? "suspicious" : "valid";

    return {
        ok: true,
        lead: {
            name: nameResult.value,
            rawName: nameResult.raw,
            nameNormalized: nameResult.normalized,
            mobile: phoneResult.local!,
            phone: phoneResult.local!,
            rawPhone: phoneResult.raw,
            phoneNormalized: phoneResult.local!,
            email: emailResult.value,
            company: clean(input.company, 120) || null,
            city,
            pincode: pincodeResult.value ?? inferredPin,
            interest: clean(input.interest, MAX_INTEREST) || null,
            source: clean(input.source, MAX_SOURCE) || "contact_form",
            message,
            campaign: clean(input.campaign, 120) || null,
            validationStatus,
            validationFlags: flags,
            // A format-valid number is NOT a verified number.
            verificationStatus: "format_valid",
            botRisk: bot.score,
            botSignals: bot.signals,
            duplicateOfId: duplicate.original?.id ?? sameNameSameCity?.id ?? null,
            isDeterministicAbuse: bot.deterministicAbuse,
            ipHash: context.ipHash,
            userAgentHash: context.userAgentHash,
        },
    };
}

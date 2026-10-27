export interface BotRiskInput {
    honeypotFilled: boolean;
    tokenPresent: boolean;
    tokenValid: boolean;
    tokenAgeMs: number | null;
    duplicatePhoneCount: number;
    nameFlags: string[];
    phoneValid: boolean;
    userAgentPresent: boolean;
    message: string;
    submittedFieldsMismatch?: boolean;
}

export interface BotRiskResult {
    score: number;
    signals: string[];
    /** High-confidence abuse: forms that only a script fills. */
    deterministicAbuse: boolean;
}

/**
 * Pure, explainable abuse risk. Every point is a named signal so the admin can
 * see why a submission was flagged. Nothing here rejects a lead on its own
 * except the honeypot, which no human can fill in.
 */
export function assessBotRisk(input: BotRiskInput): BotRiskResult {
    const signals: string[] = [];
    let score = 0;

    if (input.honeypotFilled) {
        score += 80;
        signals.push("honeypot_filled");
    }
    if (!input.tokenPresent) {
        score += 25;
        signals.push("missing_form_token");
    } else if (!input.tokenValid) {
        score += 20;
        signals.push("invalid_form_token");
    }
    if (input.tokenAgeMs !== null && input.tokenAgeMs >= 0 && input.tokenAgeMs < 2_500) {
        score += 35;
        signals.push("submitted_too_fast");
    }
    if (input.duplicatePhoneCount > 0) {
        score += Math.min(30, input.duplicatePhoneCount * 15);
        signals.push(`duplicate_phone_x${input.duplicatePhoneCount}`);
    }
    if (input.nameFlags.length > 0) {
        score += Math.min(30, input.nameFlags.length * 10);
        signals.push(...input.nameFlags.map((flag) => `name_${flag}`));
    }
    if (!input.phoneValid) {
        score += 20;
        signals.push("invalid_phone");
    }
    if (!input.userAgentPresent) {
        score += 10;
        signals.push("missing_user_agent");
    }
    if (/https?:\/\/|www\./i.test(input.message)) {
        score += 15;
        signals.push("link_in_message");
    }
    if (input.submittedFieldsMismatch) {
        score += 20;
        signals.push("hidden_field_tampering");
    }

    return {
        score: Math.max(0, Math.min(100, score)),
        signals,
        deterministicAbuse: input.honeypotFilled,
    };
}

export type SpamBand = "low" | "elevated" | "high";

export function spamBand(score: number): SpamBand {
    if (score >= 70) return "high";
    if (score >= 40) return "elevated";
    return "low";
}

"use client";

import React from "react";
import {
    Users, ShieldAlert, ShieldQuestion, ShieldCheck, PhoneOff, Flame, MapPin,
    PhoneCall, CheckCircle2, Ban, TrendingUp, Activity, Eye, EyeOff,
} from "lucide-react";
import type { IntelligenceMetrics } from "./types";

function pct(value: number | null, digits = 1): string {
    if (value === null || Number.isNaN(value)) return "—";
    return `${(value * 100).toFixed(digits)}%`;
}

function TrendChart({ points }: { points: IntelligenceMetrics["trends"] }) {
    const max = Math.max(1, ...points.map((point) => point.total));
    return (
        <div>
            <div className="flex items-end gap-[3px] h-28">
                {points.map((point) => {
                    const totalHeight = Math.max(2, (point.total / max) * 100);
                    const spamHeight = point.total > 0 ? (point.spam / point.total) * totalHeight : 0;
                    return (
                        <div
                            key={point.date}
                            className="group relative flex-1 min-w-[4px] h-full flex flex-col justify-end"
                            title={`${point.date}: ${point.total} lead${point.total === 1 ? "" : "s"}, ${point.spam} spam, ${point.converted} converted`}
                        >
                            <div className="w-full rounded-t-sm bg-[#FBBF24]/70" style={{ height: `${totalHeight}%` }}>
                                <div className="w-full bg-red-500/80 rounded-t-sm" style={{ height: `${(spamHeight / totalHeight) * 100}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/25 font-mono">
                <span>{points[0]?.date}</span>
                <span>{points[Math.floor(points.length / 2)]?.date}</span>
                <span>{points[points.length - 1]?.date}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-white/40">
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#FBBF24]/70" /> Leads</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500/80" /> Spam / invalid</span>
            </div>
        </div>
    );
}

function Kpi({
    icon: Icon,
    label,
    value,
    hint,
    tone = "default",
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    hint?: string;
    tone?: "default" | "good" | "warn" | "bad" | "info";
}) {
    const toneClass = {
        default: "text-white/70",
        good: "text-emerald-300",
        warn: "text-amber-300",
        bad: "text-red-300",
        info: "text-sky-300",
    }[tone];

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/35">{label}</span>
                <Icon size={14} className="text-white/25" />
            </div>
            <p className={`text-2xl font-black tabular-nums ${toneClass}`}>{value}</p>
            {hint && <p className="text-[10px] text-white/30 mt-1 leading-relaxed">{hint}</p>}
        </div>
    );
}

function MetricRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <div className="flex items-start justify-between gap-3 py-2 border-b border-white/5 last:border-0">
            <div>
                <p className="text-xs font-bold text-white/60">{label}</p>
                {hint && <p className="text-[10px] text-white/25 mt-0.5 leading-relaxed">{hint}</p>}
            </div>
            <span className="text-xs font-black text-white/80 tabular-nums shrink-0">{value}</span>
        </div>
    );
}

export default function OverviewPanel({ metrics }: { metrics: IntelligenceMetrics }) {
    const { counts, rates, outcomes, aiUsage, coverageAreas } = metrics;

    return (
        <div className="space-y-6">
            {/* Observation mode banner */}
            <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${metrics.observationMode ? "border-sky-400/30 bg-sky-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
                {metrics.observationMode ? <Eye size={16} className="text-sky-300 mt-0.5 shrink-0" /> : <EyeOff size={16} className="text-amber-300 mt-0.5 shrink-0" />}
                <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${metrics.observationMode ? "text-sky-300" : "text-amber-300"}`}>
                        AI {metrics.observationMode ? "in observation mode" : "is adjusting scores"}
                    </p>
                    <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                        {metrics.observationMode
                            ? "Rules set the score. The AI's opinion is recorded on each lead for comparison but never changes the score or classification. Turn this off only after reviewing enough outcomes to trust the model."
                            : "The AI can lower a score when it detects spam. Rule-based signals still run first and are never overridden by the model alone."}
                    </p>
                </div>
            </div>

            {/* Primary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                <Kpi icon={Users} label="Total leads" value={counts.total} hint="All records, including spam" />
                <Kpi icon={ShieldCheck} label="Valid" value={counts.valid} hint={`${pct(rates.validRate)} of all leads`} tone="good" />
                <Kpi icon={ShieldQuestion} label="Suspicious" value={counts.suspicious} hint="Stored and flagged for review" tone="warn" />
                <Kpi icon={ShieldAlert} label="Invalid" value={counts.invalid} hint="Failed deterministic validation" tone="bad" />
                <Kpi icon={Ban} label="Spam" value={counts.spam} hint={`${pct(rates.spamRate)} spam rate`} tone="bad" />
                <Kpi icon={PhoneOff} label="Unverified phone" value={counts.unverifiedPhone} hint={`${counts.phoneFormatValid} format-valid · ${counts.phoneVerified} OTP-verified`} tone="info" />
                <Kpi icon={Flame} label="Qualified" value={counts.qualified} hint="Score 70+ or classified qualified" tone="warn" />
                <Kpi icon={MapPin} label="In live area" value={counts.serviceable} hint={`${coverageAreas.live} live areas · area-level only`} tone="info" />
                <Kpi icon={PhoneCall} label="Contacted" value={counts.contacted} hint="Status set to contacted" />
                <Kpi icon={CheckCircle2} label="Converted" value={counts.converted} hint={`${pct(rates.conversionRate)} conversion rate`} tone="good" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Trend */}
                <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-black text-white">Lead volume, last 30 days</p>
                            <p className="text-[10px] text-white/30 mt-0.5">Counted from real submission timestamps. Spam is shown in red inside each day.</p>
                        </div>
                        <TrendingUp size={16} className="text-[#FBBF24]" />
                    </div>
                    <TrendChart points={metrics.trends} />
                </div>

                {/* Outcome quality */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-black text-white">Review quality</p>
                        <Activity size={16} className="text-[#FBBF24]" />
                    </div>
                    <MetricRow
                        label="False-positive rate"
                        value={pct(outcomes.falsePositiveRate)}
                        hint="Abuse-flagged leads an admin later marked genuine. Lower is better."
                    />
                    <MetricRow
                        label="Spam detection rate"
                        value={pct(outcomes.spamDetectionRate)}
                        hint={`${outcomes.confirmedSpam} of ${outcomes.reviewed} reviewed leads confirmed spam.`}
                    />
                    <MetricRow
                        label="Genuine retention"
                        value={pct(outcomes.genuineRetention)}
                        hint="1 − false-positive rate. How many flagged leads were actually real."
                    />
                    <MetricRow label="Valid contact rate" value={pct(outcomes.validContactRate)} hint="Leads with a format-valid phone number." />
                    <MetricRow label="Qualified rate" value={pct(outcomes.qualifiedRate)} hint="Share of all leads that score 70+." />
                    <MetricRow label="Conversion rate" value={pct(outcomes.conversionRate)} hint="Converted leads ÷ all leads." />
                    {outcomes.reviewed === 0 && (
                        <p className="text-[10px] text-amber-300/70 mt-3 leading-relaxed">
                            No lead has been reviewed yet, so false-positive and spam-detection rates are unknown — not zero.
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm font-black text-white mb-3">Follow-up performance</p>
                    <MetricRow label="Leads contacted" value={String(outcomes.followUp.contacted)} hint="Status contacted or converted." />
                    <MetricRow
                        label="Converted after contact"
                        value={`${outcomes.followUp.convertedAfterContact} (${pct(outcomes.followUp.conversionAfterContactRate)})`}
                    />
                    <MetricRow
                        label="Avg. time to first contact"
                        value={outcomes.followUp.averageHoursToFirstContact === null ? "—" : `${outcomes.followUp.averageHoursToFirstContact.toFixed(1)} h`}
                        hint="Only leads where an admin logged a contact time are included."
                    />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm font-black text-white mb-3">Outcome labels recorded</p>
                    <MetricRow label="Genuine / qualified" value={String(outcomes.confirmedGenuine)} />
                    <MetricRow label="Confirmed spam" value={String(outcomes.confirmedSpam)} />
                    <MetricRow label="Invalid contact" value={String(outcomes.invalidContact)} />
                    <MetricRow label="Out of coverage" value={String(outcomes.outOfCoverage)} />
                    <MetricRow label="Unreachable" value={String(outcomes.unreachable)} />
                    <MetricRow label="Duplicates linked" value={String(counts.duplicates)} hint="Never auto-deleted." />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm font-black text-white mb-3">AI quota</p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black text-[#FBBF24] tabular-nums">{aiUsage.requests}</span>
                        <span className="text-xs font-bold text-white/40">/ {aiUsage.limit} free requests today</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#FBBF24]" style={{ width: `${Math.min(100, (aiUsage.requests / Math.max(1, aiUsage.limit)) * 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
                        Rule-based scoring is unlimited and always runs. The free LLM only adds a summary and next action when quota allows.
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { Activity, Users, Copy, Sparkles, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import OverviewPanel from "./OverviewPanel";
import LeadReviewTable from "./LeadReviewTable";
import DuplicateManager from "./DuplicateManager";
import AskPanel from "./AskPanel";
import type { DuplicateGroupView, IntelligenceLead, IntelligenceMetrics } from "./types";

type Tab = "overview" | "leads" | "duplicates" | "ask";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "leads", label: "Lead review", icon: Users },
    { id: "duplicates", label: "Duplicates", icon: Copy },
    { id: "ask", label: "Ask the data", icon: Sparkles },
];

export default function IntelligenceDashboard({
    metrics,
    leads,
    duplicates,
}: {
    metrics: IntelligenceMetrics | null;
    leads: IntelligenceLead[];
    duplicates: DuplicateGroupView[];
}) {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("overview");

    return (
        <div className="min-h-screen bg-[#0A192F] text-white p-6 lg:p-10">
            <div className="max-w-[1500px] mx-auto">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Lead Intelligence</h1>
                        <p className="text-white/40 text-sm font-medium mt-1">
                            Validation, abuse signals, sales quality and follow-up — from the live leads database.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest">
                            {leads.length} leads
                        </span>
                        <button
                            onClick={() => router.refresh()}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 text-white/60 text-[11px] font-black uppercase tracking-widest transition-all"
                        >
                            <RefreshCw size={13} /> Refresh
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {TABS.map(({ id, label, icon: Icon }) => {
                        const active = tab === id;
                        const count = id === "duplicates" ? duplicates.length : undefined;
                        return (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    active
                                        ? "bg-[#FBBF24] text-[#0A192F]"
                                        : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/30"
                                }`}
                            >
                                <Icon size={13} />
                                {label}
                                {count !== undefined && count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${active ? "bg-[#0A192F] text-[#FBBF24]" : "bg-white/10 text-white/60"}`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {tab === "overview" && (
                    metrics
                        ? <OverviewPanel metrics={metrics} />
                        : <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-200">
                            Metrics could not be loaded. Check the database connection and try again.
                        </div>
                )}

                {tab === "leads" && <LeadReviewTable initialLeads={leads} />}

                {tab === "duplicates" && <DuplicateManager groups={duplicates} />}

                {tab === "ask" && <AskPanel />}
            </div>
        </div>
    );
}

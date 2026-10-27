"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users, BarChart3, Sparkles,
    ArrowUpRight, ArrowDownRight, Calendar,
    MapPin, Flame, Phone, Loader2, Brain
} from 'lucide-react';
import { scoreUnscoredLeads } from '@/app/actions/lead-ai';

interface AiStats {
    requestsToday: number;
    dailyLimit: number;
    remaining: number;
    hotCount: number;
    unscoredCount: number;
    avgScore: number | null;
    scoringEnabled: boolean;
    aiConfigured: boolean;
}

interface DashboardLead {
    id?: string;
    name: string;
    phone?: string | null;
    mobile?: string | null;
    email?: string | null;
    city?: string | null;
    interest?: string | null;
    status?: string | null;
    aiScore?: number | null;
    aiSummary?: string | null;
    aiNextAction?: string | null;
}

interface DashboardAsset {
    sectionName: string;
    animationType: string;
}

interface DashboardStats {
    totalLeads: string;
    totalPlans: string;
    totalCoverage: string;
    activeBanners: string;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend?: string;
    isUp?: boolean;
    color: string;
}

const StatCard = ({ icon, label, value, trend, isUp, color }: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-white/80 shadow-[0_8px_32px_rgba(10,25,47,0.04)] relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${color}/5 group-hover:${color}/10 transition-all duration-500`} />

            <div className="flex items-start justify-between relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${color}/15 flex items-center justify-center ${color} border border-${color}/20 mb-6`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-tight ${isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-[#0A192F]/40 text-sm font-bold uppercase tracking-widest mb-2">{label}</p>
                <p className="text-4xl font-black text-[#0A192F] tabular-nums tracking-tighter">{value}</p>
            </div>
        </motion.div>
    );
};

function ScoreChip({ score }: { score?: number | null }) {
    if (typeof score !== 'number') return null;
    const style = score >= 70
        ? 'bg-red-500/10 text-red-600'
        : score >= 40
            ? 'bg-amber-500/10 text-amber-600'
            : 'bg-slate-500/10 text-slate-500';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tabular-nums ${style}`}>
            {score >= 70 && <Flame size={10} />}
            {score}
        </span>
    );
}

export default function DashboardView({
    leads,
    stats: serverStats,
    activeAssets = [],
    aiStats = null,
    hotLeads = [],
}: {
    leads: DashboardLead[],
    stats: DashboardStats,
    activeAssets?: DashboardAsset[],
    aiStats?: AiStats | null,
    hotLeads?: DashboardLead[],
}) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const stats = [
        { icon: <BarChart3 size={24} />, label: "Total Leads", value: serverStats.totalLeads, trend: "Capture", isUp: true, color: "text-[#FBBF24]" },
        { icon: <Users size={24} />, label: "Broadband Plans", value: serverStats.totalPlans, trend: "Active", isUp: true, color: "text-blue-500" },
        { icon: <MapPin size={24} />, label: "Coverage Areas", value: serverStats.totalCoverage, trend: "Zones", isUp: true, color: "text-green-500" },
        { icon: <Sparkles size={24} />, label: "Active Banners", value: serverStats.activeBanners, trend: "Live", isUp: true, color: "text-purple-500" },
    ];

    const handleScoreBacklog = async () => {
        setBusy(true);
        setMessage(null);
        try {
            const result = await scoreUnscoredLeads(5);
            if (result.ok) {
                setMessage(
                    result.scored > 0
                        ? `Scored ${result.scored} lead${result.scored === 1 ? '' : 's'}${result.stoppedByQuota ? ' — daily AI quota reached, rules only' : ''}${result.remaining > 0 ? ` · ${result.remaining} pending` : ''}`
                        : 'No leads waiting to be scored.'
                );
                router.refresh();
            } else {
                setMessage(result.error);
            }
        } catch {
            setMessage('Could not score the backlog.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0A192F] tracking-tighter mb-2">Network Dashboard<span className="text-[#FBBF24]">.</span></h1>
                    <p className="text-[#0A192F]/40 font-bold text-sm uppercase tracking-widest">Real-time infrastructure & business monitoring</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2.5 bg-white border border-[#0A192F]/10 text-[#0A192F] px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all hover:bg-[#F7F8FA]">
                        <Calendar size={18} className="text-[#0A192F]/40" />
                        Live Feed: March 06, 2026
                    </button>
                </div>
            </div>

            {/* AI lead intelligence status */}
            {aiStats && (
                <div className="bg-white rounded-3xl border border-[#0A192F]/10 shadow-[0_8px_32px_rgba(10,25,47,0.04)] px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#FBBF24]/15 text-[#FBBF24] flex items-center justify-center shrink-0">
                            <Brain size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-[#0A192F] flex items-center gap-2">
                                AI lead intelligence
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${aiStats.aiConfigured && aiStats.scoringEnabled ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                    {aiStats.aiConfigured && aiStats.scoringEnabled ? 'Active' : 'Rules only'}
                                </span>
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A192F]/40 mt-0.5">
                                {aiStats.hotCount} hot · {aiStats.unscoredCount} unscored · {aiStats.requestsToday}/{aiStats.dailyLimit} free AI calls today
                                {aiStats.avgScore !== null ? ` · avg score ${aiStats.avgScore}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {message && (
                            <span className="text-[11px] font-bold text-[#0A192F]/50">{message}</span>
                        )}
                        <button
                            onClick={handleScoreBacklog}
                            disabled={busy}
                            className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#0A192F]/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                        >
                            {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-[#FBBF24]" />}
                            Score new leads
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Tables Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-white/80 p-10 shadow-[0_8px_32px_rgba(10,25,47,0.04)] overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-[#0A192F] tracking-tighter mb-1">Recent Leads</h3>
                            <p className="text-[#0A192F]/40 text-xs font-bold uppercase tracking-widest">Captured from Contact & Availability forms</p>
                        </div>
                        <Link href="/admin/leads" className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 hover:text-[#0A192F] transition-colors">
                            View all
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#0A192F]/05">
                                    <th className="text-left py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">Customer</th>
                                    <th className="text-left py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">Location</th>
                                    <th className="text-left py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">Status</th>
                                    <th className="text-right py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">AI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0A192F]/02 mt-4">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-[#0A192F]/20 font-bold uppercase tracking-widest text-xs">No leads yet</td>
                                    </tr>
                                ) : (
                                    leads.map((lead, idx) => (
                                        <tr key={idx} className="group hover:bg-[#FBBF24]/03 transition-colors">
                                            <td className="py-6">
                                                <p className="text-sm font-black text-[#0A192F]">{lead.name}</p>
                                                <p className="text-[10px] font-bold text-[#0A192F]/30">{lead.phone} • {lead.email || 'No Email'}</p>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A192F]/60">
                                                    <MapPin size={12} className="text-[#FBBF24]" />
                                                    {lead.city}
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-2 h-2 rounded-full ${lead.status === 'new' ? 'bg-[#FBBF24]' : 'bg-blue-500'} animate-pulse`} />
                                                    <span className="text-[11px] font-black leading-none text-[#0A192F]/60 uppercase">{lead.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <ScoreChip score={lead.aiScore} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Hot leads */}
                    <div className="bg-[#0A192F] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="text-xl font-black text-white tracking-tighter flex items-center gap-2.5">
                                <Flame size={20} className="text-red-400" />
                                Hot Leads
                            </h3>
                            <Link href="/admin/leads" className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-[#FBBF24] transition-colors">
                                View all
                            </Link>
                        </div>
                        <div className="space-y-3 relative z-10">
                            {hotLeads.length === 0 ? (
                                <p className="text-white/40 text-xs font-bold text-center py-4 italic uppercase tracking-widest">No hot leads right now</p>
                            ) : hotLeads.map((lead) => (
                                <div key={lead.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-white truncate">{lead.name}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">
                                                {lead.city} · {lead.interest || 'Broadband'}
                                            </p>
                                        </div>
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-300 text-[11px] font-black tabular-nums">
                                            <Flame size={10} /> {lead.aiScore}
                                        </span>
                                    </div>
                                    {(lead.aiNextAction || lead.aiSummary) && (
                                        <p className="mt-2 text-[11px] text-white/60 leading-snug line-clamp-2">
                                            {lead.aiNextAction || lead.aiSummary}
                                        </p>
                                    )}
                                    <a
                                        href={`tel:+91${String(lead.mobile || lead.phone || '').replace(/\D/g, '').slice(-10)}`}
                                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#FBBF24] hover:text-white transition-colors"
                                    >
                                        <Phone size={11} /> Call now
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0A192F] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <h3 className="text-xl font-black text-white tracking-tighter mb-8 relative z-10 flex items-center gap-2.5">
                            <Sparkles size={20} className="text-[#FBBF24]" />
                            Animation Engine
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {activeAssets.length === 0 ? (
                                <p className="text-white/40 text-xs font-bold text-center py-4 italic uppercase tracking-widest">No active layers</p>
                            ) : activeAssets.map((asset, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-white/05 border border-white/05 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                        <span className="text-sm font-bold text-white/90 uppercase">{asset.sectionName}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#FBBF24]/50">{asset.animationType}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

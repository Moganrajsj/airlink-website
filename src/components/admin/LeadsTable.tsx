"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, Filter, Download, Check, Clock, PhoneCall, Ban, ChevronRight,
    ChevronDown, Sparkles, RefreshCw, Loader2, Flame, Brain, Phone, MapPin
} from 'lucide-react';
import { updateLeadStatus } from '@/app/actions/leads';
import { scoreLeadById, scoreUnscoredLeads } from '@/app/actions/lead-ai';

interface Lead {
    id: string;
    name: string;
    mobile: string;
    email?: string | null;
    company?: string | null;
    city: string;
    pincode?: string | null;
    interest?: string | null;
    source?: string | null;
    status: string;
    message?: string | null;
    createdAt: Date | string;
    aiScore?: number | null;
    aiTier?: string | null;
    aiSummary?: string | null;
    aiIntent?: string | null;
    aiRecommendedPlan?: string | null;
    aiNextAction?: string | null;
    aiTags?: string | null;
    aiReasons?: string | null;
    aiStatus?: string | null;
    aiScoredAt?: Date | string | null;
    aiModel?: string | null;
    qualityScore?: number | null;
    spamRisk?: number | null;
    classification?: string | null;
    confidence?: string | null;
    validationStatus?: string | null;
    verificationStatus?: string | null;
    validationFlags?: string | null;
    botRisk?: number | null;
    botSignals?: string | null;
    reviewOutcome?: string | null;
    followUpOwner?: string | null;
    lastContactAt?: Date | string | null;
    duplicateOfId?: string | null;
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'interested', 'converted', 'closed', 'spam'];
const INTEREST_OPTIONS = ['Home Broadband', 'Business Internet', 'WiFi Router Setup', 'CCTV Security', 'Check Fiber Availability'];
const SOURCE_OPTIONS = ['popup_multi_step', 'contact_form', 'plans_page', 'speed_test', 'shop_page', 'check_availability', 'ai_assistant', 'popup_lead'];
const TIER_OPTIONS = [
    { value: '', label: 'All scores' },
    { value: 'hot', label: '🔥 Hot (70+)' },
    { value: 'warm', label: 'Warm (40-69)' },
    { value: 'cold', label: 'Cold (<40)' },
    { value: 'unscored', label: 'Not scored yet' },
];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'score', label: 'Highest score' },
    { value: 'oldest', label: 'Oldest first' },
];

const STATUS_STYLES: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    contacted: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    qualified: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    interested: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    converted: 'bg-green-500/20 text-green-300 border border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    spam: 'bg-red-500/20 text-red-300 border border-red-500/30',
};

const VALIDATION_STYLES: Record<string, string> = {
    valid: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    suspicious: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    invalid: 'bg-red-500/15 text-red-300 border border-red-500/30',
};

function parseFlags(value?: string | null): string[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
        return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
}

const STATUS_ICONS: Record<string, React.ElementType> = {
    new: Clock,
    contacted: PhoneCall,
    qualified: ChevronRight,
    interested: ChevronRight,
    converted: Check,
    closed: Ban,
    spam: Ban,
};

function tierOf(lead: Lead): 'hot' | 'warm' | 'cold' | null {
    if (typeof lead.aiScore !== 'number') return null;
    if (lead.aiTier === 'hot' || lead.aiTier === 'warm' || lead.aiTier === 'cold') return lead.aiTier;
    if (lead.aiScore >= 70) return 'hot';
    if (lead.aiScore >= 40) return 'warm';
    return 'cold';
}

const TIER_BADGE: Record<string, string> = {
    hot: 'bg-red-500/15 text-red-300 border-red-500/30',
    warm: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    cold: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

const AI_STATUS_LABEL: Record<string, string> = {
    pending: 'Queued',
    scored: 'AI + rules',
    heuristic: 'Rules only',
    failed: 'AI failed',
    skipped: 'Skipped',
};

function ScoreBadge({ lead }: { lead: Lead }) {
    const tier = tierOf(lead);
    if (tier === null) {
        return <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Not scored</span>;
    }
    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${TIER_BADGE[tier]}`}>
            {tier === 'hot' ? <Flame size={12} /> : tier === 'warm' ? <Sparkles size={12} /> : <Brain size={12} />}
            <span className="text-[11px] font-black tabular-nums">{lead.aiScore}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">AI</span>
        </div>
    );
}

function formatDate(value: Date | string | null | undefined, withTime = false) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-IN', withTime
        ? { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
        : { day: '2-digit', month: 'short', year: 'numeric' });
}

function exportToCSV(leads: Lead[]) {
    const headers = ['Name', 'Mobile', 'Email', 'City', 'Interest', 'Source', 'Status', 'AI Score', 'AI Tier', 'AI Summary', 'Recommended Plan', 'Next Action', 'Submitted At'];
    const rows = leads.map(l => [
        l.name, l.mobile, l.email || '', l.city || '',
        l.interest || '', l.source || '', l.status,
        typeof l.aiScore === 'number' ? String(l.aiScore) : '',
        l.aiTier || '', l.aiSummary || '', l.aiRecommendedPlan || '', l.aiNextAction || '',
        new Date(l.createdAt).toLocaleString('en-IN')
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airlink-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function LeadsTable({ leads, initialSearch = '' }: { leads: Lead[]; initialSearch?: string }) {
    const router = useRouter();
    const [search, setSearch] = useState(initialSearch);
    const [filterInterest, setFilterInterest] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [filterTier, setFilterTier] = useState('');
    const [sort, setSort] = useState('newest');
    const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [scoringId, setScoringId] = useState<string | null>(null);
    const [batchState, setBatchState] = useState<{ busy: boolean; message?: string; error?: boolean }>({ busy: false });

    const unscoredCount = localLeads.filter(l => typeof l.aiScore !== 'number').length;

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const list = localLeads.filter(l => {
            const matchSearch = !q ||
                l.name.toLowerCase().includes(q) ||
                (l.mobile || '').includes(q) ||
                (l.email || '').toLowerCase().includes(q) ||
                (l.company || '').toLowerCase().includes(q) ||
                (l.city || '').toLowerCase().includes(q) ||
                (l.aiSummary || '').toLowerCase().includes(q) ||
                (l.aiTags || '').toLowerCase().includes(q);
            const matchInterest = !filterInterest || l.interest === filterInterest;
            const matchStatus = !filterStatus || l.status === filterStatus;
            const matchSource = !filterSource || l.source === filterSource;
            const tier = tierOf(l);
            const matchTier = !filterTier ||
                (filterTier === 'unscored' ? tier === null : tier === filterTier);
            return matchSearch && matchInterest && matchStatus && matchSource && matchTier;
        });

        return list.sort((a, b) => {
            if (sort === 'score') {
                return (b.aiScore ?? -1) - (a.aiScore ?? -1);
            }
            const aTime = new Date(a.createdAt).getTime();
            const bTime = new Date(b.createdAt).getTime();
            return sort === 'oldest' ? aTime - bTime : bTime - aTime;
        });
    }, [localLeads, search, filterInterest, filterStatus, filterSource, filterTier, sort]);

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        await updateLeadStatus(leadId, newStatus);
        setLocalLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    };

    const handleRescore = async (leadId: string) => {
        setScoringId(leadId);
        try {
            const result = await scoreLeadById(leadId);
            if (result.ok) {
                setLocalLeads(prev => prev.map(l => l.id === leadId ? {
                    ...l,
                    aiScore: result.lead.score,
                    aiTier: result.lead.tier,
                    aiStatus: result.lead.aiStatus,
                    aiSummary: result.lead.summary ?? l.aiSummary,
                    aiIntent: result.lead.intent ?? l.aiIntent,
                    aiRecommendedPlan: result.lead.recommendedPlan ?? l.aiRecommendedPlan,
                    aiNextAction: result.lead.nextAction ?? l.aiNextAction,
                    aiTags: result.lead.tags ?? l.aiTags,
                    aiReasons: result.lead.reasons,
                    aiModel: result.lead.model ?? l.aiModel,
                    aiScoredAt: new Date(),
                } : l));
                router.refresh();
            }
        } finally {
            setScoringId(null);
        }
    };

    const handleScoreBatches = async () => {
        setBatchState({ busy: true });
        try {
            const result = await scoreUnscoredLeads(5);
            if (!result.ok) {
                setBatchState({ busy: false, message: result.error, error: true });
                return;
            }
            setBatchState({
                busy: false,
                message: `Scored ${result.scored} lead${result.scored === 1 ? '' : 's'}${
                    result.stoppedByQuota ? ' — daily free AI quota reached, using rules only' : ''
                }${result.remaining > 0 ? ` · ${result.remaining} still pending` : ''}`,
            });
            router.refresh();
        } catch {
            setBatchState({ busy: false, message: 'Could not score the backlog.', error: true });
        }
    };

    return (
        <div>
            {/* Filters Bar */}
            <div className="flex flex-col xl:flex-row gap-3 mb-6">
                <div className="relative flex-1 min-w-[220px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search name, mobile, email, AI summary..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-[#FBBF24] transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={14} className="text-white/40" />
                    <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        {TIER_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#0A192F]">{o.label}</option>)}
                    </select>
                    <select value={filterInterest} onChange={e => setFilterInterest(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="">All Services</option>
                        {INTEREST_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F]">{o}</option>)}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F]">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                    <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="">All Sources</option>
                        {SOURCE_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F]">{o}</option>)}
                    </select>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#0A192F]">{o.label}</option>)}
                    </select>
                </div>
            </div>

            {/* AI toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 rounded-2xl border border-[#FBBF24]/20 bg-[#FBBF24]/5 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                    <Sparkles size={14} className="text-[#FBBF24]" />
                    <span>
                        AI lead intelligence
                        {unscoredCount > 0 ? ` · ${unscoredCount} lead${unscoredCount === 1 ? '' : 's'} not scored yet` : ' · all leads scored'}
                    </span>
                    {batchState.message && (
                        <span className={batchState.error ? 'text-red-300' : 'text-green-300'}>· {batchState.message}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleScoreBatches}
                        disabled={batchState.busy}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] hover:bg-white disabled:opacity-50 text-[#0A192F] text-[11px] font-black uppercase tracking-widest transition-all"
                    >
                        {batchState.busy ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
                        Score new leads
                    </button>
                    <button
                        onClick={() => exportToCSV(filtered)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 text-white/70 text-[11px] font-black uppercase tracking-widest transition-all"
                    >
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40">
                                <th className="text-left px-4 py-3">Customer</th>
                                <th className="text-left px-4 py-3 hidden md:table-cell">Contact</th>
                                <th className="text-left px-4 py-3 hidden lg:table-cell">Interest</th>
                                <th className="text-left px-4 py-3 hidden xl:table-cell">Source</th>
                                <th className="text-left px-4 py-3">AI Score</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3 hidden xl:table-cell">Submitted</th>
                                <th className="text-left px-4 py-3">Validation</th>
                                <th className="text-left px-4 py-3 hidden xl:table-cell">Follow-up</th>
                                <th className="text-left px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={10} className="text-center py-12 text-white/30 font-medium">No leads found.</td></tr>
                            ) : filtered.map((lead, i) => {
                                const Icon = STATUS_ICONS[lead.status] || Clock;
                                const tier = tierOf(lead);
                                const isExpanded = expandedId === lead.id;
                                return (
                                    <React.Fragment key={lead.id}>
                                        <tr className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'} ${tier === 'hot' ? 'border-l-2 border-l-red-500/60' : ''}`}>
                                            <td className="px-4 py-3 font-semibold text-white">
                                                <button onClick={() => setExpandedId(isExpanded ? null : lead.id)} className="text-left">
                                                    {lead.name}
                                                    <div className="flex items-center gap-1 text-[10px] text-white/40 font-medium mt-0.5">
                                                        <MapPin size={10} /> {lead.city || '—'}
                                                        {lead.company && <span className="text-primary font-bold uppercase tracking-tighter">· {lead.company}</span>}
                                                    </div>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="font-mono text-white/80 text-xs">{lead.mobile}</div>
                                                <div className="text-white/30 text-[11px]">{lead.email || 'No email'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-white/50 hidden lg:table-cell text-xs max-w-[160px] truncate">{lead.interest || '—'}</td>
                                            <td className="px-4 py-3 text-white/40 text-xs hidden xl:table-cell">{(lead.source || '—').replace(/_/g, ' ')}</td>
                                            <td className="px-4 py-3"><ScoreBadge lead={lead} /></td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Icon size={12} className="text-white/30" />
                                                    <select
                                                        value={lead.status}
                                                        onChange={e => handleStatusChange(lead.id, e.target.value)}
                                                        className={`text-[10px] font-black uppercase tracking-wider rounded-full px-2 py-1 border-none outline-none cursor-pointer ${STATUS_STYLES[lead.status] || STATUS_STYLES.new} bg-transparent`}
                                                    >
                                                        {STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F] text-white">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-white/30 text-xs hidden xl:table-cell">{formatDate(lead.createdAt, true)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${VALIDATION_STYLES[lead.validationStatus || 'valid'] || VALIDATION_STYLES.valid}`}>
                                                        {lead.validationStatus || 'valid'}
                                                    </span>
                                                    <span
                                                        className="text-[10px] text-white/30"
                                                        title={lead.verificationStatus === 'otp_verified'
                                                            ? 'Confirmed by OTP'
                                                            : 'Format-valid only — not proof the number is reachable'}
                                                    >
                                                        {lead.verificationStatus === 'otp_verified'
                                                            ? 'OTP verified'
                                                            : lead.verificationStatus === 'format_valid'
                                                                ? 'Format only'
                                                                : 'Unverified'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs hidden xl:table-cell">
                                                <div className="text-white/60 font-semibold">{lead.followUpOwner || 'Unassigned'}</div>
                                                <div className="text-white/25">{lead.lastContactAt ? formatDate(lead.lastContactAt, true) : 'No contact'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                                                    aria-label={isExpanded ? 'Hide AI details' : 'Show AI details'}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#FBBF24] hover:text-[#0A192F] text-white/40 inline-flex items-center justify-center transition-all"
                                                >
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="border-b border-white/10 bg-[#0A192F]">
                                                <td colSpan={10} className="px-4 py-5">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                                        <div className="lg:col-span-2 space-y-4">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 flex items-center gap-1.5">
                                                                    <Sparkles size={11} className="text-[#FBBF24]" /> AI summary
                                                                </p>
                                                                <p className="text-sm text-white/80 leading-relaxed">
                                                                    {lead.aiSummary || 'No AI summary yet — only the rule-based score is available.'}
                                                                </p>
                                                                {lead.aiTags && (
                                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                                        {lead.aiTags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                                                                            <span key={tag} className="text-[10px] font-bold text-white/50 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{tag}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Intent</p>
                                                                    <p className="text-xs font-bold text-white/80 capitalize">{(lead.aiIntent || '—').replace(/_/g, ' ')}</p>
                                                                </div>
                                                                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Recommended plan</p>
                                                                    <p className="text-xs font-bold text-[#FBBF24]">{lead.aiRecommendedPlan || '—'}</p>
                                                                </div>
                                                                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                                                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Next action</p>
                                                                    <p className="text-xs font-bold text-white/80">{lead.aiNextAction || '—'}</p>
                                                                </div>
                                                            </div>

                                                            {lead.aiReasons && (
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Why this score</p>
                                                                    <p className="text-[11px] text-white/50 leading-relaxed">{lead.aiReasons}</p>
                                                                </div>
                                                            )}

                                                            {(parseFlags(lead.validationFlags).length > 0 || parseFlags(lead.botSignals).length > 0) && (
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Validation &amp; abuse signals</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {[...new Set([...parseFlags(lead.validationFlags), ...parseFlags(lead.botSignals)])].map((flag) => (
                                                                            <span key={flag} className="text-[10px] font-bold text-amber-200/80 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                                                                                {flag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {lead.message && (
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Customer message</p>
                                                                    <p className="text-[11px] text-white/60 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">{lead.message}</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Lead intelligence</p>
                                                                <div className="space-y-1.5 text-[11px]">
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Score</span>
                                                                        <span className="font-black text-white">{typeof lead.aiScore === 'number' ? `${lead.aiScore}/100` : '—'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Tier</span>
                                                                        <span className={`font-black uppercase ${tier === 'hot' ? 'text-red-300' : tier === 'warm' ? 'text-amber-300' : 'text-white/60'}`}>{tier || '—'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Method</span>
                                                                        <span className="font-bold text-white/70">{AI_STATUS_LABEL[lead.aiStatus || 'pending'] || lead.aiStatus}</span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Scored</span>
                                                                        <span className="font-bold text-white/70">{formatDate(lead.aiScoredAt, true)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Spam risk</span>
                                                                        <span className={`font-black ${(lead.spamRisk ?? lead.botRisk ?? 0) >= 70 ? 'text-red-300' : (lead.spamRisk ?? lead.botRisk ?? 0) >= 40 ? 'text-amber-300' : 'text-white/60'}`}>
                                                                            {lead.spamRisk ?? lead.botRisk ?? 0}/100
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Classification</span>
                                                                        <span className="font-bold text-white/70 capitalize">{(lead.classification || '—').replace(/_/g, ' ')}</span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Review outcome</span>
                                                                        <span className="font-bold text-white/70 capitalize">{(lead.reviewOutcome || 'not reviewed').replace(/_/g, ' ')}</span>
                                                                    </div>
                                                                    <div className="flex justify-between gap-2">
                                                                        <span className="text-white/40">Model</span>
                                                                        <span className="font-bold text-white/50 truncate max-w-[140px]" title={lead.aiModel || ''}>{lead.aiModel || 'rules only'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-2">
                                                                <a href={`tel:+91${(lead.mobile || '').replace(/\D/g, '').slice(-10)}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-white/70 transition-all">
                                                                    <Phone size={12} /> Call lead
                                                                </a>
                                                                <a href="/admin/intelligence" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#FBBF24]/30 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-[#FBBF24] transition-all">
                                                                    <Sparkles size={12} /> Review in Intelligence
                                                                </a>
                                                                <button
                                                                    onClick={() => handleRescore(lead.id)}
                                                                    disabled={scoringId === lead.id}
                                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBBF24] hover:bg-white disabled:opacity-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-[#0A192F] transition-all"
                                                                >
                                                                    {scoringId === lead.id ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                                                    Re-score with AI
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-white/30 text-xs mt-3 text-right">Showing {filtered.length} of {localLeads.length} leads</p>
        </div>
    );
}

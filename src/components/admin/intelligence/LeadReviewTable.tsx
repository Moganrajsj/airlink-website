"use client";

import React, { useMemo, useState, useTransition } from "react";
import {
    Search, Filter, ChevronDown, ChevronRight, Loader2, ShieldAlert, ShieldCheck,
    ShieldQuestion, Phone, MapPin, Download, CheckSquare, Square, Save, UserCheck,
} from "lucide-react";
import { bulkUpdateLeadStatus, reviewLead } from "@/app/actions/intelligence";
import type { OutcomeLabel } from "@/lib/review-labels";
import {
    OUTCOME_LABELS,
    OUTCOME_STYLES,
    STATUS_OPTIONS,
    formatDate,
    parseFlags,
    type IntelligenceLead,
} from "./types";

const PAGE_SIZE = 25;

const VALIDATION_STYLES: Record<string, string> = {
    valid: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    suspicious: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    invalid: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const CLASSIFICATION_STYLES: Record<string, string> = {
    qualified: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    contactable: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
    needs_review: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    spam: "bg-red-500/15 text-red-300 border border-red-500/30",
    low_intent: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
};

function ValidationBadge({ lead }: { lead: IntelligenceLead }) {
    const status = lead.validationStatus || "valid";
    const flags = parseFlags(lead.validationFlags);
    const Icon = status === "invalid" ? ShieldAlert : status === "suspicious" ? ShieldQuestion : ShieldCheck;
    return (
        <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider w-fit ${VALIDATION_STYLES[status] || VALIDATION_STYLES.valid}`}>
                <Icon size={10} /> {status}
            </span>
            {flags.length > 0 && (
                <span className="text-[10px] text-white/30 truncate max-w-[150px]" title={flags.join(", ")}>
                    {flags.slice(0, 2).join(", ")}{flags.length > 2 ? ` +${flags.length - 2}` : ""}
                </span>
            )}
        </div>
    );
}

function VerificationBadge({ lead }: { lead: IntelligenceLead }) {
    const verified = lead.verificationStatus === "otp_verified";
    const formatValid = lead.verificationStatus === "format_valid";
    return (
        <span
            title={verified
                ? "Confirmed with a one-time password"
                : formatValid
                    ? "Passes the Indian mobile format check. This does NOT prove the number belongs to the person."
                    : "Not verified"}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                verified
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : formatValid
                        ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                        : "bg-slate-500/15 text-slate-300 border border-slate-500/30"
            }`}
        >
            {verified ? "OTP verified" : formatValid ? "Format only" : "Unverified"}
        </span>
    );
}

function ScoringBadges({ lead }: { lead: IntelligenceLead }) {
    const quality = typeof lead.qualityScore === "number" ? lead.qualityScore : lead.aiScore;
    const spam = lead.spamRisk ?? lead.botRisk;
    return (
        <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-white/80">
                <span className={`w-1.5 h-1.5 rounded-full ${typeof quality === "number" && quality >= 70 ? "bg-red-400" : typeof quality === "number" && quality >= 40 ? "bg-amber-400" : "bg-slate-500"}`} />
                {typeof quality === "number" ? `${quality} quality` : "Not scored"}
            </span>
            <span className={`text-[10px] font-bold ${typeof spam === "number" && spam >= 70 ? "text-red-300" : typeof spam === "number" && spam >= 40 ? "text-amber-300" : "text-white/30"}`}>
                {typeof spam === "number" ? `${spam} spam risk` : "No spam score"}
            </span>
        </div>
    );
}

export default function LeadReviewTable({ initialLeads }: { initialLeads: IntelligenceLead[] }) {
    const [leads, setLeads] = useState<IntelligenceLead[]>(initialLeads);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [validation, setValidation] = useState("");
    const [classification, setClassification] = useState("");
    const [owner, setOwner] = useState("");
    const [page, setPage] = useState(0);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkStatus, setBulkStatus] = useState("contacted");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [, startTransition] = useTransition();

    const owners = useMemo(
        () => [...new Set(leads.map((lead) => lead.followUpOwner).filter((value): value is string => Boolean(value)))],
        [leads]
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return leads.filter((lead) => {
            if (q) {
                const haystack = [lead.name, lead.mobile, lead.email, lead.city, lead.aiSummary, lead.message]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            if (status && lead.status !== status) return false;
            if (validation && (lead.validationStatus || "valid") !== validation) return false;
            if (classification && (lead.classification || "") !== classification) return false;
            if (owner && (lead.followUpOwner || "") !== owner) return false;
            return true;
        });
    }, [leads, search, status, validation, classification, owner]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, pageCount - 1);
    const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

    const toggleSelected = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAllVisible = () => {
        setSelected((prev) => {
            const allSelected = visible.every((lead) => prev.has(lead.id));
            const next = new Set(prev);
            for (const lead of visible) {
                if (allSelected) next.delete(lead.id);
                else next.add(lead.id);
            }
            return next;
        });
    };

    const handleReview = (leadId: string, input: {
        outcome: OutcomeLabel | null;
        classification: string | null;
        followUpOwner: string;
        note: string;
        markContacted: boolean;
    }) => {
        startTransition(async () => {
            setBusy(true);
            setMessage("");
            const result = await reviewLead({
                leadId,
                outcome: input.outcome,
                classification: input.classification,
                followUpOwner: input.followUpOwner,
                note: input.note,
                markContacted: input.markContacted,
            });
            setBusy(false);
            if (!result.success) {
                setMessage(result.error);
                return;
            }
            setLeads((prev) =>
                prev.map((lead) =>
                    lead.id === leadId
                        ? {
                            ...lead,
                            reviewOutcome: input.outcome,
                            classification: input.classification ?? lead.classification,
                            followUpOwner: input.followUpOwner || null,
                            lastContactAt: input.markContacted ? new Date().toISOString() : lead.lastContactAt,
                            status: input.markContacted && lead.status === "new" ? "contacted" : lead.status,
                        }
                        : lead
                )
            );
            setMessage("Review saved.");
        });
    };

    const handleBulk = () => {
        const ids = [...selected];
        if (ids.length === 0) {
            setMessage("Select at least one lead first.");
            return;
        }
        const confirmed = confirm(
            `Apply status "${bulkStatus}" to ${ids.length} lead${ids.length === 1 ? "" : "s"}?\n\n` +
            "This changes the status immediately and is recorded in the audit trail. It does not delete any lead."
        );
        if (!confirmed) return;

        startTransition(async () => {
            setBusy(true);
            setMessage("");
            const result = await bulkUpdateLeadStatus(ids, bulkStatus);
            setBusy(false);
            if (!result.success) {
                setMessage(result.error);
                return;
            }
            setLeads((prev) => prev.map((lead) => (ids.includes(lead.id) ? { ...lead, status: bulkStatus } : lead)));
            setSelected(new Set());
            setMessage(`Updated ${result.updated} lead${result.updated === 1 ? "" : "s"}.`);
        });
    };

    const exportCsv = () => {
        const header = [
            "Name", "Mobile", "Email", "City", "Pincode", "Status", "Validation", "Verification",
            "Quality score", "Spam risk", "Classification", "Confidence", "Review outcome",
            "Follow-up owner", "Last contact", "Reasons", "Created",
        ];
        const rows = filtered.map((lead) => [
            lead.name, lead.mobile, lead.email ?? "", lead.city, lead.pincode ?? "", lead.status,
            lead.validationStatus ?? "valid", lead.verificationStatus ?? "unverified",
            lead.qualityScore ?? lead.aiScore ?? "", lead.spamRisk ?? lead.botRisk ?? "",
            lead.classification ?? "", lead.confidence ?? "", lead.reviewOutcome ?? "",
            lead.followUpOwner ?? "", lead.lastContactAt ? formatDate(lead.lastContactAt, true) : "",
            lead.aiReasons ?? "", formatDate(lead.createdAt, true),
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `airlink-intelligence-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        value={search}
                        onChange={(event) => { setSearch(event.target.value); setPage(0); }}
                        placeholder="Search name, mobile, email, city, message…"
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-[#FBBF24] transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={14} className="text-white/40" />
                    <select value={validation} onChange={(event) => { setValidation(event.target.value); setPage(0); }} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="" className="bg-[#0A192F]">All validation</option>
                        <option value="valid" className="bg-[#0A192F]">Valid</option>
                        <option value="suspicious" className="bg-[#0A192F]">Suspicious</option>
                        <option value="invalid" className="bg-[#0A192F]">Invalid</option>
                    </select>
                    <select value={classification} onChange={(event) => { setClassification(event.target.value); setPage(0); }} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="" className="bg-[#0A192F]">All classifications</option>
                        <option value="qualified" className="bg-[#0A192F]">Qualified</option>
                        <option value="contactable" className="bg-[#0A192F]">Contactable</option>
                        <option value="needs_review" className="bg-[#0A192F]">Needs review</option>
                        <option value="low_intent" className="bg-[#0A192F]">Low intent</option>
                        <option value="spam" className="bg-[#0A192F]">Spam</option>
                    </select>
                    <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="" className="bg-[#0A192F]">All statuses</option>
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option} className="bg-[#0A192F]">{option}</option>
                        ))}
                    </select>
                    <select value={owner} onChange={(event) => { setOwner(event.target.value); setPage(0); }} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="" className="bg-[#0A192F]">All owners</option>
                        {owners.map((name) => (
                            <option key={name} value={name} className="bg-[#0A192F]">{name}</option>
                        ))}
                    </select>
                    <button onClick={exportCsv} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 text-white/70 text-[11px] font-black uppercase tracking-widest transition-all">
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Bulk bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
                <p className="text-[11px] font-bold text-white/50">
                    {selected.size} selected · {filtered.length} matching · {leads.length} total
                    {message && <span className="text-[#FBBF24]"> · {message}</span>}
                </p>
                <div className="flex items-center gap-2">
                    <select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value)} className="bg-white/5 border border-white/10 text-xs text-white/70 px-3 py-1.5 rounded-lg outline-none focus:border-[#FBBF24]">
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option} className="bg-[#0A192F]">{option}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleBulk}
                        disabled={busy || selected.size === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FBBF24] hover:bg-white disabled:opacity-40 text-[#0A192F] text-[11px] font-black uppercase tracking-widest transition-all"
                    >
                        {busy ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                        Apply to selected
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40">
                                <th className="px-3 py-3 w-8">
                                    <button onClick={toggleAllVisible} aria-label="Select all visible leads" className="text-white/40 hover:text-[#FBBF24]">
                                        {visible.length > 0 && visible.every((lead) => selected.has(lead.id))
                                            ? <CheckSquare size={14} />
                                            : <Square size={14} />}
                                    </button>
                                </th>
                                <th className="text-left px-3 py-3">Customer</th>
                                <th className="text-left px-3 py-3 hidden lg:table-cell">Contact</th>
                                <th className="text-left px-3 py-3">Validation</th>
                                <th className="text-left px-3 py-3 hidden md:table-cell">Verification</th>
                                <th className="text-left px-3 py-3">Scores</th>
                                <th className="text-left px-3 py-3 hidden xl:table-cell">Classification</th>
                                <th className="text-left px-3 py-3 hidden xl:table-cell">Follow-up</th>
                                <th className="text-left px-3 py-3">Status</th>
                                <th className="px-3 py-3 w-8"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-12 text-white/30 font-medium">
                                        No leads match these filters.
                                    </td>
                                </tr>
                            ) : visible.map((lead, index) => {
                                const isExpanded = expandedId === lead.id;
                                return (
                                    <React.Fragment key={lead.id}>
                                        <tr className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
                                            <td className="px-3 py-3">
                                                <button onClick={() => toggleSelected(lead.id)} aria-label="Select lead" className="text-white/30 hover:text-[#FBBF24]">
                                                    {selected.has(lead.id) ? <CheckSquare size={14} className="text-[#FBBF24]" /> : <Square size={14} />}
                                                </button>
                                            </td>
                                            <td className="px-3 py-3">
                                                <button onClick={() => setExpandedId(isExpanded ? null : lead.id)} className="text-left">
                                                    <span className="font-semibold text-white block">{lead.name}</span>
                                                    <span className="flex items-center gap-1 text-[10px] text-white/40 font-medium mt-0.5">
                                                        <MapPin size={10} /> {lead.city || "—"}
                                                        {lead.duplicateOfId && <span className="text-amber-300">· duplicate</span>}
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="px-3 py-3 hidden lg:table-cell">
                                                <div className="font-mono text-white/70 text-xs">{lead.mobile}</div>
                                                <div className="text-white/30 text-[11px]">{lead.email || "No email"}</div>
                                            </td>
                                            <td className="px-3 py-3"><ValidationBadge lead={lead} /></td>
                                            <td className="px-3 py-3 hidden md:table-cell"><VerificationBadge lead={lead} /></td>
                                            <td className="px-3 py-3"><ScoringBadges lead={lead} /></td>
                                            <td className="px-3 py-3 hidden xl:table-cell">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${CLASSIFICATION_STYLES[lead.classification || ""] || "bg-white/5 text-white/40 border border-white/10"}`}>
                                                    {(lead.classification || "unscored").replace(/_/g, " ")}
                                                </span>
                                                {lead.reviewOutcome && (
                                                    <span className={`ml-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${OUTCOME_STYLES[lead.reviewOutcome] || "bg-white/5 text-white/40"}`}>
                                                        {lead.reviewOutcome.replace(/_/g, " ")}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 hidden xl:table-cell text-xs">
                                                <div className="text-white/60 font-semibold">{lead.followUpOwner || "Unassigned"}</div>
                                                <div className="text-white/25">{lead.lastContactAt ? formatDate(lead.lastContactAt, true) : "No contact logged"}</div>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={`text-[10px] font-black uppercase tracking-wider rounded-full px-2 py-1 ${
                                                    lead.status === "new" ? "bg-blue-500/15 text-blue-300"
                                                        : lead.status === "contacted" ? "bg-amber-500/15 text-amber-300"
                                                            : lead.status === "converted" ? "bg-emerald-500/15 text-emerald-300"
                                                                : lead.status === "spam" ? "bg-red-500/15 text-red-300"
                                                                    : "bg-white/5 text-white/50"
                                                }`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                                                    aria-label={isExpanded ? "Hide review panel" : "Open review panel"}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#FBBF24] hover:text-[#0A192F] text-white/40 inline-flex items-center justify-center transition-all"
                                                >
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="border-b border-white/10 bg-[#071322]">
                                                <td colSpan={10} className="px-4 py-5">
                                                    <ReviewPanel lead={lead} busy={busy} onSave={handleReview} />
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

            <div className="flex items-center justify-between mt-3">
                <p className="text-white/30 text-xs">
                    Page {current + 1} of {pageCount} · showing {visible.length} of {filtered.length} filtered leads
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(Math.max(0, current - 1))}
                        disabled={current === 0}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-white/60 text-xs font-bold disabled:opacity-30 hover:border-white/30 transition-all"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(Math.min(pageCount - 1, current + 1))}
                        disabled={current >= pageCount - 1}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-white/60 text-xs font-bold disabled:opacity-30 hover:border-white/30 transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

function ReviewPanel({
    lead,
    busy,
    onSave,
}: {
    lead: IntelligenceLead;
    busy: boolean;
    onSave: (leadId: string, input: {
        outcome: OutcomeLabel | null;
        classification: string | null;
        followUpOwner: string;
        note: string;
        markContacted: boolean;
    }) => void;
}) {
    const [outcome, setOutcome] = useState<string>(lead.reviewOutcome || "");
    const [classification, setClassification] = useState(lead.classification || "");
    const [owner, setOwner] = useState(lead.followUpOwner || "");
    const [note, setNote] = useState("");
    const [markContacted, setMarkContacted] = useState(false);
    const flags = parseFlags(lead.validationFlags);
    const botSignals = parseFlags(lead.botSignals);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Why the system scored it this way</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">{lead.aiReasons || "No reasons recorded yet — run the rule-based scorer on this lead."}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">AI summary</p>
                        <p className="text-xs text-white/70 leading-relaxed">{lead.aiSummary || "No AI summary (rules-only score)."}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Next action</p>
                        <p className="text-xs text-white/70 leading-relaxed">{lead.aiNextAction || "—"}</p>
                        <p className="text-[10px] text-white/30 mt-2">Confidence: {lead.confidence || "—"} · Model: {lead.aiModel || "rules only"}</p>
                    </div>
                </div>

                {(flags.length > 0 || botSignals.length > 0) && (
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Signals</p>
                        <div className="flex flex-wrap gap-1.5">
                            {[...new Set([...flags, ...botSignals])].map((flag) => (
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

                <div className="flex items-center gap-3 text-[10px] text-white/30">
                    <span>Created {formatDate(lead.createdAt, true)}</span>
                    <span>·</span>
                    <span>Source {(lead.source || "—").replace(/_/g, " ")}</span>
                    {lead.campaign && <><span>·</span><span>Campaign {lead.campaign}</span></>}
                </div>
            </div>

            <div className="space-y-3">
                <div className="rounded-xl bg-white/5 border border-[#FBBF24]/30 p-4 space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#FBBF24]">Review decision</p>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Outcome label</label>
                        <select value={outcome} onChange={(event) => setOutcome(event.target.value)} className="w-full bg-[#0A192F] border border-white/10 text-xs text-white/80 px-3 py-2 rounded-lg outline-none focus:border-[#FBBF24]">
                            <option value="">Not reviewed</option>
                            {OUTCOME_LABELS.map((label) => (
                                <option key={label} value={label}>{label.replace(/_/g, " ")}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Correct the classification</label>
                        <select value={classification} onChange={(event) => setClassification(event.target.value)} className="w-full bg-[#0A192F] border border-white/10 text-xs text-white/80 px-3 py-2 rounded-lg outline-none focus:border-[#FBBF24]">
                            <option value="">Keep system classification</option>
                            <option value="qualified">Qualified</option>
                            <option value="contactable">Contactable</option>
                            <option value="needs_review">Needs review</option>
                            <option value="low_intent">Low intent</option>
                            <option value="spam">Spam</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Follow-up owner</label>
                        <input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="Team member name" className="w-full bg-[#0A192F] border border-white/10 text-xs text-white/80 px-3 py-2 rounded-lg outline-none focus:border-[#FBBF24]" />
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1">Review note</label>
                        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} placeholder="What did you find?" className="w-full bg-[#0A192F] border border-white/10 text-xs text-white/80 px-3 py-2 rounded-lg outline-none focus:border-[#FBBF24] resize-y" />
                    </div>

                    <label className="flex items-center gap-2 text-[11px] font-bold text-white/60">
                        <input type="checkbox" checked={markContacted} onChange={(event) => setMarkContacted(event.target.checked)} className="w-3.5 h-3.5 accent-[#FBBF24]" />
                        Log contact now
                    </label>

                    <button
                        onClick={() => onSave(lead.id, {
                            outcome: (outcome || null) as OutcomeLabel | null,
                            classification: classification || null,
                            followUpOwner: owner,
                            note,
                            markContacted,
                        })}
                        disabled={busy}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FBBF24] hover:bg-white disabled:opacity-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-[#0A192F] transition-all"
                    >
                        {busy ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save review
                    </button>
                </div>

                <a href={`tel:+91${(lead.mobile || "").replace(/\D/g, "").slice(-10)}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-white/70 transition-all">
                    <Phone size={12} /> Call lead
                </a>
            </div>
        </div>
    );
}

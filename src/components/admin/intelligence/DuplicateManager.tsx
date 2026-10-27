"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Link2, Loader2, Unlink, Check } from "lucide-react";
import { keepDuplicateAsSeparate, linkDuplicate, unlinkDuplicate } from "@/app/actions/intelligence";
import { formatDate, type DuplicateGroupView } from "./types";

/**
 * Duplicate management. A repeated enquiry is never deleted or merged away
 * silently: the admin can link it to the original, keep it as a separate lead,
 * or unlink it. Every choice is written to the lead audit trail.
 */
export default function DuplicateManager({ groups: initialGroups }: { groups: DuplicateGroupView[] }) {
    const router = useRouter();
    const [groups] = useState(initialGroups);
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [, startTransition] = useTransition();

    const act = (key: string, action: () => Promise<{ success: boolean; error?: string }>) => {
        startTransition(async () => {
            setBusy(key);
            setMessage("");
            const result = await action();
            setBusy(null);
            if (!result.success) {
                setMessage(result.error ?? "Could not update this duplicate.");
                return;
            }
            setMessage("Duplicate updated.");
            router.refresh();
        });
    };

    if (groups.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-center">
                <Copy size={22} className="mx-auto text-white/20 mb-3" />
                <p className="text-sm font-bold text-white/40">No repeated phone numbers found.</p>
                <p className="text-[11px] text-white/25 mt-1">
                    A group appears here when the same number submits more than once. Nothing is removed automatically.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {message && (
                <p className="text-[11px] font-bold text-[#FBBF24] bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl px-4 py-2">
                    {message}
                </p>
            )}

            {groups.map((group) => {
                const canonical = group.leads[0];
                return (
                    <div key={group.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div>
                                <p className="text-sm font-black text-white font-mono">+91 {group.phone}</p>
                                <p className="text-[10px] text-white/30 mt-0.5">{group.leads.length} enquiries from this number</p>
                            </div>
                            {group.leads.some((lead) => lead.duplicateOfId) && (
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                                    Linked
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            {group.leads.map((lead, index) => {
                                const isOriginal = index === 0;
                                return (
                                    <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0A192F] px-4 py-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-bold text-white truncate">{lead.name}</p>
                                                {isOriginal && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-full px-2 py-0.5">
                                                        First enquiry
                                                    </span>
                                                )}
                                                {lead.duplicateOfId && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                                                        Duplicate
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-white/30 mt-0.5">
                                                {formatDate(lead.createdAt, true)} · {lead.source.replace(/_/g, " ")} · status {lead.status}
                                                {lead.validationStatus !== "valid" ? ` · ${lead.validationStatus}` : ""}
                                                {typeof lead.spamRisk === "number" ? ` · spam risk ${lead.spamRisk}` : ""}
                                            </p>
                                        </div>

                                        {!isOriginal && (
                                            <div className="flex items-center gap-2">
                                                {busy === lead.id ? (
                                                    <Loader2 size={14} className="animate-spin text-[#FBBF24]" />
                                                ) : lead.duplicateOfId ? (
                                                    <>
                                                        <button
                                                            onClick={() => act(lead.id, () => unlinkDuplicate(lead.id))}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-white/60 text-[10px] font-black uppercase tracking-widest transition-all"
                                                        >
                                                            <Unlink size={11} /> Unlink
                                                        </button>
                                                        <button
                                                            onClick={() => act(lead.id, () => keepDuplicateAsSeparate(lead.id))}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBBF24] hover:bg-white text-[#0A192F] text-[10px] font-black uppercase tracking-widest transition-all"
                                                        >
                                                            <Check size={11} /> Keep separate
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => act(lead.id, () => linkDuplicate(lead.id, canonical.id))}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FBBF24] hover:bg-white text-[#0A192F] text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        <Link2 size={11} /> Link to first
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

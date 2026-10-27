"use client";

import React, { useState, useTransition } from "react";
import { Plus, BookOpen, Trash2, X, Check, Eye, EyeOff, Search, Sparkles } from "lucide-react";
import {
    createKnowledgeEntry,
    updateKnowledgeEntry,
    deleteKnowledgeEntry,
    toggleKnowledgeEntry,
    type KnowledgeEntryView,
} from "@/app/actions/knowledge";
import { KNOWLEDGE_CATEGORIES } from "@/lib/knowledge-categories";

/**
 * Editor for the approved FAQ that grounds the public assistant.
 * Nothing written here reaches the visitor until the entry is active; every
 * save is attributed to the signed-in administrator by the server action.
 */

interface FormState {
    category: string;
    question: string;
    answer: string;
    keywords: string;
    priority: number;
    isActive: boolean;
}

const EMPTY_FORM: FormState = {
    category: KNOWLEDGE_CATEGORIES[0],
    question: "",
    answer: "",
    keywords: "",
    priority: 0,
    isActive: true,
};

export default function KnowledgeManager({ initialEntries }: { initialEntries: KnowledgeEntryView[] }) {
    const [entries, setEntries] = useState<KnowledgeEntryView[]>(initialEntries);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
    const [isPending, startTransition] = useTransition();

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setError("");
        setShowForm(true);
    };

    const openEdit = (entry: KnowledgeEntryView) => {
        setForm({
            category: entry.category,
            question: entry.question,
            answer: entry.answer,
            keywords: entry.keywords ?? "",
            priority: entry.priority,
            isActive: entry.isActive,
        });
        setEditingId(entry.id);
        setError("");
        setShowForm(true);
    };

    const handleSave = () => {
        if (!form.question.trim() || !form.answer.trim()) {
            setError("Question and answer are both required.");
            return;
        }

        startTransition(async () => {
            setError("");
            const payload = {
                category: form.category,
                question: form.question.trim(),
                answer: form.answer.trim(),
                keywords: form.keywords.trim(),
                priority: Number(form.priority) || 0,
                isActive: form.isActive,
            };

            const result = editingId
                ? await updateKnowledgeEntry(editingId, payload)
                : await createKnowledgeEntry(payload);

            if (!result.success) {
                setError(result.error);
                return;
            }

            if (editingId) {
                setEntries((prev) =>
                    prev.map((entry) =>
                        entry.id === editingId
                            ? { ...entry, ...payload, keywords: payload.keywords || null, updatedAt: new Date() }
                            : entry
                    )
                );
            } else {
                window.location.reload();
            }
            setShowForm(false);
        });
    };

    const handleToggle = (entry: KnowledgeEntryView) => {
        startTransition(async () => {
            const next = !entry.isActive;
            const result = await toggleKnowledgeEntry(entry.id, next);
            if (result.success) {
                setEntries((prev) => prev.map((item) => (item.id === entry.id ? { ...item, isActive: next } : item)));
            }
        });
    };

    const handleDelete = (entry: KnowledgeEntryView) => {
        if (!confirm(`Delete this answer permanently?\n\n"${entry.question}"`)) return;
        startTransition(async () => {
            const result = await deleteKnowledgeEntry(entry.id);
            if (result.success) {
                setEntries((prev) => prev.filter((item) => item.id !== entry.id));
            }
        });
    };

    const visible = entries.filter((entry) => {
        if (filter === "active" && !entry.isActive) return false;
        if (filter === "hidden" && entry.isActive) return false;
        const needle = search.trim().toLowerCase();
        if (!needle) return true;
        return [entry.question, entry.answer, entry.keywords ?? "", entry.category]
            .join(" ")
            .toLowerCase()
            .includes(needle);
    });

    const activeCount = entries.filter((entry) => entry.isActive).length;

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0A192F] tracking-tight">Assistant Knowledge</h1>
                    <p className="text-[#0A192F]/40 text-sm mt-1">
                        Approved answers the AI assistant is allowed to use. {activeCount} of {entries.length} active.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0A192F]/30" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search answers"
                            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-[#0A192F] outline-none focus:border-[#FBBF24] w-48"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(event) => setFilter(event.target.value as typeof filter)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-[#0A192F] outline-none focus:border-[#FBBF24]"
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="hidden">Hidden</option>
                    </select>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FBBF24] hover:bg-[#0A192F] hover:text-white text-[#0A192F] font-black text-sm rounded-xl transition-all"
                    >
                        <Plus size={14} /> Add Answer
                    </button>
                </div>
            </div>

            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <Sparkles size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-900/80 font-semibold leading-relaxed">
                    The assistant never invents prices, offers or coverage. Keep answers factual and current, and
                    include the words a customer is likely to type in the keywords field. Changes reach the live
                    assistant within a minute — no redeploy needed.
                </p>
            </div>

            <div className="space-y-3">
                {visible.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#0A192F]/10 flex items-center justify-center shrink-0">
                                    <BookOpen size={14} className="text-[#0A192F]" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0A192F]/5 text-[#0A192F]/60">
                                            {entry.category}
                                        </span>
                                        {!entry.isActive && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                Hidden
                                            </span>
                                        )}
                                        {entry.priority !== 0 && (
                                            <span className="text-[10px] font-bold text-[#0A192F]/30">
                                                priority {entry.priority}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-black text-[#0A192F] leading-snug">{entry.question}</h3>
                                    <p className="text-sm text-[#0A192F]/60 mt-1 whitespace-pre-line">{entry.answer}</p>
                                    {entry.keywords && (
                                        <p className="text-[11px] text-[#0A192F]/35 mt-2 font-mono">{entry.keywords}</p>
                                    )}
                                    <p className="text-[10px] text-[#0A192F]/25 mt-2">
                                        Updated {new Date(entry.updatedAt).toLocaleString("en-IN")}
                                        {entry.updatedBy ? ` by ${entry.updatedBy}` : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleToggle(entry)}
                                    disabled={isPending}
                                    title={entry.isActive ? "Hide from assistant" : "Make available to assistant"}
                                    className="p-2 border border-gray-200 rounded-lg text-[#0A192F]/60 hover:bg-[#0A192F] hover:text-white hover:border-[#0A192F] transition-all disabled:opacity-40"
                                >
                                    {entry.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                                </button>
                                <button
                                    onClick={() => openEdit(entry)}
                                    className="text-xs font-bold px-3 py-2 border border-gray-200 rounded-lg hover:bg-[#0A192F] hover:text-white hover:border-[#0A192F] transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(entry)}
                                    disabled={isPending}
                                    className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-all disabled:opacity-40"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {visible.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-[#0A192F]/40 text-sm">
                        {entries.length === 0
                            ? "No approved answers yet. Add the first one so the assistant can answer accurately."
                            : "No answers match this filter."}
                    </div>
                )}
            </div>

            {showForm && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 my-8"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#0A192F]">
                                {editingId ? "Edit Answer" : "Add Answer"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">
                                    Category
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]"
                                >
                                    {KNOWLEDGE_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">
                                    Customer question
                                </label>
                                <input
                                    value={form.question}
                                    onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
                                    placeholder="e.g. How long does installation take?"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">
                                    Approved answer
                                </label>
                                <textarea
                                    value={form.answer}
                                    onChange={(event) => setForm((prev) => ({ ...prev, answer: event.target.value }))}
                                    rows={5}
                                    placeholder="Write the exact answer the assistant should give."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24] resize-y"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">
                                    Keywords (comma separated)
                                </label>
                                <input
                                    value={form.keywords}
                                    onChange={(event) => setForm((prev) => ({ ...prev, keywords: event.target.value }))}
                                    placeholder="installation, install time, how long, connection"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]"
                                />
                                <p className="text-[10px] text-[#0A192F]/35 mt-1">
                                    Used to match this answer to what the visitor actually types.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">
                                        Priority
                                    </label>
                                    <input
                                        type="number"
                                        min={-100}
                                        max={100}
                                        value={form.priority}
                                        onChange={(event) =>
                                            setForm((prev) => ({ ...prev, priority: Number(event.target.value) }))
                                        }
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]"
                                    />
                                </div>
                                <label className="flex items-center gap-2 mt-5 text-sm font-bold text-[#0A192F]/70 select-none">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(event) =>
                                            setForm((prev) => ({ ...prev, isActive: event.target.checked }))
                                        }
                                        className="w-4 h-4 accent-[#0A192F]"
                                    />
                                    Active
                                </label>
                            </div>

                            {error && (
                                <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs font-bold">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className="flex-1 py-3 bg-[#0A192F] text-white font-black text-sm rounded-xl hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Check size={16} /> {isPending ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 border border-gray-200 text-[#0A192F]/60 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

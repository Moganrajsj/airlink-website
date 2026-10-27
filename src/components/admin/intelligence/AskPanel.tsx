"use client";

import React, { useState, useTransition } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { askBusinessQuestion } from "@/app/actions/intelligence";
import type { BiAnswer } from "@/lib/intelligence";

const SUGGESTIONS = [
    "How many leads do we have?",
    "How many leads this month are spam?",
    "Which city sends the most leads?",
    "What is our conversion rate?",
    "How many leads are in a live coverage area?",
    "Show the lead trend for the last 14 days",
    "How many leads have no follow-up yet?",
    "Which source brings the most enquiries?",
];

/**
 * Business questions are answered by hand-written, parameterized Prisma
 * queries. No text-to-SQL, no LLM and no access to admin credentials — the
 * router only recognises a fixed set of intents and returns the query it ran so
 * the admin can verify the figure.
 */
export default function AskPanel() {
    const [question, setQuestion] = useState("");
    const [history, setHistory] = useState<BiAnswer[]>([]);
    const [pending, startTransition] = useTransition();

    const ask = (value?: string) => {
        const text = (value ?? question).trim();
        if (!text || pending) return;
        setQuestion(text);
        startTransition(async () => {
            const result = await askBusinessQuestion(text);
            setHistory((prev) => [result, ...prev].slice(0, 8));
        });
    };

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-[#FBBF24]" />
                    <p className="text-sm font-black text-white">Ask the database</p>
                </div>
                <p className="text-[11px] text-white/40 mb-4 leading-relaxed">
                    Answers are computed live from the leads table. The assistant shows which query it ran, so every
                    number can be checked. If something has never been recorded, the answer says so instead of guessing.
                </p>

                <div className="flex gap-2">
                    <input
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                        onKeyDown={(event) => { if (event.key === "Enter") ask(); }}
                        placeholder="e.g. How many spam leads did we get this week?"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#FBBF24] transition-colors"
                    />
                    <button
                        onClick={() => ask()}
                        disabled={pending || !question.trim()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-white disabled:opacity-40 text-[#0A192F] text-[11px] font-black uppercase tracking-widest transition-all"
                    >
                        {pending ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />} Ask
                    </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                    {SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => ask(suggestion)}
                            disabled={pending}
                            className="text-[10px] font-bold text-white/40 hover:text-[#FBBF24] border border-white/10 hover:border-[#FBBF24]/40 rounded-full px-2.5 py-1 transition-all disabled:opacity-40"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {history.map((entry, index) => (
                <div key={`${entry.question}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Question</p>
                    <p className="text-sm font-bold text-white/80 mb-3">{entry.question}</p>

                    <p className="text-sm text-white leading-relaxed">{entry.answer}</p>

                    {entry.rows.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                            {entry.rows.map((row) => (
                                <div key={row.label} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 truncate" title={row.label}>{row.label}</p>
                                    <p className="text-lg font-black text-[#FBBF24] tabular-nums">{row.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="text-[10px] text-white/25 mt-3 font-mono break-all">Source: {entry.source}</p>
                </div>
            ))}
        </div>
    );
}

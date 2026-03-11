"use client";

import React, { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, Wifi, Star, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { createPlan, updatePlan, deletePlan } from '@/app/actions/cms';

interface Plan {
    id: string;
    title: string;
    speed: number;
    price: number;
    features: string;
    tag: string | null;
    isBusiness: boolean;
    status: boolean;
    createdAt: Date;
}

interface FeaturesObj {
    ottApps?: string[];
    bestFor?: string;
    benefits?: string[];
    positioningLine?: string;
    support?: string;
    isPopular?: boolean;
    isPremium?: boolean;
}

function parseFeatures(f: string): FeaturesObj {
    try { return JSON.parse(f); } catch { return {}; }
}

const defaultFeatures: FeaturesObj = {
    ottApps: [],
    bestFor: "",
    benefits: [],
    positioningLine: "",
    support: "24/7 Online Support",
    isPopular: false,
    isPremium: false,
};

interface FormState {
    title: string;
    speed: string;
    price: string;
    tag: string;
    isBusiness: boolean;
    status: boolean;
    bestFor: string;
    positioningLine: string;
    support: string;
    benefits: string;
    ottApps: string;
    isPopular: boolean;
    isPremium: boolean;
}

function planToForm(plan: Plan): FormState {
    const f = parseFeatures(plan.features);
    return {
        title: plan.title,
        speed: String(plan.speed),
        price: String(plan.price),
        tag: plan.tag || "",
        isBusiness: plan.isBusiness,
        status: plan.status,
        bestFor: f.bestFor || "",
        positioningLine: f.positioningLine || "",
        support: f.support || "24/7 Online Support",
        benefits: (f.benefits || []).join("\n"),
        ottApps: (f.ottApps || []).join(", "),
        isPopular: f.isPopular || false,
        isPremium: f.isPremium || false,
    };
}

function formToFeaturesJson(form: FormState): string {
    return JSON.stringify({
        ottApps: form.ottApps.split(",").map(s => s.trim()).filter(Boolean),
        bestFor: form.bestFor,
        benefits: form.benefits.split("\n").map(s => s.trim()).filter(Boolean),
        positioningLine: form.positioningLine,
        support: form.support,
        isPopular: form.isPopular,
        isPremium: form.isPremium,
    });
}

const emptyForm: FormState = {
    title: "", speed: "", price: "", tag: "",
    isBusiness: false, status: true,
    bestFor: "", positioningLine: "", support: "24/7 Online Support",
    benefits: "", ottApps: "",
    isPopular: false, isPremium: false,
};

export default function PlansManager({ initialPlans }: { initialPlans: Plan[] }) {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isPending, startTransition] = useTransition();

    const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
    const openEdit = (plan: Plan) => { setForm(planToForm(plan)); setEditingId(plan.id); setShowForm(true); };
    const closeForm = () => { setShowForm(false); setEditingId(null); };

    const handleSave = () => {
        startTransition(async () => {
            const data = {
                title: form.title,
                speed: Number(form.speed),
                price: Number(form.price),
                features: formToFeaturesJson(form),
                tag: form.tag || null,
                isBusiness: form.isBusiness,
                status: form.status,
            };
            if (editingId) {
                await updatePlan(editingId, data);
                setPlans(prev => prev.map(p => p.id === editingId ? { ...p, ...data } as Plan : p));
            } else {
                const result = await createPlan(data as Parameters<typeof createPlan>[0]);
                if (result.success) window.location.reload();
            }
            closeForm();
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this plan? This will remove it from the website.")) return;
        startTransition(async () => {
            await deletePlan(id);
            setPlans(prev => prev.filter(p => p.id !== id));
        });
    };

    const handleToggle = (plan: Plan) => {
        startTransition(async () => {
            await updatePlan(plan.id, { status: !plan.status });
            setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, status: !p.status } : p));
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0A192F] tracking-tight">Broadband Plans</h1>
                    <p className="text-[#0A192F]/40 text-sm mt-1">Changes apply to the live website instantly</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#FBBF24] hover:bg-[#0A192F] hover:text-white text-[#0A192F] font-black text-sm rounded-xl transition-all">
                    <Plus size={16} /> Add Plan
                </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {plans.map(plan => {
                    const f = parseFeatures(plan.features);
                    return (
                        <div key={plan.id} className={`rounded-2xl border p-5 bg-white relative ${plan.status ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}>
                            {plan.tag && (
                                <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-[#FBBF24]/20 text-[#92400e]">{plan.tag}</span>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-[#0A192F]/10 flex items-center justify-center">
                                    <Wifi size={14} className="text-[#0A192F]" />
                                </div>
                                <div>
                                    <h3 className="font-black text-[#0A192F] text-sm">{plan.title}</h3>
                                    <p className="text-xs text-[#0A192F]/40">{plan.isBusiness ? "Business" : "Residential"}</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-2xl font-black text-[#0A192F]">₹{plan.price}</span>
                                <span className="text-xs text-[#0A192F]/40">/mo</span>
                                <span className="ml-2 text-xs text-[#0A192F]/60">{plan.speed} Mbps</span>
                            </div>
                            <p className="text-xs text-[#0A192F]/50 mb-3 leading-relaxed">{f.bestFor}</p>
                            {(f.ottApps && f.ottApps.length > 0) && (
                                <p className="text-[10px] text-[#0A192F]/40 mb-3">🎬 {f.ottApps.slice(0, 3).join(", ")}{f.ottApps.length > 3 ? ` +${f.ottApps.length - 3} more` : ""}</p>
                            )}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                <button onClick={() => openEdit(plan)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-[#0A192F] hover:text-white hover:border-[#0A192F] transition-all">
                                    <Pencil size={12} /> Edit
                                </button>
                                <button onClick={() => handleToggle(plan)} className={`p-1.5 rounded-lg border transition-all ${plan.status ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                    {plan.status ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                </button>
                                <button onClick={() => handleDelete(plan.id)} className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeForm}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#0A192F]">{editingId ? "Edit Plan" : "Create New Plan"}</h2>
                            <button onClick={closeForm} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Title */}
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Plan Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. 100 Mbps"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Speed */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Speed (Mbps)</label>
                                <input type="number" value={form.speed} onChange={e => setForm(f => ({ ...f, speed: e.target.value }))}
                                    placeholder="100"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Price (₹/month)</label>
                                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                    placeholder="799"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Tag */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Tag (optional)</label>
                                <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                                    placeholder="Most Popular"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Support */}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Support</label>
                                <input value={form.support} onChange={e => setForm(f => ({ ...f, support: e.target.value }))}
                                    placeholder="24/7 Online Support"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Best For */}
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Best For</label>
                                <input value={form.bestFor} onChange={e => setForm(f => ({ ...f, bestFor: e.target.value }))}
                                    placeholder="Families + Work From Home"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Positioning Line */}
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Plan Tagline</label>
                                <input value={form.positioningLine} onChange={e => setForm(f => ({ ...f, positioningLine: e.target.value }))}
                                    placeholder="Balanced Speed & Premium Streaming Experience."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Benefits */}
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Benefits (one per line)</label>
                                <textarea rows={4} value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))}
                                    placeholder={"Buffer-free 4K streaming\nSmooth Zoom / Teams calls\nOnline gaming (casual)"}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24] resize-none" />
                            </div>

                            {/* OTT Apps */}
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">OTT Apps (comma separated)</label>
                                <input value={form.ottApps} onChange={e => setForm(f => ({ ...f, ottApps: e.target.value }))}
                                    placeholder="Sun NXT, Zee5, SonyLIV, Aha"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>

                            {/* Flags */}
                            <div className="col-span-2 flex items-center gap-6 flex-wrap">
                                {[
                                    { key: "isBusiness" as keyof FormState, label: "Business Plan" },
                                    { key: "isPopular" as keyof FormState, label: "Most Popular" },
                                    { key: "isPremium" as keyof FormState, label: "Premium" },
                                    { key: "status" as keyof FormState, label: "Active (visible on website)" },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#0A192F]/70">
                                        <input type="checkbox" checked={Boolean(form[key])}
                                            onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                                            className="accent-[#FBBF24] w-4 h-4" />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={handleSave} disabled={isPending || !form.title || !form.speed || !form.price}
                                className="flex-1 py-3 bg-[#0A192F] text-white font-black text-sm rounded-xl hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                <Check size={16} /> {isPending ? "Saving..." : (editingId ? "Update Plan" : "Create Plan")}
                            </button>
                            <button onClick={closeForm} className="px-6 py-3 border border-gray-200 text-[#0A192F]/60 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

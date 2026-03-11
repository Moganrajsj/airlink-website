"use client";

import React, { useState, useTransition } from 'react';
import { Plus, Star, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/app/actions/cms';

interface Testimonial {
    id: string;
    name: string;
    role: string | null;
    content: string;
    rating: number;
    isActive: boolean;
    createdAt: Date;
}

const empty = { name: "", role: "", content: "", rating: 5, isActive: true };

export default function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
    const [items, setItems] = useState<Testimonial[]>(initial);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(empty);
    const [isPending, startTransition] = useTransition();

    const openEdit = (t: Testimonial) => {
        setForm({ name: t.name, role: t.role || "", content: t.content, rating: t.rating, isActive: t.isActive });
        setEditingId(t.id); setShowForm(true);
    };
    const openCreate = () => { setForm(empty); setEditingId(null); setShowForm(true); };

    const handleSave = () => {
        startTransition(async () => {
            const data = { name: form.name, role: form.role || null, content: form.content, rating: form.rating, isActive: form.isActive };
            if (editingId) {
                await updateTestimonial(editingId, data);
                setItems(prev => prev.map(t => t.id === editingId ? { ...t, ...data } : t));
            } else {
                await createTestimonial({ ...data, role: data.role || undefined });
                window.location.reload();
            }
            setShowForm(false);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this testimonial?")) return;
        startTransition(async () => {
            await deleteTestimonial(id);
            setItems(prev => prev.filter(t => t.id !== id));
        });
    };

    const handleToggle = (t: Testimonial) => {
        startTransition(async () => {
            await updateTestimonial(t.id, { isActive: !t.isActive });
            setItems(prev => prev.map(x => x.id === t.id ? { ...x, isActive: !x.isActive } : x));
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0A192F] tracking-tight">Testimonials</h1>
                    <p className="text-[#0A192F]/40 text-sm mt-1">Active testimonials appear on the homepage</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#FBBF24] hover:bg-[#0A192F] hover:text-white text-[#0A192F] font-black text-sm rounded-xl transition-all">
                    <Plus size={16} /> Add Testimonial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map(t => (
                    <div key={t.id} className={`bg-white rounded-2xl border p-5 ${t.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={12} className={i < t.rating ? "text-[#FBBF24] fill-[#FBBF24]" : "text-gray-200 fill-gray-200"} />
                                ))}
                            </div>
                            <button onClick={() => handleToggle(t)} className={`${t.isActive ? 'text-green-500' : 'text-gray-300'}`}>
                                {t.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            </button>
                        </div>
                        <p className="text-sm text-[#0A192F]/70 mb-4 leading-relaxed line-clamp-3">&ldquo;{t.content}&rdquo;</p>
                        <div className="mb-3">
                            <p className="font-black text-[#0A192F] text-sm">{t.name}</p>
                            {t.role && <p className="text-xs text-[#0A192F]/40">{t.role}</p>}
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                            <button onClick={() => openEdit(t)} className="flex-1 text-xs font-bold py-1.5 border border-gray-200 rounded-lg hover:bg-[#0A192F] hover:text-white hover:border-[#0A192F] transition-all">Edit</button>
                            <button onClick={() => handleDelete(t.id)} className="p-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50"><Trash2 size={12} /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <div className="col-span-3 text-center py-16 text-[#0A192F]/40">No testimonials yet. Add your first one!</div>}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-black text-[#0A192F]">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Customer Name</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ravi Kumar"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24]" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Role / Location (optional)</label>
                                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    placeholder="Home User, Dharmapuri"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24]" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Review</label>
                                <textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Excellent fiber connection with zero downtime..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24] resize-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Star Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                                            <Star size={24} className={n <= form.rating ? "text-[#FBBF24] fill-[#FBBF24]" : "text-gray-200 fill-gray-200"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#0A192F]/60">
                                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-[#FBBF24] w-4 h-4" />
                                Show on website
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={handleSave} disabled={isPending || !form.name || !form.content}
                                className="flex-1 py-3 bg-[#0A192F] text-white font-black text-sm rounded-xl hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                <Check size={16} /> {isPending ? "Saving..." : "Save Testimonial"}
                            </button>
                            <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-gray-200 font-bold text-sm rounded-xl hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

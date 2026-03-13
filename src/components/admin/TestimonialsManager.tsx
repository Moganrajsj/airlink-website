"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Star, AlertCircle, MessageSquare } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    person: string;
    role: string;
    city: string;
    tag: string;
    content: string;
    rating: number;
    color: string;
    metric: string;
    status: boolean;
}

const API = '/api/admin/testimonials';

const PRESET_COLORS = [
    { label: 'Gold', value: '#FBBF24' },
    { label: 'Blue', value: '#60a5fa' },
    { label: 'Green', value: '#34d399' },
    { label: 'Purple', value: '#a78bfa' },
    { label: 'Orange', value: '#fb923c' },
    { label: 'Red', value: '#f43f5e' },
    { label: 'Cyan', value: '#06b6d4' },
];

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => onChange(s)}>
                <Star size={20} fill={s <= value ? '#FBBF24' : 'transparent'} className={s <= value ? 'text-[#FBBF24]' : 'text-white/20'} />
            </button>
        ))}
    </div>
);

const emptyForm = { name: '', person: '', role: '', city: '', tag: '', content: '', rating: 5, color: '#FBBF24', metric: '', status: true };

export default function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...emptyForm });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(API);
            setTestimonials(await res.json());
        } catch { setError('Failed to load testimonials'); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        setError(null);
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editId ? { id: editId, ...form } : form)
        });
        const result = await res.json();
        if (result.success) {
            setShowForm(false);
            setEditId(null);
            setForm({ ...emptyForm });
            fetchData();
        } else {
            setError(result.error || 'Failed to save');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        await fetch(API, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        fetchData();
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        await fetch(API, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: !currentStatus }) });
        fetchData();
    };

    const startEdit = (t: Testimonial) => {
        setEditId(t.id);
        setForm({ name: t.name, person: t.person || t.name, role: t.role, city: t.city || '', tag: t.tag || '', content: t.content, rating: t.rating, color: t.color || '#FBBF24', metric: t.metric || '', status: t.status });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditId(null);
        setForm({ ...emptyForm });
    };

    const field = (label: string, key: keyof typeof emptyForm, placeholder: string, type: string = 'text') => (
        <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{label}</label>
            <input
                type={type} placeholder={placeholder}
                value={form[key] as string}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FBBF24] outline-none"
            />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white">Testimonials</h2>
                    <p className="text-white/40 text-sm mt-1">Manage customer reviews on the homepage — changes appear live on the website</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-[#FBBF24] text-[#0A192F] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_4px_12px_rgba(251,191,36,0.3)]"
                    >
                        <Plus size={18} /> Add Testimonial
                    </button>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400">
                    <AlertCircle size={16} /><span className="text-sm">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
                    >
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">
                            {editId ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </h3>

                        {/* Basic info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {field('Business / Group Name', 'name', 'e.g. Murugan Textiles')}
                            {field('Person Name (shown on card)', 'person', 'e.g. Mr. K. Muthukumar')}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {field('Role / Occupation', 'role', 'e.g. Proprietor')}
                            {field('City', 'city', 'e.g. Dharmapuri')}
                            {field('Tag (business type)', 'tag', 'e.g. Textile Business')}
                        </div>

                        {/* Review content */}
                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Review Content</label>
                            <textarea
                                rows={4} placeholder="Write the customer testimonial here..."
                                value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                                className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FBBF24] outline-none resize-none"
                            />
                        </div>

                        {/* Metric + Color */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {field('Metric / Achievement (optional)', 'metric', 'e.g. Zero downtime in 10 months')}
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Card Accent Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {PRESET_COLORS.map(c => (
                                        <button
                                            key={c.value} type="button"
                                            onClick={() => setForm({ ...form, color: c.value })}
                                            className="w-8 h-8 rounded-full transition-all border-2"
                                            style={{ background: c.value, borderColor: form.color === c.value ? 'white' : 'transparent' }}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Rating + Toggle */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Rating</label>
                                <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-white/60 font-semibold">Show on website</label>
                                <button
                                    onClick={() => setForm({ ...form, status: !form.status })}
                                    className={`w-12 h-6 rounded-full transition-all relative ${form.status ? 'bg-[#FBBF24]' : 'bg-white/10'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.status ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleSave}
                                disabled={!form.name || !form.content}
                                className="flex items-center gap-2 bg-[#FBBF24] text-[#0A192F] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-40"
                            >
                                <Check size={18} /> {editId ? 'Save Changes' : 'Add Testimonial'}
                            </button>
                            <button onClick={cancelForm} className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            {loading ? (
                <div className="py-20 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-[#FBBF24] border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-white/40">Loading...</p>
                </div>
            ) : testimonials.length === 0 ? (
                <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <MessageSquare size={40} className="text-white/10 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white/60">No testimonials yet</h3>
                    <p className="text-white/30 text-sm mt-1">Click "Add Testimonial" to create one</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {testimonials.map((t) => (
                        <motion.div key={t.id} layout
                            className={`bg-white/5 border rounded-2xl p-5 transition-all ${t.status ? 'border-white/10' : 'border-white/5 opacity-60'}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                                        style={{ background: t.color || '#FBBF24' }}
                                    >
                                        {(t.person || t.name)[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-white text-sm">{t.person || t.name}</span>
                                            {t.city && <span className="text-xs text-white/40">· {t.city}</span>}
                                            {t.tag && <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${t.color || '#FBBF24'}20`, color: t.color || '#FBBF24' }}>{t.tag}</span>}
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < t.rating ? '#FBBF24' : 'transparent'} className={i < t.rating ? 'text-[#FBBF24]' : 'text-white/20'} />)}
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase ${t.status ? 'text-green-500' : 'text-white/30'}`}>
                                                {t.status ? '● Visible' : '○ Hidden'}
                                            </span>
                                        </div>
                                        <p className="text-white/50 text-xs mt-1 truncate">"{t.content}"</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <button onClick={() => handleToggle(t.id, t.status)} className={`p-2 rounded-lg transition-all ${t.status ? 'text-green-500 bg-green-500/10' : 'text-white/20 hover:text-green-500 hover:bg-green-500/10'}`}><Check size={15} /></button>
                                    <button onClick={() => startEdit(t)} className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Edit2 size={15} /></button>
                                    <button onClick={() => handleDelete(t.id)} className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={15} /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

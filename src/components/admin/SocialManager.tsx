"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, Edit2, Check, X, 
    Facebook, Instagram, Linkedin, 
    Youtube, Globe, Share2,
    ExternalLink,
    MessageCircle, Send, Music2, Ghost, AlertCircle
} from 'lucide-react';

const PLATFORMS = [
    { name: 'Facebook', icon: <Facebook size={18} /> },
    { name: 'Instagram', icon: <Instagram size={18} /> },
    { name: 'LinkedIn', icon: <Linkedin size={18} /> },
    { name: 'YouTube', icon: <Youtube size={18} /> },
    { name: 'Pinterest', icon: <Share2 size={18} /> },
    { name: 'Twitter', icon: <X size={18} /> },
    { name: 'WhatsApp', icon: <MessageCircle size={18} /> },
    { name: 'Telegram', icon: <Send size={18} /> },
    { name: 'TikTok', icon: <Music2 size={18} /> },
    { name: 'Snapchat', icon: <Ghost size={18} /> },
    { name: 'Website', icon: <Globe size={18} /> }
];

interface SocialLink {
    id: string;
    platform: string;
    url: string;
    status: boolean;
}

const API = '/api/admin/social';

export default function SocialManager() {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        platform: 'Facebook',
        url: '',
        status: true
    });
    const [editUrl, setEditUrl] = useState('');

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const res = await fetch(API);
            const data = await res.json();
            setLinks(Array.isArray(data) ? data : []);
        } catch (e) {
            setError('Failed to load social links');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (id?: string) => {
        setError(null);
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id ? { id, ...formData } : formData)
        });
        const result = await res.json();
        if (result.success) {
            setIsEditing(null);
            setShowAddForm(false);
            setFormData({ platform: 'Facebook', url: '', status: true });
            fetchLinks();
        } else {
            setError(result.error || 'Failed to save');
        }
    };

    const handleEditSave = async (id: string) => {
        setError(null);
        const link = links.find(l => l.id === id);
        if (!link) return;
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, platform: link.platform, url: editUrl, status: link.status })
        });
        const result = await res.json();
        if (result.success) {
            setIsEditing(null);
            fetchLinks();
        } else {
            setError(result.error || 'Failed to save');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this social link?')) return;
        const res = await fetch(API, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if ((await res.json()).success) fetchLinks();
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        await fetch(API, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: !currentStatus })
        });
        fetchLinks();
    };

    const startEdit = (link: SocialLink) => {
        setIsEditing(link.id);
        setEditUrl(link.url);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white">Social Media Links</h2>
                    <p className="text-white/40 text-sm mt-1">Add your URL and toggle active to show in the website footer</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-[#FBBF24] text-[#0A192F] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_4px_12px_rgba(251,191,36,0.3)]"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            {/* Add New Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-4">Add New Social Platform</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Platform</label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FBBF24] transition-all outline-none"
                                >
                                    {PLATFORMS.map(p => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Profile URL</label>
                                <div className="flex gap-3">
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="flex-1 bg-[#0A192F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FBBF24] transition-all outline-none"
                                    />
                                    <button
                                        onClick={() => handleSave()}
                                        disabled={!formData.url}
                                        className="bg-[#FBBF24] text-[#0A192F] px-5 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-40"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="bg-white/5 text-white p-3 rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-[#FBBF24] border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-white/40">Loading...</p>
                    </div>
                ) : links.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                        <Share2 size={40} className="text-white/10 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white/60">No social links yet</h3>
                        <p className="text-white/30 text-sm mt-1">Click "Add New" to get started</p>
                    </div>
                ) : (
                    links.map((link) => (
                        <motion.div
                            key={link.id}
                            layout
                            className={`bg-white/5 border border-white/10 rounded-2xl p-6 transition-all ${!link.status ? 'opacity-60' : 'border-white/20'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.status ? 'bg-[#FBBF24]/10 text-[#FBBF24]' : 'bg-white/5 text-white/30'}`}>
                                        {PLATFORMS.find(p => p.name === link.platform)?.icon || <Globe size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{link.platform}</h4>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${link.status && link.url ? 'text-green-500' : 'text-white/30'}`}>
                                            {link.status && link.url ? '● Active' : link.url ? '○ Hidden' : '○ No URL'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleToggle(link.id, link.status)}
                                        title={link.status ? 'Deactivate' : 'Activate'}
                                        className={`p-2 rounded-lg transition-all text-xs ${link.status ? 'text-green-500 bg-green-500/10' : 'text-white/20 hover:text-green-500 hover:bg-green-500/10'}`}
                                    >
                                        <Check size={15} />
                                    </button>
                                    <button
                                        onClick={() => startEdit(link)}
                                        className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <Edit2 size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>

                            {isEditing === link.id ? (
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <input
                                        type="url"
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-[#0A192F] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[#FBBF24] outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditSave(link.id)}
                                            className="flex-1 bg-[#FBBF24] text-[#0A192F] py-2 rounded-xl text-xs font-bold"
                                        >
                                            Save URL
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(null)}
                                            className="px-4 bg-white/5 text-white py-2 rounded-xl text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                    <span className="text-xs text-white/30 truncate max-w-[160px]">
                                        {link.url || 'No URL set — click edit to add'}
                                    </span>
                                    {link.url && (
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#FBBF24] transition-colors">
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

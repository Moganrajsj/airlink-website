"use client";

import React, { useState, useEffect } from 'react';
import {
    Sparkles, Settings2, Play, Pause,
    RefreshCcw, Eye, Save, Trash2,
    Info, Search, Plus, Clock, CheckCircle2,
    X, Check, AlertCircle, Edit
} from 'lucide-react';
import { 
    getBackgroundAssets, 
    createBackgroundAsset, 
    updateBackgroundAsset, 
    deleteBackgroundAsset, 
    toggleBackgroundAssetStatus,
    type BackgroundAssetInput
} from '@/app/actions/backgrounds';
import type { BackgroundAsset } from '@prisma/client';

const BackgroundPage = () => {
    const [assets, setAssets] = useState<BackgroundAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState<BackgroundAssetInput>({
        sectionName: "",
        animationType: "grid",
        speed: 1.0,
        opacity: 0.15,
        status: true,
        imageUrl: ""
    });

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        setIsLoading(true);
        const res = await getBackgroundAssets();
        if (res.success && res.assets) {
            setAssets(res.assets);
        }
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const res = editingId 
            ? await updateBackgroundAsset(editingId, formData)
            : await createBackgroundAsset(formData);

        if (res.success) {
            loadAssets();
            setShowForm(false);
            resetForm();
        } else {
            alert(res.error || "Operation failed");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this infrastructure asset?")) return;
        const res = await deleteBackgroundAsset(id);
        if (res.success) loadAssets();
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const res = await toggleBackgroundAssetStatus(id, currentStatus);
        if (res.success) loadAssets();
    };

    const openEdit = (asset: BackgroundAsset) => {
        setFormData({
            sectionName: asset.sectionName,
            animationType: asset.animationType,
            speed: asset.speed,
            opacity: asset.opacity,
            status: asset.status,
            imageUrl: asset.imageUrl || ""
        });
        setEditingId(asset.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            sectionName: "",
            animationType: "grid",
            speed: 1.0,
            opacity: 0.15,
            status: true,
            imageUrl: ""
        });
        setEditingId(null);
    };

    const filteredAssets = assets.filter(a => 
        a.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.animationType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0A192F] tracking-tighter mb-2">Infrastructure Graphics<span className="text-[#FBBF24]">.</span></h1>
                    <p className="text-[#0A192F]/40 font-bold text-sm uppercase tracking-widest">Manage layered background animations across sections</p>
                </div>
                <button 
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="inline-flex items-center gap-2.5 bg-[#0A192F] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all hover:-translate-y-1"
                >
                    <Plus size={18} className="text-[#FBBF24]" />
                    Deploy New Asset
                </button>
            </div>

            {/* Utility Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-white/80 shadow-sm">
                <div className="flex items-center gap-2 px-4 border-r border-[#0A192F]/05">
                    <Search size={18} className="text-[#0A192F]/20" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sections..." 
                        className="bg-transparent border-none text-sm font-bold text-[#0A192F] focus:ring-0 placeholder-[#0A192F]/20" 
                    />
                </div>
                <div className="flex items-center gap-3 pr-2">
                    <button onClick={loadAssets} className="p-2.5 text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors"><RefreshCcw size={18} /></button>
                </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <div className="py-20 text-center text-[#0A192F]/20 font-black uppercase tracking-widest">Loading Infrastructure Assets...</div>
                ) : filteredAssets.length === 0 ? (
                    <div className="py-20 text-center text-[#0A192F]/20 font-black uppercase tracking-widest">No assets deployed</div>
                ) : filteredAssets.map((asset) => (
                    <div key={asset.id} className="bg-white rounded-[2rem] border border-white/80 p-8 shadow-[0_8px_32px_rgba(10,25,47,0.04)] group hover:border-[#FBBF24]/20 transition-all duration-300">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
                            {/* Section Info */}
                            <div className="w-full lg:w-1/4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-3 h-3 rounded-full ${asset.status ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-gray-300'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30">{asset.status ? 'Active' : 'Deactivated'}</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#0A192F] tracking-tighter mb-1 uppercase">{asset.sectionName}</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24]">
                                    <Sparkles size={14} />
                                    {asset.animationType}
                                </div>
                            </div>

                            {/* Configuration */}
                            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Speed</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-[#0A192F]">{asset.speed}x</span>
                                        <div className="h-1 flex-1 bg-[#FBBF24]/10 rounded-full relative">
                                            <div className="absolute inset-y-0 left-0 bg-[#FBBF24] rounded-full" style={{ width: `${(asset.speed / 5) * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Opacity</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-[#0A192F]">{asset.opacity}</span>
                                        <div className="h-1 flex-1 bg-blue-500/10 rounded-full relative">
                                            <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full" style={{ width: `${asset.opacity * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Graphic Type</p>
                                    <p className="text-sm font-black text-[#0A192F] uppercase">{asset.imageUrl ? 'Static Overlay' : 'Dynamic Canvas'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Last Update</p>
                                    <p className="text-sm font-bold text-[#0A192F]/40 flex items-center gap-1.5"><Clock size={12} /> {new Date(asset.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-[#0A192F]/05">
                                <button onClick={() => handleToggle(asset.id, asset.status)} className={`flex-1 lg:flex-none p-4 rounded-2xl transition-all ${asset.status ? 'bg-amber-50 text-amber-600' : 'bg-[#F7F8FA] text-[#0A192F]'}`}>
                                    {asset.status ? <Pause size={18} /> : <Play size={18} />}
                                </button>
                                <button onClick={() => openEdit(asset)} className="flex-1 lg:flex-none p-4 bg-[#F7F8FA] rounded-2xl text-[#0A192F] hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(asset.id)} className="flex-1 lg:flex-none p-4 bg-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-[#0A192F]/20 hover:text-[#0A192F]"><X size={24} /></button>
                        
                        <h2 className="text-3xl font-black text-[#0A192F] tracking-tighter mb-8 uppercase">
                            {editingId ? 'Edit Configuration' : 'New Infrastructure Layer'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 block mb-2">Target Section</label>
                                <input 
                                    required
                                    value={formData.sectionName}
                                    onChange={e => setFormData({...formData, sectionName: e.target.value})}
                                    placeholder="e.g. HERO, FEATURES, CTA"
                                    className="w-full bg-[#F7F8FA] border-none rounded-2xl p-4 text-sm font-bold text-[#0A192F] focus:ring-2 focus:ring-[#FBBF24] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 block mb-2">Animation Type</label>
                                    <select 
                                        value={formData.animationType}
                                        onChange={e => setFormData({...formData, animationType: e.target.value})}
                                        className="w-full bg-[#F7F8FA] border-none rounded-2xl p-4 text-sm font-bold text-[#0A192F] focus:ring-2 focus:ring-[#FBBF24] outline-none appearance-none"
                                    >
                                        <option value="grid">Network Grid</option>
                                        <option value="beams">Fiber Beams</option>
                                        <option value="particles">Data Particles</option>
                                        <option value="pulse">Pulse Core</option>
                                        <option value="circuit">Circuit Board</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 block mb-2">Speed (0.1 - 5.0)</label>
                                    <input 
                                        type="number" step="0.1" min="0.1" max="5"
                                        value={formData.speed}
                                        onChange={e => setFormData({...formData, speed: parseFloat(e.target.value)})}
                                        className="w-full bg-[#F7F8FA] border-none rounded-2xl p-4 text-sm font-bold text-[#0A192F] focus:ring-2 focus:ring-[#FBBF24] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 block mb-2">Opacity (0 - 1)</label>
                                    <input 
                                        type="number" step="0.01" min="0" max="1"
                                        value={formData.opacity}
                                        onChange={e => setFormData({...formData, opacity: parseFloat(e.target.value)})}
                                        className="w-full bg-[#F7F8FA] border-none rounded-2xl p-4 text-sm font-bold text-[#0A192F] focus:ring-2 focus:ring-[#FBBF24] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 block mb-2">Status</label>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, status: !formData.status})}
                                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${formData.status ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        {formData.status ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 block mb-2">Static Asset Fallback (Optional)</label>
                                <input 
                                    value={formData.imageUrl || ""}
                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                    placeholder="/images/fallback.svg"
                                    className="w-full bg-[#F7F8FA] border-none rounded-2xl p-4 text-sm font-bold text-[#0A192F] focus:ring-2 focus:ring-[#FBBF24] outline-none"
                                />
                            </div>

                            <button 
                                disabled={isSubmitting}
                                className="w-full py-5 bg-[#0A192F] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all disabled:opacity-50 mt-4"
                            >
                                {isSubmitting ? 'Syncing...' : editingId ? 'Update Configuration' : 'Deploy Infrastructure Asset'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackgroundPage;

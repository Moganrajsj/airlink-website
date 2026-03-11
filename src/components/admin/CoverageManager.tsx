"use client";

import React, { useState, useTransition } from 'react';
import { Plus, MapPin, Trash2, X, Check, Users } from 'lucide-react';
import { createCoverage, updateCoverage, deleteCoverage } from '@/app/actions/cms';

interface Coverage {
    id: string;
    cityName: string;
    status: string;
    leadsCount: number;
    updatedAt: Date;
}

interface Lead {
    id: string;
    name: string;
    mobile: string;
    email?: string | null;
    city: string;
    source?: string | null;
    status: string;
    createdAt: Date;
}

const STATUS_OPTIONS = ["Live", "Coming Soon", "Expanding", "Full Coverage"];
const STATUS_COLORS: Record<string, string> = {
    "Live": "bg-green-100 text-green-700",
    "Coming Soon": "bg-yellow-100 text-yellow-700",
    "Expanding": "bg-blue-100 text-blue-700",
    "Full Coverage": "bg-purple-100 text-purple-700",
};

export default function CoverageManager({
    initialCoverage,
    coverageLeads,
}: {
    initialCoverage: Coverage[];
    coverageLeads: Lead[];
}) {
    const [areas, setAreas] = useState<Coverage[]>(initialCoverage);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [cityName, setCityName] = useState("");
    const [status, setStatus] = useState("Live");
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState<"areas" | "inquiries">("areas");

    const openCreate = () => { setCityName(""); setStatus("Live"); setEditingId(null); setShowForm(true); };
    const openEdit = (area: Coverage) => { setCityName(area.cityName); setStatus(area.status); setEditingId(area.id); setShowForm(true); };

    const handleSave = () => {
        startTransition(async () => {
            if (editingId) {
                await updateCoverage(editingId, { cityName, status });
                setAreas(prev => prev.map(a => a.id === editingId ? { ...a, cityName, status } : a));
            } else {
                const result = await createCoverage({ cityName, status });
                if (result.success) window.location.reload();
            }
            setShowForm(false);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Remove this coverage area?")) return;
        startTransition(async () => {
            await deleteCoverage(id);
            setAreas(prev => prev.filter(a => a.id !== id));
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0A192F] tracking-tight">Coverage Areas</h1>
                    <p className="text-[#0A192F]/40 text-sm mt-1">Manage service zones and view coverage inquiries</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab("areas")} className={`px-4 py-2 text-sm font-black rounded-xl transition-all ${activeTab === "areas" ? "bg-[#0A192F] text-white" : "bg-white border border-gray-200 text-[#0A192F]/60"}`}>
                        Coverage Areas
                    </button>
                    <button onClick={() => setActiveTab("inquiries")} className={`px-4 py-2 text-sm font-black rounded-xl transition-all flex items-center gap-2 ${activeTab === "inquiries" ? "bg-[#0A192F] text-white" : "bg-white border border-gray-200 text-[#0A192F]/60"}`}>
                        <Users size={14} /> Inquiries <span className="px-2 py-0.5 rounded-full bg-[#FBBF24] text-[#0A192F] text-[10px] font-black">{coverageLeads.length}</span>
                    </button>
                    {activeTab === "areas" && (
                        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2 bg-[#FBBF24] hover:bg-[#0A192F] hover:text-white text-[#0A192F] font-black text-sm rounded-xl transition-all">
                            <Plus size={14} /> Add Area
                        </button>
                    )}
                </div>
            </div>

            {activeTab === "areas" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {areas.map(area => (
                        <div key={area.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-8 h-8 rounded-lg bg-[#0A192F]/10 flex items-center justify-center">
                                    <MapPin size={14} className="text-[#0A192F]" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${STATUS_COLORS[area.status] || "bg-gray-100 text-gray-600"}`}>
                                    {area.status}
                                </span>
                            </div>
                            <h3 className="font-black text-[#0A192F] mb-1">{area.cityName}</h3>
                            <p className="text-xs text-[#0A192F]/40 mb-4">{area.leadsCount} inquiries received</p>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(area)} className="flex-1 text-xs font-bold py-1.5 border border-gray-200 rounded-lg hover:bg-[#0A192F] hover:text-white hover:border-[#0A192F] transition-all">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(area.id)} className="p-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-all">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {areas.length === 0 && (
                        <div className="col-span-4 text-center py-16 text-[#0A192F]/40 text-sm">
                            No coverage areas yet. Click &quot;Add Area&quot; to get started.
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-[#0A192F]/40">
                                <th className="text-left px-4 py-3">Name</th>
                                <th className="text-left px-4 py-3">Mobile</th>
                                <th className="text-left px-4 py-3 hidden md:table-cell">City</th>
                                <th className="text-left px-4 py-3 hidden lg:table-cell">Source</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3 hidden xl:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coverageLeads.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-[#0A192F]/30">No coverage inquiries yet.</td></tr>
                            ) : coverageLeads.map((lead, i) => (
                                <tr key={lead.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                    <td className="px-4 py-3 font-semibold text-[#0A192F]">{lead.name}</td>
                                    <td className="px-4 py-3 font-mono text-[#0A192F]/70">{lead.mobile}</td>
                                    <td className="px-4 py-3 text-[#0A192F]/50 hidden md:table-cell">{lead.city}</td>
                                    <td className="px-4 py-3 text-[#0A192F]/40 text-xs hidden lg:table-cell">{lead.source}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-[#0A192F]/30 text-xs hidden xl:table-cell">
                                        {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#0A192F]">{editingId ? "Edit Coverage Area" : "Add Coverage Area"}</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">City / Area Name</label>
                                <input value={cityName} onChange={e => setCityName(e.target.value)}
                                    placeholder="e.g. Dharmapuri"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Service Status</label>
                                <select value={status} onChange={e => setStatus(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0A192F] outline-none focus:border-[#FBBF24]">
                                    {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={handleSave} disabled={isPending || !cityName}
                                className="flex-1 py-3 bg-[#0A192F] text-white font-black text-sm rounded-xl hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                <Check size={16} /> {isPending ? "Saving..." : "Save"}
                            </button>
                            <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 text-[#0A192F]/60 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, BarChart3, TrendingUp, Sparkles,
    ArrowUpRight, ArrowDownRight, UserPlus, Calendar,
    ChevronRight, CheckCircle2, AlertCircle, Clock, MapPin
} from 'lucide-react';

const StatCard = ({ icon, label, value, trend, isUp, color }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-white/80 shadow-[0_8px_32px_rgba(10,25,47,0.04)] relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 ${color}/5 group-hover:${color}/10 transition-all duration-500`} />

            <div className="flex items-start justify-between relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${color}/15 flex items-center justify-center ${color} border border-${color}/20 mb-6`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-tight ${isUp ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-[#0A192F]/40 text-sm font-bold uppercase tracking-widest mb-2">{label}</p>
                <p className="text-4xl font-black text-[#0A192F] tabular-nums tracking-tighter">{value}</p>
            </div>
        </motion.div>
    );
};

export default function DashboardView({ leads, stats: serverStats }: { leads: any[], stats: any }) {
    const stats = [
        { icon: <BarChart3 size={24} />, label: "Total Leads", value: serverStats.totalLeads, trend: "+100%", isUp: true, color: "text-[#FBBF24]" },
        { icon: <Users size={24} />, label: "Active Connections", value: "10,000+", trend: "+8.2%", isUp: true, color: "text-blue-500" },
        { icon: <TrendingUp size={24} />, label: "Network Uptime", value: "99.99%", trend: "Stable", isUp: true, color: "text-green-500" },
        { icon: <Sparkles size={24} />, label: "Animation Layers", value: "5 Layers", trend: "Optimized", isUp: true, color: "text-purple-500" },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0A192F] tracking-tighter mb-2">Network Dashboard<span className="text-[#FBBF24]">.</span></h1>
                    <p className="text-[#0A192F]/40 font-bold text-sm uppercase tracking-widest">Real-time infrastructure & business monitoring</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2.5 bg-white border border-[#0A192F]/10 text-[#0A192F] px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all hover:bg-[#F7F8FA]">
                        <Calendar size={18} className="text-[#0A192F]/40" />
                        Live Feed: March 06, 2026
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Tables Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-white/80 p-10 shadow-[0_8px_32px_rgba(10,25,47,0.04)] overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-[#0A192F] tracking-tighter mb-1">Recent Leads</h3>
                            <p className="text-[#0A192F]/40 text-xs font-bold uppercase tracking-widest">Captured from Contact & Availability forms</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#0A192F]/05">
                                    <th className="text-left py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">Customer</th>
                                    <th className="text-left py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">Location</th>
                                    <th className="text-left py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">Status</th>
                                    <th className="text-right py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#0A192F]/30">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0A192F]/02 mt-4">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-[#0A192F]/20 font-bold uppercase tracking-widest text-xs">No leads yet</td>
                                    </tr>
                                ) : (
                                    leads.map((lead, idx) => (
                                        <tr key={idx} className="group hover:bg-[#FBBF24]/03 transition-colors">
                                            <td className="py-6">
                                                <p className="text-sm font-black text-[#0A192F]">{lead.name}</p>
                                                <p className="text-[10px] font-bold text-[#0A192F]/30">{lead.phone} • {lead.email || 'No Email'}</p>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A192F]/60">
                                                    <MapPin size={12} className="text-[#FBBF24]" />
                                                    {lead.city}
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-2 h-2 rounded-full ${lead.status === 'New' ? 'bg-[#FBBF24]' : 'bg-blue-500'} animate-pulse`} />
                                                    <span className="text-[11px] font-black leading-none text-[#0A192F]/60 uppercase">{lead.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <button className="w-9 h-9 bg-[#F7F8FA] rounded-xl flex items-center justify-center text-[#0A192F]/20 hover:text-[#0A192F] hover:bg-[#FBBF24] transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-[#0A192F] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <h3 className="text-xl font-black text-white tracking-tighter mb-8 relative z-10 flex items-center gap-2.5">
                            <Sparkles size={20} className="text-[#FBBF24]" />
                            Animation Engine
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {["Fiber Beams", "Network Grid", "Data Pulse", "Particles", "Circuit Pattern"].map((layer, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-white/05 border border-white/05 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                        <span className="text-sm font-bold text-white/90">{layer}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#FBBF24]/50">Active</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

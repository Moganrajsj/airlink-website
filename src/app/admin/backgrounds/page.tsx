"use client";

import React, { useState } from 'react';
import {
    Sparkles, Settings2, Play, Pause,
    RefreshCcw, Eye, Save, Trash2,
    Info, Search, Plus, Clock, CheckCircle2
} from 'lucide-react';

const BackgroundPage = () => {
    const [assets, setAssets] = useState([
        { id: '1', section: 'Hero', animation: 'Network Grid + Beams', speed: '1.0x', opacity: '0.15', status: 'Active' },
        { id: '2', section: 'Speed Test', animation: 'Data Pulse + Particles', speed: '1.2x', opacity: '0.20', status: 'Active' },
        { id: '3', section: 'Features', animation: 'Circuit Board', speed: 'Static', opacity: '0.05', status: 'Active' },
        { id: '4', section: 'Testimonials', animation: 'Data Particles', speed: '0.5x', opacity: '0.10', status: 'Inactive' },
    ]);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#0A192F] tracking-tighter mb-2">Infrastructure Graphics<span className="text-[#FBBF24]">.</span></h1>
                    <p className="text-[#0A192F]/40 font-bold text-sm uppercase tracking-widest">Manage layered background animations across sections</p>
                </div>
                <button className="inline-flex items-center gap-2.5 bg-[#0A192F] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all hover:-translate-y-1">
                    <Plus size={18} className="text-[#FBBF24]" />
                    Deploy New Asset
                </button>
            </div>

            {/* Utility Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-white/80 shadow-sm">
                <div className="flex items-center gap-2 px-4 border-r border-[#0A192F]/05">
                    <Search size={18} className="text-[#0A192F]/20" />
                    <input type="text" placeholder="Search sections..." className="bg-transparent border-none text-sm font-bold text-[#0A192F] focus:ring-0 placeholder-[#0A192F]/20" />
                </div>
                <div className="flex items-center gap-3 pr-2">
                    <button className="p-2.5 text-[#0A192F]/40 hover:text-[#FBBF24] transition-colors"><RefreshCcw size={18} /></button>
                    <button className="p-2.5 text-[#0A192F]/40 hover:text-[#0A192F] transition-colors"><Settings2 size={18} /></button>
                </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 gap-6">
                {assets.map((asset, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] border border-white/80 p-8 shadow-[0_8px_32px_rgba(10,25,47,0.04)] group hover:border-[#FBBF24]/20 transition-all duration-300">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
                            {/* Section Info */}
                            <div className="w-full lg:w-1/4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-3 h-3 rounded-full ${asset.status === 'Active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-gray-300'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30">{asset.status}</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#0A192F] tracking-tighter mb-1">{asset.section}</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#FBBF24]">
                                    <Sparkles size={14} />
                                    {asset.animation}
                                </div>
                            </div>

                            {/* Configuration */}
                            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Speed</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-[#0A192F]">{asset.speed}</span>
                                        <div className="h-1 flex-1 bg-[#FBBF24]/10 rounded-full relative">
                                            <div className="absolute inset-y-0 left-0 bg-[#FBBF24] rounded-full" style={{ width: '45%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Opacity</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-[#0A192F]">{asset.opacity}</span>
                                        <div className="h-1 flex-1 bg-blue-500/10 rounded-full relative">
                                            <div className="absolute inset-y-0 left-0 bg-blue-500 rounded-full" style={{ width: '25%' }} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Load Stats</p>
                                    <p className="text-sm font-black text-[#0A192F]">0.12ms <span className="text-green-500 font-bold text-xs uppercase ml-1">Optimized</span></p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/30 mb-2">Last Sync</p>
                                    <p className="text-sm font-bold text-[#0A192F]/40 flex items-center gap-1.5"><Clock size={12} /> Today, 10:24 AM</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-[#0A192F]/05">
                                <button className="flex-1 lg:flex-none p-4 bg-[#F7F8FA] rounded-2xl text-[#0A192F] hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all"><Eye size={18} /></button>
                                <button className="flex-1 lg:flex-none p-4 bg-[#F7F8FA] rounded-2xl text-[#0A192F] hover:bg-[#0A192F] hover:text-white transition-all"><Save size={18} /></button>
                                <button className="flex-1 lg:flex-none p-4 bg-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Footer */}
            <div className="bg-[#0A192F] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBF24]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/05 rounded-full flex items-center justify-center border border-white/10">
                        <Info size={24} className="text-[#FBBF24]" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black tracking-tighter mb-1">Infrastructure Logic</h4>
                        <p className="text-white/40 text-sm font-bold">Background layers are rendered via high-performance Canvas API to ensure 0% impact on LCP.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <div className="text-right mr-4 hidden md:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FBBF24]">Overall Engine Health</p>
                        <p className="text-lg font-black tracking-tight">System Optimized</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] rounded-full flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundPage;

"use client";
import React from 'react';
import { packages } from '@/data/packages';
import { Check, Minus } from 'lucide-react';

import OTTIcon from '../ui/OTTIcon';

export default function ComparisonTable() {
    const comparisonFeatures: { label: string; values: (boolean | string)[]; ott?: string }[] = [
        { label: "Unlimited Data", values: [true, true, true, true, true, true] },
        { label: "Free Dual Band Router", values: [true, true, true, true, true, true] },
        { label: "Support", values: ["24/7", "24/7", "24/7", "24/7", "24/7", "Priority"] },
        { label: "4K Streaming", values: ["Basic", "HD", "Full HD", "4K", "Ultra 4K", "4K / 8K"] },
        { label: "Sun NXT", values: [false, true, true, true, true, true], ott: "Sun NXT" },
        { label: "Sony Liv", values: [false, true, true, true, true, true], ott: "Sony Liv" },
        { label: "Zee5", values: [false, false, true, true, true, true], ott: "Zee5" },
        { label: "OM TV", values: [false, true, true, true, true, true], ott: "OM TV" },
        { label: "Dollywood Play", values: [false, true, false, true, true, true], ott: "Dollywood Play" },
        { label: "Friday", values: [false, true, false, false, false, false], ott: "Friday" },
        { label: "Aha", values: [false, false, false, true, true, true], ott: "Aha" },
        { label: "Jio Hotstar", values: [false, false, false, true, true, true], ott: "Jio Hotstar" },
        { label: "PlayFlix", values: [false, false, false, false, true, true], ott: "PlayFlix" },
        { label: "Fancode", values: [false, false, false, false, false, true], ott: "Fancode" },
        { label: "Distro TV", values: [false, false, false, false, false, true], ott: "Distro TV" },
        { label: "Hubhopper", values: [false, false, false, false, false, true], ott: "Hubhopper" },
        { label: "Amazon Prime", values: [false, false, false, false, false, true], ott: "Amazon Prime" },
    ];

    return (
        <section className="py-20 bg-white border-t border-gray-300 overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6 tracking-tight">
                        Compare <span className="text-primary">Speeds.</span><br />Compare <span className="text-primary">Entertainment.</span>
                    </h2>
                    <p className="text-xl text-secondary/60 font-medium leading-relaxed">
                        Choose What Fits Your Lifestyle. Dive deep into all the features and OTT subscriptions included in each tier.
                    </p>
                </div>

                <div className="w-full overflow-x-auto pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-hide">
                    <table className="w-full min-w-[900px] border-collapse bg-white rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/40 border border-gray-300 outline outline-1 outline-gray-300">
                        <thead className="bg-[#1F2933] text-white text-left">
                            <tr>
                                <th className="p-6 font-bold uppercase tracking-widest text-xs border-r border-white/20 w-1/4">Features</th>
                                {packages.map(p => (
                                    <th key={p.id} className={`p-6 text-center border-r border-white/20 ${p.speed === "200" || p.speed === "500" ? 'bg-primary text-secondary' : ''}`}>
                                        <div className="text-3xl font-black tracking-tighter leading-none">{p.speed}</div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${p.speed === "200" || p.speed === "500" ? 'text-secondary/60' : 'text-gray-400'}`}>Mbps</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {/* Price Row */}
                            <tr className="bg-surface/50">
                                <td className="p-6 font-bold text-secondary text-sm border-r border-gray-300">Price</td>
                                {packages.map(p => (
                                    <td key={p.id} className={`p-6 text-center font-black text-lg border-r border-gray-300 ${p.speed === "200" || p.speed === "500" ? 'bg-orange-50/50 text-secondary' : 'text-primary'}`}>
                                        ₹{p.price}
                                    </td>
                                ))}
                            </tr>

                            {/* Mapping Features */}
                            {comparisonFeatures.map((feat, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 px-6 font-semibold text-secondary/80 text-sm border-r border-gray-300 flex items-center gap-3">
                                        {feat.ott ? <OTTIcon name={feat.ott} className="w-6 h-6" /> : null}
                                        {feat.label}
                                    </td>
                                    {feat.values.map((val, vIdx) => (
                                        <td key={vIdx} className={`p-4 text-center border-r border-gray-300 ${packages[vIdx].speed === "200" || packages[vIdx].speed === "500" ? 'bg-orange-50/30' : ''}`}>
                                            {typeof val === 'boolean' ? (
                                                val ? <Check className="mx-auto text-green-500" size={18} strokeWidth={3} /> : <Minus className="mx-auto text-gray-300" size={18} />
                                            ) : (
                                                <span className="font-bold text-secondary text-xs">{val}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Bottom Action Row */}
                            <tr className="bg-surface">
                                <td className="p-6 font-bold text-secondary text-sm border-r border-gray-300">Actions</td>
                                {packages.map(p => (
                                    <td key={p.id} className={`p-4 text-center border-r border-gray-300 ${p.speed === "200" || p.speed === "500" ? 'bg-orange-50/50' : ''}`}>
                                        <a href="#booking" className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${p.speed === "200" || p.speed === "500" ? 'bg-primary text-secondary hover:bg-black hover:text-white' : 'bg-secondary text-white hover:bg-primary hover:text-secondary'}`}>
                                            Select
                                        </a>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

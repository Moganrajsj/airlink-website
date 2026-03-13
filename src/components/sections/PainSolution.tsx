"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Wifi, TrendingUp, Video, Gamepad2, Tv2, Zap } from 'lucide-react';
import Link from 'next/link';
import { LightSectionBg } from '@/components/ui/AnimatedBackground';

const pains = [
    { icon: <Video size={22} />, text: "Video calls dropping in the middle of important client meetings?" },
    { icon: <Gamepad2 size={22} />, text: "Gaming lag and high ping ruining your tournament rank?" },
    { icon: <Tv2 size={22} />, text: "OTT shows buffering right when the story gets exciting?" },
    { icon: <Wifi size={22} />, text: "Frequent disconnections disrupting your work from home?" },
    { icon: <TrendingUp size={22} />, text: "Slow uploads making file sharing a nightmare?" },
    { icon: <AlertTriangle size={22} />, text: "Paying for high speed but getting throttled every evening?" },
];

const solutions = [
    "Symmetrical 1:1 fiber bandwidth — no sharing, no throttling",
    "99.99% uptime SLA backed by Tier 3 data center infrastructure",
    "Direct IXP & CDN peering for ultra-low latency",
    "Redundant fiber core — no single point of failure",
    "24/7 NOC monitoring with proactive fault resolution",
    "Same-day support response for all service disruptions",
];

export default function PainSolution() {
    const [hoveredPain, setHoveredPain] = useState<number | null>(null);

    return (
        <section className="py-12 md:py-28 bg-[#F7F8FA] relative overflow-hidden" id="why-airlink">
            <LightSectionBg variant="dots" />
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#FBBF24]/04 to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6"
                    >
                        <AlertTriangle size={13} /> Sound Familiar?
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-6xl font-black text-[#0A192F] tracking-tight mb-4"
                    >
                        Still Facing{' '}
                        <span className="text-[#FBBF24]">Slow Internet?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#0A192F]/55 text-base md:text-lg max-w-2xl mx-auto font-medium"
                    >
                        Millions of Tamil Nadu homes and businesses deserve better. Here's what you should never have to deal with again.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
                    {/* Left — Pain column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-3"
                    >
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400 mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-red-400/60 inline-block" /> The Pain
                        </p>
                        {pains.map((pain, i) => (
                            <motion.div
                                key={i}
                                onMouseEnter={() => setHoveredPain(i)}
                                onMouseLeave={() => setHoveredPain(null)}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                className="flex items-start gap-4 p-4 md:p-5 rounded-2xl border cursor-default transition-all duration-300"
                                style={{
                                    background: hoveredPain === i
                                        ? 'rgba(239,68,68,0.05)'
                                        : '#FFFFFF',
                                    borderColor: hoveredPain === i
                                        ? 'rgba(239,68,68,0.2)'
                                        : 'rgba(10,25,47,0.06)',
                                }}
                            >
                                <div className="mt-0.5 text-red-400/70 flex-shrink-0">{pain.icon}</div>
                                <p className="text-[#0A192F]/70 font-semibold text-[15px] leading-relaxed">{pain.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Right — Solution column */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:sticky lg:top-32"
                    >
                        <div
                            className="rounded-[2rem] border border-[#FBBF24]/20 p-6 md:p-10 relative overflow-hidden bg-white shadow-[0_8px_40px_rgba(251,191,36,0.08)]"
                        >
                            {/* Yellow top accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent" />

                            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FBBF24] mb-6 flex items-center gap-2">
                                <span className="w-8 h-px bg-[#FBBF24]/60 inline-block" /> The Airlink Solution
                            </p>

                            <h3 className="text-2xl md:text-3xl font-black text-[#0A192F] mb-3 leading-snug">
                                One Switch. <span className="text-[#FBBF24]">Zero Compromises.</span>
                            </h3>
                            <p className="text-[#0A192F]/55 text-[15px] font-medium mb-8 leading-relaxed">
                                Airlink's dedicated fiber infrastructure delivers consistent, high-speed connectivity — the same enterprise-grade backbone trusted by Tamil Nadu's leading businesses, now available for your home.
                            </p>

                            <ul className="space-y-4 mb-10">
                                {solutions.map((s, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + i * 0.07 }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle2 size={18} className="text-[#FBBF24] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#0A192F]/70 font-semibold text-sm leading-relaxed">{s}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/plans"
                                    className="flex-1 text-center bg-[#FBBF24] text-[#0A192F] font-black py-4 px-6 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-1"
                                    style={{ boxShadow: '0 8px 24px rgba(251,191,36,0.3)' }}
                                >
                                    View Fiber Plans
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex-1 text-center border border-[#0A192F]/10 text-[#0A192F] font-bold py-4 px-6 rounded-xl text-sm uppercase tracking-widest transition-all duration-300 hover:border-[#FBBF24]/50 hover:text-[#FBBF24]"
                                    style={{ background: 'rgba(10,25,47,0.03)' }}
                                >
                                    Book Free Installation
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

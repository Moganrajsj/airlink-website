"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Factory, Building2, Hospital, GraduationCap, ShoppingBag, Wifi, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const segments = [
    {
        icon: <Factory size={28} />,
        name: "Textile Units",
        description: "Export orders, buyer video calls, ERP systems, and inventory management — all need rock-solid connectivity.",
        color: "#FBBF24",
        stat: "Zero downtime SLA",
    },
    {
        icon: <Building2 size={28} />,
        name: "Corporate Offices",
        description: "Multi-branch leased lines, SD-WAN, and VPN — dedicated 1:1 bandwidth that scales as your team grows.",
        color: "#60a5fa",
        stat: "1:1 Uncontended ILL",
    },
    {
        icon: <Hospital size={28} />,
        name: "Hospitals & Clinics",
        description: "Telemedicine, PACS imaging, cloud HIS, and insurance claims require always-on, high-bandwidth connectivity.",
        color: "#34d399",
        stat: "Mission-critical uptime",
    },
    {
        icon: <GraduationCap size={28} />,
        name: "Schools & Colleges",
        description: "Smart classrooms, student portals, live streaming assemblies, and administrative systems — handled effortlessly.",
        color: "#a78bfa",
        stat: "Campus-wide coverage",
    },
    {
        icon: <ShoppingBag size={28} />,
        name: "Retail Shops",
        description: "POS billing, UPI/QR payments, GST filing, and inventory syncing — never lose a sale to a dropped connection.",
        color: "#fb923c",
        stat: "Same-day installation",
    },
];

const businessFeatures = [
    "Dedicated 1:1 Uncontended Bandwidth",
    "Internet Leased Lines (ILL / DIA)",
    "SD-WAN & MPLS for Multi-Branch",
    "Managed UTM Firewall & Security",
    "4-Hour On-Site Response SLA",
    "Dedicated Account Manager",
];

export default function BusinessSolutions() {
    return (
        <section className="py-28 bg-[#F7F7F8] relative overflow-hidden" id="business-solutions">
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #0A192F 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-[#0A192F]/5 border border-[#0A192F]/10 text-[#0A192F] px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6"
                    >
                        <Building2 size={12} /> For Tamil Nadu Businesses
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-[#0A192F] tracking-tight mb-4"
                    >
                        Powering Local Businesses <br className="hidden md:block" />
                        <span className="text-[#FBBF24]">Across Tamil Nadu.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#0A192F]/50 text-lg max-w-2xl mx-auto font-medium"
                    >
                        From small textile shops in Erode to multi-branch corporates in Coimbatore — Airlink's dedicated fiber infrastructure keeps your business running.
                    </motion.p>
                </div>

                {/* Segments grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-14">
                    {segments.map((seg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2rem] p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                        >
                            {/* Top color accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]" style={{ background: seg.color }} />

                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                style={{ background: `${seg.color}15`, color: seg.color }}
                            >
                                {seg.icon}
                            </div>

                            <h3 className="font-black text-[#0A192F] text-lg mb-3">{seg.name}</h3>
                            <p className="text-[#0A192F]/50 text-sm font-medium leading-relaxed mb-5">{seg.description}</p>

                            <div
                                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                                style={{ background: `${seg.color}15`, color: seg.color }}
                            >
                                <Wifi size={10} /> {seg.stat}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0A192F] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent" />

                    {/* Decorative rings */}
                    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end overflow-hidden pointer-events-none opacity-5">
                        <div className="w-[500px] h-[500px] rounded-full border-[60px] border-white" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                        <div>
                            <p className="text-[#FBBF24] text-xs font-black uppercase tracking-[0.3em] mb-4">Enterprise-Grade for All Sizes</p>
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-snug">
                                The Same Infrastructure <br />
                                <span className="text-[#FBBF24]">Used by Large Corporates.</span>
                            </h3>
                            <p className="text-gray-400 text-[15px] font-medium leading-relaxed mb-8">
                                Airlink delivers Tier 3 data center-backed connectivity, direct submarine cable access, and redundant fiber cores — now accessible to Tamil Nadu's SMEs at prices that make sense for your business.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/infrastructure"
                                    className="inline-flex items-center justify-center gap-2 bg-[#FBBF24] text-[#0A192F] font-black py-4 px-8 rounded-xl text-sm uppercase tracking-widest hover:-translate-y-1 transition-all duration-300"
                                    style={{ boxShadow: '0 8px 24px rgba(251,191,36,0.3)' }}
                                >
                                    Explore Business Plans <ArrowRight size={16} />
                                </Link>
                                <a
                                    href="tel:+919344584000"
                                    className="inline-flex items-center justify-center gap-2 border border-white/10 text-white font-bold py-4 px-8 rounded-xl text-sm uppercase tracking-widest hover:border-[#FBBF24]/40 hover:text-[#FBBF24] transition-all duration-300"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                >
                                    Call +91 93445 84000
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {businessFeatures.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.05 * i }}
                                    className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-2xl p-4"
                                >
                                    <CheckCircle2 size={16} className="text-[#FBBF24] mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm font-semibold leading-relaxed">{f}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

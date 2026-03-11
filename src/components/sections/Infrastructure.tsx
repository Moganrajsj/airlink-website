"use client";

import React, { useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { Shield, Zap, Globe, Cpu, ArrowRight } from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

const Infrastructure = () => {
    return (
        <section className="py-32 bg-white overflow-hidden relative">
            {/* Decorative Accents */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-[#FF6F00]/5 to-transparent blur-[120px] rounded-full"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24">

                    <div className="lg:w-5/12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#FF6F00] font-black text-xs tracking-[0.3em] uppercase mb-8 block">Global Backbone</span>
                            <h2 className="text-5xl md:text-7xl font-black text-[#1F2933] mb-10 leading-[1.05] tracking-tight">
                                Engineering <br />
                                <span className="text-[#FF6F00]">Excellence.</span>
                            </h2>
                            <p className="text-[#1F2933]/50 text-xl mb-12 font-medium leading-relaxed">
                                Our infrastructure is built on Tier-1 global transit providers and
                                highly redundant fiber paths to ensure mission-critical stability.
                            </p>

                            <div className="space-y-6">
                                {[
                                    "Tier-1 Transit Providers",
                                    "Redundant Carrier-Neutral Paths",
                                    "24/7 Managed NOC Facility",
                                    "Direct Cloud Peering (AWS/Azure)"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#1F2933]/40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6F00]"></div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-7/12">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            {[
                                {
                                    icon: <Zap size={28} />,
                                    title: "Low Latency",
                                    desc: "Direct peering with major hubs for sub-5ms local response times."
                                },
                                {
                                    icon: <Shield size={28} />,
                                    title: "Encrypted Core",
                                    desc: "Bulletproof next-gen firewalls built into the network backbone."
                                },
                                {
                                    icon: <Globe size={28} />,
                                    title: "Dynamic Routing",
                                    desc: "BGP-powered path selection ensuring zero-packet-loss delivery."
                                },
                                {
                                    icon: <Cpu size={28} />,
                                    title: "SD-WAN Ready",
                                    desc: "Enterprise logic that adapts your bandwidth on the fly."
                                }
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="p-10 rounded-[2.5rem] bg-[#F7F7F8] border border-[#E5E7EB] hover:bg-white hover:border-[#FF6F00]/30 transition-all duration-500 group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#FF6F00] mb-8 shadow-sm group-hover:bg-[#FF6F00] group-hover:text-white transition-all duration-500">
                                        {card.icon}
                                    </div>
                                    <h4 className="text-2xl font-black text-[#1F2933] mb-4 tracking-tight">{card.title}</h4>
                                    <p className="text-sm font-medium text-[#1F2933]/40 leading-relaxed">{card.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </div>

        </section>
    );
};

export default Infrastructure;

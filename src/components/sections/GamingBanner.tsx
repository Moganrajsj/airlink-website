"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bolt, Rocket, Activity } from 'lucide-react';

const GamingBanner = () => {
    return (
        <section className="relative overflow-hidden rounded-[1.5rem] md:rounded-[3rem] bg-[#0A192F] h-[220px] md:h-[600px] flex items-center mx-4 md:mx-6 my-8 md:my-12">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    className="w-full h-full object-cover opacity-40 md:opacity-50" 
                    src="/images/stitch/gaming-bg.png" 
                    alt="Ultimate Gaming Performance"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent opacity-60" />
            </div>

            <div className="container mx-auto px-5 md:px-12 relative z-10 py-6 md:py-16">
                <div className="flex flex-row items-center justify-between gap-4 md:gap-0">
                    {/* Left content */}
                    <div className="flex-1 space-y-2 md:space-y-6">
                        {/* Badge */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="hidden md:inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/30 px-4 py-2 rounded-full text-[#FBBF24] text-xs font-black uppercase tracking-widest shadow-lg shadow-[#FBBF24]/10"
                        >
                            <Bolt size={16} className="fill-[#FBBF24]" />
                            Zero Latency Guaranteed
                        </motion.div>

                        {/* Title */}
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter uppercase"
                        >
                            Ultimate Gaming <br />
                            <span className="text-[#FBBF24] drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">Performance</span>
                        </motion.h2>

                        {/* Description - only on md and up */}
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden md:block text-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-lg"
                        >
                            Dominate the leaderboard with fiber-optic speeds. Lag is now a thing of the past with our dedicated gaming lanes.
                        </motion.p>

                        {/* CTA and Stats */}
                        <div className="flex flex-wrap gap-3 md:gap-6 items-center md:pt-4">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#FBBF24] text-[#0A192F] px-4 py-2.5 md:px-8 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-lg flex items-center gap-2 md:gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(251,191,36,0.3)]"
                            >
                                Level Up
                                <Rocket size={14} className="md:w-[22px] md:h-[22px]" />
                            </motion.button>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-lg md:text-3xl flex items-center gap-1 md:gap-2">
                                    0.5ms <Activity size={14} className="md:w-5 md:h-5 text-[#FBBF24] animate-pulse" />
                                </span>
                                <span className="text-white/40 text-[9px] md:text-xs font-bold uppercase tracking-widest">Avg. Jitter</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop-only Glass Widget */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center text-white/90">
                                <span className="font-black text-sm uppercase tracking-wider">Network Status</span>
                                <span className="w-3 h-3 bg-[#4ADE80] rounded-full animate-pulse shadow-[0_0_15px_#4ADE80]" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "98%" }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-[#FBBF24]" 
                                    />
                                </div>
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                                    OPTIMIZED FOR STEAM, EPIC & PSN
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GamingBanner;

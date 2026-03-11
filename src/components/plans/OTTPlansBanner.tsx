"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Sparkles, Zap } from 'lucide-react';
import OTTIcon from '../ui/OTTIcon';

const allOTTs = [
    "Amazon Prime", "Sun NXT", "Zee5", "Sony Liv", "Aha",
    "Jio Hotstar", "Fancode", "Distro TV", "OM TV",
    "Dollywood Play", "PlayFlix", "Hubhopper", "Fridaay"
];

const OTTPlansBanner = () => {
    return (
        <section className="relative overflow-hidden pt-12 pb-16 bg-[#0A192F]">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FBBF24] blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text Content */}
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#FBBF24] text-xs font-black uppercase tracking-widest mb-6"
                            >
                                <Sparkles size={14} />
                                <span>Entertainment Beyond Speed</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight"
                            >
                                15+ Premium OTTs <br />
                                <span className="text-[#FBBF24]">Included with your Plan.</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-white/60 text-lg font-medium leading-relaxed mb-8 max-w-xl"
                            >
                                Don't just browse, experience ultimate entertainment. Get access to major streaming platforms bundled with your high-speed Airlink Fiber connection.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24]">
                                        <Tv size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-black text-sm uppercase tracking-wider">Free Setup</div>
                                        <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Included in Plans</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Zap size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-black text-sm uppercase tracking-wider">No Lag 4K</div>
                                        <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Optimized Routes</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* OTT Logo Grid */}
                        <div className="lg:w-1/2">
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
                                {allOTTs.map((ott, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        transition={{ duration: 0.4, delay: idx * 0.03 }}
                                        className="aspect-square relative group"
                                    >
                                        <div className="absolute inset-0 bg-[#FBBF24]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="h-full bg-white rounded-2xl p-2 sm:p-3 shadow-lg flex items-center justify-center border border-white/10 relative z-10 transition-all duration-300 group-hover:border-[#FBBF24]/50">
                                            <OTTIcon name={ott} className="w-full h-full" />
                                        </div>
                                    </motion.div>
                                ))}
                                {/* Plus More Icon */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: allOTTs.length * 0.03 }}
                                    className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center group hover:border-[#FBBF24]/50 transition-all duration-300"
                                >
                                    <span className="text-[#FBBF24] text-xl font-black">+2</span>
                                    <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">More</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OTTPlansBanner;

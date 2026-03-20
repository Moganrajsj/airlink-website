"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Router, Leaf, Headphones, Sparkles } from 'lucide-react';

const SmartHomeBanner = () => {
    const features = [
        { icon: <ShieldCheck size={20} className="text-[#FBBF24]" />, text: "Advanced Security" },
        { icon: <Router size={20} className="text-[#FBBF24]" />, text: "Next-Gen Wi-Fi 6" },
        { icon: <Leaf size={20} className="text-[#FBBF24]" />, text: "IoT Optimization" },
        { icon: <Headphones size={20} className="text-[#FBBF24]" />, text: "24/7 Smart Support" },
    ];

    return (
        <section className="container mx-auto px-4 md:px-6 my-8 md:my-16">
            <div className="bg-[#0A192F] rounded-[1.5rem] md:rounded-[3rem] p-1 shadow-2xl overflow-hidden group hover:shadow-[#FBBF24]/10 transition-all duration-700">
                {/* Mobile layout: horizontal rectangle */}
                <div className="block md:hidden">
                    <div className="bg-white rounded-[1.2rem] overflow-hidden">
                        <div className="flex flex-row h-[220px]">
                            {/* Text side */}
                            <div className="flex-1 p-5 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-1 bg-[#0A192F]/05 text-[#0A192F]/60 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#0A192F]/10">
                                        <Sparkles size={10} className="text-[#FBBF24]" />
                                        Smart Home Bundle
                                    </div>
                                    <h2 className="text-xl font-black text-[#0A192F] leading-[1] tracking-tighter">
                                        One Connection. <br />
                                        <span className="text-[#FBBF24]">Total Control.</span>
                                    </h2>
                                    <p className="text-[#0A192F]/60 text-[11px] font-medium leading-snug">
                                        Connect 100+ devices with military-grade security.
                                    </p>
                                </div>

                                {/* Mobile Features (2-up) */}
                                <div className="grid grid-cols-2 gap-y-1 gap-x-2">
                                    {features.slice(0, 4).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-lg bg-[#0A192F]/05 flex items-center justify-center flex-shrink-0 text-[#FBBF24]">
                                                {idx === 0 && <ShieldCheck size={12} />}
                                                {idx === 1 && <Router size={12} />}
                                                {idx === 2 && <Leaf size={12} />}
                                                {idx === 3 && <Headphones size={12} />}
                                            </div>
                                            <span className="text-[#0A192F] font-bold text-[9px] tracking-tight">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile CTA  */}
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="text-[#0A192F]/40 text-[8px] font-black uppercase tracking-widest">Starting at</p>
                                        <p className="text-xl font-black text-[#0A192F] tracking-tight">₹499<span className="text-xs font-medium opacity-40">/mo</span></p>
                                    </div>
                                    <button className="bg-[#0A192F] text-white px-4 py-2 rounded-xl font-black text-xs">
                                        Get Bundle
                                    </button>
                                </div>
                            </div>

                            {/* Image side */}
                            <div className="w-[42%] flex-shrink-0 grid grid-cols-2 gap-1 p-1">
                                <div className="rounded-xl overflow-hidden">
                                    <img className="w-full h-full object-cover" src="/images/stitch/smarthome-1.png" alt="Smart home" />
                                </div>
                                <div className="rounded-xl overflow-hidden">
                                    <img className="w-full h-full object-cover" src="/images/stitch/smarthome-2.png" alt="Smart doorbell" />
                                </div>
                                <div className="col-span-2 rounded-xl overflow-hidden">
                                    <img className="w-full h-full object-cover" src="/images/stitch/smarthome-3.png" alt="Smart home interior" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop layout: original 2-col grid */}
                <div className="hidden md:block">
                    <div className="bg-white rounded-[3rem] p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Text content */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-10"
                        >
                            <div className="inline-flex items-center gap-2 bg-[#0A192F]/05 text-[#0A192F]/60 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border border-[#0A192F]/10">
                                <Sparkles size={16} className="text-[#FBBF24]" />
                                Smart Home Bundle
                            </div>

                            <h2 className="text-4xl lg:text-5xl font-black text-[#0A192F] leading-[1] tracking-tighter">
                                One Connection. <br />
                                <span className="text-[#FBBF24]">Total Control.</span>
                            </h2>

                            <p className="text-[#0A192F]/60 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                                From smart locks to security cameras, connect up to 100+ devices with military-grade encryption and unwavering stability.
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-[#0A192F]/05 flex items-center justify-center group-hover/item:bg-[#FBBF24]/10 transition-all">
                                            {feature.icon}
                                        </div>
                                        <span className="text-[#0A192F] font-black text-base md:text-lg tracking-tight">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing / CTA Block */}
                                <div className="bg-[#F7F8FA] p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 overflow-hidden relative">
                                    <div className="relative z-10">
                                        <p className="text-[#0A192F]/40 text-xs font-black uppercase tracking-widest mb-1">Starting at</p>
                                        <p className="text-3xl font-black text-[#0A192F] tracking-tight">₹499<span className="text-sm font-medium opacity-40">/mo</span></p>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative z-10 bg-[#0A192F] text-white px-8 py-3 rounded-xl font-black text-base hover:shadow-2xl hover:shadow-[#0A192F]/30 transition-all"
                                    >
                                        Get Bundle
                                    </motion.button>
                                    <div className="absolute top-[-50%] right-[-10%] w-40 h-40 bg-[#FBBF24]/10 blur-[60px] rounded-full" />
                                </div>
                        </motion.div>

                        {/* Bento Grid Visuals */}
                        <div className="grid grid-cols-2 gap-6 md:gap-8">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="aspect-square rounded-[2rem] overflow-hidden bg-[#F7F8FA] shadow-lg border border-[#0A192F]/05 group/img"
                            >
                                <img className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" src="/images/stitch/smarthome-1.png" alt="Smart home dashboard" />
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="aspect-square rounded-[2rem] overflow-hidden bg-[#F7F8FA] shadow-lg border border-[#0A192F]/05 mt-10 group/img"
                            >
                                <img className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" src="/images/stitch/smarthome-2.png" alt="Smart doorbell" />
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="col-span-2 aspect-[2/1] rounded-[2rem] overflow-hidden bg-[#F7F8FA] shadow-lg border border-[#0A192F]/05 group/img"
                            >
                                <img className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-[3s]" src="/images/stitch/smarthome-3.png" alt="Smart home interior" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SmartHomeBanner;

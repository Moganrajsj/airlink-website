"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';



export default function ServiceAreas() {
    return (
        <section className="py-32 bg-white relative overflow-hidden" id="service-areas">
            {/* Background accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-0 w-[500px] h-[500px] rounded-full bg-[#FBBF24]/04 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-[#0A192F]/03 blur-[120px] translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#0A192F] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
                    >
                        Network Presence
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-[#0A192F] tracking-tighter mb-6 uppercase"
                    >
                        Proudly Serving <br />
                        <span className="text-[#FBBF24]">Across Tamil Nadu.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#0A192F]/50 text-xl max-w-2xl mx-auto font-medium"
                    >
                        We are rapidly expanding our fiber footprint across every district. 50+ service areas and growing every month.
                    </motion.p>
                </div>



                {/* Check availability CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0A192F] rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl text-white"
                >
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FBBF24]/05 blur-[100px] pointer-events-none" />

                    <div className="grid lg:grid-cols-5 gap-16 items-center relative z-10">
                        <div className="lg:col-span-3">
                            <p className="text-[#FBBF24] text-xs font-black uppercase tracking-[0.4em] mb-6">Rapidly Expanding</p>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tighter uppercase">
                                Don't See Your Area? <br className="hidden md:block" />
                                <span className="text-[#FBBF24]">Global Standard Fiber</span> <br className="hidden md:block" />
                                is Coming Soon.
                            </h3>
                            <p className="text-white/50 text-lg font-medium leading-relaxed mb-10 max-w-2xl">
                                We're expanding our fiber network across all districts. Check if Airlink is already available at your location — or register your interest and we'll prioritize your street.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                {["No waiting charges", "Free installation survey", "Priority onboarding"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-[#FBBF24]" />
                                        <span className="text-xs font-black uppercase tracking-widest text-white/60">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex flex-col gap-4 w-full">
                            <Link
                                href="/coverage"
                                className="w-full bg-[#FBBF24] text-[#0A192F] font-black py-6 px-10 rounded-2xl text-base uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-2xl shadow-[#FBBF24]/20 flex items-center justify-center gap-3"
                            >
                                <MapPin size={22} /> Check Availability
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full border-2 border-white/10 text-white font-black py-6 px-10 rounded-2xl text-base uppercase tracking-widest hover:bg-white hover:text-[#0A192F] transition-all duration-300 flex items-center justify-center gap-3 bg-white/05 backdrop-blur-md"
                            >
                                Book Free Install <ArrowRight size={22} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

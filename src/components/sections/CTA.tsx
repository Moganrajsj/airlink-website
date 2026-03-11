"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { YellowAccentBg } from '@/components/ui/AnimatedBackground';
import Magnet from '../animations/Magnet';
import TrueFocus from '../animations/TrueFocus';

const CTA = () => {
    return (
        <section className="py-28 bg-[#FBBF24] relative overflow-hidden" id="cta">
            <YellowAccentBg />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 bg-[#0A192F]/10 border border-[#0A192F]/15 text-[#0A192F] px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8">
                        🚀 Join 10,000+ Tamil Nadu Families
                    </div>
                    <div className="text-5xl md:text-7xl font-black text-[#0A192F] leading-tight mb-6 tracking-tight flex justify-center">
                        <TrueFocus
                            sentence="Ready to Experience Speed Beyond Thinking?"
                            manualMode={false}
                            blurAmount={4}
                            borderColor="#0A192F"
                            glowColor="rgba(10, 25, 47, 0.3)"
                            animationDuration={0.8}
                            pauseBetweenAnimations={0.5}
                        />
                    </div>
                    <p className="text-[#0A192F]/65 text-xl md:text-2xl font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of satisfied homes and businesses across Tamil Nadu powered by Airlink Broadband — backed by Sriram Broadband Services.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                        <Magnet padding={20} magnetStrength={0.2}>
                            <Link href="/contact"
                                className="w-full sm:w-auto bg-[#0A192F] text-white font-black text-lg py-5 px-12 rounded-2xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all duration-300"
                                style={{ boxShadow: '0 10px 40px rgba(10,25,47,0.25)' }}
                            >
                                Book Free Installation Today <ArrowRight size={22} />
                            </Link>
                        </Magnet>
                        <a href="tel:+919345217979"
                            className="w-full sm:w-auto border-2 border-[#0A192F]/20 text-[#0A192F] font-bold text-lg py-5 px-12 rounded-2xl flex items-center justify-center gap-3 hover:border-[#0A192F]/50 transition-all duration-300 bg-white/30"
                        >
                            <Phone size={20} /> Call +91 93452 17979
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                        {['Free Installation', '24-Hour Activation', 'No Hidden Charges', '99.99% Uptime SLA'].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-[#0A192F]" />
                                <span className="text-[#0A192F]/70 text-sm font-semibold">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

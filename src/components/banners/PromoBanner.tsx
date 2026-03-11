"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Banner } from "@prisma/client";

interface PromoBannerProps {
    banners: Banner[];
}

export default function PromoBanner({ banners }: PromoBannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance
    useEffect(() => {
        if (!banners || banners.length <= 1) return;

        let interval: NodeJS.Timeout;
        if (!isPaused) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [banners, isPaused]);

    if (!banners || banners.length === 0) return null;

    const banner = banners[currentIndex];

    return (
        <section className="w-full py-8 md:py-24 bg-[#F7F8FA] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative w-full z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={banner.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            className="w-full bg-[#FBBF24] rounded-3xl md:rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-stretch group"
                        >
                            {/* Subtle animated moving network background effect inside the text area */}
                            <div
                                className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />

                            {/* Left Content Area */}
                            <div className="w-full md:w-3/5 p-6 md:p-16 lg:p-20 relative z-20 flex flex-col items-start text-left justify-center">
                                {/* Tag/Badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A192F]/10 border border-[#0A192F]/15 text-[#0A192F] text-xs font-black uppercase tracking-widest mb-6"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A192F] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A192F]"></span>
                                    </span>
                                    <Sparkles size={14} /> Limited Time Offer
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0A192F] leading-[1.1] tracking-tight mb-4 md:mb-6"
                                >
                                    {banner.title}
                                </motion.h2>

                                {/* Subtitle */}
                                {banner.subtitle && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="text-[#0A192F]/80 text-base lg:text-xl font-medium leading-relaxed mb-6 md:mb-8 max-w-lg"
                                    >
                                        {banner.subtitle}
                                    </motion.p>
                                )}

                                {/* Offer Highlight Box */}
                                {banner.offerHighlight && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="bg-[#0A192F]/10 border border-[#0A192F]/20 rounded-xl md:rounded-2xl p-4 md:p-5 mb-6 md:mb-10 inline-block shadow-lg"
                                    >
                                        <span className="block text-lg md:text-2xl font-black text-[#0A192F] tracking-tight">
                                            {banner.offerHighlight}
                                        </span>
                                    </motion.div>
                                )}

                                {/* CTA Button */}
                                {banner.ctaText && banner.ctaLink && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                    >
                                        <Link
                                            href={banner.ctaLink}
                                            className="cursor-target inline-flex items-center gap-2 md:gap-3 shrink-0 bg-[#0A192F] hover:bg-white text-white hover:text-[#0A192F] py-3 md:py-5 px-6 md:px-12 rounded-full font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_rgba(10,25,47,0.25)] hover:shadow-[0_10px_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 group-hover:scale-[1.02]"
                                        >
                                            {banner.ctaText} <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                )}
                            </div>

                            {/* Right Image Area */}
                            <div className="w-full md:w-2/5 min-h-[200px] sm:min-h-[250px] md:min-h-full relative overflow-hidden flex-shrink-0">
                                {/* Gradient mask to blend the image seamlessly into the left side on desktop */}
                                <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FBBF24] to-transparent z-10" />

                                {/* Gradient mask for mobile to blend top of image with text section */}
                                <div className="md:hidden absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FBBF24] to-transparent z-10" />

                                {banner.imageUrl ? (
                                    <motion.div
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 3, ease: "easeOut" }}
                                        className="absolute inset-0 bg-cover bg-center md:bg-left z-0"
                                        style={{ backgroundImage: `url('${banner.imageUrl}')` }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-[#FBBF24] flex items-center justify-center">
                                        {/* Fallback abstract pattern if no image */}
                                        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #0A192F 0px, #0A192F 2px, transparent 2px, transparent 24px)' }} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination Dots */}
                {banners.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {banners.map((_, i) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => setCurrentIndex(i)}
                                className={`cursor-target h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-[#0A192F]" : "w-2 bg-[#0A192F]/20 hover:bg-[#0A192F]/40"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

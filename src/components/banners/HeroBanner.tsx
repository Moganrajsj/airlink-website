"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Banner } from "@prisma/client";

interface HeroBannerProps {
    banner: Banner;
}

export default function HeroBanner({ banner }: HeroBannerProps) {
    // Default background if none provided
    const bgImage = banner.imageUrl || "/backgrounds/network-bg.jpg"; // You can use a real image later

    return (
        <div className="relative w-full h-full flex items-center">
            {/* Background Image & Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${bgImage}')` }}
            >
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/90 via-[#0A192F]/70 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 relative z-10 pt-20">
                <div className="max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6"
                    >
                        {banner.title.split(" ").map((word, i) => (
                            <React.Fragment key={i}>
                                {i === banner.title.split(" ").length - 1 ? (
                                    <span className="text-[#FBBF24]">{word}</span>
                                ) : (
                                    `${word} `
                                )}
                            </React.Fragment>
                        ))}
                    </motion.h1>

                    {banner.subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-2xl text-white/80 font-medium leading-relaxed mb-10 max-w-xl"
                        >
                            {banner.subtitle}
                        </motion.p>
                    )}

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        {banner.ctaText && banner.ctaLink && (
                            <Link
                                href={banner.ctaLink}
                                className="bg-[#FBBF24] text-[#0A192F] py-4 px-10 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_10px_30px_rgba(251,191,36,0.3)] flex items-center gap-2"
                            >
                                {banner.ctaText} <ArrowUpRight size={18} />
                            </Link>
                        )}
                        <Link
                            href="/plans"
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 px-10 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#0A192F] transition-all flex items-center gap-2"
                        >
                            View Plans
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

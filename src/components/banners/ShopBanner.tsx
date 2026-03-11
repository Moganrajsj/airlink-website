"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import type { Banner } from "@prisma/client";

interface ShopBannerProps {
    banner: Banner;
}

export default function ShopBanner({ banner }: ShopBannerProps) {
    if (!banner) return null;

    return (
        <section className="w-full bg-white py-12">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full rounded-3xl overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center shadow-lg border border-gray-100"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[#F7F8FA]" />
                    <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="2" fill="#0A192F" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>
                    </div>

                    {/* Image Layer */}
                    {banner.imageUrl && (
                        <div
                            className="absolute inset-0 md:left-auto md:w-3/5 h-full bg-cover bg-center opacity-60 md:opacity-100 z-10"
                            style={{ backgroundImage: `url('${banner.imageUrl}')` }}
                        />
                    )}

                    {/* Gradient Fade for text blending on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-r from-white via-white/90 to-transparent md:w-3/4 z-20" />

                    <div className="relative z-30 w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-start h-full">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A192F]/5 border border-[#0A192F]/10 text-[#0A192F] text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm">
                            <ShoppingBag size={14} /> Shop Promotion
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A192F] leading-[1.1] tracking-tight mb-6">
                            {banner.title}
                        </h2>

                        {banner.subtitle && (
                            <p className="text-[#0A192F]/60 text-lg font-medium leading-relaxed mb-10 max-w-md">
                                {banner.subtitle}
                            </p>
                        )}

                        {banner.ctaText && banner.ctaLink && (
                            <Link
                                href={banner.ctaLink}
                                className="bg-[#FBBF24] hover:bg-black text-[#0A192F] hover:text-white py-4 px-10 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:-translate-y-1 flex items-center gap-3 group"
                            >
                                {banner.ctaText}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

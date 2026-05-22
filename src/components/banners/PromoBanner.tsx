"use client";

import React, { useState, useEffect, useRef } from "react";
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
    const [direction, setDirection] = useState(0);

    // Auto-advance
    useEffect(() => {
        if (!banners || banners.length <= 1) return;

        let interval: NodeJS.Timeout;
        if (!isPaused) {
            interval = setInterval(() => {
                paginate(1);
            }, 6000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [banners, isPaused, currentIndex]);

    if (!banners || banners.length === 0) return null;

    const banner = banners[currentIndex];

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = banners.length - 1;
            if (nextIndex >= banners.length) nextIndex = 0;
            return nextIndex;
        });
    };

    return (
        <section className="w-full py-4 md:py-6 lg:py-8 bg-[#F7F8FA] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div 
                    className="relative w-full z-10 h-[220px] md:h-[260px] lg:h-[300px]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 }
                            }}
                            drag={banners.length > 1 ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            dragMomentum={false}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                            className="absolute inset-0 w-full h-full bg-[#FBBF24] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-row items-stretch justify-between group"
                        >
                            <div
                                className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />

                            {/* Left Content Area */}
                            <div className="w-[55%] md:w-3/5 p-4 md:p-8 lg:p-12 relative z-20 flex flex-col items-start text-left justify-center select-none">
                                <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A192F]/10 border border-[#0A192F]/15 text-[#0A192F] text-xs font-black uppercase tracking-widest mb-4">
                                    <Sparkles size={14} /> Limited Time Offer
                                </div>

                                <h2 className="text-base md:text-xl lg:text-3xl font-black text-[#0A192F] leading-[1.1] tracking-tight mb-2 uppercase">
                                    {banner.title}
                                </h2>

                                {banner.subtitle && (
                                    <p className="hidden md:block text-[#0A192F]/80 text-sm font-medium leading-relaxed mb-4 max-w-lg">
                                        {banner.subtitle}
                                    </p>
                                )}

                                {banner.offerHighlight && (
                                    <div className="bg-[#0A192F]/10 border border-[#0A192F]/20 rounded-2xl p-3 md:p-4 mb-4 md:mb-6 inline-block shadow-lg">
                                        <span className="block text-sm md:text-lg font-black text-[#0A192F] tracking-tight">
                                            {banner.offerHighlight}
                                        </span>
                                    </div>
                                )}

                                {banner.ctaText && banner.ctaLink && (
                                    <Link
                                        href={banner.ctaLink}
                                        className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-white text-white hover:text-[#0A192F] py-2 md:py-3 px-4 md:px-8 rounded-2xl font-black text-[10px] md:text-base uppercase tracking-widest transition-all duration-300 shadow-xl"
                                    >
                                        {banner.ctaText} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </Link>
                                )}
                            </div>

                            <div className="w-[45%] md:w-2/5 relative z-10 overflow-hidden h-full border-l border-[#0A192F]/10">
                                {banner.imageUrl ? (
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#0A192F]/5 flex items-center justify-center">
                                        <Sparkles size={48} className="text-[#0A192F]/20" />
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
                                onClick={() => {
                                    setDirection(i > currentIndex ? 1 : -1);
                                    setCurrentIndex(i);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-[#0A192F]" : "w-2 bg-[#0A192F]/20 hover:bg-[#0A192F]/40"
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

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroBanner from "./HeroBanner";
import type { Banner } from "@prisma/client";

interface BannerCarouselProps {
    banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide every 6 seconds
    useEffect(() => {
        if (!banners || banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [banners]);

    if (!banners || banners.length === 0) {
        return (
            <div className="w-full h-[60vh] md:h-[80vh] bg-[#0A192F] flex flex-col justify-center items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[#FBBF24]/5" />
                <h1 className="text-4xl md:text-6xl font-black text-center px-4 relative z-10">
                    Welcome to <span className="text-[#FBBF24]">Airlink</span>
                </h1>
            </div>
        );
    }

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    return (
        <div className="relative w-full h-[70vh] md:h-[800px] overflow-hidden group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <HeroBanner banner={banners[currentIndex]} />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows (Visible on Hover) */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-[#FBBF24] text-white hover:text-[#0A192F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 backdrop-blur-sm border border-white/10"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-[#FBBF24] text-white hover:text-[#0A192F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 backdrop-blur-sm border border-white/10"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Pagination Indicators */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex
                                    ? "w-8 bg-[#FBBF24]"
                                    : "w-2 bg-white/30 hover:bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

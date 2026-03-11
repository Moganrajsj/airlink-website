"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, X } from "lucide-react";
import type { Banner } from "@prisma/client";

interface AnnouncementBannerProps {
    banner: Banner;
    onClose?: () => void;
}

export default function AnnouncementBanner({ banner, onClose }: AnnouncementBannerProps) {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!banner || !isVisible) return null;

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-[#FBBF24] text-[#0A192F] relative z-[110] overflow-hidden"
                >
                    <div className="container mx-auto px-4 md:px-6 relative h-10 md:h-12 flex items-center justify-between">
                        {/* Scroll Container for Mobile / Centered for Desktop */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden whitespace-nowrap md:whitespace-normal">
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                className="flex items-center gap-2 text-[11px] md:text-[13px] font-black tracking-widest uppercase"
                            >
                                <Zap size={14} className="fill-[#0A192F] animate-pulse" />

                                {banner.ctaLink ? (
                                    <Link href={banner.ctaLink} className="hover:underline hover:text-white transition-colors duration-300">
                                        <span className="opacity-90">{banner.title}</span>
                                        {banner.subtitle && <span className="hidden md:inline-block ml-2 opacity-75 font-bold"> - {banner.subtitle}</span>}
                                    </Link>
                                ) : (
                                    <>
                                        <span className="opacity-90">{banner.title}</span>
                                        {banner.subtitle && <span className="hidden md:inline-block ml-2 opacity-75 font-bold"> - {banner.subtitle}</span>}
                                    </>
                                )}
                            </motion.div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors shrink-0"
                            aria-label="Close announcement"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

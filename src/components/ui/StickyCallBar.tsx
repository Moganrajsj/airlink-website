"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StickyCallBar() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (!dismissed && window.scrollY > 400) {
                setVisible(true);
            } else if (window.scrollY <= 400) {
                setVisible(false);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [dismissed]);

    const handleDismiss = () => {
        setDismissed(true);
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && !dismissed && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-[200] md:bottom-6 md:left-auto md:right-6 md:max-w-sm"
                >
                    {/* Mobile: full-width bottom bar */}
                    <div
                        className="md:hidden w-full border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3"
                        style={{ background: '#0A192F' }}
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-black text-sm truncate">Airlink Broadband</p>
                            <p className="text-[#FBBF24] text-xs font-bold">Free Installation Available!</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <a
                                href="https://wa.me/919345217979?text=Hi%2C%20I%20want%20to%20book%20a%20free%20Airlink%20fiber%20installation"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-xl"
                                style={{ background: '#25D366' }}
                                aria-label="WhatsApp"
                            >
                                <MessageCircle size={18} className="text-white" />
                            </a>
                            <a
                                href="tel:+919345217979"
                                className="flex items-center gap-1.5 bg-[#FBBF24] text-[#0A192F] font-black text-xs py-2.5 px-4 rounded-xl uppercase tracking-widest"
                            >
                                <Phone size={14} /> Call Now
                            </a>
                            <button onClick={handleDismiss} className="text-gray-500 hover:text-white p-1">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Desktop: floating card */}
                    <div
                        className="hidden md:block rounded-[1.5rem] border border-white/10 p-5 shadow-2xl relative overflow-hidden"
                        style={{ background: '#0A192F' }}
                    >
                        {/* Top accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FBBF24]" />

                        <div className="flex justify-between items-center mb-4 mt-1">
                            <div>
                                <h3 className="text-[18px] font-semibold text-white leading-tight">Airlink Broadband</h3>
                                <span className="text-[12px] text-[#FFD54F] font-bold tracking-widest mt-0.5 block">FREE INSTALLATION AVAILABLE</span>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors flex-shrink-0 self-start"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <p className="text-gray-400 text-xs font-medium leading-relaxed mb-4">
                            Get connected today. Our team installs within 24 hours of booking confirmation.
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <a
                                href="tel:+919345217979"
                                className="flex items-center justify-center gap-2 bg-[#FBBF24] text-[#0A192F] font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all"
                                style={{ boxShadow: '0 6px 16px rgba(251,191,36,0.3)' }}
                            >
                                <Phone size={14} /> Call +91 93452 17979
                            </a>
                            <a
                                href="https://wa.me/919345217979?text=Hi%2C%20I%20want%20to%20book%20a%20free%20Airlink%20fiber%20installation"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all text-white"
                                style={{ background: '#25D366' }}
                            >
                                <MessageCircle size={14} /> WhatsApp Us
                            </a>
                            <Link
                                href="/contact"
                                className="flex items-center justify-center gap-2 border border-white/10 text-gray-300 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:border-[#FBBF24]/40 hover:text-[#FBBF24] transition-all"
                            >
                                Book Online <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

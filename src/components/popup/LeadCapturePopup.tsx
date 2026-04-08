"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, RadioTower } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createLead } from '@/app/actions/leads';
import Aurora from '@/components/animations/Aurora';
import BlurText from '@/components/animations/BlurText';

const INTEREST_OPTIONS = [
    'Home Broadband (Fiber)',
    'Business Internet',
    'Wireless Internet',
    'WiFi Router Setup',
    'CCTV Security',
];

interface FormData {
    name: string;
    mobile: string;
    email: string;
    interest: string;
}

export default function LeadCapturePopup() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Do NOT render or trigger logic if on admin or auth pages
    const hidePopup = pathname.startsWith("/admin") || pathname.startsWith("/auth");
    
    const [mobileError, setMobileError] = useState('');
    const [form, setForm] = useState<FormData>({
        name: '', mobile: '', email: '', interest: INTEREST_OPTIONS[0]
    });
    const hasShownOnce = React.useRef(false);

    useEffect(() => {
        if (hidePopup || success) return;

        let timer: NodeJS.Timeout;

        // 1st popup after 10s, subsequent popups after 30s
        if (!isVisible) {
            const delay = hasShownOnce.current ? 30000 : 10000;
            timer = setTimeout(() => {
                hasShownOnce.current = true;
                setIsVisible(true);
            }, delay);
        }

        return () => clearTimeout(timer);
    }, [isVisible, success]);

    const closePopup = () => {
        // Closes the popup, which triggers the useEffect — next one shows in 30s
        setIsVisible(false);
    };

    const validateMobile = (val: string) => {
        if (!/^[6-9]\d{9}$/.test(val)) {
            setMobileError('Enter a valid 10-digit Indian mobile number.');
            return false;
        }
        setMobileError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateMobile(form.mobile)) return;

        setLoading(true);
        const result = await createLead({
            name: form.name,
            mobile: form.mobile,
            email: form.email || undefined,
            city: "N/A",
            interest: form.interest,
            source: 'popup_lead',
        });
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            sessionStorage.setItem('airlink_popup_success', '1');
            setTimeout(() => {
                setIsVisible(false);
            }, 500);
        }
    };

    if (hidePopup) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Dark Blurred Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="fixed inset-0 z-[2000] bg-[#0A192F]/80 backdrop-blur-sm cursor-pointer"
                    />

                    {/* 3D Container for Flip Animation */}
                    <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4 sm:p-6 pointer-events-none" style={{ perspective: '1200px' }}>
                        <motion.div
                            initial={{ rotateX: -90, opacity: 0, y: 50 }}
                            animate={{ rotateX: 0, opacity: 1, y: 0 }}
                            exit={{ rotateX: 90, opacity: 0, y: -50 }}
                            transition={{ type: "spring", stiffness: 120, damping: 15, mass: 1 }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="w-full max-w-[420px] pointer-events-auto"
                        >
                            <div className="bg-[#FBBF24] relative overflow-hidden rounded-3xl border border-white/30 shadow-[0_30px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(251,191,36,0.3)]">

                                {/* Background Aesthetic Patterns */}
                                <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay">
                                    <Aurora colorStops={["#ffffff", "#FEE12B", "#ffffff"]} speed={0.8} />
                                </div>

                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    suppressHydrationWarning
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors text-[#0A192F]/80 hover:text-[#0A192F] z-50 cursor-pointer"
                                    aria-label="Close"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>

                                {/* Header Area */}
                                <div className="px-6 md:px-8 pt-8 md:pt-10 pb-6 text-center relative z-10">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FEF08A] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-5 border border-white/60 shadow-sm relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                                        <RadioTower className="text-[#0A192F] relative z-10 w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <h2 className="text-xl sm:text-3xl font-black text-[#0A192F] mb-3 tracking-tight">Check Fiber / Wireless <br className="hidden sm:inline" /> Availability</h2>
                                    <p className="text-xs sm:text-sm text-[#0A192F]/80 leading-relaxed max-w-[280px] mx-auto font-medium">
                                        Enter your details to check if high-speed internet is available in your area.
                                    </p>
                                    <div className="mt-3 md:mt-4 flex justify-center">
                                        <div className="bg-green-100/90 border border-green-500/30 text-green-800 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold inline-flex items-center gap-2 shadow-sm">
                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse border border-green-200"></span>
                                            <BlurText text="Free Installation Available ." animateBy="word" delay={200} className="m-0 leading-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Body */}
                                <div className="px-5 md:px-8 pb-6 md:pb-10 relative z-10">
                                    {success ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-6"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex flex-col items-center justify-center mx-auto mb-4 border border-green-500/30">
                                                <div className="w-8 h-8 rounded-full border-2 border-green-700 flex items-center justify-center animate-pulse">
                                                    <div className="w-4 h-4 bg-green-700 rounded-full" />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#0A192F] mb-2">Thank You!</h3>
                                            <p className="text-[#0A192F]/80 text-sm font-medium">We'll check availability and contact you shortly.</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Name *"
                                                    value={form.name}
                                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                                    className="w-full bg-white/50 border border-white/40 focus:border-[#0A192F] focus:bg-white text-[#0A192F] placeholder-[#0A192F]/50 rounded-xl px-5 py-3.5 text-sm outline-none transition-all font-semibold"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="tel"
                                                    required
                                                    maxLength={10}
                                                    placeholder="Mobile Number *"
                                                    value={form.mobile}
                                                    onChange={e => {
                                                        const val = e.target.value.replace(/\D/, '');
                                                        setForm(f => ({ ...f, mobile: val }));
                                                        if (mobileError) setMobileError('');
                                                    }}
                                                    className={`w-full bg-white/50 border ${mobileError ? 'border-red-600' : 'border-white/40 focus:border-[#0A192F] focus:bg-white'} text-[#0A192F] placeholder-[#0A192F]/50 rounded-xl px-5 py-3.5 text-sm outline-none transition-all font-semibold`}
                                                />
                                                {mobileError && <p className="text-red-600 font-bold text-xs mt-1 px-2">{mobileError}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    value={form.email}
                                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                                    className="w-full bg-white/50 border border-white/40 focus:border-[#0A192F] focus:bg-white text-[#0A192F] placeholder-[#0A192F]/50 rounded-xl px-5 py-3.5 text-sm outline-none transition-all font-semibold"
                                                />
                                            </div>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={form.interest}
                                                    onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                                                    className="w-full bg-white/50 border border-white/40 focus:border-[#0A192F] focus:bg-white text-[#0A192F] rounded-xl px-5 py-3.5 text-sm outline-none transition-all appearance-none font-semibold"
                                                >
                                                    {INTEREST_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt} className="bg-white text-[#0A192F]">
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-[#0A192F]">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                </div>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!form.name.trim() || !form.mobile || loading}
                                                suppressHydrationWarning
                                                className="w-full mt-4 py-4 rounded-xl bg-[#0A192F] hover:bg-black text-white font-black text-[13px] uppercase tracking-widest transition-all disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-2 group shadow-[0_10px_20px_rgba(10,25,47,0.2)] hover:shadow-[0_10px_25px_rgba(10,25,47,0.3)] hover:-translate-y-0.5"
                                            >
                                                {loading ? 'Processing...' : 'Check Availability'}
                                                {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform stroke-[2.5px]" />}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

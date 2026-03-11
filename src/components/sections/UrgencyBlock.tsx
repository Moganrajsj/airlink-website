"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, Clock, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';

const urgencyOffers = [
    {
        icon: <Gift size={28} />,
        headline: "Free Installation",
        subline: "Exclusive Digital Offer",
        desc: "₹0 installation charges for all new fiber connections booked online this week.",
        image: "/images/offers/free_installation_bg.png",
        badge: "HOT OFFER",
    },
    {
        icon: <Zap size={28} />,
        headline: "Same-Day Activation",
        subline: "Express Provisioning",
        desc: "Get connected within 4-6 hours in supported zones like Salem and Dharmapuri.",
        image: "/images/offers/fast_activation_bg.png",
        badge: "EXPRESS",
    },
    {
        icon: <Clock size={28} />,
        headline: "Premium Home Wi-Fi",
        subline: "Ultra-Fast Coverage",
        desc: "Experience seamless connectivity in every corner with our dual-band mesh-ready routers.",
        image: "/images/offers/premium_wifi_bg.png",
        badge: "GIGA READY",
    },
    {
        icon: <ShieldCheck size={28} />,
        headline: "24/7 Priority Support",
        subline: "Enterprise Grade",
        desc: "Dedicated support team ensuring 99.99% uptime for your domestic and business needs.",
        image: "/images/offers/priority_support_bg.png",
        badge: "24/7 NOC",
    },
];

const plans = [
    { speed: "100", price: 799, perDay: 27, tag: "Essential", popular: false },
    { speed: "200", price: 899, perDay: 30, tag: "Most Popular", popular: true },
    { speed: "300", price: 999, perDay: 33, tag: "Elite Performance", popular: false },
];

export default function UrgencyBlock() {
    return (
        <section className="py-32 bg-white relative overflow-hidden" id="offers">
            {/* Background elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/30 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#0A192F] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
                    >
                        🔥 Switch to Airlink Today
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-[#0A192F] tracking-tighter mb-6"
                    >
                        Switch Today. <span className="text-[#FBBF24]">Thank Yourself Tomorrow.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#0A192F]/50 text-xl max-w-2xl mx-auto font-medium"
                    >
                        Join the high-speed revolution in Tamil Nadu. Experience internet that actually keeps up with your life.
                    </motion.p>
                </div>

                {/* Imagery Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {urgencyOffers.map((offer, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative h-[450px] rounded-[3rem] overflow-hidden group border border-gray-100 shadow-xl"
                        >
                            {/* Background Image or Static Color */}
                            {offer.image ? (
                                <img
                                    src={offer.image}
                                    className="cursor-target absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={offer.headline}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-[#0A192F]" />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                <div className="mb-4">
                                    <span className="bg-[#FBBF24] text-[#0A192F] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                                        {offer.badge}
                                    </span>
                                </div>

                                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 text-[#FBBF24]">
                                    {offer.icon}
                                </div>

                                <h3 className="text-2xl font-black text-white mb-2 leading-tight uppercase tracking-tighter">
                                    {offer.headline}
                                </h3>
                                <p className="text-[#FBBF24] font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                    {offer.subline}
                                </p>
                                <p className="text-white/60 text-sm font-medium leading-relaxed">
                                    {offer.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Per-day pricing block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0A192F] rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl text-white"
                >
                    {/* Background blob */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FBBF24]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />

                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="lg:w-2/5 text-left">
                            <div className="inline-block bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-5 py-2 rounded-full mb-8">
                                <p className="text-[#FBBF24] text-[10px] font-black uppercase tracking-[0.3em]">Pricing That Makes Sense</p>
                            </div>
                            <h3 className="text-5xl md:text-6xl font-black mb-8 leading-[1.05] tracking-tighter uppercase transition-all duration-500">
                                Less Than Your <br />
                                Daily <span className="text-[#FBBF24]">Morning Coffee.</span>
                            </h3>
                            <p className="text-white/50 font-medium text-lg leading-relaxed">
                                Airlink fiber is more affordable than you think. Break it down — you're looking at just a few rupees per day for enterprise-grade connectivity.
                            </p>
                        </div>

                        <div className="lg:w-3/5 grid sm:grid-cols-3 gap-6 w-full">
                            {plans.map((plan, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -8 }}
                                    className={`relative rounded-[2.5rem] p-8 border transition-all duration-300 flex flex-col items-center ${plan.popular
                                        ? 'bg-[#FBBF24] border-[#FBBF24] text-[#0A192F] scale-105 shadow-[0_20px_40px_rgba(251,191,36,0.2)]'
                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0A192F] text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="text-5xl font-black mb-1 group-hover:scale-110 transition-transform tracking-tight">
                                        {plan.speed}
                                    </div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-8 ${plan.popular ? 'text-[#0A192F]/60' : 'text-white/40'}`}>Mbps Fiber</p>

                                    <div className="flex flex-col items-center mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-bold uppercase tracking-widest opacity-50">Only</span>
                                            <span className="text-5xl font-black tracking-tighter">₹{plan.perDay}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50">per day</span>
                                    </div>

                                    <Link
                                        href="/plans"
                                        className={`cursor-target w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all text-center ${plan.popular
                                            ? 'bg-[#0A192F] text-white shadow-xl'
                                            : 'bg-[#FBBF24] text-[#0A192F]'
                                            }`}
                                    >
                                        Book Now
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Final CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
                    <Link
                        href="/contact"
                        className="cursor-target group w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-[#FBBF24] text-[#0A192F] font-black py-6 px-12 rounded-[2rem] text-lg uppercase tracking-widest hover:translate-y-[-4px] transition-all duration-500 shadow-[0_20px_40px_rgba(251,191,36,0.3)]"
                    >
                        Book Free Installation <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <a
                        href="tel:+919345217979"
                        className="cursor-target w-full sm:w-auto inline-flex items-center justify-center gap-4 border-2 border-[#0A192F]/10 text-[#0A192F] font-black py-6 px-12 rounded-[2rem] text-lg uppercase tracking-widest hover:border-[#FBBF24]/50 hover:text-[#FBBF24] transition-all duration-500 bg-white"
                    >
                        <Phone size={20} /> +91 93452 17979
                    </a>
                </div>
            </div>
        </section>
    );
}

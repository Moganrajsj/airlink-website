"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Zap, ShieldCheck } from 'lucide-react';
import CountUp from '../animations/CountUp';

interface Stat {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    sublabel: string;
    color: string;
}

const stats: Stat[] = [
    {
        icon: <Users size={28} />,
        value: 10000,
        suffix: '+',
        label: 'Happy Customers',
        sublabel: 'Homes & businesses connected',
        color: '#FBBF24',
    },
    {
        icon: <MapPin size={28} />,
        value: 50,
        suffix: '+',
        label: 'Service Areas',
        sublabel: 'Across Tamil Nadu & South India',
        color: '#FBBF24', // Unified to brand yellow
    },
    {
        icon: <Zap size={28} />,
        value: 1,
        suffix: 'Gbps',
        label: 'Max Speed',
        sublabel: 'Symmetrical fiber bandwidth',
        color: '#FBBF24', // Unified to brand yellow
    },
    {
        icon: <ShieldCheck size={28} />,
        value: 99.99,
        suffix: '%',
        label: 'Reliability',
        sublabel: 'Uptime SLA guaranteed',
        color: '#FBBF24', // Unified to brand yellow
    },
];

const TrustStats = () => {
    return (
        <section className="py-12 md:py-32 bg-white relative overflow-hidden" id="trust">
            {/* Decorative shapes - Unified to Navy/Yellow shadow */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-[#FBBF24]/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0A192F]/05 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-10 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#0A192F] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6"
                    >
                        Our Track Record
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-7xl font-black text-[#0A192F] tracking-tighter"
                    >
                        Numbers That <span className="text-[#FBBF24]">Speak.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-[#0A192F]/50 mt-4 md:mt-6 max-w-2xl mx-auto text-lg md:text-xl font-medium"
                    >
                        15+ years of powering Tamil Nadu's most demanding homes and businesses with rock-solid fiber infrastructure.
                    </motion.p>
                </div>

                {/* Stat cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-[0_8px_32px_rgba(10,25,47,0.04)] group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#FBBF24]/30"
                        >
                            {/* Icon */}
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 bg-secondary/05 text-[#0A192F] group-hover:bg-[#FBBF24] group-hover:text-[#0A192F] group-hover:shadow-[0_8px_20px_rgba(251,191,36,0.2)]"
                            >
                                {stat.icon}
                            </div>

                            {/* Animated number */}
                            <div className="text-3xl md:text-5xl font-black mb-3 leading-none tracking-tighter text-[#0A192F]">
                                <CountUp
                                    to={stat.value}
                                    decimals={stat.value < 10 ? 2 : 0}
                                    duration={2.5}
                                    className="tabular-nums"
                                    separator=","
                                />
                                {stat.suffix}
                            </div>

                            <h3 className="text-[#0A192F] font-black text-xl mb-2 uppercase tracking-tight">{stat.label}</h3>
                            <p className="text-[#0A192F]/40 text-sm font-medium leading-relaxed">{stat.sublabel}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustStats;

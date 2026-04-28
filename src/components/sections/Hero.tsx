"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DynamicBackground from '@/components/animations/DynamicBackground';
import BlurText from '@/components/animations/BlurText';
import Magnet from '@/components/animations/Magnet';

const words = ["Homes", "Business", "Enterprises", "Gamers", "Creators"];

const WordCycle = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <span className="relative inline-block min-w-[3ch] text-[#FBBF24]">
            <AnimatePresence mode="wait">
                <motion.span
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="inline-block"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};



export default function Hero() {
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const itemUp: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="relative min-h-[75vh] lg:min-h-[85vh] flex items-center hero-section-offset overflow-hidden bg-black">
            {/* ── Cinematic Background ── */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-70 mix-blend-luminosity brightness-90">
                    <Image
                        src="/images/home_hero_new.webp"
                        alt="High-speed fiber internet infrastructure showcasing modern connectivity for homes and businesses"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-40" />

                {/* Advanced Accents */}
                <DynamicBackground layers={["grid", "particles", "beams"]} opacity={0.4} />

                {/* Mesh Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FBBF24]/10 blur-[140px] rounded-full pointer-events-none" />
            </div>

            <div className="container mx-auto px-6 relative z-10 py-12 lg:py-16">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    {/* ── Content Column (Left) ── */}
                    <motion.div
                        className="lg:col-span-8 text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Title */}
                        <div className="mb-8">
                            <motion.div variants={itemUp}>
                                <BlurText
                                    text="FUTURE-READY"
                                    delay={150}
                                    animateBy="character"
                                    className="font-black text-white tracking-tighter leading-[0.9] uppercase"
                                // Use style directly for clamp to ensure it's applied correctly to the container
                                />
                            </motion.div>
                            <motion.h1
                                variants={itemUp}
                                className="font-black tracking-tighter leading-[0.9] uppercase flex items-center flex-wrap"
                                style={{ fontSize: 'clamp(3.5rem, 8.5vw, 8.5rem)' }}
                            >
                                <span className="text-white/70 mr-0 sm:mr-4">FIBER FOR</span> <WordCycle />
                            </motion.h1>
                        </div>

                        {/* Description */}
                        <motion.p
                            variants={itemUp}
                            className="text-white/50 text-xl md:text-2xl font-medium max-w-2xl mb-12 leading-relaxed"
                        >
                            Experience lightning-fast fiber internet with reliable connectivity. <br className="hidden md:block" />
                            Delivering high-speed broadband across Tamil Nadu with consistent performance.
                        </motion.p>

                        {/* Call to Actions */}
                        <motion.div variants={itemUp} className="flex flex-col sm:flex-row gap-6 items-center mb-16">
                            <Magnet padding={30} magnetStrength={0.3}>
                                <Link
                                    href="/coverage"
                                    className="group w-full sm:w-auto bg-[#FBBF24] text-[#0A192F] font-black py-6 px-12 rounded-3xl text-lg uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-[0_20px_40px_rgba(251,191,36,0.3)] flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Check Availability <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                </Link>
                            </Magnet>

                            <Link
                                href="/plans"
                                className="group w-full sm:w-auto border-2 border-white/10 text-white font-black py-6 px-12 rounded-3xl text-lg uppercase tracking-widest hover:bg-white hover:text-[#0A192F] transition-all duration-300 flex items-center justify-center gap-3 bg-white/05 backdrop-blur-md"
                            >
                                Explore Plans <Play size={20} className="fill-current" />
                            </Link>
                        </motion.div>


                    </motion.div>

                    {/* ── Visual Column (Right) ── */}
                    <div className="lg:col-span-4 relative h-full min-h-[500px] hidden lg:block">

                        {/* Centered Decorative Aura */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FBBF24]/05 blur-[120px] rounded-full animate-pulse" />
                    </div>

                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    );
}

"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function PlansHero() {
    return (
        <section className="relative pt-40 pb-20 overflow-hidden bg-white">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[70%] h-[80%] bg-primary rounded-full blur-[150px]"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight text-secondary">
                        Best Broadband Plans in <br />
                        <span className="text-primary">Dharmapuri & Chennai.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-secondary/70 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
                        Airlink Broadband offers high-speed fiber internet plans in Dharmapuri and Chennai with truly unlimited data, free dual-band WiFi router, and premium OTT subscriptions. Whether you need reliable broadband for home streaming or enterprise-grade leased line connectivity for business, we deliver unmatched speed and performance backed by Tier-3 infrastructure and 24/7 network monitoring.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

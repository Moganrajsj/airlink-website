"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function PlansHero() {
    return (
        <section className="relative pt-48 pb-40 min-h-[70vh] flex items-center overflow-hidden bg-[#0A192F]">
            <div className="absolute inset-0 bg-[url('/images/plans_hero_brand.png')] bg-cover bg-fixed bg-center opacity-100"></div>

            <div className="container mx-auto px-6 relative z-10 pt-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight text-white">
                        Best Broadband Plans in <br />
                        <span className="text-[#FBBF24]">Dharmapuri & Chennai.</span>
                    </h1>
                    
                </motion.div>
            </div>
        </section>
    );
}

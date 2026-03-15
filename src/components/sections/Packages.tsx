"use client";

import React from 'react';
import { motion } from 'framer-motion';
import PackageCard from '../ui/PackageCard';
import Squares from '../animations/Squares';
import { packages as fallbackPackages } from '@/data/packages';

interface Plan {
    id: string;
    title: string;
    speed: number;
    price: number;
    features: string;
    tag: string | null;
    isBusiness: boolean;
}

const TARGET_PRICES = [799, 899, 1299];

const Packages = ({ plans }: { plans?: Plan[] }) => {
    const displayPlans = TARGET_PRICES.map(price => {
        // Try to find it in the DB
        const dbPlan = plans?.find(p => p.price === price);
        if (dbPlan) return dbPlan;

        // Try to find it in fallbackPackages
        const fallbackPlan = fallbackPackages.find(p => p.price === price);
        if (fallbackPlan) {
            return {
                id: fallbackPlan.id,
                title: "Airlink " + fallbackPlan.speed + " Mbps",
                speed: parseInt(fallbackPlan.speed),
                price: fallbackPlan.price,
                features: JSON.stringify({
                    benefits: fallbackPlan.benefits,
                    ottApps: fallbackPlan.ottApps,
                    isPopular: fallbackPlan.isPopular,
                    isPremium: fallbackPlan.isPremium,
                    bestFor: fallbackPlan.bestFor,
                    positioningLine: fallbackPlan.positioningLine,
                }),
                tag: fallbackPlan.isPopular ? "Most Popular" : null,
                isBusiness: fallbackPlan.isPremium || false
            } as Plan;
        }

        return null;
    }).filter(Boolean) as Plan[];

    return (
        <section className="py-32 relative overflow-hidden" id="packages" style={{ background: '#0A192F' }}>
            {/* Squares animated background */}
            <div className="absolute inset-0 z-0">
                <Squares
                    speed={0.4}
                    squareSize={40}
                    direction="diagonal"
                    borderColor="#1a2e4a"
                    hoverFillColor="#152032"
                />
            </div>

            {/* Soft vignette overlay */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,25,47,0.85) 100%)',
                }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-[#FBBF24]/10 text-[#FBBF24] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-[#FBBF24]/20"
                    >
                        Best Value Guaranteed
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-white mb-8 tracking-[-0.04em]"
                    >
                        Extreme Speed. <br />
                        <span className="text-[#FBBF24]">Unbeatable Value.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl mx-auto font-medium text-xl"
                    >
                        Choose the perfect fiber package for your needs. Blazing fast speeds with premium infrastructure and 24/7 support.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {displayPlans.map((plan, index) => {
                        let features: {
                            ottApps?: string[];
                            benefits?: string[];
                            isPopular?: boolean;
                            isPremium?: boolean;
                            bestFor?: string;
                            positioningLine?: string;
                        } = {};
                        try { features = JSON.parse(plan.features); } catch { features = {}; }

                        const isPopularFlag = plan.tag === "Most Popular" || features.isPopular;
                        const isPremiumFlag = plan.isBusiness || features.isPremium;

                        // Improved benefits extraction
                        let benefitsList: string[] = [];
                        if (Array.isArray(features.benefits) && features.benefits.length > 0) {
                            benefitsList = features.benefits;
                        } else {
                            // Only split if it doesn't look like JSON
                            const raw = plan.features || "";
                            if (!raw.trim().startsWith('{')) {
                                benefitsList = raw.split(',').map((f: string) => f.trim()).filter(Boolean);
                            }
                        }
                        
                        // Default fallback
                        if (benefitsList.length === 0) {
                            benefitsList = [
                                "Symmetrical Unlimited Data",
                                "Free Router Included",
                                "Zero Installation Cost"
                            ];
                        }

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="h-full"
                            >
                                <PackageCard
                                    speed={plan.speed.toString()}
                                    price={plan.price}
                                    name={plan.title}
                                    isPopular={isPopularFlag}
                                    isPremium={isPremiumFlag}
                                    ottApps={features.ottApps}
                                    benefits={benefitsList}
                                    bestFor={features.bestFor || (plan.isBusiness ? "Business Standard" : "Home Fiber")}
                                    positioningLine={features.positioningLine || (plan.isBusiness ? "Dedicated enterprise-grade bandwidth." : "High-speed residential fiber connectivity.")}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-14"
                >
                    <a
                        href="/plans"
                        className="inline-flex items-center gap-2 bg-transparent border border-[#FBBF24]/30 text-[#FBBF24] hover:bg-[#FBBF24] hover:text-[#0A192F] px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 group"
                    >
                        View All Plans
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="transition-transform duration-200 group-hover:translate-x-1">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Packages;

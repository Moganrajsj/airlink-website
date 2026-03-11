"use client";
import React from 'react';
import PackageCard from '../ui/PackageCard';

interface DbPlan {
    id: string;
    title: string;
    speed: number;
    price: number;
    features: string;
    tag: string | null;
    isBusiness: boolean;
    status: boolean;
}

function parseFeatures(raw: string) {
    try { return JSON.parse(raw); } catch { return {}; }
}

export default function ResidentialPlans({ plans }: { plans: DbPlan[] }) {
    const activePlans = plans.filter(p => p.status && !p.isBusiness);

    return (
        <section className="py-12 bg-surface">
            <div className="container mx-auto px-6 max-w-[1400px]">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black text-secondary tracking-tight mb-4">Unlimited Fiber Broadband Plans for Homes</h2>
                    <p className="text-secondary/70 font-medium leading-relaxed">
                        Airlink provides affordable high-speed broadband plans starting from 40 Mbps up to 500 Mbps. Our home fiber internet is ideal for streaming, online gaming, work-from-home, and smart home devices. Every plan includes unlimited data and selected OTT entertainment platforms like Amazon Prime, Jio Hotstar, Sun NXT, Zee5, Sony Liv, and more.
                        If you are searching for the best broadband connection in Dharmapuri or Chennai, Airlink delivers stable, low-latency, and high-performance fiber connectivity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activePlans.map((plan) => {
                        const f = parseFeatures(plan.features);
                        return (
                            <div key={plan.id}>
                                <PackageCard
                                    speed={String(plan.speed)}
                                    price={plan.price}
                                    name={plan.title}
                                    isPopular={f.isPopular}
                                    isPremium={f.isPremium}
                                    ottApps={f.ottApps}
                                    bonus={f.bestFor}
                                    benefits={f.benefits}
                                    bestFor={f.bestFor}
                                    positioningLine={f.positioningLine}
                                    support={f.support}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

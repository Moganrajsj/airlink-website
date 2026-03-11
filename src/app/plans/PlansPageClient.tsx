"use client";

import React, { useState } from 'react';
import PlansHero from '@/components/plans/PlansHero';
import PlanToggle from '@/components/plans/PlanToggle';
import ResidentialPlans from '@/components/plans/ResidentialPlans';
import OTTPlansBanner from '@/components/plans/OTTPlansBanner';
import BusinessPlans from '@/components/plans/BusinessPlans';
import ComparisonTable from '@/components/plans/ComparisonTable';
import FAQSection from '@/components/plans/FAQSection';
import CTASection from '@/components/plans/CTASection';

interface DbPlan {
    id: string;
    title: string;
    speed: number;
    price: number;
    features: string;
    tag: string | null;
    isBusiness: boolean;
    status: boolean;
    createdAt: Date;
}

export default function PlansPageClient({ plans, businessPlans }: { plans: DbPlan[]; businessPlans: DbPlan[] }) {
    const [activeTab, setActiveTab] = useState<'home' | 'business'>('home');

    return (
        <div className="min-h-screen bg-surface text-dark font-inter">
            <PlansHero />
            <PlanToggle activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'home' ? (
                <>
                    <OTTPlansBanner />
                    <ResidentialPlans plans={plans} />
                    <ComparisonTable />
                </>
            ) : (
                <BusinessPlans />
            )}

            <FAQSection />
            <CTASection />
        </div>
    );
}

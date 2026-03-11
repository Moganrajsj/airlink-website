"use client";
import React from 'react';
import { Building2, Home } from 'lucide-react';

interface PlanToggleProps {
    activeTab: 'home' | 'business';
    setActiveTab: (tab: 'home' | 'business') => void;
}

export default function PlanToggle({ activeTab, setActiveTab }: PlanToggleProps) {
    return (
        <div className="flex items-center justify-center bg-white pb-6 relative z-20">
            <div className="bg-secondary/5 p-1.5 rounded-full inline-flex relative shadow-inner">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`relative z-10 flex items-center gap-2 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all ${activeTab === 'home' ? 'bg-white text-secondary shadow-md' : 'text-secondary/50 hover:text-secondary'}`}
                >
                    <Home size={18} /> Home Plans
                </button>
                <button
                    onClick={() => setActiveTab('business')}
                    className={`relative z-10 flex items-center gap-2 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all ${activeTab === 'business' ? 'bg-white text-secondary shadow-md' : 'text-secondary/50 hover:text-secondary'}`}
                >
                    <Building2 size={18} /> Business Plans
                </button>
            </div>
        </div>
    );
}

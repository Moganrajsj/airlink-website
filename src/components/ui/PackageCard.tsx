"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Tv, Gift } from 'lucide-react';
import OTTIcon from './OTTIcon';

interface PackageCardProps {
    speed: string;
    price: string | number;
    name: string;
    isPopular?: boolean;
    isPremium?: boolean;
    bgImage?: string;
    ottApps?: string[];
    bonus?: string;
    benefits?: string[];
    support?: string;
    bestFor?: string;
    positioningLine?: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
    speed,
    price,
    name,
    isPopular,
    isPremium,
    bgImage,
    ottApps,
    benefits = [],
    support = "24/7 Priority Support",
    bestFor = "Fast Fiber",
    positioningLine = "Enterprise-grade connectivity for your home."
}) => {

    const [showAllOTT, setShowAllOTT] = React.useState(false);

    // isHighlight = popular or premium — gets full yellow treatment
    const isHighlight = isPopular || isPremium;

    const defaultBenefits = [
        "Symmetrical Unlimited Data",
        "Free Router Included",
        "Zero Installation Cost"
    ];

    const displayBenefits = benefits && benefits.length > 0 ? benefits.slice(0, 3) : defaultBenefits;

    return (
        <>
            <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`cursor-target rounded-3xl flex flex-col h-full relative overflow-hidden group border transition-all duration-300 ${isHighlight
                    ? 'border-[#FBBF24] shadow-[0_8px_40px_rgba(251,191,36,0.35)] hover:shadow-[0_16px_60px_rgba(251,191,36,0.5)]'
                    : 'border-white/10 shadow-md hover:shadow-xl text-white'
                    }`}
            >
                {/* ── Annual Offer Banner (all cards) ── */}
                <div className={`relative z-10 flex items-center justify-center gap-2 py-2 px-4 text-[10px] whitespace-nowrap font-black uppercase tracking-[0.18em] rounded-t-3xl ${isHighlight
                    ? 'bg-[#0A192F] text-[#FBBF24]'
                    : 'bg-[#FBBF24]/15 text-[#FBBF24] border-b border-[#FBBF24]/20'
                    }`}>
                    <Gift size={12} className="shrink-0" />
                    1 Month FREE if paid annually
                </div>

                {/* Animated Golden Shine Border for Premium Card */}
                {isPremium && (
                    <div className="absolute inset-[-4px] z-0 rounded-3xl bg-[conic-gradient(from_0deg,transparent_0_340deg,#F59E0B_360deg)] animate-[spin_3s_linear_infinite] opacity-100 mix-blend-screen pointer-events-none" />
                )}

                {/* Card body */}
                <div className="p-6 lg:p-8 flex flex-col flex-1 relative z-10 bg-[#0A192F] rounded-b-3xl">
                    {/* Background */}
                    {bgImage ? (
                        <>
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 z-0"
                                style={{ backgroundImage: `url(${bgImage})` }}
                            />
                            <div className={`absolute inset-0 z-0 ${isHighlight
                                ? 'bg-gradient-to-t from-[#FBBF24] via-[#F59E0B]/90 to-[#FCD34D]/80'
                                : 'bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/70'}`} />
                        </>
                    ) : (
                        <div className={`absolute inset-0 z-0 ${isHighlight ? 'bg-[#FBBF24]' : 'bg-gray-900'}`} />
                    )}

                    {/* Glow blob */}
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20 z-0 transition-opacity duration-300 group-hover:opacity-40 pointer-events-none ${isHighlight ? 'bg-white' : 'bg-[#FBBF24]'}`} />

                    {/* Popular / Premium badge */}
                    {isPopular && (
                        <div className="absolute top-0 right-0 bg-[#0A192F] text-[#FBBF24] font-black text-[9px] uppercase tracking-widest py-1.5 px-4 rounded-bl-xl shadow-sm z-10">
                            Most Popular
                        </div>
                    )}
                    {isPremium && !isPopular && (
                        <div className="absolute top-0 right-0 bg-[#0A192F] text-[#FBBF24] font-black text-[9px] uppercase tracking-widest py-1.5 px-4 rounded-bl-xl shadow-sm z-10">
                            Premium
                        </div>
                    )}

                    {/* Header: speed + price */}
                    <div className="flex justify-between items-start mb-6 w-full relative z-10">
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block ${isHighlight
                                ? 'bg-[#0A192F]/15 text-[#0A192F]'
                                : 'bg-[#FBBF24] text-[#0A192F]'
                                }`}>
                                {name}
                            </span>
                            <div className="flex items-end gap-1">
                                <span className={`text-5xl lg:text-6xl font-black tracking-tighter leading-none ${isHighlight ? 'text-[#0A192F]' : 'text-white'}`}>{speed}</span>
                                <span className={`text-base font-bold mb-1 ${isHighlight ? 'text-[#0A192F]' : 'text-[#FBBF24]'}`}>Mbps</span>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end pt-1">
                            <span className={`text-3xl font-black tracking-tight ${isHighlight ? 'text-[#0A192F]' : 'text-white'}`}>₹{price}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isHighlight ? 'text-[#0A192F]/60' : 'text-white/60'}`}>/ Month</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className={`w-full h-px mb-6 relative z-10 ${isHighlight ? 'bg-[#0A192F]/20' : 'bg-white/20'}`} />

                    <div className="flex-grow flex flex-col relative z-10">
                        {/* OTT Apps */}
                        {ottApps && ottApps.length > 0 && (
                            <div className="mb-6">
                                <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isHighlight ? 'text-[#0A192F]/70' : 'text-white/70'}`}>
                                    Entertainment Included
                                </p>
                                <div className="flex items-center -space-x-3 group-hover:-space-x-1 transition-all duration-300">
                                    {ottApps.slice(0, 5).map((app, idx) => (
                                        <div key={idx} className="rounded-full border-2 overflow-hidden shadow-md w-10 h-10 flex-shrink-0 bg-white relative border-white" style={{ zIndex: 50 - idx }}>
                                            <OTTIcon name={app} className="w-full h-full rounded-none" />
                                        </div>
                                    ))}
                                    {ottApps.length > 5 && (
                                        <button
                                            onClick={() => setShowAllOTT(true)}
                                            className={`cursor-target w-10 h-10 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors shadow-sm relative z-0 border-white cursor-pointer ${isHighlight
                                                ? 'bg-[#0A192F] hover:bg-[#0A192F]/80 text-[#FBBF24]'
                                                : 'bg-[#FBBF24] hover:bg-white text-[#0A192F]'
                                                }`}
                                        >
                                            <span className="text-[10px] font-black">+{ottApps.length - 5}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="mb-8">
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isHighlight ? 'text-[#0A192F]/70' : 'text-white/70'}`}>
                                Top Benefits
                            </p>
                            <ul className="space-y-3">
                                {displayBenefits.map((benefit, i) => (
                                    <li key={i} className={`flex items-start gap-3 text-sm font-medium ${isHighlight ? 'text-[#0A192F]/90' : 'text-white/90'}`}>
                                        <Check size={18} className={`shrink-0 mt-0.5 ${isHighlight ? 'text-[#0A192F]' : 'text-[#FBBF24]'}`} />
                                        <span className="leading-snug">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="relative z-10 mt-auto">
                        <a
                            href="/plans#booking"
                            className={`cursor-target w-full py-4 block rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 text-center shadow-lg relative overflow-hidden group/btn ${isHighlight
                                ? 'bg-[#0A192F] text-white hover:bg-[#0A192F]/80'
                                : 'bg-[#FBBF24] text-[#0A192F] hover:bg-white'
                                }`}
                        >
                            <span className="relative z-10">Select Plan</span>
                            <div className={`absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out ${isHighlight ? 'bg-white/10' : 'bg-white/80'}`} />
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* OTT Expansion Modal */}
            <AnimatePresence>
                {showAllOTT && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden border border-white/20"
                        >
                            <button
                                onClick={() => setShowAllOTT(false)}
                                className="cursor-target absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#0A192F]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-[#0A192F] mb-2 tracking-tight">Included Entertainment</h3>
                                <p className="text-sm font-semibold text-[#0A192F]/40 uppercase tracking-widest">Premium OTT Subscriptions for {speed}Mbps Plan</p>
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                                {ottApps?.map((app, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm p-1.5 flex items-center justify-center hover:scale-110 transition-transform hover:shadow-md">
                                            <OTTIcon name={app} className="w-full h-full" />
                                        </div>
                                        <span className="text-[8px] font-black text-[#0A192F]/60 uppercase tracking-tighter text-center leading-none">{app}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-[#0A192F]">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24]">
                                        <Tv size={16} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">{ottApps?.length} Premium Apps</span>
                                </div>
                                <button
                                    onClick={() => setShowAllOTT(false)}
                                    className="cursor-target px-6 py-2.5 bg-[#0A192F] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all"
                                >
                                    Close View
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PackageCard;

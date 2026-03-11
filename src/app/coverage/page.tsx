"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    CheckCircle2,
    AlertCircle,
    Search,
    ArrowRight,
    Navigation,
    Globe,
    Map,
    User,
    Phone
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FiberGlobe from '@/components/three/FiberGlobe';
import { createLead } from '@/app/actions/leads';

const CoveragePage = () => {
    // Multi-step Checker State
    const [step, setStep] = useState<'search' | 'info' | 'success'>('search');
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (location.trim()) {
            setStep('info');
        }
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createLead({
            name,
            phone,
            city: location,
            message: `Availability check for: ${location}`
        });

        if (result.success) {
            setStep('success');
        } else {
            alert("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    const currentAreas = [
        { district: "Dharmapuri", desc: "100% Core coverage. FTTH & Enterprise leased lines active across all major zones.", icon: <Globe size={32} /> },
        { district: "Chennai", desc: "High-density fiber ring active in major IT corridors, OMR, and industrial tech parks.", icon: <Building2 size={32} /> }
    ];

    const upcomingAreas = [
        "Hosur Tech Park", "Krishnagiri Industrial", "Salem SIPCOT"
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white font-inter overflow-hidden">
            {/* 1. 3D Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 border-b border-white/5">
                {/* 3D Canvas Background */}
                <div className="absolute inset-0 z-0 opacity-60">
                    <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={2} color="#FBBF24" />
                        <FiberGlobe />
                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>
                </div>

                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] z-10 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 mb-8 backdrop-blur-md">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FBBF24]"></span>
                                </span>
                                <span className="text-[10px] uppercase font-black tracking-[0.2em] leading-none mt-0.5">Live Network Status</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.05]">
                                Connecting the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] to-yellow-200">State at Light Speed.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-medium leading-relaxed mb-12">
                                Our robust, dark-fiber backbone is actively expanding across Tamil Nadu, delivering zero-latency enterprise connectivity.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a href="#checker" className="px-8 py-5 bg-[#FBBF24] text-[#0A192F] hover:bg-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-3">
                                    <MapPin size={18} /> Check Your Area
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Coverage Areas List - Premium Glassmorphism */}
            <section className="py-24 relative z-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Active Deployment Zones</h2>
                        <p className="text-gray-400 text-lg">Direct peering and gigabit distribution active in the following regions.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                        {currentAreas.map((area, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/[0.02] backdrop-blur-xl p-10 rounded-[2rem] border border-white/5 hover:border-[#FBBF24]/30 hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="text-gray-500 group-hover:text-[#FBBF24] transition-colors mb-8">
                                    {area.icon}
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">{area.district}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">{area.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-[#FBBF24]/10 to-transparent p-12 rounded-[2rem] border border-[#FBBF24]/20 relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-[#FBBF24]/20 rounded-full blur-[80px]"></div>
                        <h3 className="text-2xl font-black text-[#FBBF24] mb-8 relative z-10 flex items-center gap-4">
                            <TrendingUpIcon /> Future Expansion Corridors
                        </h3>
                        <div className="flex flex-wrap gap-4 relative z-10">
                            {upcomingAreas.map((city, idx) => (
                                <span key={idx} className="px-6 py-3 bg-[#020617] border border-white/10 rounded-full text-white text-sm font-bold tracking-wider hover:border-[#FBBF24] transition-colors cursor-default">
                                    {city}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Robust Feasibility Checker (Multi-Step Lead Gen) */}
            <section className="py-24 relative z-20 border-t border-white/5" id="checker">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/[0.02] backdrop-blur-xl rounded-[3rem] p-10 md:p-20 border border-white/10 relative overflow-hidden max-w-5xl mx-auto shadow-2xl"
                    >
                        {/* Subtle glow */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[50%] bg-[#FBBF24]/10 blur-[120px] rounded-full pointer-events-none" />

                        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                            <div className="lg:w-1/2 text-left">
                                <span className="text-[#FBBF24] font-black text-[10px] tracking-[0.3em] uppercase mb-6 block">Check Connectivity</span>
                                <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                                    Run a Real-Time <br />Feasibility Check.
                                </h2>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed">
                                    Enter your specific pincode or area name. Our technical team will map your coordinates against our active OLTs to confirm direct fiber availability.
                                </p>
                            </div>

                            <div className="lg:w-1/2 w-full">
                                <AnimatePresence mode="wait">
                                    {step === 'search' && (
                                        <motion.div
                                            key="search"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="bg-[#020617] p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group"
                                        >
                                            <form onSubmit={handleSearch} className="space-y-8 relative z-10">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2 block">Area or Pincode</label>
                                                    <div className="relative">
                                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FBBF24]">
                                                            <Search size={22} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 600001 or Anna Nagar"
                                                            value={location}
                                                            onChange={(e) => setLocation(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white text-lg font-bold outline-none focus:border-[#FBBF24] focus:bg-white/10 transition-all placeholder-white/20"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <button type="submit" className="w-full bg-[#FBBF24] text-[#0A192F] py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-white transition-all shadow-lg shadow-[#FBBF24]/20 active:scale-[0.98]">
                                                    Scan Network <ArrowRight size={20} />
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}

                                    {step === 'info' && (
                                        <motion.div
                                            key="info"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="bg-[#020617] p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
                                        >
                                            <form onSubmit={handleFinalSubmit} className="space-y-6 relative z-10">
                                                <div className="mb-2">
                                                    <h3 className="text-2xl font-black text-white mb-2">Almost Done.</h3>
                                                    <p className="text-gray-400 text-sm font-medium">Scanning network grid for <strong className="text-[#FBBF24]">{location}</strong>. Who should we notify with the results?</p>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2 block">Full Name</label>
                                                    <div className="relative">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FBBF24]">
                                                            <User size={18} />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="John Doe"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:border-[#FBBF24] focus:bg-white/10 transition-all placeholder-white/20"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2 block">Phone Number</label>
                                                    <div className="relative">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FBBF24]">
                                                            <Phone size={18} />
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            placeholder="+91 00000 00000"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-bold outline-none focus:border-[#FBBF24] focus:bg-white/10 transition-all placeholder-white/20"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <button type="submit" disabled={loading} className="w-full bg-[#FBBF24] text-[#0A192F] py-5 mt-2 rounded-xl font-black text-lg flex items-center justify-center hover:bg-white transition-all active:scale-[0.98]">
                                                    {loading ? 'Analyzing...' : 'Confirm Request'}
                                                </button>
                                                <button type="button" onClick={() => setStep('search')} className="w-full text-white/40 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors mt-2">Change Location</button>
                                            </form>
                                        </motion.div>
                                    )}

                                    {step === 'success' && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-[#020617] p-8 md:p-12 rounded-[2rem] border border-green-500/30 shadow-2xl text-center space-y-6"
                                        >
                                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-white mb-2">Request Logged</h3>
                                                <p className="text-gray-400 font-medium">We've mapped your backend coordinates for <strong className="text-white">{location}</strong>. Our deployment team will contact you shortly with the feasibility report.</p>
                                            </div>
                                            <button
                                                onClick={() => { setStep('search'); setLocation(''); setName(''); setPhone(''); }}
                                                className="w-full bg-white/10 text-white hover:bg-white/20 py-4 rounded-xl font-black tracking-widest text-xs uppercase transition-colors"
                                            >
                                                Check Another Location
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// Helper Icon
const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FBBF24]"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
)

// Dummy Icon Component just in case Building2 doesn't import
function Building2({ size = 24 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M12 6h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M8 14h.01"></path>
        </svg>
    )
}

export default CoveragePage;

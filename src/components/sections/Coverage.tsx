"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ArrowRight, CheckCircle2, Phone, User } from 'lucide-react';
import { createLead } from '@/app/actions/leads';

const Coverage = () => {
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
            mobile: phone,
            city: location,
            message: `Availability check for: ${location}`,
            source: 'coverage_section'
        });

        if (result.success) {
            setStep('success');
        } else {
            alert("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <section className="py-12 md:py-32 bg-white overflow-hidden" id="coverage">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#F7F7F8] rounded-[2rem] md:rounded-[4rem] px-5 py-10 md:p-24 border border-[#E5E7EB] relative overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.03)]"
                >
                    {/* Background Accents (Updated to Navy/Yellow theme) */}
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-[#FBBF24]/5 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FBBF24]/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 md:gap-20">
                        <div className="lg:w-1/2 text-left">
                            <span className="text-[#FBBF24] font-black text-xs tracking-[0.3em] uppercase mb-8 block">Network Presence</span>
                            <h2 className="text-[1.75rem] md:text-7xl font-black text-[#0A192F] mb-6 md:mb-8 leading-[1.1] tracking-tight text-left">
                                Check Availability <br />
                                in <span className="text-[#FBBF24]">Your Area.</span>
                            </h2>
                            <p className="text-[#0A192F]/50 text-lg md:text-xl mb-8 md:mb-12 font-medium leading-relaxed text-left">
                                We are rapidly expanding our fiber footprint across Tamil Nadu. Enter your location to see if Airlink is available at your doorstep.
                            </p>
                            <div className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-white border border-[#E5E7EB] w-full max-w-fit shadow-sm">
                                <MapPin size={22} className="text-[#FBBF24]" />
                                <span className="text-sm font-black uppercase tracking-[0.1em] text-[#0A192F]/60">Serving Dharmapuri, Chennai & More</span>
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <AnimatePresence mode="wait">
                                {step === 'search' && (
                                    <motion.div
                                        key="search"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white p-5 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-[#E5E7EB] shadow-[0_15px_50px_rgb(0,0,0,0.05)] relative overflow-hidden group"
                                    >
                                        <form onSubmit={handleSearch} className="space-y-6 md:space-y-10 relative z-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-[#0A192F]/40 uppercase tracking-[0.2em] ml-2 block text-left">Location Detail</label>
                                                <div className="relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FBBF24]">
                                                        <Search size={24} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Pincode or Area"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-3xl py-6 pl-16 pr-8 text-[#0A192F] text-xl font-bold outline-none focus:border-[#FBBF24] transition-all focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full group bg-[#FBBF24] text-[#0A192F] py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:translate-y-[-4px] transition-all duration-300 shadow-xl shadow-[#FBBF24]/20 transform active:scale-[0.98]">
                                                Verify Coverage <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
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
                                        className="bg-white p-5 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-[#E5E7EB] shadow-[0_15px_50px_rgb(0,0,0,0.05)] relative overflow-hidden"
                                    >
                                        <form onSubmit={handleFinalSubmit} className="space-y-8 relative z-10">
                                            <div className="text-left mb-4">
                                                <h3 className="text-2xl font-black text-[#0A192F]">Contact Info</h3>
                                                <p className="text-[#0A192F]/40 text-sm font-bold">Location identified: {location}. Tell us who you are so we can confirm availability.</p>
                                            </div>

                                            <div className="space-y-4 text-left">
                                                <label className="text-[10px] font-black text-[#0A192F]/40 uppercase tracking-[0.2em] ml-2 block">Full Name</label>
                                                <div className="relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FBBF24]">
                                                        <User size={20} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-2xl py-4 pl-14 pr-8 text-[#0A192F] font-bold outline-none focus:border-[#FBBF24] transition-all focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 text-left">
                                                <label className="text-[10px] font-black text-[#0A192F]/40 uppercase tracking-[0.2em] ml-2 block">Phone Number</label>
                                                <div className="relative">
                                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FBBF24]">
                                                        <Phone size={20} />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        placeholder="+91 00000 00000"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-2xl py-4 pl-14 pr-8 text-[#0A192F] font-bold outline-none focus:border-[#FBBF24] transition-all focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" disabled={loading} className="w-full bg-[#0A192F] text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-[#1A2F4F] transition-all transform active:scale-[0.98]">
                                                {loading ? 'Processing...' : 'Notify Me Upon Availability'}
                                            </button>
                                            <button type="button" onClick={() => setStep('search')} className="w-full text-[#0A192F]/40 font-bold text-sm hover:text-[#0A192F] transition-colors">Change Location</button>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-5 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-[#E5E7EB] shadow-[0_15px_50px_rgb(0,0,0,0.05)] text-center space-y-6 md:space-y-8"
                                    >
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-[#0A192F] mb-4">Request Logged!</h3>
                                            <p className="text-[#0A192F]/60 text-lg font-medium">We've noted your interest in <strong>{location}</strong>. Our team will verify and get back to you shortly.</p>
                                        </div>
                                        <button
                                            onClick={() => { setStep('search'); setLocation(''); setName(''); setPhone(''); }}
                                            className="w-full bg-[#FBBF24] text-[#0A192F] py-5 rounded-2xl font-black"
                                        >
                                            Check Another Area
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Coverage;

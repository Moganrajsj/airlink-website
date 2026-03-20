"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Tablet, ArrowRight, Video } from 'lucide-react';

const StreamingBanner = () => {
    return (
        <section className="container mx-auto px-4 md:px-6 my-8 md:my-16 font-poppins">
            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-8 items-stretch h-[220px] md:h-auto">
                {/* Text Content Area */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="col-span-1 md:col-span-7 bg-[#F7F8FA] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 lg:p-14 flex flex-col justify-center space-y-3 md:space-y-6 relative overflow-hidden"
                >
                    <div className="relative z-10 space-y-2 md:space-y-6">
                        <h2 className="text-lg md:text-4xl lg:text-5xl font-black text-[#0A192F] tracking-tighter leading-[1.05]">
                            Seamless <span className="text-[#FBBF24] italic">4K</span> Streaming
                        </h2>
                        <p className="hidden md:block text-[#0A192F]/60 text-base md:text-lg font-medium max-w-lg leading-relaxed">
                            Buffering is an ancient history. Watch your favorite epics on multiple devices simultaneously without a single hitch.
                        </p>
                        <p className="md:hidden text-[#0A192F]/60 text-[11px] font-medium leading-snug">
                            Watch on all devices, seamlessly.
                        </p>
                    </div>

                    {/* Device Status Row — hidden on smallest mobile */}
                    <div className="relative z-10 hidden sm:flex gap-4 overflow-x-auto pb-1 no-scrollbar">
                        <div className="flex-shrink-0 bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-[#0A192F]/05 flex items-center gap-3 md:gap-4">
                            <div className="bg-[#FBBF24]/10 p-2 md:p-3 rounded-xl md:rounded-2xl text-[#FBBF24]">
                                <Tv size={18} className="fill-[#FBBF24]/20 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="font-black text-[#0A192F] text-xs md:text-base">Living Room</p>
                                <p className="text-[9px] md:text-xs text-[#0A192F]/40 font-bold uppercase tracking-wider">4K UHD • Active</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-[#0A192F]/05 flex items-center gap-3 md:gap-4">
                            <div className="bg-[#0A192F]/05 p-2 md:p-3 rounded-xl md:rounded-2xl text-[#0A192F]/40">
                                <Tablet size={18} className="md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="font-black text-[#0A192F] text-xs md:text-base">Bedroom 1</p>
                                <p className="text-[9px] md:text-xs text-[#0A192F]/40 font-bold uppercase tracking-wider">1080p • Idle</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 hidden md:block">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#0A192F] text-white px-8 py-4 rounded-2xl font-black text-base hover:bg-[#112240] transition-all flex items-center gap-3 shadow-xl shadow-[#0A192F]/20"
                        >
                            Explore Entertainment Plans
                            <ArrowRight size={18} className="text-[#FBBF24]" />
                        </motion.button>
                    </div>

                    {/* Mobile CTA */}
                    <div className="relative z-10 md:hidden">
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#0A192F] text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2"
                        >
                            Explore Plans
                            <ArrowRight size={12} className="text-[#FBBF24]" />
                        </motion.button>
                    </div>

                    {/* Abstract Decorative Element */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FBBF24]/10 rounded-full blur-[100px]" />
                </motion.div>

                {/* Visual Image Area */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="col-span-1 md:col-span-5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative group shadow-2xl"
                >
                    <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                        src="/images/stitch/streaming-side.png" 
                        alt="Cinema experience at home"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent flex items-end p-4 md:p-10">
                        <div className="space-y-1 md:space-y-3">
                            <Video className="text-[#FBBF24] w-5 h-5 md:w-9 md:h-9" />
                            <p className="text-white text-sm md:text-2xl font-black italic tracking-tight leading-tight">
                                "The theater, <br className="hidden md:block" /> finally at home."
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default StreamingBanner;

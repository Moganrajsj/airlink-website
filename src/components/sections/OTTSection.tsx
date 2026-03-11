"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ottApps = [
    { name: "Disney+ Hotstar", color: "bg-[#001B41]" },
    { name: "Zee5", color: "bg-[#A54499]" },
    { name: "SonyLIV", color: "bg-black" },
    { name: "Aha", color: "bg-[#FF4500]" },
    { name: "Prime Video", color: "bg-[#00A8E1]" },
    { name: "Sun NXT", color: "bg-[#ED1C24]" }
];

const OTTSection = () => {
    return (
        <section className="py-32 bg-[#F7F7F8] relative overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#FF6F00]/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#FF8F00]/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-[#FF6F00] font-black text-xs tracking-[0.3em] uppercase mb-8 block">Streaming Benefits</span>
                            <h2 className="text-5xl md:text-7xl font-black text-[#1F2933] mb-10 leading-[1.05] tracking-tight">
                                Stream <span className="text-[#FF6F00]">Unlimited</span> <br />
                                Entertainment.
                            </h2>
                            <p className="text-[#1F2933]/60 text-xl mb-12 font-medium leading-relaxed">
                                Don't just browse, experience. Get premium access to 15+ OTT platforms
                                included with our high-speed fiber packages. Stream in 4K Ultra HD without interruption.
                            </p>

                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <div className="text-4xl font-black text-[#FF6F00] mb-2">15+</div>
                                    <div className="text-xs font-black text-[#1F2933]/30 uppercase tracking-widest">Premium Apps</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-[#FF6F00] mb-2">4K</div>
                                    <div className="text-xs font-black text-[#1F2933]/30 uppercase tracking-widest">Ultra HD Ready</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="grid grid-cols-3 gap-6">
                            {ottApps.map((app, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.6, ease: "backOut" }}
                                    whileHover={{ scale: 1.05, y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                    className={`${app.color} aspect-square rounded-[2.5rem] p-6 flex items-center justify-center text-center shadow-lg transition-all duration-300 relative group overflow-hidden`}
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="text-white font-black text-xs md:text-md leading-tight tracking-tight uppercase">{app.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OTTSection;

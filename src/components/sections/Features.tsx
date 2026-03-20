"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Server, Network, Shield, Headphones, MonitorDot, Link2 } from 'lucide-react';
import DynamicBackground from '@/components/animations/DynamicBackground';

const features = [
    {
        icon: <Award className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "India Govt Licensed ISP",
        description: "Department of Telecom licensed Internet Service Provider for Tamil Nadu offering trusted and regulatory compliant connectivity."
    },
    {
        icon: <ShieldCheck className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "15+ Years Experience",
        description: "Over a decade and a half of proven expertise in delivering high-speed internet to enterprise and residential users."
    },
    {
        icon: <Server className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "Tier 3 Data Center",
        description: "Strategically located Point of Presence (POP) in world-class Tier 3 Data Centers ensuring 99.98% reliability."
    },
    {
        icon: <Network className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "Direct IXP & CDN",
        description: "Direct peering with major Internet Exchanges and global Content Delivery Networks for ultra-low latency."
    },
    {
        icon: <Link2 className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "Submarine Cable Access",
        description: "Direct connectivity to submarine cable landing stations ensuring unmatched international bandwidth capabilities."
    },
    {
        icon: <Shield className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "Redundant Core Network",
        description: "Fully redundant fiber optic core network architecture to prevent single points of failure."
    },
    {
        icon: <Headphones className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "24/7 NOC Monitoring",
        description: "Proactive, round-the-clock Network Operations Center (NOC) monitoring all circuits 24/7/365."
    },
    {
        icon: <MonitorDot className="text-[#0A192F] group-hover:text-[#0A192F]" size={32} />,
        title: "Symmetrical Speeds",
        description: "Equal upload and download speeds, crucial for video conferencing, cloud access, and large file transfers."
    }
];

const Features = () => {
    return (
        <section className="py-12 md:py-32 bg-white relative overflow-hidden" id="features">
            {/* ── Layered Premium Background ── */}
            <DynamicBackground layers={["circuit", "particles"]} opacity={0.6} />
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-[#FBBF24]/10 text-[#0A192F] uppercase text-[10px] font-black tracking-[0.3em] py-2 px-6 rounded-full mb-4 md:mb-6 border border-[#FBBF24]/20"
                    >
                        Why Choose Us
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-7xl font-black text-[#0A192F] mb-6 tracking-tighter uppercase"
                    >
                        Enterprise-Grade Infrastructure <br className="hidden md:block" />
                        <span className="text-[#FBBF24]">Delivered to You.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#0A192F]/50 max-w-3xl mx-auto text-lg md:text-xl font-medium"
                    >
                        We don't just provide internet; we power your digital life with next-gen fiber technology, direct CDN peering, and highly redundant systems.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const isBlue = [0, 1, 2, 3, 4, 5, 6, 7].includes(index);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] transition-all duration-500 group cursor-default ${
                                    isBlue 
                                    ? "bg-[#0A192F] border border-[#0A192F] shadow-[0_20px_40px_rgba(10,25,47,0.3)] hover:border-[#FBBF24]/30" 
                                    : "bg-white/80 backdrop-blur-md border border-gray-100 shadow-[0_8px_32px_rgba(10,25,47,0.04)] hover:shadow-2xl hover:border-[#FBBF24]/30"
                                }`}
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-lg ${
                                    isBlue 
                                    ? "bg-[#FBBF24] group-hover:bg-white shadow-[#FBBF24]/20 group-hover:shadow-white/20" 
                                    : "bg-[#0A192F] group-hover:bg-[#FBBF24] shadow-[#0A192F]/10 group-hover:shadow-[#FBBF24]/20"
                                }`}>
                                    {React.cloneElement(feature.icon as React.ReactElement<any>, {
                                        className: isBlue ? "text-[#0A192F] transition-colors duration-500" : "text-white group-hover:text-[#0A192F] transition-colors duration-500"
                                    })}
                                </div>
                                <h3 className={`text-xl font-black mb-4 uppercase tracking-tighter transition-colors duration-300 ${
                                    isBlue ? "text-white" : "text-[#0A192F]"
                                }`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-sm font-medium leading-relaxed ${
                                    isBlue ? "text-white/70" : "text-[#0A192F]/50"
                                }`}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;

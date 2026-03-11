"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Link as LinkIcon,
    Globe,
    Cloud,
    Server,
    Lock,
    Laptop,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Building2,
    Clock,
    ShieldAlert,
    ArrowRight
} from 'lucide-react';

interface ServiceDetail {
    title: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
}

const services: ServiceDetail[] = [
    {
        title: "Dedicated Internet Leased Line (ILL)",
        description: "High-speed symmetrical connectivity for business-critical operations.",
        features: [
            "1:1 uncontended bandwidth",
            "SLA uptime guarantee (99.5%+)",
            "IPv4/IPv6 with BGP support",
            "24/7 proactive monitoring",
            "Scalable bandwidth"
        ],
        icon: <Zap className="w-8 h-8" />
    },
    {
        title: "Managed Secure Internet Leased Line",
        description: "Internet connectivity combined with enterprise security.",
        features: [
            "Firewall with UTM protection",
            "IDS/IPS security",
            "Web and application filtering",
            "DDoS mitigation",
            "Real-time dashboard"
        ],
        icon: <ShieldCheck className="w-8 h-8" />
    },
    {
        title: "Point-to-Point Leased Lines",
        description: "Secure dedicated links between locations.",
        features: [
            "Layer 2/Layer 3 circuits",
            "Voice, video, and data support",
            "Low latency high throughput",
            "Fiber or wireless options"
        ],
        icon: <LinkIcon className="w-8 h-8" />
    },
    {
        title: "SD-WAN Services",
        description: "Intelligent WAN solutions for cloud enterprises.",
        features: [
            "Dynamic path selection",
            "Centralized management",
            "Application-aware routing",
            "Zero-touch provisioning",
            "End-to-end encryption"
        ],
        icon: <Globe className="w-8 h-8" />
    },
    {
        title: "Cloud On-Ramp Services",
        description: "Direct access to public cloud platforms.",
        features: [
            "Private cloud peering",
            "Guaranteed bandwidth",
            "Low-latency interconnect",
            "WAN integration"
        ],
        icon: <Cloud className="w-8 h-8" />
    },
    {
        title: "Colocation Hosting Services",
        description: "Tier-3 data center infrastructure hosting.",
        features: [
            "Flexible rack space",
            "Redundant power/cooling",
            "24/7 secure access",
            "Biometric security"
        ],
        icon: <Server className="w-8 h-8" />
    },
    {
        title: "Firewall & Network Security Solutions",
        description: "Advanced network protection.",
        features: [
            "Threat detection",
            "VPN & SSL inspection",
            "High availability setups",
            "Managed options"
        ],
        icon: <Lock className="w-8 h-8" />
    },
    {
        title: "Software Licensing & IT Solutions",
        description: "Enterprise software support.",
        features: [
            "Volume licensing",
            "Compliance guidance",
            "Installation support",
            "Cost optimization"
        ],
        icon: <Laptop className="w-8 h-8" />
    }
];

const ServiceCard = ({ service, index }: { service: ServiceDetail; index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgb(255,111,0,0.1)] hover:border-[#FF6F00]/20 transition-all duration-500 overflow-hidden group"
        >
            <div className="p-10">
                <div className="w-16 h-16 rounded-2xl bg-[#F7F7F8] flex items-center justify-center text-[#FF6F00] mb-8 group-hover:bg-[#FF6F00] group-hover:text-white transition-all duration-500 shadow-sm">
                    {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1F2933] mb-4 leading-tight group-hover:text-[#FF6F00] transition-colors">
                    {service.title}
                </h3>
                <p className="text-[#1F2933]/70 leading-relaxed mb-8 text-lg font-medium">
                    {service.description}
                </p>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-3 text-[#FF6F00] font-bold text-sm tracking-wider uppercase group/btn"
                >
                    {isExpanded ? "Close features" : "Explore features"}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="border-t border-[#E5E7EB] bg-[#F7F7F8]/50"
                    >
                        <div className="p-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F2933]/40 mb-6 flex items-center gap-3">
                                <span className="w-6 h-[1px] bg-[#FF6F00]"></span> Key Specifications
                            </h4>
                            <ul className="grid gap-4">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4 text-[#1F2933]/80 font-medium">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-[#FF6F00]/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3 h-3 text-[#FF6F00]" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-white text-[#1F2933] font-inter selection:bg-[#FF6F00]/30 selection:text-white">
            {/* 1. Light Hero Section */}
            <section className="relative pt-44 pb-32 overflow-hidden bg-white">
                {/* Subtle Saffron Gradient Shapes */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        className="absolute top-[-15%] right-[-5%] w-[60%] h-[70%] bg-gradient-to-br from-[#FF6F00]/10 to-transparent blur-[140px] rounded-full"
                    />
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 0.2, x: 0 }}
                        transition={{ duration: 3, delay: 0.5 }}
                        className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[55%] bg-[#FF8F00]/5 blur-[100px] rounded-full"
                    />
                    {/* Abstract Network Element (SVG) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]">
                        <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="500" cy="500" r="150" stroke="#FF6F00" strokeWidth="1" fill="none" />
                            <circle cx="500" cy="500" r="300" stroke="#FF6F00" strokeWidth="1" fill="none" />
                            <circle cx="500" cy="500" r="450" stroke="#FF6F00" strokeWidth="1" fill="none" />
                            <line x1="0" y1="500" x2="1000" y2="500" stroke="#FF6F00" strokeWidth="1" />
                            <line x1="500" y1="0" x2="500" y2="1000" stroke="#FF6F00" strokeWidth="1" />
                        </svg>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-[#FF6F00]/5 text-[#FF6F00] text-xs font-black tracking-[0.2em] uppercase mb-8 border border-[#FF6F00]/10">
                                <span className="w-2 h-2 rounded-full bg-[#FF6F00] animate-pulse"></span>
                                Next-Gen Solutions
                            </span>
                            <h1 className="text-6xl md:text-[5.5rem] font-black text-[#1F2933] mb-8 tracking-[-0.04em] leading-[0.95]">
                                Enterprise <span className="text-[#FF6F00]">Connectivity</span> <br />
                                & Infrastructure.
                            </h1>
                            <p className="text-xl md:text-2xl text-[#1F2933]/60 max-w-2xl font-medium leading-relaxed">
                                Advanced networking, security, and cloud services designed for modern businesses.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Services Grid */}
            <section className="py-32 bg-[#F7F7F8]/30">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
                    >
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                                Solutions built for <br />
                                <span className="text-[#FF6F00]">Scale & Performance.</span>
                            </h2>
                            <p className="text-[#1F2933]/50 font-medium text-lg">
                                Explore our comprehensive suite of enterprise-grade networking and infrastructure services.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-32 h-[1px] bg-[#FF6F00]/20 mb-4"></div>
                            <span className="text-xs font-black uppercase tracking-widest text-[#1F2933]/30">8 Core Solutions</span>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Infrastructure Highlight (Light) */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <div className="inline-flex items-center gap-4 mb-8">
                                <div className="w-12 h-[1px] bg-[#FF6F00]"></div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6F00]">Infrastructure</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-[#1F2933] mb-8 leading-[1.1] tracking-tight">
                                Tier-3 Data Center <br />
                                <span className="text-[#FF6F00]">Global Ecosystem.</span>
                            </h2>
                            <p className="text-xl text-[#1F2933]/60 mb-12 leading-relaxed font-medium">
                                Our core infrastructure operates from a Tier-3 environment engineered for maximum uptime, serving as the heartbeat of your digital operations.
                            </p>

                            <div className="grid gap-6">
                                {[
                                    { icon: <Building2 />, title: "Carrier Grade", desc: "Enterprise infrastructure standards." },
                                    { icon: <Clock />, title: "99.5% Uptime", desc: "Strict SLA-backed guarantees." },
                                    { icon: <ShieldAlert />, title: "Proactive NOC", desc: "24/7 active monitoring & response." }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6 p-6 rounded-3xl bg-[#F7F7F8] border border-[#E5E7EB] hover:border-[#FF6F00]/20 transition-all group"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#FF6F00] shadow-sm group-hover:bg-[#FF6F00] group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1F2933] text-lg mb-1">{item.title}</h4>
                                            <p className="text-sm text-[#1F2933]/50 font-medium">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <div className="relative p-2 bg-[#F7F7F8] rounded-[3rem] border border-[#E5E7EB]">
                                <div className="bg-white rounded-[2.5rem] p-16 shadow-[0_20px_60px_rgb(0,0,0,0.03)] relative overflow-hidden text-center">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6F00]/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-24 h-24 rounded-full bg-[#FF6F00]/5 flex items-center justify-center mb-8 border border-[#FF6F00]/10">
                                            <Globe className="w-10 h-10 text-[#FF6F00]" />
                                        </div>
                                        <h3 className="text-3xl font-black text-[#1F2933] mb-6 tracking-tight">Enterprise Availability</h3>
                                        <p className="text-[#1F2933]/50 leading-relaxed mb-10 text-lg font-medium">
                                            Direct connectivity to Internet Exchange Points (IXPs) and CDNs ensuring ultra-low latency for your users nationwide.
                                        </p>
                                        <button className="flex items-center gap-3 text-[#FF6F00] font-black text-sm tracking-widest uppercase hover:gap-5 transition-all">
                                            Technical Backbone <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. CTA Section (Light) */}
            <section className="py-32 bg-[#F7F7F8]/50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-[0_25px_80px_rgb(0,0,0,0.05)] border border-[#E5E7EB]"
                    >
                        {/* Soft saffron accent glows */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6F00]/5 blur-[120px] rounded-full -ml-48 -mt-48"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF8F00]/5 blur-[120px] rounded-full -mr-48 -mb-48"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <span className="text-[#FF6F00] font-black text-xs tracking-[0.3em] uppercase mb-8 block">Partner with Excellence</span>
                            <h2 className="text-4xl md:text-7xl font-black text-[#1F2933] mb-10 tracking-tight leading-[1.05]">
                                Ready to Scale Your <br />
                                <span className="text-[#FF6F00]">Infrastructure?</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-[#1F2933]/50 mb-14 font-medium leading-relaxed">
                                Empower your business with connectivity that never compromises. Contact our solution architects for a tailored consultation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                                <button className="px-14 py-6 bg-[#FF6F00] text-white font-black rounded-3xl hover:bg-[#FF8F00] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#FF6F00]/25 text-lg">
                                    Talk to an Expert
                                </button>
                                <button className="flex items-center gap-3 text-[#1F2933] font-bold text-lg hover:text-[#FF6F00] transition-colors group">
                                    Download Catalog
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Clean Bottom Edge */}
            <div className="h-4 bg-[#FF6F00]"></div>
        </div>
    );
};

export default ServicesPage;

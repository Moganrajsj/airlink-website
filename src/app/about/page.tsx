"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { DarkHeroBg, LightSectionBg, NavySectionBg, MeshBg, LightHeroBg, GraySectionBg, LightMeshBg } from '@/components/ui/AnimatedBackground';
import {
    ShieldCheck,
    Globe,
    Server,
    Cpu,
    Lock,
    Zap,
    Layers,
    ChevronRight,
    Database,
    Network,
    Award,
    ArrowRight,
    Building2
} from 'lucide-react';

const partnersData = [
    { name: "HPE Aruba", category: "Networking", logo: "/images/partners/HPE aruba networking.png" },
    { name: "Ubiquiti", category: "Wireless & Routing", logo: "/images/partners/u.png" },
    { name: "Cisco", category: "Core Networking", logo: "/images/partners/cisco.png" },
    { name: "Equinix", category: "Data Center & Colocation", logo: "/images/partners/equinix.png" },
    { name: "ST Telemedia", category: "Data Center & Colocation", logo: "/images/partners/st telemedia global data centres.png" },
    { name: "Broadcom", category: "Semiconductor", logo: "/images/partners/broadcom.png" },
    { name: "Zscaler", category: "Cloud Security", logo: "/images/partners/zsaler.png" },
    { name: "Microsoft 365", category: "Enterprise Software", logo: "/images/partners/microsoft 365.png" },
    { name: "Google Workspace", category: "Enterprise Software", logo: "/images/partners/google workspace.png" },
    { name: "Observium", category: "Network Monitoring", logo: "/images/partners/observium.png" },
    { name: "Cloudstack", category: "Cloud Computing", logo: "/images/partners/cloudstack.png" },
    { name: "Dell", category: "Server Hardware", logo: "/images/partners/DELL technologies.png" },
    { name: "HPE", category: "Server Hardware", logo: "/images/partners/HPE.png" },
    { name: "D-Link", category: "Networking", logo: "/images/partners/d link .png" },
    { name: "Fortinet", category: "Network Security", logo: "/images/partners/fortinet.png" },
    { name: "SonicWall", category: "Network Security", logo: "/images/partners/Sonicwall.png" },
    { name: "Cloud Cube", category: "Cloud Services", logo: "/images/partners/cloud cube .png" }
];

const PartnerCard = ({ partner, index }: { partner: any, index: number }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 4) * 0.1 }}
            className="bg-white rounded-[2rem] p-8 border border-[#E5E7EB] hover:border-[#FBBF24]/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-center items-center text-center group h-56 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex-1 flex items-center justify-center w-full relative z-10 mb-4">
                {!imgError && partner.logo ? (
                    <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-[80px] max-w-[80%] object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Building2 size={32} className="text-[#1F2933]/30 group-hover:text-[#FBBF24] transition-colors duration-300" />
                        <span className="font-extrabold text-2xl text-[#1F2933]/50 group-hover:text-[#0A192F] transition-colors duration-300">
                            {partner.name}
                        </span>
                    </div>
                )}
            </div>

            <div className="relative z-10 w-full pt-4 border-t border-gray-50 flex items-center justify-center">
                <p className="text-[10px] font-black text-[#1F2933]/50 uppercase tracking-[0.2em] group-hover:text-[#FBBF24] transition-colors duration-300 text-center">
                    {partner.category}
                </p>
            </div>
        </motion.div>
    );
};

const AboutPage = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const services = [
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Dedicated Leased Line",
            description: "High-performance symmetrical connectivity with guaranteed bandwidth and 99.9% uptime for mission-critical operations."
        },
        {
            icon: <Layers className="w-8 h-8" />,
            title: "SD-WAN & Cloud On-ramp",
            description: "Simplify branch networking and optimize application performance with secure, cloud-ready software-defined networking."
        },
        {
            icon: <Network className="w-8 h-8" />,
            title: "Enterprise Networking",
            description: "Secure point-to-point and multipoint connectivity across Tamil Nadu using resilient fiber and wireless infrastructure."
        },
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Cybersecurity Protection",
            description: "Cloud-native firewalling, DDoS protection, and managed security services to safeguard your business assets."
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: "Colocation & Hosting",
            description: "Mission-critical infrastructure hosting in our Tier-3 data center environment with redundant power and cooling."
        },
        {
            icon: <Cpu className="w-8 h-8" />,
            title: "IT Enablement",
            description: "Full-stack software licensing and strategic IT infra consulting to accelerate your digital transformation journey."
        },
        {
            icon: <Lock className="w-8 h-8" />,
            title: "Secure Managed Internet",
            description: "Enterprise-grade internet access with built-in security protocols and 24/7 proactive monitoring."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-[#0A192F] font-inter">
            {/* 1. Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[url('/images/indian_telecom_tower.png')] bg-cover bg-fixed bg-center opacity-80"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-black tracking-[0.2em] uppercase mb-10 border border-[#FBBF24]/20">
                            <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse"></span>
                            Government Licensed ISP
                        </span>
                        <h1 className="text-6xl md:text-[6.5rem] font-black text-[#0A192F] mb-8 tracking-[-0.04em] leading-[0.95]">
                            About <span className="text-[#FBBF24]">Sriram</span> <br />
                            Broadband.
                        </h1>
                        <p className="text-xl md:text-2xl text-[#0A192F]/55 max-w-3xl mx-auto font-medium leading-relaxed">
                            “Trusted Internet Infrastructure Partner for Tamil Nadu”
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    >
                        <div className="w-6 h-12 border-2 border-[#0A192F]/20 rounded-full flex justify-center p-1.5">
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full"
                            />
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* 2. Company Introduction */}
            < section className="py-32 bg-white relative overflow-hidden" >
                <LightSectionBg variant="dots" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <div className="inline-flex items-center gap-4 mb-8">
                                <div className="w-12 h-[1px] bg-[#FBBF24]"></div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FBBF24]">Our Legacy</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-[#1F2933] mb-10 leading-[1.1] tracking-tight">
                                Engineering <span className="text-[#FBBF24]">Connectivity</span> <br />
                                with 15 Years of Excellence.
                            </h2>
                            <div className="space-y-8 text-xl text-[#1F2933]/60 leading-relaxed font-medium">
                                <p>
                                    Sriram Broadband Services Pvt. Ltd. is a Government of India, Department of Telecommunications licensed Internet Service Provider serving Tamil Nadu. With over 15 years of proven excellence, we deliver high-performance internet and enterprise networking solutions.
                                </p>
                                <p>
                                    Whether you're powering complex business <strong className="text-[#0A192F] font-black">interactions</strong>, indulging in high-speed, lag-free <strong className="text-[#0A192F] font-black">fun</strong>, or scaling massive enterprise operations, our infrastructure ensures your digital experience is blazing fast, ultra-reliable, and always seamless.
                                </p>
                                <p>
                                    We combine enterprise-grade infrastructure with a customer-centric service approach, making Sriram Broadband a trusted long-term technology partner for both serious business operations and daily digital thrills.
                                </p>
                            </div>

                            <div className="mt-16 grid grid-cols-2 gap-12">
                                <div>
                                    <div className="text-5xl font-black text-[#FBBF24] mb-2 tracking-tight">15+</div>
                                    <div className="text-xs font-black text-[#1F2933]/30 uppercase tracking-widest">Years of Trust</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-black text-[#FBBF24] mb-2 tracking-tight">99.9%</div>
                                    <div className="text-xs font-black text-[#1F2933]/30 uppercase tracking-widest">Network Uptime</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_30px_90px_rgb(0,0,0,0.08)] bg-[#F7F7F8] p-2 border border-[#E5E7EB]">
                                <div className="bg-[#0A192F] rounded-[2.5rem] p-12 relative overflow-hidden aspect-[4/3] flex flex-col justify-center items-center group">
                                    <div className="absolute inset-0 bg-[url('/images/indian_telecom_tower.png')] bg-cover bg-center opacity-50 group-hover:opacity-60 transition-opacity duration-700 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/60 to-transparent"></div>
                                    <div className="relative z-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
                                        <Award className="w-10 h-10 text-[#FBBF24]" />
                                    </div>
                                    <h3 className="relative z-10 text-3xl font-black text-white mb-4 text-center tracking-tight">Tamil Nadu's Premium ISP</h3>
                                    <p className="relative z-10 text-white/70 text-center font-medium leading-relaxed">Dedicated to serving the industrial and enterprise heartbeat of South India.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* 3. Animated Services Grid */}
            < section className="py-32 bg-[#F7F8FA] relative overflow-hidden" >
                <GraySectionBg />
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-[#1F2933] mb-6 tracking-tight">
                                Advanced <span className="text-[#FBBF24]">Connectivity</span> Solutions.
                            </h2>
                            <p className="text-lg text-[#1F2933]/50 font-medium">
                                We support businesses of all sizes with advanced connectivity and IT infrastructure services.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="bg-white p-10 rounded-[2rem] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgb(255,111,0,0.1)] hover:border-[#FBBF24]/20 transition-all duration-500 overflow-hidden group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#F7F7F8] flex items-center justify-center text-[#FBBF24] mb-8 group-hover:bg-[#FBBF24] group-hover:text-white transition-all duration-500 shadow-sm">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-[#1F2933] mb-4 leading-tight group-hover:text-[#FBBF24] transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-[#1F2933]/60 leading-relaxed font-medium">
                                    {service.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section >

            {/* 4. Infrastructure Highlight (Light Refactor) */}
            < section className="py-32 bg-white overflow-hidden relative" >
                <LightSectionBg />
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-4 mb-8">
                                    <div className="w-12 h-[1px] bg-[#FBBF24]"></div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FBBF24]">Our Backbone</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-[#1F2933] mb-10 leading-[1.1] tracking-tight">
                                    Tier-3 Data Center <br />
                                    <span className="text-[#FBBF24]">Network Ecosystem.</span>
                                </h2>
                                <p className="text-xl text-[#1F2933]/60 mb-12 leading-relaxed font-medium">
                                    Our core infrastructure operates from a Tier-3 environment engineered for maximum uptime, serving as the heartbeat of your digital operations.
                                </p>

                                <ul className="space-y-6">
                                    {[
                                        "Direct connectivity to Internet Exchange Points (IXPs)",
                                        "Strategically located CDN nodes for local traffic",
                                        "Multiple upstream telecom carrier integrations",
                                        "Submarine cable system landing station backhaul"
                                    ].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-4 text-[#1F2933]/80 font-semibold"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-[#FBBF24]/10 flex items-center justify-center shrink-0">
                                                <ChevronRight className="w-4 h-4 text-[#FBBF24]" />
                                            </div>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        <div className="lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative p-2 bg-[#F7F7F8] rounded-[3.5rem] border border-[#E5E7EB]"
                            >
                                <div className="bg-white p-12 rounded-[3rem] shadow-[0_30px_100px_rgb(255,111,0,0.05)] relative overflow-hidden">
                                    <div className="grid grid-cols-2 gap-12 relative z-10">
                                        <div className="text-center p-8 border border-[#E5E7EB] rounded-[2rem] bg-white group hover:border-[#FBBF24]/30 transition-all">
                                            <div className="text-4xl font-black text-[#FBBF24] mb-2">Low</div>
                                            <div className="text-xs uppercase tracking-widest text-[#1F2933]/30 font-bold">Latency</div>
                                        </div>
                                        <div className="text-center p-8 border border-[#E5E7EB] rounded-[2rem] bg-white group hover:border-[#FBBF24]/30 transition-all">
                                            <div className="text-4xl font-black text-[#FBBF24] mb-2">High</div>
                                            <div className="text-xs uppercase tracking-widest text-[#1F2933]/30 font-bold">Redundancy</div>
                                        </div>
                                        <div className="text-center p-8 border border-[#E5E7EB] rounded-[2rem] bg-white group hover:border-[#FBBF24]/30 transition-all">
                                            <div className="text-4xl font-black text-[#FBBF24] mb-2">Full</div>
                                            <div className="text-xs uppercase tracking-widest text-[#1F2933]/30 font-bold">Scalability</div>
                                        </div>
                                        <div className="text-center p-8 border border-[#E5E7EB] rounded-[2rem] bg-white group hover:border-[#FBBF24]/30 transition-all">
                                            <div className="text-4xl font-black text-[#FBBF24] mb-2">24/7</div>
                                            <div className="text-xs uppercase tracking-widest text-[#1F2933]/30 font-bold">Monitoring</div>
                                        </div>
                                    </div>
                                    {/* Abstract background blur in card */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/5 blur-3xl rounded-full -mr-24 -mt-24"></div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Partners Section added per user request (Grid format) */}
            < section className="py-32 bg-[#F7F8FA] relative overflow-hidden text-center" >
                <GraySectionBg />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-[#1F2933] mb-6 tracking-tight">
                            Technology <span className="text-[#FBBF24]">Alliance</span> Partners.
                        </h2>
                        <p className="text-lg text-[#1F2933]/60 max-w-2xl mx-auto font-medium leading-relaxed">
                            We collaborate with industry leaders to bring you enterprise-grade networking and security solutions.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {partnersData.map((partner, index) => (
                            <PartnerCard key={index} partner={partner} index={index} />
                        ))}
                    </div>
                </div>
            </section >

            {/* 5. Trust & Reliability Statement (Light) */}
            < section className="py-32 bg-[#FBBF24] relative overflow-hidden" >
                {/* <YellowAccentBg /> */}
                < div className="container mx-auto px-6" >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="border border-[#0A192F]/10 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden bg-white/40"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0A192F]/30 to-transparent" />

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-7xl font-black text-[#0A192F] mb-10 tracking-tight leading-[1.05]">
                                Your Trusted <span className="text-[#0A192F] tracking-tighter">Technology Partner.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-[#0A192F]/65 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                                We combine enterprise-grade infrastructure with a customer-centric service approach, making Sriram Broadband a trusted long-term partner.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                                <button className="px-14 py-6 bg-[#0A192F] text-white font-black rounded-3xl hover:-translate-y-1 transition-all shadow-xl text-lg">
                                    Get Started Today
                                </button>
                                <button className="flex items-center gap-3 text-[#0A192F]/60 font-bold text-lg hover:text-[#0A192F] transition-colors group">
                                    View Our Packages
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div >
            </section >

            {/* Clean Bottom Edge */}
            < div className="h-px bg-gradient-to-r from-transparent via-[#0A192F]/10 to-transparent" ></div >
        </div >
    );
};

export default AboutPage;

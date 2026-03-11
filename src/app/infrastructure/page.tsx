"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DarkHeroBg, LightSectionBg, NavySectionBg, MeshBg, LightHeroBg, GraySectionBg } from '@/components/ui/AnimatedBackground';
import Aurora from '@/components/animations/Aurora';
import Particles from '@/components/animations/Particles';
import BlurText from '@/components/animations/BlurText';
import TiltedCard from '@/components/animations/TiltedCard';
import {
    Server,
    Wifi,
    Shield,
    Zap,
    Network,
    Cloud,
    BatteryCharging,
    Cable,
    Globe,
    Gauge,
    CheckCircle2,
    Mail,
    Phone,
    Building,
    Check,
    Database,
    Lock,
    Settings,
    Code,
    Cpu,
    ArrowRight
} from 'lucide-react';

const InfrastructurePage = () => {
    const features = [
        {
            icon: <Server className="w-8 h-8" />,
            title: "Tier-3 Data Center",
            description: "Enterprise-grade facilities with 99.982% uptime guarantee, precision cooling, and biometric access control."
        },
        {
            icon: <Gauge className="w-8 h-8" />,
            title: "10G+ Core Network",
            description: "Ultra-high-capacity core network backbone supporting multi-gigabit throughput with negligible latency."
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Multiple Upstream Providers",
            description: "Direct BGP peering with Tier-1 providers including Airtel, Tata Communications, and Jio for optimal routing."
        },
        {
            icon: <Cable className="w-8 h-8" />,
            title: "Submarine Cable Access",
            description: "Strategic aggregations at major submarine cable landing stations ensuring robust international connectivity."
        },
        {
            icon: <Network className="w-8 h-8" />,
            title: "Redundant Ring Topology",
            description: "Self-healing fiber optic ring architecture that automatically reroutes traffic in case of physical cuts."
        },
        {
            icon: <BatteryCharging className="w-8 h-8" />,
            title: "Zero-Downtime Power",
            description: "N+1 redundant battery banks and automated Diesel Generator (DG) backups across all critical network nodes."
        }
    ];

    const stats = [
        { value: "99.5%", label: "Uptime SLA" },
        { value: "<5ms", label: "Low Latency" },
        { value: "24/7", label: "Expert NOC Support" },
        { value: "Tier-3", label: "Data Center Arch" }
    ];

    return (
        <div className="min-h-screen bg-white text-[#0A192F] font-inter">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-[#0A192F]">

                <div className="absolute inset-0 bg-[url('/images/real_server_rack_1772908849996.png')] bg-cover bg-fixed bg-center opacity-30 mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F]/60 via-[#0A192F]/80 to-[#0A192F]"></div>

                {/* Interactive Aurora & Particles */}
                <Aurora colorStops={["#FBBF24", "#0A192F", "#1A365D"]} speed={0.8} />
                <Particles count={400} size={0.06} color="#FBBF24" interactive={true} />

                <div className="container mx-auto px-6 relative z-20 pt-10">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] uppercase text-sm font-black tracking-[0.2em] mb-8 border border-[#FBBF24]/30 backdrop-blur-md shadow-xl">
                                <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse"></span>
                                Core Infrastructure
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight leading-tight">
                                Built for <span className="text-[#FBBF24]">Extreme Performance.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto font-medium leading-relaxed">
                                Experience the power of our carrier-grade, self-healing network. Engineered with redundant architectures and Tier-3 facilities to deliver uncompromising reliability.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-[#F7F8FA] border-y border-[#0A192F]/06 relative z-20">
                <GraySectionBg />
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-8 bg-white rounded-3xl border border-[#0A192F]/08 hover:border-[#FBBF24]/30 transition-all duration-300 shadow-sm"
                            >
                                <div className="text-4xl md:text-5xl font-black text-[#FBBF24] mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest text-[#0A192F]/40">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Infrastructure Features */}
            <section className="py-32 bg-white relative overflow-hidden">
                <LightSectionBg variant="dots" />
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[#0A192F] mb-6 tracking-tight">
                            The Backbone of <span className="text-[#FBBF24]">Connectivity.</span>
                        </h2>
                        <p className="text-lg text-[#0A192F]/55 font-medium">
                            Our network is built with enterprise-grade components and true redundancy at every physical and logical layer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-10 bg-white rounded-[2rem] border border-[#0A192F]/08 hover:border-[#FBBF24]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/03 rounded-bl-[100px] -z-10 group-hover:bg-[#FBBF24]/08 transition-colors duration-500"></div>
                                <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] flex items-center justify-center text-[#FBBF24] mb-8 group-hover:bg-[#FBBF24] group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm border border-[#0A192F]/06">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black text-[#0A192F] mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-[#0A192F]/55 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Service Portfolio */}
            <section className="py-32 bg-[#FBBF24] text-[#0A192F] relative overflow-hidden">
                <MeshBg />
                <div className="container mx-auto px-6 relative z-10 text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <BlurText
                            text="ENTERPRISE SERVICE PORTFOLIO"
                            delay={150}
                            animateBy="character"
                            className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight uppercase underline decoration-white/30 decoration-8 underline-offset-[12px] inline-block"
                        />
                        <p className="text-[#0A192F]/70 text-xl font-medium">
                            Mission-critical solutions with guaranteed SLA performance.
                        </p>
                    </motion.div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap />,
                                title: "Dedicated Internet Leased Line (ILL / DIA)",
                                subtitle: "Symmetrical dedicated bandwidth with 99.5% uptime SLA guarantee.",
                                features: ["1:1 Uncontended Bandwidth", "Static IPs", "Proactive Monitoring", "Dedicated Account Manager"]
                            },
                            {
                                icon: <Shield />,
                                title: "Managed Secure Internet Leased Line",
                                subtitle: "High-speed connectivity bundled with enterprise-grade unified threat management.",
                                features: ["Next-Gen UTM Firewall", "DDoS Protection", "Web Filtering", "Intrusion Prevention"]
                            },
                            {
                                icon: <Network />,
                                title: "Point-to-Point Leased Lines",
                                subtitle: "Secure, private, and dedicated Layer 2 connectivity between multiple office locations.",
                                features: ["Ultra-Low Latency", "Unlimited Data Transfer", "Protocol Transparent", "High Security"]
                            },
                            {
                                icon: <Settings />,
                                title: "SD-WAN Services",
                                subtitle: "Software-defined architecture for intelligent path selection and centralized network management.",
                                features: ["Zero-Touch Provisioning", "Application Prioritization", "Multi-Link Aggregation", "Centralized Dashboard"]
                            },
                            {
                                icon: <Cloud />,
                                title: "Cloud On-Ramp Services",
                                subtitle: "Direct, private connectivity to major cloud providers (AWS, Azure, Google Cloud).",
                                features: ["Predictable Performance", "Enhanced Security", "BGP Peering", "Multi-Cloud Access"]
                            },
                            {
                                icon: <Database />,
                                title: "Colocation Hosting",
                                subtitle: "Secure and reliable Tier-3 data center space for your mission-critical IT infrastructure.",
                                features: ["Redundant Power & Cooling", "24/7 Physical Security", "Carrier Neutral", "Remote Hands Support"]
                            },
                            {
                                icon: <Code />,
                                title: "Software Licensing & IT Solutions",
                                subtitle: "End-to-end IT solutions including Microsoft 365, Google Workspace, and Endpoint Security.",
                                features: ["Microsoft 365 / Google Workspace", "Endpoint Security (EPP/EDR)", "Email Security", "IT Consultation"]
                            }
                        ].map((item, idx, arr) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`h-full w-full ${arr.length === 7 && idx === 6 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2 max-w-lg mx-auto lg:max-w-none' : ''}`}
                            >
                                <TiltedCard
                                    className="bg-white/90 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] flex flex-col items-start h-full"
                                    containerClassName="h-full"
                                    rotateAmplitude={8}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#0A192F]/5 flex items-center justify-center text-[#0A192F] mb-8 border border-[#0A192F]/10 transition-transform duration-500">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-[#0A192F] mb-4 uppercase tracking-tighter leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-[#0A192F]/60 text-sm mb-8 font-medium leading-relaxed">
                                        {item.subtitle}
                                    </p>
                                    <div className="mt-auto space-y-3 pt-6 border-t border-[#0A192F]/10 w-full">
                                        {item.features.map((feature, fidx) => (
                                            <div key={fidx} className="flex items-start gap-2 text-xs font-bold text-[#0A192F]/80 uppercase tracking-widest">
                                                <CheckCircle2 size={14} className="text-[#0ea5e9] shrink-0 mt-0.5" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </TiltedCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center mt-10 md:mt-16 lg:mt-24">
                    <p className="text-2xl md:text-3xl text-[#0A192F]/70 max-w-4xl mx-auto font-black italic tracking-tight leading-tight">
                        "Designed for Reliability & Scale. Our enterprise network is built on a resilient, multi-homed backbone with direct peering to major content delivery networks (CDNs) and cloud providers."
                    </p>
                </div>
            </section>

            {/* Why Dedicated Leased Line? Comparison Table */}
            <section className="py-32 bg-white relative overflow-hidden">
                <LightSectionBg variant="particles" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[#0A192F] mb-6 tracking-tight">
                            Why <span className="text-[#FBBF24]">Dedicated Leased Line?</span>
                        </h2>
                        <p className="text-lg text-[#0A192F]/55 font-medium">
                            A direct comparison confirming why mission-critical businesses cannot rely on shared broadband architectures.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto bg-white rounded-[3rem] border border-[#0A192F]/08 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#0A192F] text-white uppercase tracking-widest text-[10px] font-black italic">
                                        <th className="px-8 py-6">Feature</th>
                                        <th className="px-8 py-6">Shared Broadband</th>
                                        <th className="px-8 py-6 text-[#FBBF24]">Dedicated Leased Line</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#0A192F] font-bold">
                                    {[
                                        { f: "Bandwidth", s: "Shared Connection", d: "1:1 Dedicated Guarantee" },
                                        { f: "Upload Speed", s: "Always Lower (Asymmetrical)", d: "Equal to Download (Symmetrical)" },
                                        { f: "Static IP Pools", s: "Optional / Rare", d: "Included By Default" },
                                        { f: "SLA Guarantee", s: "Best Effort Basis", d: "99.5%+ Written SLA" },
                                        { f: "Monitoring & Support", s: "Consumer Level / Ticketing", d: "24/7 Dedicated NOC Support" },
                                        { f: "Best Fit For", s: "Homes & Small Retailers", d: "Mission-Critical Enterprise" }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-[#0A192F]/05 hover:bg-[#F7F8FA] transition-colors">
                                            <td className="px-8 py-6 text-[#0A192F]/40 uppercase text-xs tracking-widest">{row.f}</td>
                                            <td className="px-8 py-6 text-sm">{row.s}</td>
                                            <td className="px-8 py-6 text-sm text-[#0A192F]">{row.d}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise Quote Form */}
            <section className="py-32 bg-[#F7F8FA] relative overflow-hidden">
                <GraySectionBg />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black text-[#0A192F] mb-8 tracking-tighter leading-tight uppercase">
                                    Request an <br />
                                    <span className="text-[#FBBF24]">Enterprise Quote.</span>
                                </h2>
                                <p className="text-xl text-[#0A192F]/55 mb-12 font-medium leading-relaxed">
                                    Connect with our enterprise solutions team to design a custom connectivity architecture for your organization.
                                </p>

                                <div className="space-y-8">
                                    <div className="flex gap-6 p-6 bg-white rounded-3xl border border-[#0A192F]/05 shadow-sm">
                                        <div className="w-14 h-14 rounded-2xl bg-[#FBBF24]/10 flex items-center justify-center text-[#FBBF24] shrink-0">
                                            <Shield size={28} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-[#0A192F]">Secure Implementation</h4>
                                            <p className="text-sm text-[#0A192F]/50">Engineered for security-first corporate environments.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-white rounded-3xl border border-[#0A192F]/05 shadow-sm">
                                        <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] shrink-0">
                                            <Gauge size={28} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-[#0A192F]">Priority Support SLA</h4>
                                            <p className="text-sm text-[#0A192F]/50">Direct access to senior NOC engineers 24/7/365.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(10,25,47,0.1)] border border-[#0A192F]/08"
                            >
                                <form className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 ml-2">Company Name</label>
                                            <input type="text" placeholder="Acme Corp" className="w-full bg-[#F7F8FA] border border-[#0A192F]/08 rounded-2xl px-6 py-4 outline-none focus:border-[#FBBF24] transition-all font-bold placeholder:text-[#0A192F]/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 ml-2">Contact Person</label>
                                            <input type="text" placeholder="Jane Doe" className="w-full bg-[#F7F8FA] border border-[#0A192F]/08 rounded-2xl px-6 py-4 outline-none focus:border-[#FBBF24] transition-all font-bold placeholder:text-[#0A192F]/20" />
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 ml-2">Work Email</label>
                                            <input type="email" placeholder="jane@acmecorp.com" className="w-full bg-[#F7F8FA] border border-[#0A192F]/08 rounded-2xl px-6 py-4 outline-none focus:border-[#FBBF24] transition-all font-bold placeholder:text-[#0A192F]/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 ml-2">Phone Number</label>
                                            <input type="text" placeholder="+91 90000 00000" className="w-full bg-[#F7F8FA] border border-[#0A192F]/08 rounded-2xl px-6 py-4 outline-none focus:border-[#FBBF24] transition-all font-bold placeholder:text-[#0A192F]/20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 ml-2">Solutions of Interest</label>
                                        <select className="w-full bg-[#F7F8FA] border border-[#0A192F]/08 rounded-2xl px-6 py-4 outline-none focus:border-[#FBBF24] transition-all font-bold text-[#0A192F]/60">
                                            <option>Dedicated Internet Leased Line (ILL / DIA)</option>
                                            <option>Managed Secure ILL</option>
                                            <option>Point-to-Point Leased Lines</option>
                                            <option>SD-WAN Services</option>
                                            <option>Cloud On-Ramp</option>
                                            <option>Colocation Hosting</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/40 ml-2">Additional Details</label>
                                        <textarea placeholder="Briefly describe your requirements or current challenges..." rows={4} className="w-full bg-[#F7F8FA] border border-[#0A192F]/08 rounded-2xl px-6 py-4 outline-none focus:border-[#FBBF24] transition-all font-bold placeholder:text-[#0A192F]/20 resize-none"></textarea>
                                    </div>
                                    <button className="w-full bg-[#FBBF24] text-[#0A192F] font-black py-6 rounded-2xl uppercase tracking-widest hover:bg-[#0A192F] hover:text-[#FBBF24] transition-all duration-300 shadow-xl flex items-center justify-center gap-3">
                                        Submit Inquiry <ArrowRight size={20} />
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Diagram Area (Visual) */}
            <section className="py-32 bg-[#F7F8FA] relative overflow-hidden">
                <GraySectionBg />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-[#0A192F] mb-8 tracking-tight leading-tight">
                                A Network That <br />
                                <span className="text-[#FBBF24]">Defies Downtime</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-[#0A192F]/55 mb-16 font-medium leading-relaxed">
                                Our self-healing fiber ring topology instantly recalculates optimal paths within milliseconds of detecting a physical cut or node failure.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                                {[
                                    { icon: <Shield size={32} />, title: "Secure", desc: "Enterprise UTM & DDoS mitigation at the edge." },
                                    { icon: <Zap size={32} />, title: "Lightning Fast", desc: "10G+ internal switching capacity." },
                                    { icon: <CheckCircle2 size={32} />, title: "Always Online", desc: "Proactive 24/7 intelligent NOC monitoring." }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/80 border border-[#0A192F]/08 p-8 rounded-3xl"
                                    >
                                        <div className="text-[#FBBF24] mb-6 flex justify-center">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-xl font-black text-[#0A192F] mb-2">{item.title}</h4>
                                        <p className="text-[#0A192F]/55 font-medium text-sm">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <a href="/infrastructure" className="btn-primary inline-flex">
                                Explore Enterprise Solutions
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InfrastructurePage;

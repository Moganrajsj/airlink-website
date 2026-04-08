"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { GraySectionBg, LightSectionBg } from '@/components/ui/AnimatedBackground';
import {
    Heart,
    Lightbulb,
    TrendingUp,
    Rocket,
    MapPin,
    Briefcase,
    Users,
    ArrowRight,
    Star,
    Upload,
    Mail
} from 'lucide-react';

const CareersPage = () => {
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

    const cultureCards = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Friendly Team Culture",
            description: "We're not just colleagues, we're friends who build cool stuff together."
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Growth Opportunities",
            description: "Your career path is yours to design. We provide the tools and support."
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Learning & Development",
            description: "Continuous learning budget, workshops, and mentorship programs."
        },
        {
            icon: <Rocket className="w-8 h-8" />,
            title: "Real Impact Projects",
            description: "Work on infrastructure that powers thousands of homes and businesses."
        }
    ];

    const whyWorkHere = [
        "We value ideas over titles",
        "We encourage experimentation",
        "We celebrate wins (big and small)",
        "We support continuous learning",
        "We believe in work-life balance",
        "We invest in your growth"
    ];

    const openPositions = [
        {
            title: "Marketing Executive",
            location: "Chennai, Tamil Nadu",
            description: "Drive our marketing initiatives, reach out to new B2B clients, and expand our market presence.",
            gender: "Male Only"
        },
        {
            title: "Technical Executive",
            location: "Chennai, Tamil Nadu",
            description: "Provide technical support, manage installations, and solve network and infrastructure challenges.",
            gender: "Male Only"
        },
        {
            title: "Collection Executive",
            location: "Chennai, Tamil Nadu",
            description: "Handle field collections, manage customer accounts, and ensure timely payment recoveries.",
            gender: "Male Only"
        },
        {
            title: "Tele Caller",
            location: "Chennai, Tamil Nadu",
            description: "Handle inbound/outbound calls, generate leads, and provide exceptional customer support.",
            gender: "Female Only"
        },
        {
            title: "Tally Operator",
            location: "Chennai, Tamil Nadu",
            description: "Manage day-to-day accounting, billing, and financial reconciliations using Tally ERP.",
            gender: "Female Only"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-[#0A192F] font-inter">
            {/* 1. Hero Section */}
            <section className="relative pt-60 pb-32 flex items-center justify-center overflow-hidden bg-[#0A192F]">
                <div className="absolute inset-0 bg-[url('/images/careers_hero_section.avif')] bg-cover bg-fixed bg-center opacity-80"></div>
                <div className="absolute inset-0 bg-[#0A192F]/40 backdrop-blur-[2px]"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] text-xs font-black tracking-[0.2em] uppercase mb-10 border border-[#FBBF24]/30 backdrop-blur-xl shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse"></span>
                            Join The Network
                        </span>
                        <h1 className="text-4xl md:text-[6.5rem] font-black text-white mb-8 tracking-[-0.04em] leading-[1.05] md:leading-[0.95]">
                            Build the Future <br />
                            <span className="text-[#FBBF24]">of Connectivity.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed mb-12 shadow-sm">
                            Join a team of visionaries engineering the digital infrastructure for Tamil Nadu's enterprises and homes.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-[#FBBF24] text-[#0A192F] font-black rounded-full hover:bg-white shadow-[0_20px_50px_rgba(251,191,36,0.3)] text-lg transition-all"
                        >
                            View Open Roles
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* 2. Culture Section */}
            <section className="py-32 bg-[#F7F8FA] relative overflow-hidden">
                <GraySectionBg />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-[#0A192F] mb-6 tracking-tight">
                                Life at <span className="text-[#FBBF24]">Airlink.</span>
                            </h2>
                            <p className="text-lg text-[#0A192F]/60 font-medium leading-relaxed">
                                We believe great network infrastructure starts with great people. We focus on engineering excellence, professional growth, and delivering real impact.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {cultureCards.map((card, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="bg-white p-10 rounded-[2rem] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgb(251,191,36,0.15)] hover:border-[#FBBF24]/30 transition-all duration-500 overflow-hidden group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#F7F8FA] flex items-center justify-center text-[#0A192F] mb-8 group-hover:bg-[#0A192F] group-hover:text-[#FBBF24] transition-all duration-500 shadow-sm">
                                    {card.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-[#0A192F] mb-4 leading-tight group-hover:text-[#FBBF24] transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-[#0A192F]/60 leading-relaxed font-medium">
                                    {card.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 3. Why Work Here */}
            <section className="py-32 bg-white relative overflow-hidden">
                <LightSectionBg />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-5/12">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-4 mb-8">
                                    <div className="w-12 h-[1px] bg-[#FBBF24]"></div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FBBF24]">Our Commitment</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-[#0A192F] mb-10 leading-[1.1] tracking-tight">
                                    Why You'll <span className="text-[#FBBF24]">Excel</span> <br />
                                    Working Here.
                                </h2>
                                <p className="text-xl text-[#0A192F]/60 mb-12 leading-relaxed font-medium">
                                    We provide an environment where technical expertise thrives and innovation is rewarded. Join us to build infrastructure that matters.
                                </p>

                                <div className="space-y-5">
                                    {whyWorkHere.map((reason, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-4 font-semibold text-[#0A192F] text-lg group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#FBBF24]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FBBF24] transition-colors border border-[#FBBF24]/20">
                                                <Star className="w-4 h-4 text-[#FBBF24] group-hover:text-white" fill="currentColor" />
                                            </div>
                                            {reason}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:w-7/12 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(10,25,47,0.1)] border border-[#E5E7EB]"
                            >
                                <div className="w-full relative bg-[#F7F8FA]">
                                    <img 
                                        src="/images/hiring_poster.jpg" 
                                        alt="Airlink Hiring Poster" 
                                        className="w-full h-auto object-contain rounded-[2.5rem]"
                                    />
                                </div>
                            </motion.div>
                            {/* Decorative background blob */}
                            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#FBBF24]/10 blur-3xl rounded-full z-0"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Open Positions */}
            <section className="py-32 bg-[#F7F8FA] relative overflow-hidden">
                <GraySectionBg />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-[#0A192F] mb-6 tracking-tight">
                                Current <span className="text-[#FBBF24]">Openings.</span>
                            </h2>
                            <p className="text-lg text-[#0A192F]/60 font-medium leading-relaxed">
                                Discover your next career move and help us engineer the future.
                            </p>
                        </motion.div>
                    </div>

                    <div className="max-w-5xl mx-auto space-y-6">
                        {openPositions.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#E5E7EB] hover:shadow-[0_15px_45px_rgb(251,191,36,0.1)] hover:border-[#FBBF24]/40 transition-all duration-300 group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-black text-[#0A192F] mb-4 group-hover:text-[#0A192F]/80 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-[#0A192F]/60 mb-6 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-[#FBBF24]" />
                                                <span className="font-semibold text-sm uppercase tracking-wide">{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-[#FBBF24]" />
                                                <span className="font-semibold text-sm uppercase tracking-wide">Full-time</span>
                                            </div>
                                            {job.gender && (
                                                <div className="flex items-center gap-2 bg-[#FBBF24]/10 text-[#0A192F] px-4 py-1.5 rounded-full border border-[#FBBF24]/20">
                                                    <Users className="w-4 h-4 text-[#FBBF24]" />
                                                    <span className="font-bold text-xs tracking-widest uppercase">{job.gender}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[#0A192F]/65 font-medium leading-relaxed text-lg">
                                            {job.description}
                                        </p>
                                    </div>
                                    <motion.a
                                        href={`mailto:info@srirambroadband.com?subject=Application for ${job.title}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-5 bg-[#0A192F] text-white font-black rounded-full hover:bg-[#112240] transition-all shadow-lg flex items-center gap-3 whitespace-nowrap"
                                    >
                                        Apply Now <ArrowRight className="w-5 h-5" />
                                    </motion.a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CTA / Send Resume */}
            <section className="py-32 bg-[#FBBF24] relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto border border-[#0A192F]/10 rounded-[2.5rem] md:rounded-[4rem] px-8 py-16 md:p-24 text-center relative overflow-hidden bg-white/40"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0A192F]/30 to-transparent" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-6xl font-black text-[#0A192F] mb-6 md:mb-8 tracking-tight leading-[1.1] md:leading-[1.05]">
                                Don't see a perfect fit?
                            </h2>
                            <p className="text-lg md:text-2xl text-[#0A192F]/65 max-w-3xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed">
                                Send us your resume. We are always on the lookout for talented engineering and business professionals.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <a 
                                    href="mailto:info@srirambroadband.com?subject=General Application - Resume Upload"
                                    className="px-12 py-6 bg-[#0A192F] text-white font-black rounded-full hover:-translate-y-1 transition-all shadow-xl text-lg flex items-center gap-3"
                                >
                                    <Upload className="w-5 h-5" />
                                    Upload Resume
                                </a>
                                <a 
                                    href="mailto:info@srirambroadband.com"
                                    className="flex items-center gap-3 text-[#0A192F]/80 font-bold text-lg hover:text-[#0A192F] transition-colors group px-8 py-5 border-2 border-[#0A192F]/20 rounded-full hover:border-[#0A192F]"
                                >
                                    <Mail className="w-5 h-5" />
                                    info@srirambroadband.com
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;

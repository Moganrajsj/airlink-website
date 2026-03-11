"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    Heart,
    Lightbulb,
    Users,
    TrendingUp,
    Coffee,
    Zap,
    Star,
    Upload,
    Mail,
    MapPin,
    Briefcase,
    ArrowRight
} from 'lucide-react';

const CareersPage = () => {
    const [hoveredWord, setHoveredWord] = useState<number | null>(null);

    const floatingWords = [
        { text: "Innovate", x: "10%", y: "20%" },
        { text: "Create", x: "80%", y: "15%" },
        { text: "Grow", x: "15%", y: "70%" },
        { text: "Collaborate", x: "75%", y: "65%" },
        { text: "Learn", x: "50%", y: "50%" }
    ];

    const cultureCards = [
        {
            icon: <Heart className="w-8 h-8" />,
            title: "Friendly Team Culture",
            description: "We're not just colleagues, we're friends who build cool stuff together"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Growth Opportunities",
            description: "Your career path is yours to design. We provide the tools and support"
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Learning & Development",
            description: "Continuous learning budget, workshops, and mentorship programs"
        },
        {
            icon: <Rocket className="w-8 h-8" />,
            title: "Real Impact Projects",
            description: "Work on infrastructure that powers thousands of homes and businesses"
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
            title: "Network Engineer",
            location: "Chennai, Tamil Nadu",
            description: "Build and maintain our fiber optic infrastructure across Tamil Nadu"
        },
        {
            title: "Full Stack Developer",
            location: "Chennai, Tamil Nadu",
            description: "Create amazing web experiences for our customers and internal tools"
        },
        {
            title: "Customer Success Manager",
            location: "Multiple Locations",
            description: "Help our customers get the most out of their Airlink connection"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-[#1F2933] font-inter selection:bg-[#FF6F00] selection:text-white overflow-hidden">
            {/* Fun Hero Section */}
            <section className="relative pt-52 pb-40 overflow-hidden bg-white">
                {/* Floating Words Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {floatingWords.map((word, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: hoveredWord === index ? 0.3 : 0.1,
                                scale: hoveredWord === index ? 1.2 : 1,
                                y: [0, -20, 0]
                            }}
                            transition={{
                                y: {
                                    duration: 4 + index,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                },
                                opacity: { duration: 0.3 },
                                scale: { duration: 0.3 }
                            }}
                            onMouseEnter={() => setHoveredWord(index)}
                            onMouseLeave={() => setHoveredWord(null)}
                            className="absolute text-6xl md:text-8xl font-black text-[#FF6F00] cursor-pointer"
                            style={{ left: word.x, top: word.y }}
                        >
                            {word.text}
                        </motion.div>
                    ))}
                </div>

                {/* Gradient Blobs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute top-[-20%] right-[-10%] w-[70%] h-[80%] bg-gradient-to-br from-[#FF6F00]/15 to-transparent blur-[160px] rounded-full"
                />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-7xl md:text-[8rem] font-black text-[#1F2933] mb-8 tracking-[-0.06em] leading-[0.9] text-balance">
                                Work With Us. <br />
                                Build the Internet. <br />
                                <span className="text-[#FF6F00] italic">Have Fun Doing It.</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-[#1F2933]/50 max-w-4xl mx-auto font-medium leading-[1.4] tracking-tight mb-16">
                                We're a team of builders, problem-solvers, and coffee-powered innovators.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-16 py-6 bg-[#FF6F00] text-white font-black rounded-3xl hover:bg-[#FF8F00] shadow-[0_20px_50px_rgba(255,111,0,0.3)] text-lg uppercase tracking-widest transition-all"
                            >
                                Join Our Team
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Interactive Culture Section */}
            <section className="py-40 bg-[#F7F7F8]">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-6xl md:text-[6rem] font-black text-[#1F2933] mb-8 tracking-[-0.04em]">
                                Life at <span className="text-[#FF6F00]">Airlink</span>
                            </h2>
                            <p className="text-2xl text-[#1F2933]/50 font-medium leading-relaxed">
                                We believe great internet starts with great people. We work hard, laugh often,
                                and solve real problems together.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {cultureCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group p-10 bg-white rounded-[2.5rem] border border-[#E5E7EB] hover:border-[#FF6F00] hover:shadow-2xl transition-all duration-500 cursor-pointer"
                            >
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-20 h-20 rounded-[1.5rem] bg-[#F7F7F8] flex items-center justify-center text-[#FF6F00] mb-8 group-hover:bg-[#FF6F00] group-hover:text-white transition-all duration-500"
                                >
                                    {card.icon}
                                </motion.div>
                                <h3 className="text-2xl font-black text-[#1F2933] mb-4">
                                    {card.title}
                                </h3>
                                <p className="text-lg text-[#1F2933]/50 font-medium leading-relaxed">
                                    {card.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Work With Us */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-6xl md:text-[6rem] font-black text-[#1F2933] mb-8 tracking-[-0.04em]">
                                Why You'll <span className="text-[#FF6F00]">Love</span> Working Here
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {whyWorkHere.map((reason, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, x: 10 }}
                                    className="flex items-center gap-6 p-8 bg-[#F7F7F8] rounded-3xl hover:bg-[#FF6F00] hover:text-white transition-all duration-500 cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[#FF6F00] flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-[#FF6F00] transition-all">
                                        <Star className="w-6 h-6" fill="currentColor" />
                                    </div>
                                    <p className="text-xl font-bold text-[#1F2933] group-hover:text-white transition-colors">
                                        {reason}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-40 bg-[#F7F7F8]">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-6xl md:text-[6rem] font-black text-[#1F2933] mb-8 tracking-[-0.04em]">
                                Open <span className="text-[#FF6F00]">Positions</span>
                            </h2>
                        </motion.div>

                        <div className="space-y-6">
                            {openPositions.map((job, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="group p-10 bg-white rounded-[2.5rem] border border-[#E5E7EB] hover:border-[#FF6F00] hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-black text-[#1F2933] mb-4 group-hover:text-[#FF6F00] transition-colors">
                                                {job.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-[#1F2933]/50 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="font-medium">{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4" />
                                                    <span className="font-medium">Full-time</span>
                                                </div>
                                            </div>
                                            <p className="text-lg text-[#1F2933]/50 font-medium">
                                                {job.description}
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-10 py-5 bg-[#FF6F00] text-white font-black rounded-2xl hover:bg-[#FF8F00] transition-all shadow-lg flex items-center gap-3 whitespace-nowrap"
                                        >
                                            Apply Now <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* No Perfect Role Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-16 p-12 bg-white rounded-[3rem] border-2 border-dashed border-[#FF6F00]/30 text-center"
                        >
                            <Coffee className="w-16 h-16 text-[#FF6F00] mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-[#1F2933] mb-4">
                                Don't see your dream role?
                            </h3>
                            <p className="text-lg text-[#1F2933]/50 font-medium mb-8">
                                Send us your resume anyway — we love meeting talented people.
                            </p>
                            <button className="px-12 py-5 bg-[#F7F7F8] text-[#1F2933] font-black rounded-2xl hover:bg-[#FF6F00] hover:text-white transition-all">
                                Send Resume
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Resume Submission CTA */}
            <section className="py-40 bg-[#1F2933] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-[#FF6F00]/20 blur-[160px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#FF8F00]/10 blur-[140px] rounded-full"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h2 className="text-6xl md:text-[7rem] font-black text-white mb-12 tracking-[-0.05em] leading-[0.9]">
                            Ready to Join the <br />
                            <span className="text-[#FF6F00]">Adventure?</span>
                        </h2>
                        <p className="text-2xl md:text-3xl text-white/50 mb-16 font-medium leading-relaxed">
                            We're always looking for passionate people who want to make a difference.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-16 py-8 bg-[#FF6F00] text-white font-black rounded-3xl hover:bg-[#FF8F00] transition-all shadow-[0_20px_50px_rgba(255,111,0,0.4)] text-xl uppercase tracking-widest flex items-center gap-4"
                            >
                                <Upload className="w-6 h-6" />
                                Upload Resume
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-4 text-white font-black text-xl hover:text-[#FF6F00] transition-colors group"
                            >
                                <Mail className="w-6 h-6" />
                                Email Us
                                <ArrowRight className="group-hover:translate-x-3 transition-transform duration-500" />
                            </motion.button>
                        </div>

                        <p className="mt-12 text-white/40 font-medium text-lg">
                            careers@airlink.in • We'll get back to you within 48 hours
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="h-6 bg-[#FF6F00]"></div>
        </div>
    );
};

export default CareersPage;

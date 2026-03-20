"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Zap,
    Check,
    ArrowRight,
    Clock,
    Tv,
    PlayCircle,
    TrendingUp,
    Infinity as InfinityIcon,
    Wifi,
    Laptop
} from 'lucide-react';
import PackageCard from '@/components/ui/PackageCard';
import OTTIcon from '@/components/ui/OTTIcon';

interface PackageDetail {
    id: string;
    name: string;
    speed: string;
    price: string;
    ottApps?: string[];
    bonus?: string;
    isPopular?: boolean;
}

const packages: PackageDetail[] = [
    {
        id: "pkg-300",
        name: "Airlink 300 Mbps",
        speed: "300",
        price: "999",
        isPopular: true,
        ottApps: ["Jio Hotstar", "Sun NXT", "Zee5", "SonyLIV", "OM TV", "PlayFlix", "Dollywood Play", "Fridaay", "DistroTV", "VR Me", "Short Friendly", "Aha"]
    },
    {
        id: "pkg-100",
        name: "Airlink 100 Mbps",
        speed: "100",
        price: "799",
        bonus: "YouTube 4K Streaming",
        ottApps: ["Sun NXT", "Zee5", "SonyLIV", "OM TV", "Fridaay", "Dollywood Play"]
    },
    {
        id: "pkg-50",
        name: "Airlink 50 Mbps",
        speed: "50",
        price: "599",
        ottApps: ["Sun NXT", "SonyLIV", "OM TV", "Dollywood Play", "Fridaay"]
    },
    {
        id: "pkg-40",
        name: "Airlink 40 Mbps",
        speed: "40",
        price: "499",
    },
    {
        id: "pkg-200",
        name: "Airlink 200 Mbps",
        speed: "200",
        price: "899",
        bonus: "YouTube 4K Streaming",
        ottApps: ["Jio Hotstar", "Sun NXT", "Zee5", "OM TV", "Dollywood Play", "Fridaay", "Aha"]
    },
    {
        id: "pkg-500",
        name: "Airlink 500 Mbps",
        speed: "500",
        price: "1299",
        ottApps: ["Sun NXT", "Amazon Prime", "Zee5", "SonyLIV", "Aha", "OM TV", "Dollywood Play", "Fridaay", "Fancode", "DistroTV", "VR Me", "Short Friendly", "PlayFlix", "Runn", "Hubhopper"]
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};


const PackagesPage = () => {
    return (
        <div className="min-h-screen bg-white text-[#1F2933] font-inter selection:bg-[#FF6F00] selection:text-white">
            {/* 1. Hero Section */}
            <section className="relative pt-52 pb-40 overflow-hidden bg-white">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        className="absolute top-[-20%] right-[-10%] w-[70%] h-[80%] bg-gradient-to-br from-[#FF6F00]/15 to-transparent blur-[160px] rounded-full"
                    />
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 0.3, x: 0 }}
                        transition={{ duration: 3, delay: 0.5 }}
                        className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[60%] bg-[#FF8F00]/5 blur-[120px] rounded-full"
                    />
                    {/* Animated network lines background */}
                    <div className="absolute inset-0 opacity-[0.03] grayscale bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-4 py-3 px-8 rounded-full bg-[#1F2933] text-white text-[10px] font-black tracking-[0.4em] uppercase mb-12 shadow-2xl">
                                <span className="w-2 h-2 rounded-full bg-[#FF6F00] animate-pulse"></span>
                                Ultra Broadband 2.0
                            </div>
                            <h1 className="text-7xl md:text-[8.5rem] font-black text-[#1F2933] mb-12 tracking-[-0.06em] leading-[0.85] text-balance">
                                The Speed You <br />
                                <span className="text-[#FF6F00] italic">Deserve.</span>
                            </h1>
                            <p className="text-2xl md:text-3xl text-[#1F2933]/50 max-w-4xl mx-auto font-medium leading-[1.4] tracking-tight">
                                High-speed fiber packages with 15+ premium entertainment apps built in.
                                Experience the next standard of home connectivity.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. Packages Grid */}
            <section className="pb-40 pt-10 bg-white relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {packages.map((pkg) => (
                            <PackageCard
                                key={pkg.id}
                                name={pkg.name}
                                speed={pkg.speed}
                                price={pkg.price}
                                isPopular={pkg.isPopular}
                                ottApps={pkg.ottApps}
                                bonus={pkg.bonus}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Coverage Checker Section */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-4 mb-10">
                                <div className="w-16 h-[2px] bg-[#FF6F00]"></div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FF6F00]">Service Availability</span>
                                <div className="w-16 h-[2px] bg-[#FF6F00]"></div>
                            </div>
                            <h2 className="text-5xl md:text-[5rem] font-black text-[#1F2933] mb-8 leading-[1.0] tracking-[-0.04em]">
                                Check Service Availability <br />
                                <span className="text-[#FF6F00]">in Your Area</span>
                            </h2>
                            <p className="text-xl text-[#1F2933]/50 font-medium">
                                Enter your location to see if Airlink is available in your neighborhood
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-12 rounded-[3rem] border-2 border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:border-[#FF6F00] transition-all duration-500"
                        >
                            <div className="space-y-6">
                                {/* Location Input */}
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-[0.2em] text-[#1F2933]/60 mb-4">
                                        Your Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your street address or area"
                                        className="w-full px-8 py-6 bg-[#F7F7F8] border-2 border-transparent rounded-2xl text-lg font-medium text-[#1F2933] placeholder:text-[#1F2933]/30 focus:outline-none focus:border-[#FF6F00] focus:bg-white transition-all duration-300"
                                    />
                                </div>

                                {/* City Dropdown */}
                                <div>
                                    <label className="block text-sm font-black uppercase tracking-[0.2em] text-[#1F2933]/60 mb-4">
                                        City
                                    </label>
                                    <select className="w-full px-8 py-6 bg-[#F7F7F8] border-2 border-transparent rounded-2xl text-lg font-medium text-[#1F2933] focus:outline-none focus:border-[#FF6F00] focus:bg-white transition-all duration-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23FF6F00%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:24px] bg-[right_1.5rem_center] bg-no-repeat">
                                        <option value="">Select your city</option>
                                        <option value="chennai">Chennai</option>
                                        <option value="coimbatore">Coimbatore</option>
                                        <option value="madurai">Madurai</option>
                                        <option value="tiruchirappalli">Tiruchirappalli</option>
                                        <option value="salem">Salem</option>
                                        <option value="tirunelveli">Tirunelveli</option>
                                        <option value="tiruppur">Tiruppur</option>
                                        <option value="vellore">Vellore</option>
                                        <option value="erode">Erode</option>
                                        <option value="thoothukkudi">Thoothukkudi</option>
                                    </select>
                                </div>

                                {/* Check Availability Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full px-12 py-8 bg-[#FF6F00] text-white font-black rounded-2xl hover:bg-[#FF8F00] transition-all shadow-[0_10px_30px_rgba(255,111,0,0.3)] text-xl uppercase tracking-widest flex items-center justify-center gap-4 group"
                                >
                                    Check Availability
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </motion.button>
                            </div>

                            {/* Info Text */}
                            <p className="mt-8 text-center text-sm font-medium text-[#1F2933]/40">
                                We'll check if our fiber network reaches your area and get back to you within 24 hours
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. OTT Benefits Highlight */}
            <section className="py-40 bg-[#F7F7F8] relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-32">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-[45%]"
                        >
                            <div className="inline-flex items-center gap-4 mb-10">
                                <div className="w-16 h-[2px] bg-[#FF6F00]"></div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FF6F00]">Premium Ecosystem</span>
                            </div>
                            <h2 className="text-6xl md:text-[5.5rem] font-black text-[#1F2933] mb-12 leading-[1.0] tracking-[-0.04em]">
                                One Cable. <br />
                                <span className="text-[#FF6F00]">Infinite Show.</span>
                            </h2>
                            <p className="text-2xl text-[#1F2933]/50 mb-16 leading-relaxed font-medium">
                                Our packages come bundled with a curated selection of premium OTT subscriptions,
                                streamed over our ultra-low latency fiber core.
                            </p>

                            <div className="space-y-12">
                                {[
                                    { icon: <PlayCircle className="w-8 h-8 text-[#FF6F00]" />, title: "Cinema Library", desc: "Access to 50,000+ hours of content" },
                                    { icon: <Tv className="w-8 h-8 text-[#FF6F00]" />, title: "Live Sports", desc: "No-lag streaming for major leagues" },
                                    { icon: <InfinityIcon className="w-8 h-8 text-[#FF6F00]" />, title: "Max Bandwidth", desc: "Symmetrical upload & download" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center border border-[#E5E7EB] group-hover:bg-[#FF6F00] group-hover:text-white group-hover:-rotate-6 transition-all duration-500 shadow-sm shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-[#1F2933] mb-2">{item.title}</h4>
                                            <p className="text-lg font-medium text-[#1F2933]/40 tracking-tight">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="lg:w-[55%] relative"
                        >
                            <div className="relative p-3 bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-[#E5E7EB]">
                                <div className="bg-[#1F2933] rounded-[3.5rem] p-20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6F00]/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 relative z-10">
                                        {[
                                            "Jio Hotstar", "Sun NXT", "Amazon Prime", "Zee5", "SonyLIV", "Aha", "DistroTV", "Fancode", "OM TV", "Fridaay"
                                        ].map((app, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center gap-4 hover:border-[#FF6F00] transition-all group"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-white p-2 shadow-2xl group-hover:scale-110 transition-transform">
                                                    <OTTIcon name={app} className="w-full h-full" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">{app}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                {/* Floating Decorative Element */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-10 w-32 h-32 rounded-[2rem] bg-[#FF6F00] flex items-center justify-center text-white shadow-2xl rotate-12"
                                >
                                    <Wifi size={48} />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. CTA Section */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#1F2933] rounded-[5rem] p-24 md:p-32 text-center relative overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.2)]"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-[#FF6F00]/20 blur-[160px] rounded-full"></div>
                        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#FF8F00]/10 blur-[140px] rounded-full"></div>

                        <div className="relative z-10 max-w-5xl mx-auto">
                            <span className="text-[#FF6F00] font-black text-xs tracking-[0.5em] uppercase mb-12 block">Fastest In Tamil Nadu</span>
                            <h2 className="text-6xl md:text-[7.5rem] font-black text-white mb-16 tracking-[-0.05em] leading-[0.8] text-balance">
                                Elevate Your <br />
                                <span className="text-[#FF6F00]">Digital Life.</span>
                            </h2>
                            <p className="text-2xl md:text-3xl text-white/50 max-w-4xl mx-auto mb-20 font-medium leading-relaxed tracking-tight">
                                Seamless connectivity for homes and businesses. Pick your speed and get connected in less than 24 hours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
                                <button className="px-20 py-8 bg-[#FF6F00] text-white font-black rounded-3xl hover:bg-[#FF8F00] transition-all hover:scale-110 active:scale-95 shadow-[0_20px_50px_rgba(255,111,0,0.4)] text-xl uppercase tracking-widest">
                                    Order Now
                                </button>
                                <button className="flex items-center gap-4 text-white font-black text-xl hover:text-[#FF6F00] transition-colors group">
                                    Contact Support <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="h-6 bg-[#FF6F00]"></div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F7F7F8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF6F00;
        }
        .mask-fade-right {
          mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
      `}</style>
        </div>
    );
};

export default PackagesPage;

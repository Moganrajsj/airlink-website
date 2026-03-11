"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Search,
    Wifi,
    Camera,
    ShieldCheck,
    ArrowRight,
    Star,
    TrendingUp,
    CheckCircle2,
    Phone,
    MessageSquare,
    ChevronRight,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { LightHeroBg, LightSectionBg, GraySectionBg } from '@/components/ui/AnimatedBackground';
import Link from 'next/link';
import ShopBanner from '@/components/banners/ShopBanner';
import { getActiveBannersByType } from '@/app/actions/banners';
import type { Banner } from '@prisma/client';

const ShopPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [banners, setBanners] = useState<Banner[]>([]);

    React.useEffect(() => {
        const fetchBanners = async () => {
            const res = await getActiveBannersByType('shop');
            if (res.success && res.banners) {
                setBanners(res.banners);
            }
        };
        fetchBanners();
    }, []);

    const categories = [
        { id: 'All', name: 'All Products', icon: <ShoppingCart size={18} /> },
        { id: 'Routers', name: 'WiFi Routers', icon: <Wifi size={18} /> },
        { id: 'CCTV', name: 'CCTV Cameras', icon: <Camera size={18} /> },
        { id: 'Security', name: 'Internet Security', icon: <ShieldCheck size={18} /> },
    ];

    const products = [
        {
            id: 1,
            category: 'Routers',
            name: 'TP-Link Archer AX10',
            price: 460,
            originalPrice: 899,
            rating: 4.8,
            reviews: 124,
            description: 'A powerful WiFi router designed to deliver stable and high-speed internet connectivity. Perfect for streaming, gaming, video calls, and smart home devices.',
            keywords: ['wifi router for fiber broadband', 'high speed wireless router'],
            tag: 'Best Seller'
        },
        {
            id: 2,
            category: 'Routers',
            name: 'Router YI11 Wireless',
            price: 260,
            originalPrice: 450,
            rating: 4.5,
            reviews: 89,
            description: 'Affordable wireless router designed for reliable internet access. Ideal for small homes and offices requiring stable and consistent broadband connectivity.',
            keywords: ['best budget wifi router', 'router for broadband internet'],
            tag: 'Budget Pick'
        },
        {
            id: 3,
            category: 'Routers',
            name: 'Airlink Router White',
            price: 250,
            originalPrice: 399,
            rating: 4.3,
            reviews: 56,
            description: 'Compact and efficient WiFi router that provides strong signal coverage and smooth internet performance for everyday browsing and streaming.',
            keywords: ['home wifi router', 'router for high speed internet']
        },
        {
            id: 4,
            category: 'Routers',
            name: 'TP Link Router KN008',
            price: 460,
            originalPrice: 750,
            rating: 4.9,
            reviews: 210,
            description: 'Advanced wireless router designed for high-speed fiber internet networks. Supports multiple devices with stable connectivity and excellent signal strength.',
            keywords: ['fiber broadband router', 'router for gaming and streaming'],
            tag: 'Ultra Fast'
        },
        {
            id: 5,
            category: 'CCTV',
            name: 'CC Camera Pro LP03',
            price: 230,
            originalPrice: 499,
            rating: 4.7,
            reviews: 145,
            description: 'High-definition CCTV camera designed for clear video monitoring. Ideal for homes, offices, and retail stores.',
            keywords: ['cctv camera for home security', 'hd security camera system'],
            tag: 'Top Rated'
        },
        {
            id: 6,
            category: 'CCTV',
            name: 'CC Camera LP4 Standard',
            price: 200,
            originalPrice: 350,
            rating: 4.4,
            reviews: 78,
            description: 'Reliable security camera for everyday monitoring. Provides dependable surveillance for homes and offices.',
            keywords: ['home surveillance camera', 'security camera for office']
        },
        {
            id: 7,
            category: 'CCTV',
            name: 'CC Camera Pro LP1 Smart',
            price: 230,
            originalPrice: 450,
            rating: 4.6,
            reviews: 92,
            description: 'Advanced CCTV monitoring solution designed for enhanced security and remote access surveillance.',
            keywords: ['smart security camera', 'cctv system for business'],
            tag: 'New Arrival'
        },
        {
            id: 8,
            category: 'Security',
            name: 'Airlink NetShield Security',
            price: 70,
            originalPrice: 150,
            rating: 5.0,
            reviews: 320,
            description: 'Essential security software designed to protect your internet connection and devices from online threats such as malware, phishing attacks, and cyber risks.',
            keywords: ['internet security software', 'network protection tools'],
            tag: 'Essential'
        }
    ];

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-white text-[#0A192F] font-inter">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-white">
                <LightHeroBg />
                <div className="container mx-auto px-6 relative z-10 pt-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] uppercase text-sm font-bold tracking-[0.2em] mb-8 border border-[#FBBF24]/20">
                                <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse"></span>
                                Broadband Accessories Shop
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#0A192F] mb-8 tracking-tight leading-tight">
                                Smart Devices for <br />
                                <span className="text-[#FBBF24]">Faster & Safer Internet.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-[#0A192F]/50 max-w-2xl font-medium leading-relaxed mb-10">
                                Upgrade your broadband experience with high-quality networking devices designed for modern homes and businesses. Powerful WiFi routers, advanced CCTV security, and essential digital safety tools.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="cursor-target btn-primary"
                                >
                                    Browse Products <ArrowRight size={20} />
                                </button>
                                <Link
                                    href="/contact"
                                    className="cursor-target px-8 py-4 bg-[#0A192F]/05 text-[#0A192F] font-bold rounded-full border border-[#0A192F]/10 hover:bg-[#0A192F]/10 transition-all flex items-center gap-2"
                                >
                                    Expert Consultation <MessageSquare size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Shop Banner Promotion */}
            {banners.length > 0 && <ShopBanner banner={banners[0]} />}

            {/* Category Filter Section */}
            <section className="sticky top-[80px] z-50 bg-white/80 backdrop-blur-xl border-y border-[#0A192F]/05 py-4">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
                        <div className="flex items-center gap-2 mr-6 text-[#0A192F]/40 font-bold uppercase text-[10px] tracking-widest min-w-fit">
                            <Filter size={14} /> Filter By:
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`cursor-target flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm whitespace-nowrap
                                    ${activeCategory === cat.id
                                        ? 'bg-[#0A192F] text-white shadow-lg'
                                        : 'bg-[#F7F8FA] text-[#0A192F]/50 hover:bg-[#FBBF24]/10 hover:text-[#0A192F] border border-[#0A192F]/05'
                                    }`}
                            >
                                {cat.icon}
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Listing Section */}
            <section id="products" className="py-24 bg-white relative">
                <LightSectionBg variant="dots" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-[#0A192F] mb-6 tracking-tight">
                                Shop <span className="text-[#FBBF24]">Networking Devices</span> for Your Broadband
                            </h2>
                            <p className="text-lg text-[#0A192F]/55 font-medium">
                                Explore our collection of reliable networking devices designed to improve internet speed, strengthen wireless coverage, and protect your home or office network.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-bold text-[#0A192F]/40 uppercase tracking-widest">
                            Showing {filteredProducts.length} Results
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="group bg-white rounded-[2.5rem] border border-[#0A192F]/08 hover:border-[#FBBF24]/40 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(10,25,47,0.08)] flex flex-col overflow-hidden"
                                >
                                    {/* Product Image Placeholder */}
                                    <div className="aspect-square bg-[#F7F8FA] relative overflow-hidden flex items-center justify-center group-hover:bg-[#FBBF24]/05 transition-colors duration-500">
                                        <div className="text-[#0A192F]/10 transform group-hover:scale-110 transition-transform duration-700">
                                            {product.category === 'Routers' && <Wifi size={120} strokeWidth={1} />}
                                            {product.category === 'CCTV' && <Camera size={120} strokeWidth={1} />}
                                            {product.category === 'Security' && <ShieldCheck size={120} strokeWidth={1} />}
                                        </div>

                                        {/* Tag */}
                                        {product.tag && (
                                            <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0A192F] text-white text-[10px] font-black uppercase tracking-widest rounded-full z-10">
                                                {product.tag}
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-[#0A192F]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="cursor-target bg-[#FBBF24] text-[#0A192F] px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                Order Now
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FBBF24] mb-1">
                                                {product.category}
                                            </div>
                                            <div className="flex items-center gap-1 text-[#FBBF24]">
                                                <Star size={12} fill="#FBBF24" />
                                                <span className="text-xs font-bold text-[#0A192F]">{product.rating}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-[#0A192F] mb-3 group-hover:text-[#FBBF24] transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm text-[#0A192F]/50 font-medium leading-relaxed mb-6 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-[#0A192F]/05 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[#0A192F]/30 uppercase tracking-widest line-through">₹{product.originalPrice}</span>
                                                <span className="text-2xl font-black text-[#0A192F]">₹{product.price}</span>
                                            </div>
                                            <button className="cursor-target w-12 h-12 rounded-2xl bg-[#F7F8FA] border border-[#0A192F]/05 flex items-center justify-center text-[#0A192F] group-hover:bg-[#FBBF24] group-hover:border-[#FBBF24] transition-all">
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hidden SEO Keywords for indexers */}
                                    <div className="sr-only">
                                        {product.keywords.join(', ')}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Why Buy Section */}
            <section className="py-32 bg-[#F7F8FA] relative overflow-hidden">
                <GraySectionBg />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-[#0A192F] mb-8 tracking-tight leading-tight uppercase">
                                Why Choose <span className="text-[#FBBF24]">Airlink Devices?</span>
                            </h2>
                            <p className="text-xl text-[#0A192F]/55 mb-12 font-medium leading-relaxed">
                                Don't let low-quality hardware bottleneck your high-speed fiber connection. Our devices are hand-picked and tested for maximum compatibility with Airlink fiber infrastructure.
                            </p>

                            <div className="space-y-6">
                                {[
                                    "Optimized for fiber broadband networks",
                                    "Reliable performance and strong signal coverage",
                                    "Affordable pricing for homes and businesses",
                                    "Easy installation and configuration",
                                    "Local technical support and service assistance"
                                ].map((point, i) => (
                                    <div key={i} className="flex items-center gap-4 text-lg font-bold text-[#0A192F]">
                                        <div className="w-6 h-6 rounded-full bg-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] shrink-0">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-[#FBBF24]/10 rounded-full blur-[100px] -z-10 animate-pulse" />
                            <div className="bg-white p-12 rounded-[3.5rem] border border-[#0A192F]/08 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/10 rounded-bl-[100px]" />
                                <TrendingUp size={48} className="text-[#FBBF24] mb-8" />
                                <h3 className="text-3xl font-black text-[#0A192F] mb-6 tracking-tight leading-tight">
                                    Boost Your <span className="text-[#FBBF24]">Network Speed</span> by up to 40%
                                </h3>
                                <p className="text-lg text-[#0A192F]/50 font-medium leading-relaxed mb-8">
                                    Standard routers often struggle with high-speed fiber. Our WiFi 6 enabled devices ensure you get the speed you pay for, everywhere in your home.
                                </p>
                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#0A192F]/05">
                                    <div>
                                        <div className="text-4xl font-black text-[#0A192F]">10G+</div>
                                        <div className="text-[10px] font-bold text-[#0A192F]/40 uppercase tracking-widest mt-1">Core Backbone</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-black text-[#0A192F]">99.5%</div>
                                        <div className="text-[10px] font-bold text-[#0A192F]/40 uppercase tracking-widest mt-1">Uptime SLA</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support / Help Section */}
            <section className="py-32 bg-white relative">
                <LightSectionBg variant="particles" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-[#0A192F] mb-8 tracking-tight uppercase">
                            Need Help Choosing the <span className="text-[#FBBF24]">Right Device?</span>
                        </h2>
                        <p className="text-xl text-[#0A192F]/55 mb-12 font-medium leading-relaxed">
                            Our broadband experts can help you select the best router, CCTV camera, or security solution for your home or business network.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/contact" className="cursor-target btn-primary">
                                Contact Support <ArrowUpRight size={20} />
                            </Link>
                            <a href="tel:+919345217979" className="cursor-target px-10 py-5 bg-[#0A192F] text-white font-black rounded-2xl flex items-center gap-4 hover:bg-[#0A192F]/90 transition-all shadow-xl">
                                <Phone size={20} /> Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-[#FBBF24] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #0A192F 0px, #0A192F 1px, transparent 1px, transparent 24px)' }} />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-[#0A192F] rounded-[4rem] p-16 md:p-24 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-12">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight uppercase">
                                Upgrade Your <br />
                                <span className="text-[#FBBF24]">Broadband Setup Today</span>
                            </h2>
                            <p className="text-white/60 text-lg font-medium">
                                Discover powerful networking devices designed to deliver faster speeds, stronger connectivity, and improved security for your digital lifestyle.
                            </p>
                        </div>
                        <button
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="cursor-target bg-[#FBBF24] text-[#0A192F] px-12 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform duration-300 shadow-2xl shadow-[#0A192F]/50"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShopPage;

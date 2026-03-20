"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Wifi,
    Camera,
    ShieldCheck,
    ArrowRight,
    MessageSquare,
    CheckCircle2
} from 'lucide-react';
import { LightHeroBg, GraySectionBg } from '@/components/ui/AnimatedBackground';
import Link from 'next/link';
import Image from 'next/image';

// ── Product Data ──────────────────────────────────────────────────────────────

const cctvProducts = [
    {
        id: 'cctv-1',
        name: 'Hikvision DS-2CE16H0T-ITPFS 5MP Bullet Camera',
        price: '2,595',
        image: '/images/products/Hikvision DS-2CE16H0T-ITPFS Bullet Camera.webp',
        description: 'Ultra-clear outdoor security camera with built-in microphone and night vision.',
        features: [
            '5MP high-resolution video (2560 × 1944)',
            'Smart IR night vision up to 25 meters',
            'Built-in microphone audio recording',
            'IP67 weatherproof design',
            'Digital WDR technology'
        ]
    },
    {
        id: 'cctv-2',
        name: 'Hikvision DS-2CE76H0T-ITPFS 5MP Dome Camera',
        price: '2,450',
        image: '/images/products/Hikvision DS-2CE76H0T-ITPFS Dome Camera.webp',
        description: 'Compact indoor dome camera ideal for home and office surveillance.',
        features: [
            '5MP resolution',
            'Wide angle lens',
            'IR night vision',
            'Indoor installation',
            'HD Turbo video output'
        ]
    },
    {
        id: 'cctv-3',
        name: 'Hikvision DS-2CD1023G0-I IP Camera',
        price: '3,800',
        image: '/images/products/Hikvision DS-2CE16D0T-IRP Bullet Camera.webp',
        description: 'High-performance IP network camera designed for advanced surveillance systems.',
        features: [
            'Full HD 1080p video',
            'Smart motion detection',
            'H.265 video compression',
            '30m night vision',
            'Weather resistant body'
        ]
    },
    {
        id: 'cctv-4',
        name: 'Hikvision DS-2CE16D0T-IRP HD Bullet Camera',
        price: '1,950',
        image: '/images/products/Hikvision DS-2CE16D0T-IRP Bullet Camera (2).webp',
        description: 'Affordable outdoor security camera with clear night monitoring.',
        features: [
            'HD 1080p resolution',
            'Smart IR night vision',
            '20m night range',
            'Weatherproof body',
            'Reliable performance'
        ]
    },
    {
        id: 'cctv-5',
        name: 'Hikvision DS-2CE76D0T-ITMF Turret Camera',
        price: '2,750',
        image: '/images/products/Hikvision DS-2CE76D0T-ITMF Turret Camera.webp',
        description: 'Wide-angle surveillance camera for indoor & outdoor monitoring.',
        features: [
            '2MP Full HD camera',
            '30m night vision',
            'Turret design',
            'Wide dynamic range',
            'Easy installation'
        ]
    }
];

const routerProducts = [
    {
        id: 'router-1',
        name: 'TP-Link Archer C6 AC1200 Dual Band Router',
        price: '2,599',
        image: '/images/products/TP-Link Archer C6 Router.webp',
        description: 'High-performance dual-band router designed for high-speed broadband connections.',
        features: [
            'AC1200 Dual-Band WiFi',
            '867 Mbps (5GHz) + 400 Mbps (2.4GHz)',
            'MU-MIMO technology',
            '4 high-gain antennas',
            'Gigabit ports for ultra-fast connections'
        ]
    },
    {
        id: 'router-2',
        name: 'TP-Link Archer C20 AC750 Dual Band Router',
        price: '2,299',
        image: '/images/products/TP-Link Archer C20 Router.webp',
        description: 'Reliable dual-band router for homes and small offices.',
        features: [
            'AC750 WiFi speed',
            '433 Mbps (5GHz) + 300 Mbps (2.4GHz)',
            '3 external antennas',
            'Stable coverage for apartments'
        ]
    },
    {
        id: 'router-3',
        name: 'TP-Link Archer C64 AC1200 Router',
        price: '3,199',
        image: '/images/products/TP-Link Archer C64 Router.webp',
        description: 'Modern high-performance router with wide coverage and strong signals.',
        features: [
            'AC1200 high-speed WiFi',
            '4 antennas for extended coverage',
            'Smart connect technology',
            'Parental control options'
        ]
    },
    {
        id: 'router-4',
        name: 'TP-Link Archer A6 Gigabit Router',
        price: '2,999',
        image: '/images/products/TP-Link Archer A6 Router.webp',
        description: 'Fast and reliable router designed for streaming, gaming, and high-speed internet.',
        features: [
            'Dual band WiFi',
            'Gigabit Ethernet ports',
            'Beamforming technology',
            'Access point mode'
        ]
    },
    {
        id: 'router-5',
        name: 'TP-Link TL-WR841N Wireless Router',
        price: '1,699',
        image: '/images/products/TP-Link TL-WR841N Router.webp',
        description: 'Budget friendly router ideal for small homes.',
        features: [
            '300 Mbps wireless speed',
            'Stable signal coverage',
            'Easy setup',
            'Parental control'
        ]
    }
];

// ── Product Card ──────────────────────────────────────────────────────────────

const ProductCard = ({ product, type }: { product: any; type: 'cctv' | 'router' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col bg-white rounded-3xl border border-[#0A192F]/08 overflow-hidden hover:shadow-2xl hover:shadow-[#0A192F]/10 hover:border-[#FBBF24]/40 transition-all duration-300 group"
    >
        {/* Image Area */}
        <div className="bg-white aspect-square p-2 flex flex-col items-center justify-center relative border-b border-[#0A192F]/05 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#0A192F]/05 group-hover:opacity-0 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#FBBF24]/05 to-[#0A192F]/05 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative w-full h-full z-10 p-4 transform group-hover:scale-105 transition-transform duration-500">
                <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                />
            </div>

            {/* Brand Badge */}
            <span className="absolute top-4 left-4 bg-[#0A192F] text-[#FBBF24] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow z-20">
                {type === 'cctv' ? 'Hikvision' : 'TP-Link'}
            </span>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-base font-black text-[#0A192F] mb-2 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-[#FBBF24] transition-colors">
                {product.name}
            </h3>
            <p className="text-xs text-[#0A192F]/50 font-medium mb-4 line-clamp-2">
                {product.description}
            </p>

            {/* Features */}
            <div className="flex-grow">
                <ul className="space-y-1.5 mb-6 text-[11px] text-[#0A192F]/60 font-medium">
                    {product.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 size={11} className="text-[#FBBF24] mt-0.5 shrink-0" />
                            <span className="line-clamp-1" title={feature}>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price & CTA */}
            <div className="mt-auto pt-4 border-t border-[#0A192F]/06">
                <div className="flex flex-col mb-4">
                    <span className="text-[9px] uppercase font-bold text-[#0A192F]/30 tracking-widest">MRP</span>
                    <div className="text-2xl font-black text-[#0A192F]">₹{product.price}</div>
                </div>

                <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="w-full py-3 px-4 bg-[#0A192F] hover:bg-[#FBBF24] text-white hover:text-[#0A192F] text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
                >
                    Enquire Now <MessageSquare size={14} />
                </Link>
            </div>
        </div>
    </motion.div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-white text-[#0A192F] font-inter">

            {/* Hero */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-white">
                <LightHeroBg />
                <div className="container mx-auto px-6 relative z-10 pt-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] uppercase text-xs font-black tracking-[0.2em] mb-6 border border-[#FBBF24]/20">
                                <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                                Airlink Device Store
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-[#0A192F] mb-6 tracking-tight leading-[1.1]">
                                Premium Devices for <br />
                                <span className="text-[#FBBF24]">Smart Connectivity.</span>
                            </h1>
                            <p className="text-xl text-[#0A192F]/50 max-w-2xl font-medium leading-relaxed mb-10">
                                Handpicked TP-Link routers and Hikvision CCTV security systems to upgrade your home or office infrastructure.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => document.getElementById('cctv-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="btn-primary"
                                >
                                    View Cameras <Camera size={18} />
                                </button>
                                <button
                                    onClick={() => document.getElementById('router-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-[#0A192F]/05 text-[#0A192F] font-bold rounded-full border border-[#0A192F]/10 hover:bg-[#0A192F]/10 transition-all flex items-center gap-2"
                                >
                                    View Routers <Wifi size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CCTV Section */}
            <section id="cctv-section" className="py-24 bg-white relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="mb-14">
                        <h2 className="text-3xl md:text-5xl font-black text-[#0A192F] tracking-tight">
                            CCTV Security Cameras
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {cctvProducts.map(product => (
                            <ProductCard key={product.id} product={product} type="cctv" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Router Section */}
            <section id="router-section" className="py-24 bg-[#F7F8FA] border-y border-[#0A192F]/05 relative overflow-hidden">
                <GraySectionBg />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="mb-14">
                        <h2 className="text-3xl md:text-5xl font-black text-[#0A192F] tracking-tight">
                            WiFi Routers
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {routerProducts.map(product => (
                            <ProductCard key={product.id} product={product} type="router" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-24 bg-[#FBBF24] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #0A192F 0px, #0A192F 1px, transparent 1px, transparent 24px)' }} />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-[#0A192F] rounded-[4rem] p-16 md:p-24 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-12">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-black uppercase tracking-[0.2em] mb-6 border border-[#FBBF24]/20">
                                <ShieldCheck size={14} /> Expert Advice
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight uppercase">
                                Need Help Choosing the <span className="text-[#FBBF24]">Right Device?</span>
                            </h2>
                            <p className="text-white/60 text-lg font-medium">
                                Contact our experts to find the best CCTV cameras and WiFi routers for your home or office.
                            </p>
                        </div>
                        <Link
                            href="/contact"
                            className="bg-[#FBBF24] text-[#0A192F] px-12 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform duration-300 shadow-2xl shadow-[#0A192F]/50 flex items-center gap-3 whitespace-nowrap"
                        >
                            Talk to Our Experts <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight, Wifi } from 'lucide-react';
import { LightSectionBg } from '@/components/ui/AnimatedBackground';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-[#F7F8FA] text-[#0A192F] pt-28 pb-10 overflow-hidden border-t border-[#0A192F]/06">
            <LightSectionBg variant="particles" />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/50 to-transparent" />

            {/* Background decorative rings */}
            <div className="absolute right-[-100px] top-[-100px] w-[500px] h-[500px] rounded-full border border-[#FBBF24]/08 pointer-events-none" />
            <div className="absolute right-[-60px] top-[-60px] w-[350px] h-[350px] rounded-full border border-[#FBBF24]/05 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-20">

                    {/* Brand column */}
                    <div className="space-y-7">
                        <Link href="/" className="cursor-target group inline-flex flex-col">
                            <img
                                src="/airlink-logo.png"
                                alt="Airlink Broadband"
                                className="h-16 md:h-20 w-auto object-contain"
                            />
                        </Link>

                        <p className="text-[#0A192F]/55 text-sm leading-relaxed max-w-xs font-medium">
                            Sriram Broadband Services Private Limited. Delivering speed beyond your thinking with futuristic fiber infrastructure — trusted across Tamil Nadu.
                        </p>

                        {/* Social links */}
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="cursor-target w-10 h-10 rounded-xl border border-[#0A192F]/10 flex items-center justify-center text-[#0A192F]/40 hover:border-[#FBBF24]/50 hover:text-[#FBBF24] transition-all duration-300 hover:-translate-y-1 bg-white"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company links */}
                    <div>
                        <h4 className="text-[#FBBF24] font-black mb-7 uppercase tracking-[0.25em] text-[10px] flex items-center gap-2">
                            <span className="w-6 h-px bg-[#FBBF24]/60 inline-block" /> Company
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Plans', href: '/plans' },
                                { name: 'Infrastructure', href: '/infrastructure' },
                                { name: 'Speed Test', href: '/speed-test' },
                                { name: 'Coverage Map', href: '/coverage' },
                                { name: 'Shop', href: '/shop' },
                                { name: 'About', href: '/about' },
                                { name: 'Contact Us', href: '/contact' },

                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="cursor-target text-[#0A192F]/55 hover:text-[#0A192F] text-sm font-semibold transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-[#FBBF24] transition-all duration-300 inline-block" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h4 className="text-[#FBBF24] font-black mb-7 uppercase tracking-[0.25em] text-[10px] flex items-center gap-2">
                            <span className="w-6 h-px bg-[#FBBF24]/60 inline-block" /> Solutions
                        </h4>
                        <ul className="space-y-4">
                            {['Residential Fiber', 'Business Leased Line', 'SD-WAN Solutions', 'Cloud Connectivity', 'Managed Security', 'Colocation'].map((s) => (
                                <li key={s}>
                                    <span className="cursor-target text-[#0A192F]/55 hover:text-[#0A192F] text-sm font-semibold transition-colors flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-3 h-px bg-[#FBBF24] transition-all duration-300 inline-block" />
                                        {s}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[#FBBF24] font-black mb-7 uppercase tracking-[0.25em] text-[10px] flex items-center gap-2">
                            <span className="w-6 h-px bg-[#FBBF24]/60 inline-block" /> Get in Touch
                        </h4>
                        <ul className="space-y-5">
                            <li>
                                <a
                                    href="mailto:sales@srirambroadband.com"
                                    className="cursor-target flex items-start gap-3 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] flex-shrink-0 group-hover:bg-[#FBBF24] group-hover:text-[#0A192F] transition-all duration-300">
                                        <Mail size={15} />
                                    </div>
                                    <span className="text-sm font-semibold text-[#0A192F]/55 group-hover:text-[#0A192F] transition-colors pt-1.5">
                                        sales@srirambroadband.com
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+919345217979"
                                    className="cursor-target flex items-start gap-3 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] flex-shrink-0 group-hover:bg-[#FBBF24] group-hover:text-[#0A192F] transition-all duration-300">
                                        <Phone size={15} />
                                    </div>
                                    <span className="text-sm font-semibold text-[#0A192F]/55 group-hover:text-[#0A192F] transition-colors pt-1.5">
                                        +91 93452 17979 | +91 93445 84000
                                    </span>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-[#FBBF24] flex-shrink-0">
                                        <MapPin size={15} />
                                    </div>
                                    <span className="text-sm font-semibold text-[#0A192F]/55 pt-1.5 leading-relaxed">
                                        Dharmapuri &amp; Chennai<br />Tamil Nadu, India
                                    </span>
                                </div>
                            </li>
                        </ul>

                        {/* Quick CTA */}
                        <Link
                            href="/contact"
                            className="cursor-target mt-8 inline-flex items-center gap-2 bg-[#FBBF24] text-[#0A192F] font-black text-xs py-3 px-5 rounded-xl uppercase tracking-widest hover:-translate-y-1 transition-all duration-300"
                            style={{ boxShadow: '0 6px 20px rgba(251,191,36,0.25)' }}
                        >
                            Get Connected <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-[#0A192F]/06 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center">
                            <Wifi size={12} className="text-[#FBBF24]" />
                        </div>
                        <p className="text-[10px] font-black text-[#0A192F]/30 uppercase tracking-[0.3em]">
                            © {year} Sriram Broadband Services Pvt. Ltd. All Rights Reserved.
                        </p>
                    </div>
                    <div className="flex gap-8">
                        {['Privacy', 'Terms', 'Cookies'].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="cursor-target text-[10px] font-black text-[#0A192F]/30 uppercase tracking-[0.2em] hover:text-[#FBBF24] transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

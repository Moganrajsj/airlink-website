"use client";
import React from 'react';
import { ArrowRight, Shield, Globe, Server } from 'lucide-react';
import Link from 'next/link';

export default function BusinessPlans() {
    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="bg-secondary text-white rounded-[3rem] p-12 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
                            Enterprise Connectivity
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Dedicated Internet Leased Line in <span className="text-primary">Chennai & Dharmapuri</span>
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 leading-relaxed text-justify">
                            Airlink Broadband provides enterprise-grade Dedicated Internet Leased Line (DIA) solutions with 1:1 uncontended bandwidth, static IP addresses, symmetrical upload and download speeds, and 99.5% SLA. Our business connectivity solutions include managed security, SD-WAN, cloud on-ramp services, and colocation hosting from Tier-3 data centers. Businesses across Chennai and Dharmapuri trust Airlink for reliable, scalable, and secure internet infrastructure.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6 mb-12">
                            <div className="flex items-center gap-3">
                                <Shield className="text-primary" size={24} />
                                <span className="font-bold text-sm">Managed Security</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="text-primary" size={24} />
                                <span className="font-bold text-sm">Static IPs Included</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Server className="text-primary" size={24} />
                                <span className="font-bold text-sm">99.5% SLA</span>
                            </div>
                        </div>

                        <Link href="/infrastructure" className="btn-primary py-4 px-10 inline-flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(251,191,36,0.3)] group rounded-xl">
                            Explore Enterprise Solutions <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import {
    Wifi,
    CreditCard,
    Clock,
    Download,
    Upload,
    LogOut,
    User as UserIcon,
    ChevronRight,
    Zap,
    Shield,
    History
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function CustomerPortal() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
        } else if (isAdmin) {
            router.push('/admin');
        }
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || !user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-white text-[#1F2933] font-inter selection:bg-[#FF6F00]/30 selection:text-white pt-32 pb-20">
            {/* 1. Header Section */}
            <section className="container mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#FF6F00]/5 text-[#FF6F00] text-[10px] font-black tracking-widest uppercase mb-6 border border-[#FF6F00]/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F00]"></span>
                            Active Connection
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-[#1F2933] tracking-tight">
                            Hello, <span className="text-[#FF6F00]">{user.name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-lg text-[#1F2933]/40 font-medium mt-2">Personal Management Dashboard</p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-8 py-4 bg-[#F7F7F8] border border-[#E5E7EB] rounded-2xl text-xs font-black uppercase tracking-widest text-[#1F2933]/60 hover:bg-[#1F2933] hover:text-white transition-all group shadow-sm"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Logout Session
                    </motion.button>
                </div>
            </section>

            {/* 2. Main Body */}
            <section className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Stats & Packages */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Quick Status Bar */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {[
                                { label: 'Current Package', val: user.plan || 'No Package', icon: <Wifi />, color: 'text-[#FF6F00]' },
                                { label: 'Payment Status', val: user.isPaid ? 'Active / Paid' : 'Pending', icon: <CreditCard />, color: user.isPaid ? 'text-green-600' : 'text-red-600' },
                                { label: 'Renewal Date', val: user.billingDate || 'N/A', icon: <Clock />, color: 'text-[#1F2933]' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="p-8 rounded-[2.5rem] bg-[#F7F7F8] border border-[#E5E7EB] hover:border-[#FF6F00]/30 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#FF6F00] mb-6 shadow-sm group-hover:bg-[#FF6F00] group-hover:text-white transition-all duration-500">
                                        {stat.icon}
                                    </div>
                                    <div className="text-[10px] font-black text-[#1F2933]/30 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
                                    <div className={`text-xl font-black ${stat.color} tracking-tight`}>{stat.val}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Detailed Usage */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-12 rounded-[3rem] bg-white border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.03)]"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black text-[#1F2933]">Data Insights</h3>
                                <div className="px-4 py-2 bg-[#F7F7F8] rounded-xl text-[10px] font-black text-[#1F2933]/40 uppercase tracking-widest border border-[#E5E7EB]">
                                    Unlimited Fiber
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[#FF6F00]">
                                        <Download size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Download Data</span>
                                    </div>
                                    <div className="text-4xl font-black text-[#1F2933]">245.8 <span className="text-lg opacity-30">GB</span></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[#1F2933]/40">
                                        <Upload size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Data</span>
                                    </div>
                                    <div className="text-4xl font-black text-[#1F2933]">89.2 <span className="text-lg opacity-30">GB</span></div>
                                </div>
                            </div>

                            <div className="relative h-4 bg-[#F7F7F8] rounded-full overflow-hidden mb-6 border border-[#E5E7EB]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '35%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute inset-y-0 left-0 bg-[#FF6F00] rounded-full"
                                />
                            </div>
                            <p className="text-xs font-bold text-[#1F2933]/30 uppercase tracking-[0.2em]">335 GB of Truly Unlimited Data used this cycle</p>
                        </motion.div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <button
                                onClick={() => router.push('/packages')}
                                className="p-10 rounded-[2.5rem] bg-[#1F2933] text-white flex flex-col items-start text-left hover:bg-[#FF6F00] transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-[#FF6F00] transition-all">
                                    <Zap size={24} />
                                </div>
                                <h4 className="text-xl font-black mb-2">Upgrade Package</h4>
                                <p className="text-white/40 text-sm font-medium">Switch to higher speeds with more OTT benefits.</p>
                                <ChevronRight size={20} className="mt-6 opacity-40 group-hover:translate-x-2 transition-transform" />
                            </button>

                            <button
                                onClick={() => window.open(`https://wa.me/919677402451?text=Hi, I need support for my account ${user.id}`, '_blank')}
                                className="p-10 rounded-[2.5rem] bg-white border border-[#E5E7EB] flex flex-col items-start text-left hover:border-[#FF6F00]/30 hover:shadow-xl hover:shadow-black/5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#F7F7F8] flex items-center justify-center text-[#FF6F00] mb-6 group-hover:bg-[#FF6F00] group-hover:text-white transition-all">
                                    <Shield size={24} />
                                </div>
                                <h4 className="text-xl font-black text-[#1F2933] mb-2">Priority NOC</h4>
                                <p className="text-[#1F2933]/40 text-sm font-medium">Get 24/7 technical assistance directly via WhatsApp.</p>
                                <ChevronRight size={20} className="mt-6 text-[#FF6F00] group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Account Details */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* Account Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-10 rounded-[3rem] bg-[#F7F7F8] border border-[#E5E7EB] sticky top-32"
                        >
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 rounded-2xl bg-[#FF6F00] flex items-center justify-center text-white shadow-lg">
                                    <UserIcon size={32} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-[#1F2933]/30 uppercase tracking-[0.3em] mb-1">Account Master</h4>
                                    <div className="text-xl font-black text-[#1F2933]">{user.name}</div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <div className="text-[10px] font-black text-[#1F2933]/30 uppercase tracking-[0.2em] mb-3">Login Identity</div>
                                    <div className="font-bold text-[#1F2933] break-all">{user.email}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-[#1F2933]/30 uppercase tracking-[0.2em] mb-3">Customer Reference</div>
                                    <div className="font-black text-[#FF6F00] text-lg tracking-widest">{user.id}</div>
                                </div>
                                <div className="pt-8 border-t border-[#E5E7EB]">
                                    <div className="flex items-center gap-4 text-[#1F2933]/40 mb-6">
                                        <History size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Recent Invoices</span>
                                    </div>
                                    <button className="w-full py-4 bg-white border border-[#E5E7EB] rounded-xl text-xs font-black uppercase tracking-widest text-[#1F2933] hover:border-[#FF6F00] transition-colors">
                                        Download Oct 2023
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </section>

            <div className="h-4 bg-[#FF6F00] fixed bottom-0 left-0 right-0 z-50"></div>
        </div>
    );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Wifi, MapPin,
    Users, MessageSquare, Newspaper,
    Settings, Image as ImageIcon, Sparkles,
    LogOut, ChevronRight, BarChart3
} from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
        { icon: <Sparkles size={20} />, label: "Backgrounds", href: "/admin/backgrounds" },
        { icon: <Wifi size={20} />, label: "Broadband Plans", href: "/admin/plans" },
        { icon: <MapPin size={20} />, label: "Coverage Areas", href: "/admin/coverage" },
        { icon: <MessageSquare size={20} />, label: "Testimonials", href: "/admin/testimonials" },
        { icon: <Newspaper size={20} />, label: "Blog Posts", href: "/admin/blogs" },
        { icon: <BarChart3 size={20} />, label: "Leads", href: "/admin/leads" },
        { icon: <ImageIcon size={20} />, label: "Media Library", href: "/admin/media" },
        { icon: <ImageIcon size={20} />, label: "Banners", href: "/admin/banners" },
        { icon: <Settings size={20} />, label: "SEO Settings", href: "/admin/settings" },
    ];

    return (
        <aside className="w-64 h-screen bg-[#0A192F] text-white flex flex-col sticky top-0 overflow-hidden">
            {/* Logo area */}
            <div className="p-8 pb-4">
                <Link href="/" className="flex flex-col">
                    <span className="text-xl font-black text-white tracking-tight">AIRLINK<span className="text-[#FBBF24]">.</span></span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1 italic">Admin Console</span>
                </Link>
            </div>

            {/* Menu */}
            <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item, idx) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`flex items-center justify-between group px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                                ? "bg-[#FBBF24] text-[#0A192F] font-bold shadow-[0_4px_12px_rgba(251,191,36,0.3)]"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`${isActive ? "text-[#0A192F]" : "text-white/40 group-hover:text-[#FBBF24]"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={14} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Support / User */}
            <div className="p-4 border-t border-white/5 mx-4 mb-4 mt-auto">
                <div className="bg-white/5 rounded-2xl p-4 mb-4">
                    <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-white/80">Network Online</span>
                    </div>
                </div>
                <button
                    onClick={() => console.log('logout')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-bold">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

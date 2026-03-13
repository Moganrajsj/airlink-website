"use client";

import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminGuard from '@/components/auth/AdminGuard';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex bg-[#F7F8FA] min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 p-10 overflow-y-auto h-screen relative">
                    {/* Dashboard top blur/bg blobs (consistent with brand) */}
                    <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#FBBF24]/03 -translate-y-1/2 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0A192F]/02 translate-y-1/2 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}

"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import StickyCallBar from "@/components/ui/StickyCallBar";
import LeadCapturePopup from "@/components/popup/LeadCapturePopup";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/portal");

    return (
        <>
            {!isAdmin && <Navbar />}
            <main>
                {children}
            </main>
            {!isAdmin && <Footer />}
            {!isAdmin && <FloatingWhatsApp />}
            {!isAdmin && <StickyCallBar />}
            {!isAdmin && <LeadCapturePopup />}
        </>
    );
}

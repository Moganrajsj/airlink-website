"use client";

import { usePathname } from "next/navigation";
import dynamic from 'next/dynamic';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FloatingWhatsApp = dynamic(() => import("@/components/ui/FloatingWhatsApp"), { ssr: false });
const StickyCallBar = dynamic(() => import("@/components/ui/StickyCallBar"), { ssr: false });
const LeadCapturePopup = dynamic(() => import("@/components/popup/LeadCapturePopup"), { ssr: false });

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isRestricted = pathname?.startsWith("/admin") || pathname?.startsWith("/auth") || pathname?.startsWith("/portal");

    return (
        <>
            {!isRestricted && <Navbar />}
            <main>
                {children}
            </main>
            {!isRestricted && <Footer />}
            {!isRestricted && <FloatingWhatsApp />}
            {!isRestricted && <StickyCallBar />}
            {!isRestricted && <LeadCapturePopup />}
        </>
    );
}

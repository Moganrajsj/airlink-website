"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import StickyCallBar from "@/components/ui/StickyCallBar";
import LeadCapturePopup from "@/components/popup/LeadCapturePopup";



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

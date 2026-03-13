"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import StickyCallBar from "@/components/ui/StickyCallBar";
import LeadCapturePopup from "@/components/popup/LeadCapturePopup";

const TargetCursor = dynamic(() => import("@/components/animations/TargetCursor"), {
    ssr: false,
});

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isRestricted = pathname?.startsWith("/admin") || pathname?.startsWith("/auth") || pathname?.startsWith("/portal");

    return (
        <>
            <TargetCursor
                spinDuration={2}
                hideDefaultCursor
                parallaxOn
                hoverDuration={0.2}
            />
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

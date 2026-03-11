import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Buy WiFi Routers, CCTV Cameras & Networking Devices | Airlink Broadband Shop',
    description: 'Shop high-performance WiFi routers, CCTV security cameras, and networking devices designed for fiber broadband connections. Improve your internet speed and security with Airlink Broadband.',
    keywords: 'fiber broadband router, wifi router for fiber internet, best router for broadband, cctv camera for home security, network devices for broadband, internet security for home network, broadband accessories India'
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

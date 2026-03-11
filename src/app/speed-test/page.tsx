import type { Metadata } from 'next';
import SpeedTest from '@/components/sections/SpeedTest';
import { LightHeroBg } from '@/components/ui/AnimatedBackground';

export const metadata: Metadata = {
    title: 'Internet Speed Test | Airlink Broadband Real-Time Monitor',
    description: 'Test your fiber broadband speed in real-time. Measure Download, Upload, Ping, and Jitter on the official Airlink Broadband speed test tool for Tamil Nadu.',
    keywords: 'speed test, internet speed test, broadband speed test Tamil Nadu, download speed, upload speed, ping, jitter, Airlink Broadband speed test'
};

export default function SpeedTestPage() {
    return (
        <main className="min-h-screen pt-20">
            <section className="relative pt-20 pb-10 overflow-hidden bg-white">
                <LightHeroBg />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-[#0A192F] mb-4 tracking-tighter uppercase">
                        Network <span className="text-[#FBBF24]">Diagnostics</span>
                    </h1>
                    <p className="text-[#0A192F]/50 text-xl max-w-2xl mx-auto font-medium">
                        Run a comprehensive test of your connection quality including speed, latency, and stability.
                    </p>
                </div>
            </section>

            <SpeedTest />

            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-black text-[#0A192F] mb-4">What do these results mean?</h3>
                            <div className="space-y-4 text-[#0A192F]/60 leading-relaxed">
                                <p>
                                    <strong>Download Speed:</strong> How fast data reaches your device. Crucial for streaming 4K video, downloading large files, and browsing.
                                </p>
                                <p>
                                    <strong>Upload Speed:</strong> How fast you can send data. Essential for video calls (Zoom/Teams), gaming, and sending large attachments.
                                </p>
                                <p>
                                    <strong>Ping (Latency):</strong> The time it takes for a signal to travel to the server and back. Lower is better, especially for online gaming.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-[#0A192F] mb-4">Tips for accurate results</h3>
                            <ul className="space-y-3 text-[#0A192F]/60">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full mt-2.5 shrink-0" />
                                    Use an Ethernet (wired) connection for the most stable measurement.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full mt-2.5 shrink-0" />
                                    Close other browser tabs and background applications during the test.
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full mt-2.5 shrink-0" />
                                    Place your WiFi router in a central, open location for better wireless speeds.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

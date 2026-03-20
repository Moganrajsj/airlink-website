"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
}

// Fallback testimonials used when the DB is empty or unavailable
const FALLBACK: Testimonial[] = [
    { id: '1', name: "Rajesh Kumar", role: "Professional Gamer", content: "Switched to Airlink for the low latency. My ping in Valorant dropped from 40ms to 9ms. Absolutely stable and perfect for gaming.", rating: 5 },
    { id: '2', name: "Sneha Reddy", role: "Freelance Designer", content: "The symmetrical speeds are a lifesaver. Uploading heavy design files to the cloud is now faster than ever. No more waiting!", rating: 5 },
    { id: '3', name: "Vikram Singh", role: "Business Owner", content: "Reliable internet is crucial for my office. Airlink's uptime has been incredible, and their support team is always helpful.", rating: 5 },
    { id: '4', name: "Priya Sharma", role: "Software Engineer", content: "Working from home requires a rock-solid connection. Airlink delivers consistent speeds day and night without any packet loss.", rating: 5 },
    { id: '5', name: "Arun Krishnan", role: "Content Creator", content: "Streaming in 4K requires massive bandwidth, and Airlink handles it effortlessly. Best ISP I've ever used in Tamil Nadu.", rating: 5 },
    { id: '6', name: "Karthik Raj", role: "Startup Founder", content: "We use Airlink's enterprise leased line for our office. The 1:1 uncontended bandwidth ensures our team of 50 stays productive 24/7.", rating: 5 },
    { id: '7', name: "Anita Desai", role: "Online Educator", content: "Hosting live webinars with hundreds of students requires zero buffering. Airlink's fiber connection has been flawless for my virtual classes.", rating: 5 },
    { id: '8', name: "Mohammed Tariq", role: "E-commerce Manager", content: "Managing multiple online stores needs instant sync. Ever since we moved to Airlink, our inventory systems update in real-time instantly.", rating: 5 }
];

const TestimonialCard = ({ t }: { t: Testimonial }) => (
    <div className="bg-[#FBBF24] p-10 md:p-12 rounded-[2.5rem] border border-[#FBBF24] shadow-[0_10px_40px_rgba(251,191,36,0.15)] relative w-[350px] md:w-[450px] flex-shrink-0 flex flex-col justify-between transition-all duration-300 hover:border-white/50 hover:shadow-[0_20px_60px_rgba(251,191,36,0.3)] group/card overflow-hidden">
        <Quote size={60} className="absolute top-8 right-8 text-[#0A192F]/5 group-hover/card:text-[#0A192F]/10 transition-colors duration-500" />

        <div>
            <div className="flex gap-1.5 mb-8 relative z-10">
                {[...Array(t.rating)].map((_, index) => (
                    <Star key={index} size={16} fill="#0A192F" className="text-[#0A192F]" />
                ))}
            </div>
            {/* Note: User specifically wanted normal text instead of italic text */}
            <p className="text-[#0A192F] text-lg md:text-xl font-semibold mb-10 leading-relaxed relative z-10 tracking-tight">
                "{t.content}"
            </p>
        </div>

        <div className="flex items-center gap-4 mt-auto relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#0A192F] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#0A192F]/20">
                {t.name[0]}
            </div>
            <div>
                <h4 className="font-black text-[#0A192F] text-[15px]">{t.name}</h4>
                <p className="text-[10px] font-black text-[#0A192F]/70 uppercase tracking-[0.2em] mt-0.5">{t.role}</p>
            </div>
        </div>
    </div>
);

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setTestimonials(data);
                }
            })
            .catch(() => { /* use fallback */ });
    }, []);

    return (
        <section className="py-32 bg-[#F7F7F8]/50 overflow-hidden" id="testimonials">
            <div className="container mx-auto px-6 mb-20 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-[#FF6F00]/5 text-[#FF6F00] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#FF6F00]/10"
                    >
                        Community Trust
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-[#1F2933] mb-8 tracking-tighter leading-[1.1]"
                    >
                        Voices of <span className="text-[#FF6F00]">Airlink.</span>
                    </motion.h2>
                    <p className="text-[#1F2933]/50 font-medium text-xl leading-relaxed">
                        Join thousands of high-performance users who trust our fiber backbone for their digital success.
                    </p>
                </div>
            </div>

            {/* Infinite Marquee Container */}
            <div className="relative w-full overflow-hidden flex flex-col py-4 group/marquee">
                {/* Fade edges */}
                <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-[#F7F7F8]/50 via-[#F7F7F8]/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-[#F7F7F8]/50 via-[#F7F7F8]/40 to-transparent z-10 pointer-events-none" />

                <div className="flex w-max animate-testimonial-marquee group-hover/marquee:[animation-play-state:paused]">
                    {/* Track 1 */}
                    <div className="flex w-max gap-8 pr-8">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={`track1-${i}`} t={t} />
                        ))}
                    </div>
                    {/* Track 2 - Exact duplicate for seamless scroll */}
                    <div className="flex w-max gap-8 pr-8" aria-hidden="true">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={`track2-${i}`} t={t} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes testimonial-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-testimonial-marquee {
                    animation: testimonial-marquee 40s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;

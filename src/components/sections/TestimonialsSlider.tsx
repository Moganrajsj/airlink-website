"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Professional Gamer",
        content: "Switched to Airlink for the low latency. My ping in Valorant dropped from 40ms to 9ms. Absolutely stable and perfect for gaming.",
        rating: 5,
        initials: "RK",
        color: "#FBBF24",
    },
    {
        name: "Sneha Reddy",
        role: "Freelance Designer",
        content: "The symmetrical speeds are a lifesaver. Uploading heavy design files to the cloud is now faster than ever. No more waiting!",
        rating: 5,
        initials: "SR",
        color: "#60a5fa",
    },
    {
        name: "Vikram Singh",
        role: "Business Owner",
        content: "Reliable internet is crucial for my office. Airlink's uptime has been incredible, and their support team is always helpful.",
        rating: 5,
        initials: "VS",
        color: "#34d399",
    },
    {
        name: "Priya Nair",
        role: "Work From Home Professional",
        content: "Zero downtime in 8 months! Video calls with my international clients are crystal-clear. Airlink transformed my home office experience.",
        rating: 5,
        initials: "PN",
        color: "#f472b6",
    },
    {
        name: "Arjun Mehta",
        role: "Cloud Engineer",
        content: "As someone who works with cloud infrastructure, I need consistent, low-latency connectivity. Airlink's fiber delivers that flawlessly.",
        rating: 5,
        initials: "AM",
        color: "#a78bfa",
    },
    {
        name: "Kavitha Sundaram",
        role: "Online Educator",
        content: "I stream live classes to 500+ students daily. Airlink's 1:1 contention ratio means my streams never buffer. My students love it!",
        rating: 5,
        initials: "KS",
        color: "#fb923c",
    },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
    return (
        <div
            className="flex-shrink-0 w-[340px] md:w-[400px] bg-white rounded-[2rem] p-8 border border-gray-100 relative shadow-[0_4px_24px_rgba(0,0,0,0.05)] mx-4 transition-all duration-300"
            style={{
                outline: `1.5px solid transparent`,
            }}
        >
            {/* Glow border on hover handled via group classes in parent */}
            <Quote
                size={60}
                className="absolute top-6 right-6 opacity-5"
                style={{ color: t.color }}
            />

            {/* Stars */}
            <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill={t.color} style={{ color: t.color }} />
                ))}
            </div>

            <p className="text-[#0A192F]/70 text-base font-semibold italic leading-relaxed mb-8 relative z-10">
                "{t.content}"
            </p>

            <div className="flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg"
                    style={{ background: t.color, boxShadow: `0 6px 20px ${t.color}40` }}
                >
                    {t.initials}
                </div>
                <div>
                    <p className="font-black text-[#0A192F] text-base">{t.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: t.color }}>
                        {t.role}
                    </p>
                </div>
            </div>
        </div>
    );
}

const TestimonialsSlider = () => {
    // Triple the array for seamless looping
    const items = [...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="py-32 bg-[#F7F7F8]/50 overflow-hidden" id="testimonials">
            <div className="container mx-auto px-6 mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-block bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                >
                    Community Trust
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-black text-[#0A192F] mb-6 tracking-tighter"
                >
                    Voices of <span className="text-[#FBBF24]">Airlink.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-[#0A192F]/50 max-w-2xl mx-auto font-medium text-xl leading-relaxed"
                >
                    Join thousands of high-performance users who trust our fiber backbone for their digital success.
                </motion.p>
            </div>

            {/* Slider track */}
            <div className="relative w-full overflow-hidden">
                {/* Edge fade masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F7F8] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F7F8] to-transparent z-10 pointer-events-none" />

                <div className="flex animate-[autoScroll_40s_linear_infinite] w-max py-4">
                    {items.map((t, i) => (
                        <TestimonialCard key={i} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSlider;

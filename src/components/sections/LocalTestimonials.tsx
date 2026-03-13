"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Quote } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;       // Business/group name
    person: string;     // Individual person name
    role: string;
    city: string;
    tag: string;
    content: string;
    rating: number;
    color: string;
    metric: string;
}

const COLORS = ['#FBBF24', '#60a5fa', '#34d399', '#a78bfa', '#fb923c', '#f43f5e', '#06b6d4'];

// Fallback local testimonials (Tamil Nadu focused)
const FALLBACK: Testimonial[] = [
    { id: '1', name: "Murugan Textiles", person: "Mr. K. Muthukumar", role: "Proprietor", city: "Dharmapuri", tag: "Textile Business", content: "We export to buyers in the UK and Japan. Every video call matters. Before Airlink, we were constantly dealing with dropped calls and slow file uploads. Since switching, our communication has been flawless.", rating: 5, color: "#FBBF24", metric: "Zero downtime in 10 months" },
    { id: '2', name: "Priya Shankar", person: "Priya Shankar", role: "Work From Home Professional", city: "Dharmapuri", tag: "Family User", content: "My husband works from home, my son streams OTT and online games, and I have my own tutoring classes online. We used to fight over bandwidth every evening! Airlink solved everything.", rating: 5, color: "#60a5fa", metric: "4 devices, zero buffering" },
    { id: '3', name: "Sri Sai Clinic", person: "Dr. Ramesh Babu", role: "Medical Practitioner", city: "Dharmapuri", tag: "Healthcare Office", content: "Patient records in the cloud, online consultations, insurance claim submissions — all of it needs reliable internet. Airlink has been rock-solid. Their 24/7 NOC actually called us before we even noticed an issue.", rating: 5, color: "#34d399", metric: "Mission-critical uptime achieved" },
    { id: '4', name: "Karthik Gaming Zone", person: "Karthik R.", role: "Gaming Café Owner", city: "Dharmapuri", tag: "Gaming Business", content: "Running a gaming café, ping is everything. After Airlink fiber, average ping dropped to under 10ms. Business has doubled because word spread fast about our connection quality.", rating: 5, color: "#a78bfa", metric: "Sub-10ms ping consistently" },
    { id: '5', name: "Vijay Stores", person: "Mr. Vijayakumar", role: "Retail Business Owner", city: "Dharmapuri", tag: "Retail Shop", content: "Our GST billing, UPI payments, and online ordering all run on one connection. Since switching to Airlink, we haven't lost a single sale due to connectivity. Their team installed the same day we called.", rating: 5, color: "#fb923c", metric: "Same-day installation" },
    { id: '6', name: "Tech Solutions India", person: "Praveen S.", role: "IT Manager", city: "Dharmapuri", tag: "Software Agency", content: "We moved to Airlink's 1 Gbps enterprise leased line last year. Our 200+ developers rely on VPNs and cloud infrastructure daily. The symmetrical speeds are phenomenal.", rating: 5, color: "#FBBF24", metric: "1 Gbps symmetrical speed" },
    { id: '7', name: "Lakshmi Vidya Mandir", person: "Mrs. Revathi D.", role: "Principal", city: "Dharmapuri", tag: "Education", content: "Online classes and smart boards required an upgrade from our old broadband. Airlink provided campus-wide coverage with absolute stability. Even during heavy rain, our network stays up.", rating: 5, color: "#60a5fa", metric: "Campus-wide coverage" },
    { id: '8', name: "Senthil Auto Components", person: "Senthil Kumar", role: "Managing Director", city: "Dharmapuri", tag: "Manufacturing", content: "Our CNC machines and ERP software communicate in real-time. Any network latency halts production. Airlink's dedicated fiber line has been the most reliable investment we've made this year.", rating: 5, color: "#a78bfa", metric: "Zero latency spikes" }
];

function mapDbToCard(t: any, idx: number): Testimonial {
    return {
        id: t.id,
        name: t.name || t.person || '',
        person: t.person || t.name || '',
        role: t.role || '',
        city: t.city || 'Tamil Nadu',
        tag: t.tag || t.role || '',
        content: t.content || '',
        rating: t.rating || 5,
        color: t.color || COLORS[idx % COLORS.length],
        metric: t.metric || '',
    };
}

function StarRow({ count, color }: { count: number; color: string }) {
    return (
        <div className="flex gap-1">
            {[...Array(count)].map((_, i) => (
                <Star key={i} size={13} fill={color} style={{ color }} />
            ))}
        </div>
    );
}

const TestimonialCard = ({ t }: { t: Testimonial }) => (
    <div
        className="bg-white rounded-[2rem] p-7 border relative overflow-hidden group transition-all duration-300 w-[350px] md:w-[450px] flex-shrink-0 flex flex-col justify-between cursor-target"
        style={{ borderColor: `${t.color}30` }}
    >
        {/* Color top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem] transition-opacity duration-300" style={{ background: t.color }} />
        <Quote size={40} className="absolute top-5 right-5 opacity-[0.03]" style={{ color: t.color }} />

        <div>
            <StarRow count={t.rating} color={t.color} />
            {/* Note: Normal text instead of italic per user request */}
            <p className="text-[#0A192F]/80 text-[15px] font-semibold leading-relaxed my-5 h-36 border-b border-gray-100 pb-4">
                "{t.content.length > 200 ? t.content.slice(0, 200) + '…' : t.content}"
            </p>
        </div>

        {/* Metric pill */}
        {t.metric && (
            <div
                className="inline-flex items-center text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 self-start"
                style={{ background: `${t.color}15`, color: t.color }}
            >
                ✓ {t.metric}
            </div>
        )}

        <div className="flex items-center gap-3 mt-auto">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0"
                style={{ background: t.color, boxShadow: `0 4px 14px ${t.color}40` }}
            >
                {t.person[0]}
            </div>
            <div>
                <p className="font-black text-[#0A192F] text-sm">{t.person}</p>
                <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={9} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t.city}</span>
                    {t.tag && <>
                        <span className="text-gray-300 mx-1">·</span>
                        <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: t.color }}>{t.tag}</span>
                    </>}
                </div>
            </div>
        </div>
    </div>
);

export default function LocalTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setTestimonials(data.map(mapDbToCard));
                }
            })
            .catch(() => { /* keep fallback */ });
    }, []);

    return (
        <section className="py-28 bg-[#F7F8FA] overflow-hidden" id="testimonials">
            <div className="container mx-auto px-6 mb-16 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#0A192F] px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6"
                    >
                        <MapPin size={12} className="text-[#FBBF24]" /> Real Customers. Real Tamil Nadu.
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-[#0A192F] tracking-tight mb-4"
                    >
                        Trusted Across <span className="text-[#FBBF24]">Tamil Nadu.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[#0A192F]/50 text-lg max-w-2xl mx-auto font-medium"
                    >
                        From textile towns to tech professionals — see why thousands of homes and businesses across Tamil Nadu rely on Airlink.
                    </motion.p>
                </div>
            </div>

            {/* Infinite Marquee Container */}
            <div className="relative w-full overflow-hidden flex flex-col py-4 group/marquee cursor-target">
                {/* Fade edges */}
                <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-[#F7F8FA] via-[#F7F8FA]/90 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-[#F7F8FA] via-[#F7F8FA]/90 to-transparent z-10 pointer-events-none" />

                <div className="flex w-max animate-testimonial-marquee group-hover/marquee:[animation-play-state:paused]">
                    <div className="flex w-max gap-6 pr-6">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={`track1-${i}`} t={t} />
                        ))}
                    </div>
                    <div className="flex w-max gap-6 pr-6" aria-hidden="true">
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
                    animation: testimonial-marquee 60s linear infinite;
                    will-change: transform;
                }
            `}</style>
        </section>
    );
}

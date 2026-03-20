"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Headphones,
    Building2,
    Globe
} from 'lucide-react';
import { LightHeroBg, LightSectionBg, GraySectionBg } from '@/components/ui/AnimatedBackground';
import { createLead } from '@/app/actions/leads';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

const ContactPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const result = await createLead({
                name: formData.fullName,
                email: formData.email,
                mobile: formData.phone,
                company: formData.company,
                city: 'Contact Form',
                interest: 'General Inquiry',
                message: formData.message,
                source: 'contact_page'
            });

            if (result.success) {
                setSubmitStatus('success');
                setFormData({
                    fullName: '',
                    company: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Contact form submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface text-dark font-inter">
            {/* 1. Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-white">
                <LightHeroBg />

                <div className="container mx-auto px-6 relative z-10 text-center pt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-flex items-center justify-center gap-2 py-2 px-6 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] uppercase text-sm font-bold tracking-[0.2em] mb-8 border border-[#FBBF24]/20">
                            <Headphones size={16} className="animate-pulse" />
                            Expert Support 24/7
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-[#0A192F] mb-8 tracking-tight leading-tight">
                            Ready to <br />
                            <span className="text-[#FBBF24]">Connect?</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-[#0A192F]/50 max-w-3xl mx-auto font-medium leading-relaxed">
                            Our technical experts are standing by to design your custom network architecture or assist with your current plans. Let's build something fast together.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Contact Grid */}
            <section className="py-24 bg-white relative overflow-hidden border-b border-gray-100">
                <LightSectionBg variant="dots" />
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Contact Info Side */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="lg:w-5/12 space-y-8"
                        >
                            <div className="mb-12">
                                <h2 className="text-3xl font-black text-secondary mb-4 tracking-tight">Get in Touch</h2>
                                <p className="text-secondary/60 text-lg">Reach out to us through any of our channels. We are always here to help you get connected.</p>
                            </div>

                            {[
                                {
                                    icon: <Phone />,
                                    title: "Head Office Contact",
                                    value: <span className="block">+91 93445 84000<br />+91 93452 17979</span>,
                                    desc: "Available 24/7"
                                },
                                {
                                    icon: <Phone />,
                                    title: "Chennai Contact",
                                    value: <span className="block">+91 93456 74000<br />+91 98406 53599</span>,
                                    desc: "Regional Office"
                                },
                                {
                                    icon: <Mail />,
                                    title: "Email Assistance",
                                    value: "info@srirambroadband.com",
                                    desc: "Quick Response Guaranteed"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group flex items-start gap-6"
                                >
                                    <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-secondary transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{item.title}</h4>
                                        <div className="text-2xl font-black text-secondary mb-1">{item.value}</div>
                                        <div className="text-sm font-medium text-secondary/50">{item.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Form Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-7/12"
                        >
                            <div className="bg-secondary rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black text-white mb-10 tracking-tight">Send a Direct Inquiry</h3>

                                    <form className="space-y-8" onSubmit={handleSubmit}>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Acme Corp"
                                                    value={formData.company}
                                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="john@acme.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="+91 00000 00000"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</label>
                                            <textarea
                                                required
                                                rows={5}
                                                placeholder="Enter your complete address..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-5 py-5 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                            ></textarea>
                                        </div>

                                        {submitStatus === 'success' && (
                                            <div className="p-4 bg-primary/20 text-white rounded-xl text-sm font-bold text-center border border-primary/30 uppercase tracking-widest">
                                                Message Sent! We will get back to you soon.
                                            </div>
                                        )}

                                        {submitStatus === 'error' && (
                                            <div className="p-4 bg-red-500/20 text-white rounded-xl text-sm font-bold text-center border border-red-500/30 uppercase tracking-widest">
                                                Failed to send message. Please try again.
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-5 btn-primary flex items-center justify-center gap-3 text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Submit Request'} <Send size={20} className="" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Office Locations */}
            <section className="py-24 bg-[#F7F8FA] overflow-hidden relative">
                <GraySectionBg />
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-black text-secondary mb-4 tracking-tight">Our Offices</h2>
                        <p className="text-secondary/60 text-lg">Visit our headquarters or regional branches.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10">
                        {/* Head Office */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-xl relative group flex flex-col md:flex-row gap-10 items-center overflow-hidden"
                        >
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="w-24 h-24 shrink-0 rounded-[2rem] bg-surface border border-gray-100 flex items-center justify-center text-primary">
                                <Building2 size={40} />
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Head Office</span>
                                <h3 className="text-2xl font-black text-secondary mb-3">Dharmapuri</h3>
                                <p className="text-secondary/70 font-medium leading-relaxed">
                                    201/1A2, 1st Floor, Bypass road,<br />
                                    Dharmapuri - 636701.
                                </p>
                            </div>
                        </motion.div>

                        {/* Regional Office */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-secondary rounded-[3rem] p-10 md:p-14 border border-white/5 shadow-2xl relative group flex flex-col md:flex-row gap-10 items-center overflow-hidden"
                        >
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="w-24 h-24 shrink-0 rounded-[2rem] bg-secondary-light border border-white/10 flex items-center justify-center text-primary">
                                <Globe size={40} />
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Regional Office</span>
                                <h3 className="text-2xl font-black text-white mb-3">Chennai</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">
                                    A, 5057A. Golden Tulip Apartments,<br />
                                    21-st, Main Road, Annanagar, Chennai - 600040.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;

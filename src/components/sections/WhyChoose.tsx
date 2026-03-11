"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Headphones, Globe, Tv, Database } from 'lucide-react';

const features = [
    {
        icon: <Zap className="text-primary" size={32} />,
        title: "Lightning Fast Speed",
        description: "Experience 100% symmetrical speeds for seamless uploading and downloading."
    },
    {
        icon: <Database className="text-primary" size={32} />,
        title: "Truly Unlimited",
        description: "Forget about data caps or FUP limits. Enjoy pure unlimited fiber internet."
    },
    {
        icon: <Tv className="text-primary" size={32} />,
        title: "Premium OTT Included",
        description: "Get access to leading streaming platforms with our selected fiber packages."
    },
    {
        icon: <Headphones className="text-primary" size={32} />,
        title: "24/7 Expert Support",
        description: "Our dedicated local support team is always ready to assist you anytime."
    }
];

const Features = () => {
    return (
        <section className="py-24 bg-surface" id="features">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-dark mb-4 tracking-tighter"
                    >
                        Internet Powered by <span className="text-primary">Precision.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-dark/60 max-w-2xl mx-auto font-medium"
                    >
                        We don't just provide internet; we power your digital life with next-gen fiber technology.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-black/5"
                        >
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-3">{feature.title}</h3>
                            <p className="text-dark/50 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

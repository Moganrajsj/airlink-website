"use client";
import React from 'react';

export default function FAQSection() {
    const faqs = [
        {
            q: "Which is the best broadband in Dharmapuri?",
            a: "Airlink Broadband provides high-speed fiber internet with unlimited data and OTT benefits at competitive pricing across Dharmapuri."
        },
        {
            q: "Do you offer unlimited broadband plans in Chennai?",
            a: "Yes, all our residential fiber plans include truly unlimited data with zero throttling for homes across Chennai."
        },
        {
            q: "What is a dedicated leased line?",
            a: "A leased line is a 1:1 dedicated internet connection with guaranteed bandwidth and SLA for businesses across Tamil Nadu."
        },
        {
            q: "Do you provide static IP for businesses?",
            a: "Yes, our enterprise and business leased line plans include static IPv4/IPv6 with BGP support."
        },
        {
            q: "Is Airlink available in my area?",
            a: "We are rapidly expanding. Our primary fiber connectivity infrastructure encompasses major rings in Dharmapuri and dedicated IT corridors in Chennai."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-secondary tracking-tight mb-4">Frequently Asked Questions</h2>
                    <p className="text-secondary/60">Common questions about Airlink internet connectivity.</p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-surface rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg md:text-xl font-black text-secondary mb-3">{faq.q}</h3>
                            <p className="text-secondary/70 font-medium leading-relaxed text-sm md:text-base">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";
import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-24 bg-surface relative overflow-hidden" id="booking">
            <div className="container mx-auto px-6 max-w-4xl text-center">
                <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6">
                    Still Confused? <br />
                    <span className="text-primary">Let Our Experts Help.</span>
                </h2>
                <p className="text-lg text-secondary/60 font-medium mb-12 max-w-2xl mx-auto">
                    Contact us today and our team will recommend the best fiber plan based on your exact location in Dharmapuri or Chennai, and your family's specific internet usage.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a href="tel:+919345217979" className="btn-primary w-full sm:w-auto px-10 py-5 shadow-xl shadow-primary/20 text-lg group">
                        Call Now <ArrowRight size={20} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href="https://wa.me/919345217979" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm group bg-[#25D366] text-white hover:bg-[#128C7E] shadow-xl hover:-translate-y-1 transition-all">
                        <MessageCircle size={20} className="mr-2 inline group-hover:scale-110 transition-transform" /> WhatsApp Our Team
                    </a>
                </div>
            </div>
        </section>
    );
}

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import styles from './Contact.module.css';
import { createLead } from '@/app/actions/leads';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        city: 'Not Specified' // Default
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        const result = await createLead({
            name: formData.name,
            email: formData.email,
            mobile: formData.phone,
            message: formData.message,
            city: formData.city
        });

        if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '', city: 'Not Specified' });
        } else {
            setStatus('error');
        }
    };

    return (
        <section className={styles.section} id="contact">
            <div className={styles.container}>
                <div className={styles.grid}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.infoCol}
                    >
                        <h2 className={styles.title}>Get in <span className={styles.highlight}>Touch</span></h2>
                        <p className={styles.text}>Have questions? Our team is here to help you choose the best package for your needs.</p>

                        <div className={styles.contactList}>
                            <div className={styles.contactItem}>
                                <div className={styles.iconWrapper}><Phone size={20} /></div>
                                <div>
                                    <h4 className={styles.contactLabel}>Head Office</h4>
                                    <p className={styles.contactValue}>
                                        +91 93445 84000<br />
                                        +91 93452 17979
                                    </p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.iconWrapper}><Phone size={20} /></div>
                                <div>
                                    <h4 className={styles.contactLabel}>Chennai Contact</h4>
                                    <p className={styles.contactValue}>
                                        +91 93456 74000<br />
                                        +91 98406 53599
                                    </p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.iconWrapper}><Mail size={20} /></div>
                                <div>
                                    <h4 className={styles.contactLabel}>Email Us</h4>
                                    <p className={styles.contactValue}>info@srirambroadband.com</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.iconWrapper}><MapPin size={20} /></div>
                                <div>
                                    <h4 className={styles.contactLabel}>Visit Us</h4>
                                    <p className={styles.contactValue}>2/125-A, Opp. HP Petrol Bunk, NH-44, Dharmapuri - 636 807</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.formCol}
                    >
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-[#0A192F]">Thank You!</h3>
                                <p className="text-[#0A192F]/60 font-medium">Your request has been received. Our team will contact you shortly.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    suppressHydrationWarning
                                    className="px-6 py-2 bg-[#FBBF24] text-[#0A192F] font-bold rounded-xl"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Enter your name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Phone Number</label>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            placeholder="+91 00000 00000"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email (Optional)</label>
                                        <input
                                            type="email"
                                            className={styles.input}
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Message</label>
                                    <textarea
                                        className={styles.textarea}
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    suppressHydrationWarning
                                    className={`${styles.submitBtn}`}
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    <Send size={18} />
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-500 text-sm font-bold mt-2">Failed to send message. Please try again.</p>
                                )}
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

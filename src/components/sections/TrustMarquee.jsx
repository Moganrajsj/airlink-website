"use client";

import React from 'react';
import styles from './TrustMarquee.module.css';
import { Star } from 'lucide-react';

const promoTexts = [
    "Tamil Nadu's #1 Fiber Network",
    "Lightning Fast 1Gbps Speeds",
    "24/7 Dedicated Customer Support",
    "99.9% Uptime Guaranteed",
    "Zero Lag Gaming Experience",
    "Unlimited 4K Streaming",
    "Serving 50,000+ Happy Homes",
    "Enterprise Grade Security",
    "Free Installation Today",
    "No Data Limits. Ever.",
    "Smart Home & IoT Ready",
    "Trusted by 1000+ Businesses",
    "Ultra-Low Latency Connectivity"
];

const TrustMarquee = () => {
    return (
        <section className={styles.trustMarquee}>
            <div className={styles.marqueeWrapper}>
                <div className={styles.marqueeTrack}>
                    {/* Render multiple times for seamless infinite scroll */}
                    {[...promoTexts, ...promoTexts].map((text, idx) => (
                        <div key={idx} className={styles.textWrapper}>
                            <span className={styles.promoText}>{text}</span>
                            <Star size={14} className={styles.separatorIcon} fill="#FBBF24" stroke="#FBBF24" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustMarquee;

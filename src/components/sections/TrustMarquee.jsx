"use client";

import React from 'react';
import styles from './TrustMarquee.module.css';

const trustItems = [
    "10,000+ Homes Connected",
    "99.99% Uptime SLA",
    "Up to 1Gbps Fiber Speed",
    "Tamil Nadu Wide Coverage",
    "Enterprise Grade Infrastructure",
    "Tier 3 Network Backbone",
    "24/7 NOC Monitoring",
    "Symmetrical Fiber Speeds"
];

const TrustMarquee = () => {
    return (
        <section className={styles.trustMarquee}>
            <div className={styles.marqueeWrapper}>
                <div className={styles.marqueeTrack}>
                    {/* Render twice for seamless infinite scroll */}
                    {[...trustItems, ...trustItems].map((item, idx) => (
                        <React.Fragment key={idx}>
                            <span>{item}</span>
                            <span className={styles.separator}>•</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustMarquee;

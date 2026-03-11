"use client";

import React from 'react';
import {
    Zap, Shield, MapPin, CheckCircle2,
    Server, Headphones, Building2, Wifi
} from 'lucide-react';
import styles from './TrustStrip.module.css';

const trustItems = [
    { icon: <Wifi size={18} />, text: '10,000+ Homes Connected' },
    { icon: <Shield size={18} />, text: '99.99% Uptime SLA' },
    { icon: <Zap size={18} />, text: 'Up to 1Gbps Fiber Speed' },
    { icon: <MapPin size={18} />, text: 'Tamil Nadu Wide Coverage' },
    { icon: <CheckCircle2 size={18} />, text: 'DoT Licensed ISP' },
    { icon: <Server size={18} />, text: 'Tier 3 Network Infrastructure' },
    { icon: <Headphones size={18} />, text: '24/7 NOC Support' },
    { icon: <Building2 size={18} />, text: 'Enterprise Grade Connectivity' },
];

const TrustStrip = () => {
    return (
        <div className={styles.trustStrip}>
            <div className={styles.trustTrack}>
                {/* Render items twice for seamless loop */}
                {[...trustItems, ...trustItems].map((item, idx) => (
                    <React.Fragment key={idx}>
                        <div className={styles.trustItem}>
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.text}>{item.text}</span>
                        </div>
                        <div className={styles.dotSeparator} />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default TrustStrip;

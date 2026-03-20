"use client";

import React from 'react';
import styles from './TrustMarquee.module.css';

const partnerLogos = [
    { name: "HPE Aruba", src: "/images/partners/HPE aruba networking.png" },
    { name: "Ubiquiti", src: "/images/partners/u.png" },
    { name: "Cisco", src: "/images/partners/cisco.png" },
    { name: "Equinix", src: "/images/partners/equinix.png" },
    { name: "ST Telemedia", src: "/images/partners/st telemedia global data centres.png" },
    { name: "Broadcom", src: "/images/partners/broadcom.png" },
    { name: "Zscaler", src: "/images/partners/zsaler.png" },
    { name: "Microsoft 365", src: "/images/partners/microsoft 365.png" },
    { name: "Google Workspace", src: "/images/partners/google workspace.png" },
    { name: "Observium", src: "/images/partners/observium.png" },
    { name: "Cloudstack", src: "/images/partners/cloudstack.png" },
    { name: "Dell", src: "/images/partners/DELL technologies.png" },
    { name: "HPE", src: "/images/partners/HPE.png" },
    { name: "D-Link", src: "/images/partners/d link .png" },
    { name: "Fortinet", src: "/images/partners/fortinet.png" },
    { name: "SonicWall", src: "/images/partners/Sonicwall.png" },
    { name: "Cloud Cube", src: "/images/partners/cloud cube .png" }
];

const TrustMarquee = () => {
    return (
        <section className={styles.trustMarquee}>
            <div className={styles.marqueeWrapper}>
                <div className={styles.marqueeTrack}>
                    {/* Render multiple times for seamless infinite scroll */}
                    {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, idx) => (
                        <div key={idx} className={styles.logoWrapper}>
                            <img src={partner.src} alt={partner.name} className={styles.partnerLogo} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustMarquee;

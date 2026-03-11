"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './OTTShowcase.module.css';

const ottApps = [
    { name: "Disney+ Hotstar", color: "#001B41" },
    { name: "Zee5", color: "#2B0033" },
    { name: "SonyLIV", color: "#000000" },
    { name: "Aha", color: "#FF4500" },
    { name: "Prime Video", color: "#00A8E1" },
    { name: "Sun NXT", color: "#ED1C24" }
];

const OTTShowcase = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.leftCol}
                    >
                        <h2 className={styles.title}>
                            Entertainment <span className={styles.highlight}>Unlimited.</span>
                        </h2>
                        <p className={styles.text}>
                            Don't just browse, experience. Get premium access to all your favorite OTT platforms included with our high-speed fiber packages. Stream in 4K Ultra HD without any buffering.
                        </p>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>15+</span>
                                <span className={styles.statLabel}>OTT Apps</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>4K</span>
                                <span className={styles.statLabel}>Buffering Free</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={styles.rightCol}
                    >
                        <div className={styles.appGrid}>
                            {ottApps.map((app, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className={styles.appCard}
                                    style={{ backgroundColor: app.color }}
                                >
                                    <div className={styles.appLogoPlaceholder}>
                                        {app.name}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className={styles.glowOverlay}></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default OTTShowcase;

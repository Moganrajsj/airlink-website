"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Activity, CreditCard, Settings, LogOut,
    ArrowUp, ArrowDown, Bell, Search, User
} from 'lucide-react';
import styles from './dashboard.module.css';

const DashboardPage = () => {
    return (
        <div className={styles.dashboard}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sideBrand}>
                    AIRLINK<span>.</span>
                </div>
                <nav className={styles.sideNav}>
                    <div className={`${styles.navItem} ${styles.active}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </div>
                    <div className={styles.navItem}>
                        <Activity size={20} /> My Usage
                    </div>
                    <div className={styles.navItem}>
                        <CreditCard size={20} /> Billing
                    </div>
                    <div className={styles.navItem}>
                        <Settings size={20} /> Settings
                    </div>
                </nav>
                <div className={styles.sideFooter}>
                    <button className={styles.logoutBtn}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.content}>
                <header className={styles.topBar}>
                    <div className={styles.search}>
                        <Search size={18} />
                        <input type="text" placeholder="Search for tools, docs..." />
                    </div>
                    <div className={styles.topActions}>
                        <button className={styles.iconBtn}><Bell size={20} /></button>
                        <div className={styles.profile}>
                            <User size={20} />
                            <span>Mogan S.</span>
                        </div>
                    </div>
                </header>

                <section className={styles.welcome}>
                    <h1>Welcome back, <span className={styles.highlight}>Mogan</span></h1>
                    <p>Your network is performing optimally with 100% uptime today.</p>
                </section>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Current Speed</div>
                        <div className={styles.statValue}>984 <span>Mbps</span></div>
                        <div className={styles.statTrend}><ArrowUp size={14} /> 2.4% vs last hour</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Data Used</div>
                        <div className={styles.statValue}>1.4 <span>TB</span></div>
                        <div className={styles.statTrend}>Resetting in 12 days</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Active Devices</div>
                        <div className={styles.statValue}>42</div>
                        <div className={styles.statTrend}>Secure Tunnel Active</div>
                    </div>
                </div>

                <div className={styles.bottomGrid}>
                    <div className={styles.chartCard}>
                        <div className={styles.cardHeader}>
                            <h3>Live Bandwidth Usage</h3>
                            <div className={styles.chartActions}>
                                <span className={styles.activeDot}></span> Live
                            </div>
                        </div>
                        <div className={styles.mockChart}>
                            {[40, 70, 45, 90, 65, 80, 50, 40, 30, 60, 85, 95, 75, 55, 45, 65].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className={styles.chartBar}
                                ></motion.div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.activityCard}>
                        <h3>Recent Notifications</h3>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <div className={styles.actIcon}><Activity size={16} /></div>
                                <div>
                                    <p>Monthly uptime report generated</p>
                                    <span>2 hours ago</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.actIcon}><CreditCard size={16} /></div>
                                <div>
                                    <p>Auto-pay processed successfully</p>
                                    <span>Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

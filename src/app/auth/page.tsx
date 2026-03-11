"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Aurora from '@/components/animations/Aurora';
import BlurText from '@/components/animations/BlurText';
import OTTIcon from '@/components/ui/OTTIcon';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!forgotEmail) return;
        setForgotLoading(true);
        await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail }),
        });
        setForgotLoading(false);
        setForgotSent(true);
    };

    const { login, signup, isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push(isAdmin ? '/admin' : '/portal');
        }
    }, [isAuthenticated, isAdmin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let success = false;

            if (isLogin) {
                success = await login(email, password);
                if (!success) {
                    setError('Invalid email or password');
                }
            } else {
                if (!name.trim()) {
                    setError('Please enter your name');
                    setLoading(false);
                    return;
                }
                success = await signup(email, password, name);
                if (!success) {
                    setError('Email already exists');
                }
            }

            if (success) {
                router.push(isAdmin ? '/admin' : '/portal');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const ottApps = [
        "Amazon Prime", "Jio Hotstar", "Sony Liv", "Zee5",
        "Sun NXT", "Aha", "Fancode", "Distro TV"
    ];

    return (
        <div className="min-h-screen bg-[#0A192F] text-white font-inter selection:bg-[#FBBF24]/30 selection:text-white flex items-center justify-center p-4 md:p-10 relative overflow-hidden">

            {/* Animated Background */}
            <Aurora
                colorStops={["#FBBF24", "#0A192F", "#1F2933"]}
                amplitude={1.2}
                speed={0.8}
            />

            <div className="container max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-20 relative z-10 items-center">

                {/* Left Side: Branding & Value Proposition */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="hidden lg:block space-y-12"
                >
                    <Link href="/">
                        <img
                            src="/airlink-logo.png"
                            alt="Airlink Logo"
                            className="cursor-target h-16 w-auto brightness-0 invert"
                        />
                    </Link>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-[#FBBF24] text-[10px] font-black tracking-[0.2em] uppercase border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse"></span>
                            Real-Time Fiber Intelligence
                        </div>

                        <BlurText
                            text="Experience Airlink Power."
                            className="text-7xl font-black text-white leading-[1.1] tracking-tighter"
                            animateBy="word"
                        />

                        <p className="text-xl text-white/60 font-medium max-w-md leading-relaxed">
                            Log in to your high-speed command center. Manage your 1Gbps connection, premium OTTs, and smart home network.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
                            <Zap className="text-[#FBBF24] mb-4 group-hover:scale-110 transition-transform" size={32} />
                            <h4 className="font-bold text-lg">Turbo Speed</h4>
                            <p className="text-sm text-white/40">Up to 1Gbps Symmetric</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all">
                            <ShieldCheck className="text-[#FBBF24] mb-4 group-hover:scale-110 transition-transform" size={32} />
                            <h4 className="font-bold text-lg">Secure Core</h4>
                            <p className="text-sm text-white/40">DDoS Protected Network</p>
                        </div>
                    </div>

                    {/* OTT Bundle Preview */}
                    <div className="space-y-4 pt-4">
                        <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Included Premium Subscriptions</h5>
                        <div className="flex flex-wrap gap-3">
                            {ottApps.map((app) => (
                                <div key={app} className="w-12 h-12 bg-white/5 rounded-2xl p-1 border border-white/10 hover:border-[#FBBF24]/50 transition-colors">
                                    <OTTIcon name={app} className="w-full h-full grayscale hover:grayscale-0 transition-all" />
                                </div>
                            ))}
                            <div className="w-12 h-12 bg-[#FBBF24] rounded-2xl flex items-center justify-center text-[#0A192F] font-black text-xs">
                                +15
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Auth Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden text-[#0A192F]">
                        {/* Decorative background element for the card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>

                        <div className="relative z-10">
                            <div className="mb-10 text-center lg:text-left">
                                <h2 className="text-3xl font-black text-[#0A192F] mb-2 tracking-tight">
                                    {isLogin ? 'Command Center.' : 'Create Connection.'}
                                </h2>
                                <p className="text-sm font-semibold text-[#0A192F]/40 uppercase tracking-widest">
                                    {isLogin ? 'Enter your credentials' : 'Join Chennai\'s elite network'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {!isLogin && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-2"
                                        >
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0A192F]/20 group-focus-within:text-[#FBBF24] transition-colors" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Your Full Name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required={!isLogin}
                                                    className="w-full bg-[#F7F7F8] border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 text-[#0A192F] font-bold focus:border-[#FBBF24] focus:bg-white outline-none transition-all placeholder:text-[#0A192F]/20 shadow-inner"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0A192F]/20 group-focus-within:text-[#FBBF24] transition-colors" size={20} />
                                        <input
                                            type="email"
                                            placeholder="Member ID / Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-[#F7F7F8] border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 text-[#0A192F] font-bold focus:border-[#FBBF24] focus:bg-white outline-none transition-all placeholder:text-[#0A192F]/20 shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#0A192F]/20 group-focus-within:text-[#FBBF24] transition-colors" size={20} />
                                        <input
                                            type="password"
                                            placeholder="Security Passkey"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            className="w-full bg-[#F7F7F8] border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 text-[#0A192F] font-bold focus:border-[#FBBF24] focus:bg-white outline-none transition-all placeholder:text-[#0A192F]/20 shadow-inner"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider border border-red-100 flex items-center gap-3"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-target w-full py-5 bg-[#0A192F] text-white font-black rounded-2xl hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50"
                                >
                                    {loading ? 'Validating Session...' : (isLogin ? 'Authorize Access' : 'Initialize Account')}
                                    {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => setShowForgot(true)}
                                        className="cursor-target text-[#0A192F]/40 hover:text-[#FBBF24] text-xs font-bold tracking-wider transition-colors text-center w-full mt-1"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </form>

                            {/* Forgot Password Modal */}
                            <AnimatePresence>
                                {showForgot && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                                        onClick={() => setShowForgot(false)}
                                    >
                                        <motion.div
                                            initial={{ scale: 0.9, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            exit={{ scale: 0.9, y: 20 }}
                                            onClick={e => e.stopPropagation()}
                                            className="bg-[#0A192F] border border-white/10 rounded-3xl p-8 w-full max-w-sm"
                                        >
                                            {forgotSent ? (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                                        <ShieldCheck size={24} className="text-green-400" />
                                                    </div>
                                                    <h3 className="text-white font-black text-lg mb-2">Email Sent!</h3>
                                                    <p className="text-white/50 text-sm">Check your inbox for the password reset link. It expires in 30 minutes.</p>
                                                    <button onClick={() => { setShowForgot(false); setForgotSent(false); }} className="mt-6 text-[#FBBF24] text-xs font-black uppercase tracking-widest">Close</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="text-white font-black text-xl mb-1">Forgot Password?</h3>
                                                    <p className="text-white/40 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
                                                    <input
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={forgotEmail}
                                                        onChange={e => setForgotEmail(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 focus:border-[#FBBF24] text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none transition-colors mb-4"
                                                    />
                                                    <button
                                                        onClick={handleForgotPassword}
                                                        disabled={!forgotEmail || forgotLoading}
                                                        className="cursor-target w-full py-3 bg-[#FBBF24] hover:bg-white text-[#0A192F] font-black rounded-xl text-sm uppercase tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                                                    </button>
                                                    <button onClick={() => setShowForgot(false)} className="w-full text-center mt-3 text-white/30 text-xs font-bold">Cancel</button>
                                                </>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-8 pt-8 border-t border-[#E5E7EB] flex flex-col items-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="cursor-target text-[#0A192F]/60 font-black text-xs uppercase tracking-widest hover:text-[#FBBF24] transition-colors"
                                >
                                    {isLogin ? "Need access? Register now" : 'Registered? Back to Login'}
                                </button>

                                <p className="mt-8 text-[9px] text-[#0A192F]/30 text-center font-bold tracking-tight">
                                    Protected by Airlink Enterprise Shield. <br />
                                    By continuing, you agree to our Terms of Service.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Experimental Access Section */}
                    <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em] mb-3 text-center">Experimental Credentials</p>
                        <div className="flex justify-between items-center text-[10px] font-bold gap-4">
                            <div className="flex flex-col">
                                <span className="text-white/40 uppercase text-[7px] mb-1">Admin</span>
                                <code className="bg-white/5 px-2 py-1 rounded text-[#FBBF24]">admin@airlink.com</code>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/40 uppercase text-[7px] mb-1">User</span>
                                <code className="bg-white/5 px-2 py-1 rounded text-[#FBBF24]">customer@test.com</code>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Bottom Accent Bar */}
            <div className="h-2 bg-[#FBBF24] fixed bottom-0 left-0 right-0 z-50"></div>
        </div>
    );
}


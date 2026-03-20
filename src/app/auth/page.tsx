"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Lock, Mail, ArrowRight, ShieldCheck, 
    AlertCircle, Loader2, Sparkles 
} from 'lucide-react';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/admin');
            } else {
                setError(data.error || 'Identity verification failed');
            }
        } catch (err) {
            setError('Connection to auth server failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-4 selection:bg-[#FBBF24] selection:text-[#0A192F]">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FBBF24]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2.5 mb-6 group">
                        <div className="w-12 h-12 bg-[#FBBF24] rounded-xl flex items-center justify-center shadow-2xl shadow-[#FBBF24]/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-[#0A192F]" size={24} />
                        </div>
                        <span className="text-3xl font-black text-white tracking-tighter italic">AIRLINK<span className="text-[#FBBF24]">.</span></span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Admin Core Login</h1>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Unauthorized access is strictly prohibited</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Sparkles className="text-[#FBBF24]" size={40} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                                <p className="text-red-500 text-xs font-bold uppercase tracking-wider">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Terminal ID (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="info@srirambroadband.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white placeholder:text-white/10 outline-none focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/20 transition-all"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Access Key (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white placeholder:text-white/10 outline-none focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/20 transition-all"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FBBF24] text-[#0A192F] rounded-2xl py-5 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-[#FBBF24]/10 mt-4"
                            suppressHydrationWarning
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>Verify Identity <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer info */}
                <div className="mt-10 text-center">
                    <p className="text-white/20 text-[10px] font-black tracking-[0.3em] uppercase">Secure Infrastructure Protocol v2.5.0</p>
                </div>
            </div>
        </div>
    );
}

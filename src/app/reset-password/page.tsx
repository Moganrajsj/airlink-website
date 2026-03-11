"use client";

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

// Server action imports must be called from a client component via fetch
// We'll hit a simple API route for this instead
async function callReset(token: string, password: string) {
    const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
    });
    return res.json();
}

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (!token) {
            setError('Invalid or missing reset token. Please request a new reset link.');
            return;
        }

        setLoading(true);
        const result = await callReset(token, password);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => router.push('/auth'), 3000);
        } else {
            setError(result.error || 'Something went wrong. The link may have expired.');
        }
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Password Updated!</h2>
                <p className="text-sm text-white/50">Redirecting you to the login page...</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50 block mb-2">New Password</label>
                <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FBBF24] text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    required
                />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-white/50 block mb-2">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Repeat your new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FBBF24] text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    required
                />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-xl">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#FBBF24] hover:bg-white text-[#0A192F] font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50"
            >
                {loading ? 'Updating...' : 'Set New Password'}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#0A192F] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/20 flex items-center justify-center">
                        <KeyRound size={20} className="text-[#FBBF24]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight">Reset Password</h1>
                        <p className="text-xs text-white/40">Airlink Broadband Account</p>
                    </div>
                </div>

                <Suspense fallback={<div className="text-white/40 text-sm">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>

                <a href="/auth" className="flex items-center gap-2 text-white/30 hover:text-white text-xs mt-5 transition-colors">
                    <ArrowLeft size={12} /> Back to Login
                </a>
            </motion.div>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // If this component renders, the middleware has already verified the session
        setIsVerified(true);
    }, []);

    if (!isVerified) {
        return (
            <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-[#FBBF24]/10 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                    <Lock className="text-[#FBBF24]" size={32} />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Authenticating Core...</h2>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Establishing secure infrastructure link</p>
                <div className="mt-8 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FBBF24] w-1/3 animate-[loading_1.5s_ease-in-out_infinite]" />
                </div>
                <style jsx>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                `}</style>
            </div>
        );
    }

    return <>{children}</>;
}

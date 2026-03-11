"use client";
/**
 * AnimatedBackground — Site-wide light-theme background system
 * All variants use WHITE / LIGHT backgrounds with subtle animated elements.
 * Colors: Navy (#0A192F) particles + Yellow (#FBBF24) glow accents
 */

import React, { useEffect, useRef } from 'react';

/* ─── PARTICLE CANVAS (navy nodes on white) ─── */
function ParticleCanvas({
    count = 55,
    nodeColor = '10,25,47',
    nodeOpacity = 0.06,
    lineOpacity = 0.04,
    connectionDist = 130,
}: {
    count?: number;
    nodeColor?: string;
    nodeOpacity?: number;
    lineOpacity?: number;
    connectionDist?: number;
}) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = canvas.width = canvas.offsetWidth;
        let H = canvas.height = canvas.offsetHeight;

        interface P { x: number; y: number; vx: number; vy: number; r: number; a: number; }

        const particles: P[] = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            r: Math.random() * 1.6 + 0.6,
            a: Math.random() * nodeOpacity + nodeOpacity * 0.4,
        }));

        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < connectionDist) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${nodeColor},${(1 - d / connectionDist) * lineOpacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${nodeColor},${p.a})`;
                ctx.fill();
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            }
            raf = requestAnimationFrame(draw);
        };
        draw();

        const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
    }, [count, nodeColor, nodeOpacity, lineOpacity, connectionDist]);

    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ═══════════════════════════════════════════════════════════
   LIGHT HERO BACKGROUND — Premium white hero with particle network
   Use on all page hero sections (white bg)
   ═══════════════════════════════════════════════════════════ */
export function LightHeroBg({ particles = true }: { particles?: boolean }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
            {/* Soft gold ambience — top right */}
            <div
                className="absolute top-[-15%] right-[-8%] w-[50%] h-[65%] rounded-full"
                style={{
                    background: 'rgba(251,191,36,0.07)',
                    filter: 'blur(120px)',
                    animation: 'orbFloat1 18s ease-in-out infinite alternate',
                }}
            />
            {/* Soft navy ambience — bottom left */}
            <div
                className="absolute bottom-[-15%] left-[-8%] w-[45%] h-[55%] rounded-full"
                style={{
                    background: 'rgba(10,25,47,0.04)',
                    filter: 'blur(110px)',
                    animation: 'orbFloat2 22s ease-in-out infinite alternate',
                }}
            />
            {/* Very subtle grid */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(10,25,47,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(10,25,47,0.025) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                }}
            />
            {/* Navy particle network */}
            {particles && (
                <ParticleCanvas count={60} nodeColor="10,25,47" nodeOpacity={0.055} lineOpacity={0.04} connectionDist={130} />
            )}
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   LIGHT SECTION BACKGROUND — Subtle ambient орbs + optional pattern
   Use on white or #F7F7F8 content sections
   ═══════════════════════════════════════════════════════════ */
export function LightSectionBg({ variant = 'default' }: { variant?: 'default' | 'warm' | 'dots' | 'particles' }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
            {/* Top-left orb */}
            <div
                className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full"
                style={{ background: 'rgba(251,191,36,0.055)', filter: 'blur(100px)' }}
            />
            {/* Bottom-right orb */}
            <div
                className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[45%] rounded-full"
                style={{ background: 'rgba(10,25,47,0.03)', filter: 'blur(100px)' }}
            />
            {variant === 'dots' && (
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #0A192F 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                />
            )}
            {variant === 'warm' && (
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(251,191,36,1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />
            )}
            {variant === 'particles' && (
                <ParticleCanvas count={40} nodeColor="10,25,47" nodeOpacity={0.04} lineOpacity={0.03} connectionDist={110} />
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   GRAY SECTION BACKGROUND — For alternating #F7F7F8 sections
   Use on light-gray content sections
   ═══════════════════════════════════════════════════════════ */
export function GraySectionBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
            <div
                className="absolute top-[-5%] right-[0%] w-[35%] h-[60%] rounded-full"
                style={{ background: 'rgba(251,191,36,0.04)', filter: 'blur(80px)' }}
            />
            <div
                className="absolute bottom-[-5%] left-[0%] w-[30%] h-[50%] rounded-full"
                style={{ background: 'rgba(10,25,47,0.03)', filter: 'blur(80px)' }}
            />
            <div
                className="absolute inset-0 opacity-[0.018]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #0A192F 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />
            <ParticleCanvas count={30} nodeColor="10,25,47" nodeOpacity={0.035} lineOpacity={0.025} connectionDist={100} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   ACCENT SECTION BACKGROUND — Yellow-tinted section (light)
   Use on CTA, urgency, or highlight sections with yellow bg
   ═══════════════════════════════════════════════════════════ */
export function YellowAccentBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #0A192F 0px, #0A192F 1px, transparent 1px, transparent 24px)',
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[600px] h-[600px] rounded-full border-[60px] border-white/10 absolute" />
                <div className="w-[900px] h-[900px] rounded-full border-[60px] border-white/5 absolute" />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   FEATURE MESH BG — Animated flowing gradient on light bg
   ═══════════════════════════════════════════════════════════ */
export function LightMeshBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(251,191,36,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(10,25,47,0.04) 0%, transparent 50%)',
                    animation: 'meshPulse 16s ease-in-out infinite alternate',
                }}
            />
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(10,25,47,1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,25,47,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />
            <ParticleCanvas count={35} nodeColor="10,25,47" nodeOpacity={0.04} lineOpacity={0.03} connectionDist={110} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   LEGACY ALIASES (for backward compat during migration)
   ═══════════════════════════════════════════════════════════ */
export const DarkHeroBg = LightHeroBg;
export const NavySectionBg = GraySectionBg;
export const MeshBg = LightMeshBg;

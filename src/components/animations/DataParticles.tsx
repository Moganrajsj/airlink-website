"use client";

import React, { useEffect, useRef } from 'react';

interface DataParticlesProps {
    particleColor?: string;
    particleCount?: number;
    speed?: number;
    opacity?: number;
}

const DataParticles: React.FC<DataParticlesProps> = ({
    particleColor = "rgba(10, 25, 47, 0.4)",
    particleCount = 40,
    speed = 0.5,
    opacity = 0.15
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        interface Particle {
            x: number;
            y: number;
            size: number;
            vx: number;
            vy: number;
            pulse: number;
            pDir: number;
        }

        const particles: Particle[] = [];

        const createParticles = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    pulse: Math.random(),
                    pDir: Math.random() > 0.5 ? 1 : -1,
                });
            }
        };

        createParticles();

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.globalAlpha = opacity;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                // Pulsing effect
                p.pulse += p.pDir * 0.005;
                if (p.pulse >= 1 || p.pulse <= 0) p.pDir *= -1;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                // Small glow around particle
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                glow.addColorStop(0, particleColor);
                glow.addColorStop(1, 'transparent');
                ctx.fillStyle = glow;
                ctx.globalAlpha = opacity * p.pulse;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = opacity; // Reset for next particle
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            createParticles();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [particleColor, particleCount, speed, opacity]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default DataParticles;

"use client";

import React, { useEffect, useRef } from 'react';

interface FiberBeamsProps {
    beamColor?: string;
    beamCount?: number;
    speed?: number;
    opacity?: number;
}

const FiberBeams: React.FC<FiberBeamsProps> = ({
    beamColor = "#FBBF24",
    beamCount = 6,
    speed = 0.05,
    opacity = 0.25
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        interface Beam {
            x: number;
            y: number;
            len: number;
            angle: number;
            vx: number;
            vy: number;
        }

        const beams: Beam[] = [];

        const createBeams = () => {
            beams.length = 0;
            for (let i = 0; i < beamCount; i++) {
                const angle = Math.random() * Math.PI * 0.25 - (Math.PI / 8); // Slight diagonal
                const s = (Math.random() + 0.5) * speed * 20;

                beams.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    len: Math.random() * 200 + 100,
                    angle: angle,
                    vx: Math.cos(angle) * s,
                    vy: Math.sin(angle) * s,
                });
            }
        };

        createBeams();

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.globalAlpha = opacity;

            for (let i = 0; i < beams.length; i++) {
                const b = beams[i];
                b.x += b.vx;
                b.y += b.vy;

                // Reset position if out of bounds
                if (b.x < -b.len || b.x > w + b.len || b.y < -b.len || b.y > h + b.len) {
                    b.x = -b.len;
                    b.y = Math.random() * h;
                }

                // Draw beam gradient
                const grad = ctx.createLinearGradient(b.x, b.y, b.x + Math.cos(b.angle) * b.len, b.y + Math.sin(b.angle) * b.len);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.5, beamColor);
                grad.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                ctx.lineTo(b.x + Math.cos(b.angle) * b.len, b.y + Math.sin(b.angle) * b.len);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Small glow/spark at the "head" of the beam
                ctx.beginPath();
                ctx.arc(b.x + Math.cos(b.angle) * b.len * 0.5, b.y + Math.sin(b.angle) * b.len * 0.5, 1, 0, Math.PI * 2);
                ctx.fillStyle = beamColor;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            createBeams();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [beamColor, beamCount, speed, opacity]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
};

export default FiberBeams;

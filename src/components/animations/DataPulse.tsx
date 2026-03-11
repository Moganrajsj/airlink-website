"use client";

import React, { useEffect, useRef } from 'react';

interface DataPulseProps {
    pulseColor?: string;
    speed?: number;
    opacity?: number;
    intensity?: number;
}

const DataPulse: React.FC<DataPulseProps> = ({
    pulseColor = "#FBBF24",
    speed = 1,
    opacity = 0.2,
    intensity = 3
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        interface Ring {
            radius: number;
            opacity: number;
        }

        const rings: Ring[] = [];

        const spawnRing = () => {
            rings.push({ radius: 0, opacity: 1 });
        };

        let lastSpawn = 0;
        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            const now = Date.now();
            if (now - lastSpawn > 2000 / speed) {
                spawnRing();
                lastSpawn = now;
            }

            ctx.lineWidth = 1.5;

            for (let i = rings.length - 1; i >= 0; i--) {
                const r = rings[i];
                r.radius += 2 * speed;
                r.opacity -= 0.005 * speed;

                if (r.opacity <= 0) {
                    rings.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(w / 2, h / 2, r.radius, 0, Math.PI * 2);
                ctx.strokeStyle = pulseColor;
                ctx.globalAlpha = r.opacity * opacity;
                ctx.stroke();

                // Optional subtle glow
                if (intensity > 1) {
                    ctx.lineWidth = 3;
                    ctx.globalAlpha = r.opacity * opacity * 0.3;
                    ctx.stroke();
                    ctx.lineWidth = 1.5;
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [pulseColor, speed, opacity, intensity]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default DataPulse;

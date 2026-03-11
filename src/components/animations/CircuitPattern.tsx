"use client";

import React, { useEffect, useRef } from 'react';

interface CircuitPatternProps {
    opacity?: number;
    color?: string;
    density?: number;
}

const CircuitPattern: React.FC<CircuitPatternProps> = ({
    opacity = 0.05,
    color = "#0A192F",
    density = 15
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = (canvas.width = window.innerWidth);
        const h = (canvas.height = window.innerHeight);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1;

        const drawCircuit = () => {
            const step = w / density;
            for (let x = 0; x < w; x += step) {
                for (let y = 0; y < h; y += step) {
                    if (Math.random() > 0.7) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);

                        // Random path
                        let curX = x;
                        let curY = y;
                        const segments = Math.floor(Math.random() * 3) + 1;

                        for (let i = 0; i < segments; i++) {
                            const dir = Math.floor(Math.random() * 3);
                            if (dir === 0) curX += step / 2;
                            else if (dir === 1) curY += step / 2;
                            else { curX += step / 2; curY += step / 2; }

                            ctx.lineTo(curX, curY);
                        }
                        ctx.stroke();

                        // End node
                        ctx.beginPath();
                        ctx.arc(curX, curY, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        };

        drawCircuit();

    }, [opacity, color, density]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default CircuitPattern;

"use client";

import React, { useEffect, useRef } from 'react';

interface NetworkGridProps {
    opacity?: number;
    speed?: number;
    nodeColor?: string;
    lineColor?: string;
    nodeCount?: number;
}

const NetworkGrid: React.FC<NetworkGridProps> = ({
    opacity = 0.08,
    speed = 0.4,
    nodeColor = "rgba(10, 25, 47, 0.15)",
    lineColor = "rgba(10, 25, 47, 0.05)",
    nodeCount = 60
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        interface Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
        }

        const nodes: Node[] = [];
        const maxDist = 180;

        const createNodes = () => {
            nodes.length = 0;
            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    size: Math.random() * 1.5 + 0.5,
                });
            }
        };

        createNodes();

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            ctx.globalAlpha = opacity;

            for (let i = 0; i < nodes.length; i++) {
                const n1 = nodes[i];
                n1.x += n1.vx;
                n1.y += n1.vy;

                // Boundary bounce
                if (n1.x < 0 || n1.x > w) n1.vx *= -1;
                if (n1.y < 0 || n1.y > h) n1.vy *= -1;

                // Draw node
                ctx.beginPath();
                ctx.arc(n1.x, n1.y, n1.size, 0, Math.PI * 2);
                ctx.fillStyle = nodeColor;
                ctx.fill();

                // Draw lines to nearby nodes
                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const d = Math.sqrt(dx * dx + dy * dy);

                    if (d < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        const lineAlpha = (1 - d / maxDist) * 0.5;
                        ctx.strokeStyle = lineColor.replace(')', `, ${lineAlpha})`).replace('rgb', 'rgba'); // Hacky but works forrgba strings if needed, better to just use a fixed alpha or handle logic

                        // Let's use simpler line styling
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = lineAlpha;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            createNodes();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [opacity, speed, nodeColor, lineColor, nodeCount]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default NetworkGrid;

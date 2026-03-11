"use client";
import React, { ReactNode } from "react";

interface AuroraProps {
    colorStops?: string[];
    amplitude?: number;
    blend?: number;
    speed?: number;
}

export default function Aurora({
    colorStops = ["#FBBF24", "#0A192F", "#1F2933"],
    amplitude = 1,
    blend = 0.5,
    speed = 1,
}: AuroraProps) {
    // Pure CSS highly fluid aurora based on React Bits specs
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div
                className="absolute inset-[-50%] opacity-50 mix-blend-screen"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${colorStops[0]} 0%, transparent 40%),
                       radial-gradient(circle at 80% 20%, ${colorStops[1]} 0%, transparent 40%),
                       radial-gradient(circle at 20% 80%, ${colorStops[2]} 0%, transparent 40%)`,
                    filter: `blur(${60 * blend}px)`,
                    animation: `auroraFlow ${20 / speed}s ease-in-out infinite alternate`,
                    transform: `scale(${1 + (amplitude * 0.2)})`
                }}
            />
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes auroraFlow {
          0% { transform: rotate(0deg) scale(1) translate(0, 0); }
          50% { transform: rotate(5deg) scale(1.1) translate(-2%, 5%); }
          100% { transform: rotate(-5deg) scale(1) translate(5%, -2%); }
        }
      `}} />
        </div>
    );
}

"use client";

import React from 'react';
import NetworkGrid from './NetworkGrid';
import FiberBeams from './FiberBeams';
import DataParticles from './DataParticles';
import DataPulse from './DataPulse';
import CircuitPattern from './CircuitPattern';

interface DynamicBackgroundProps {
    layers?: ("grid" | "beams" | "particles" | "pulse" | "circuit")[];
    theme?: "light" | "dark";
    opacity?: number;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
    layers = ["grid", "particles"],
    theme = "light",
    opacity = 1
}) => {
    const isDark = theme === "dark";

    const getColors = (type: "node" | "line" | "beam" | "particle" | "pulse") => {
        if (type === "beam" || type === "pulse") return "#FBBF24"; // Always yellow

        if (isDark) {
            switch (type) {
                case "node": return "rgba(255, 255, 255, 0.4)";
                case "line": return "rgba(255, 255, 255, 0.1)";
                case "particle": return "rgba(255, 255, 255, 0.2)";
                default: return "#FBBF24";
            }
        } else {
            switch (type) {
                case "node": return "rgba(10, 25, 47, 0.15)";
                case "line": return "rgba(10, 25, 47, 0.05)";
                case "particle": return "rgba(10, 25, 47, 0.3)";
                default: return "#FBBF24";
            }
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, opacity }}>
            {layers.includes("grid") && (
                <NetworkGrid
                    nodeColor={getColors("node")}
                    lineColor={getColors("line")}
                />
            )}
            {layers.includes("particles") && (
                <DataParticles
                    particleColor={getColors("particle")}
                />
            )}
            {layers.includes("beams") && (
                <FiberBeams
                    beamColor={getColors("beam")}
                />
            )}
            {layers.includes("pulse") && (
                <DataPulse
                    pulseColor={getColors("pulse")}
                />
            )}
            {layers.includes("circuit") && (
                <CircuitPattern
                    color={getColors("line")}
                />
            )}
        </div>
    );
};

export default DynamicBackground;

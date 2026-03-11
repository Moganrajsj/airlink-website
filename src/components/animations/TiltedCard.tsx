"use client";

import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import gsap from 'gsap';

interface TiltedCardProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    scaleOnHover?: number;
    rotateAmplitude?: number;
}

export default function TiltedCard({
    children,
    className = "",
    containerClassName = "",
    scaleOnHover = 1.02,
    rotateAmplitude = 12
}: TiltedCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Track mouse position over the card
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics-based spring for the rotation
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    // Map the mouse position (from -1 to 1) to rotation values
    const rotateX = useTransform(mouseYSpring, [-1, 1], [rotateAmplitude, -rotateAmplitude]);
    const rotateY = useTransform(mouseXSpring, [-1, 1], [-rotateAmplitude, rotateAmplitude]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        // Get dimensions of the element
        const rect = ref.current.getBoundingClientRect();

        // Calculate mouse position relative to the center of the element (-1 to 1)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = (e.clientX - centerX) / (rect.width / 2);
        const mouseY = (e.clientY - centerY) / (rect.height / 2);

        // Update framer-motion values
        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        // Ensure values are reset to 0 before tracking starts to avoid sudden jumps
        x.set(0);
        y.set(0);

        // Optional: Animate scale with GSAP for buttery smooth pop
        gsap.to(ref.current, {
            scale: scaleOnHover,
            duration: 0.4,
            ease: "power3.out"
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        // Reset rotation smoothly using Framer Motion
        x.set(0);
        y.set(0);

        // Reset scale smoothly using GSAP
        gsap.to(ref.current, {
            scale: 1,
            duration: 0.5,
            ease: "power3.out"
        });
    };

    return (
        <div
            className={`perspective-1000 ${containerClassName}`}
            style={{ perspective: "1000px" }}
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className={`relative w-full h-full transition-shadow duration-300 ${isHovered ? 'shadow-[0_30px_60px_-15px_rgba(251,191,36,0.15)] z-20 hover:border-[#FBBF24]/40' : 'shadow-none z-10'} ${className}`}
            >
                {/* Gloss overlay that moves with the mouse to catch "light" */}
                <motion.div
                    className="absolute inset-0 z-50 pointer-events-none rounded-[inherit]"
                    style={{
                        background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)",
                        x: useTransform(mouseXSpring, [-1, 1], ["-50%", "50%"]),
                        y: useTransform(mouseYSpring, [-1, 1], ["-50%", "50%"]),
                        opacity: isHovered ? 1 : 0
                    }}
                />

                {children}
            </motion.div>
        </div>
    );
}

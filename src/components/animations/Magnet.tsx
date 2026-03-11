"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

export default function Magnet({
    children,
    padding = 50,
    disabled = false,
    magnetStrength = 0.5,
    activeTransition = "transform 0.3s ease-out",
    inactiveTransition = "transform 0.5s ease-in-out"
}: {
    children: React.ReactNode;
    padding?: number;
    disabled?: boolean;
    magnetStrength?: number;
    activeTransition?: string;
    inactiveTransition?: string;
}) {
    const [isActive, setIsActive] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled || !wrapperRef.current) return;

        const el = wrapperRef.current;

        const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = clientX - centerX;
            const distanceY = clientY - centerY;

            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < rect.width / 2 + padding) {
                setIsActive(true);
                xTo(distanceX * magnetStrength);
                yTo(distanceY * magnetStrength);
            } else {
                setIsActive(false);
                xTo(0);
                yTo(0);
            }
        };

        const handleMouseLeave = () => {
            setIsActive(false);
            xTo(0);
            yTo(0);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
        };
    }, [disabled, padding, magnetStrength]);

    return (
        <div
            ref={wrapperRef}
            style={{
                display: "inline-block",
                transition: isActive ? activeTransition : inactiveTransition,
            }}
        >
            {children}
        </div>
    );
}

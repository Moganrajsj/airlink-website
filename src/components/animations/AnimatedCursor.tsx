"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over clickable elements
            if (
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        // Hide default cursor across the body when this mounts
        document.body.style.cursor = 'none';

        // Safety fallback: allow regular cursors on links/buttons if needed for screen readers, 
        // but visually we want them hidden to let our custom cursor shine.
        const style = document.createElement('style');
        style.innerHTML = `
      * { cursor: none !important; }
    `;
        document.head.appendChild(style);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
            document.body.style.cursor = 'auto';
            document.head.removeChild(style);
        };
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Main tiny dot that follows cursor instantly */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 bg-[#FBBF24] rounded-full pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: mousePosition.x - 6,
                    y: mousePosition.y - 6,
                    scale: isHovering ? 0 : 1,
                }}
                transition={{
                    type: "tween",
                    ease: "backOut",
                    duration: 0.1,
                }}
            />

            {/* Outer ring that lags slightly behind with physics */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 border border-[#FBBF24]/50 rounded-full pointer-events-none z-[9998] flex items-center justify-center backdrop-blur-sm bg-white/5"
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? "rgba(251, 191, 36, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    borderColor: isHovering ? "rgba(251, 191, 36, 0.8)" : "rgba(251, 191, 36, 0.5)",
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.5,
                }}
            />
        </>
    );
}

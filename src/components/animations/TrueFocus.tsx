"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface TrueFocusProps {
    sentence?: string;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    glowColor?: string;
    animationDuration?: number;
    pauseBetweenAnimations?: number;
}

export default function TrueFocus({
    sentence = "True Focus",
    manualMode = false,
    blurAmount = 5,
    borderColor = "#FBBF24",
    glowColor = "rgba(251, 191, 36, 0.6)",
    animationDuration = 0.5,
    pauseBetweenAnimations = 1,
}: TrueFocusProps) {
    const words = sentence.split(" ");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

    // Focus properties
    const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

    // Animated properties
    const x = useSpring(0, { stiffness: 150, damping: 20 });
    const y = useSpring(0, { stiffness: 150, damping: 20 });
    const width = useSpring(0, { stiffness: 150, damping: 20 });
    const height = useSpring(0, { stiffness: 150, damping: 20 });

    useEffect(() => {
        if (!manualMode) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
            }, (animationDuration + pauseBetweenAnimations) * 1000);

            return () => clearInterval(interval);
        }
    }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

    useEffect(() => {
        if (currentIndex === null || currentIndex === -1) return;

        if (!wordRefs.current[currentIndex] || !containerRef.current) return;

        const parentRect = containerRef.current.getBoundingClientRect();
        const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

        setFocusRect({
            x: activeRect.left - parentRect.left,
            y: activeRect.top - parentRect.top,
            width: activeRect.width,
            height: activeRect.height,
        });
    }, [currentIndex, words.length]);

    useEffect(() => {
        x.set(focusRect.x);
        y.set(focusRect.y);
        width.set(focusRect.width);
        height.set(focusRect.height);
    }, [focusRect, x, y, width, height]);

    const handleMouseEnter = (index: number) => {
        if (manualMode) {
            setLastActiveIndex(currentIndex);
            setCurrentIndex(index);
        }
    };

    const handleMouseLeave = () => {
        if (manualMode) {
            setCurrentIndex(-1);
        }
    };

    return (
        <div
            className="relative flex gap-4 justify-center items-center flex-wrap"
            ref={containerRef}
        >
            {words.map((word, index) => {
                const isActive = index === currentIndex;
                return (
                    <span
                        key={index}
                        ref={(el) => {
                            wordRefs.current[index] = el;
                        }}
                        className="relative text-[inherit] font-black cursor-pointer transition-all duration-300"
                        style={{
                            filter:
                                manualMode && currentIndex === -1
                                    ? "blur(0px)" // Clear when not hovering in manual mode
                                    : isActive
                                        ? "blur(0px)"
                                        : `blur(${blurAmount}px)`,
                            opacity: manualMode && currentIndex === -1 ? 1 : isActive ? 1 : 0.6,
                        }}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {word}
                    </span>
                );
            })}

            <motion.div
                className="absolute top-0 left-0 pointer-events-none box-border"
                style={{
                    width,
                    height,
                    x,
                    y,
                    border: `2px solid ${borderColor}`,
                    borderRadius: "12px",
                    opacity: currentIndex === -1 ? 0 : 1,
                    boxShadow: `0 0 20px ${glowColor}`,
                }}
            >
                <span
                    className="absolute w-2 h-2 rounded-tl-[4px] -top-[3px] -left-[3px]"
                    style={{ borderTop: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }}
                ></span>
                <span
                    className="absolute w-2 h-2 rounded-tr-[4px] -top-[3px] -right-[3px]"
                    style={{ borderTop: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }}
                ></span>
                <span
                    className="absolute w-2 h-2 rounded-bl-[4px] -bottom-[3px] -left-[3px]"
                    style={{ borderBottom: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }}
                ></span>
                <span
                    className="absolute w-2 h-2 rounded-br-[4px] -bottom-[3px] -right-[3px]"
                    style={{ borderBottom: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }}
                ></span>
            </motion.div>
        </div>
    );
}

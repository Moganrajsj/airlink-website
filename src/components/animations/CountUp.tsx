"use client";

import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface CountUpProps {
    to: number;
    from?: number;
    direction?: 'up' | 'down';
    delay?: number;
    duration?: number;
    className?: string;
    startWhen?: boolean;
    separator?: string;
    onStart?: () => void;
    onEnd?: () => void;
    decimals?: number;
}

export default function CountUp({
    to,
    from = 0,
    direction = 'up',
    delay = 0,
    duration = 2,
    className = '',
    startWhen = true,
    separator = '',
    onStart,
    onEnd,
    decimals = 0
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === 'down' ? to : from);

    const damping = 20 + 40 * (1 / duration);
    const stiffness = 100 * (1 / duration);

    const springValue = useSpring(motionValue, {
        damping,
        stiffness,
    });

    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = String(direction === 'down' ? to : from);
        }
    }, [from, to, direction]);

    useEffect(() => {
        if (isInView && startWhen) {
            if (typeof onStart === 'function') {
                const timeoutId = setTimeout(onStart, delay * 1000);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [isInView, startWhen, onStart, delay]);

    useEffect(() => {
        if (isInView && startWhen) {
            let timeoutId: NodeJS.Timeout;

            timeoutId = setTimeout(() => {
                motionValue.set(direction === 'down' ? from : to);
            }, delay * 1000);

            let unsubscribe: () => void;
            if (typeof onEnd === 'function') {
                unsubscribe = springValue.on("change", (latest) => {
                    if (latest === (direction === 'down' ? from : to)) {
                        onEnd();
                    }
                });
            }

            return () => {
                clearTimeout(timeoutId);
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isInView, startWhen, motionValue, direction, from, to, delay, onEnd, springValue]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (ref.current) {
                const formatNumber = (num: number) => {
                    const factor = Math.pow(10, decimals);
                    const val = Math.round(num * factor) / factor;
                    let [intPart, decPart] = val.toString().split('.');
                    if (separator) {
                        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                    }
                    if (decimals > 0) {
                        decPart = decPart || '0'.repeat(decimals);
                        decPart = decPart.padEnd(decimals, '0');
                        return `${intPart}.${decPart}`;
                    }
                    return intPart;
                }
                ref.current.textContent = formatNumber(latest);
            }
        });
        return () => unsubscribe();
    }, [springValue, separator, decimals]);

    return <span ref={ref} className={className} />;
}

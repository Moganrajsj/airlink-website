"use client";

import { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'word' | 'character';
}

export default function BlurText({ text, delay = 0, className = '', animateBy = 'word' }: BlurTextProps) {
    const elements = animateBy === 'word' ? text.split(' ') : text.split('');
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <p ref={ref} className={className}>
            {elements.map((element, index) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const springs = useSpring({
                    filter: inView ? 'blur(0px)' : 'blur(10px)',
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translate3d(0,0px,0)' : 'translate3d(0,20px,0)',
                    delay: delay + index * 50,
                });

                return (
                    <animated.span
                        key={index}
                        style={springs}
                        className="inline-block relative"
                    >
                        {element}{animateBy === 'word' ? '\u00A0' : ''}
                    </animated.span>
                );
            })}
        </p>
    );
}

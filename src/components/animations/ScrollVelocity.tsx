"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap
} from "framer-motion";

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  className?: string;
}

export default function ScrollVelocity({
  texts,
  velocity = 5,
  className = "",
}: ScrollVelocityProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * velocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap flex flex-col ${className}`}>
      {texts.map((text, index) => (
        <div key={index} className="flex whitespace-nowrap mt-2">
          <motion.div
            className="flex whitespace-nowrap gap-10 text-6xl md:text-8xl lg:text-[10rem] font-black uppercase text-white/5 tracking-tighter"
            style={{ x, direction: index % 2 === 0 ? "ltr" : "rtl" }}
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="px-5">
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

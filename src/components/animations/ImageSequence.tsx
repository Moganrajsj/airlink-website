"use client";

import React, { useState, useEffect, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export default function ImageSequence() {
  const { scrollY } = useScroll();
  
  // Map scroll position (0 to 600px) to frames (1 to 40)
  const frameIndex = useTransform(scrollY, [0, 600], [1, 40], { clamp: true });
  
  const [currentFrame, setCurrentFrame] = useState(1);
  
  // Preload images for smooth animation
  useEffect(() => {
    for (let i = 1; i <= 40; i++) {
      const img = new Image();
      img.src = `/images/hero-sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
    }
  }, []);

  useEffect(() => {
    return frameIndex.onChange((v) => {
      setCurrentFrame(Math.round(v));
    });
  }, [frameIndex]);

  const formattedFrame = currentFrame.toString().padStart(3, '0');
  
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
       <img 
         src={`/images/hero-sequence/ezgif-frame-${formattedFrame}.jpg`} 
         alt="Hero Animation Frame"
         // Changed from object-cover to object-contain so the sequence isn't over-zoomed on large screens
         className="w-full h-full object-contain object-right lg:object-center" 
       />
    </div>
  );
}

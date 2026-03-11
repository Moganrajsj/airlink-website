"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface ParticlesProps {
    color?: string;
    count?: number;
    size?: number;
    interactive?: boolean;
}

export default function Particles({
    color = "#FBBF24",
    count = 2000,
    size = 0.05,
    interactive = true,
}: ParticlesProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // Particles creation
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spread particles across a wide 3D space
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size,
            color: new THREE.Color(color),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const particlesSystem = new THREE.Points(geometry, material);
        scene.add(particlesSystem);

        camera.position.z = 15;

        // Interaction handlers
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize mouse to -1 to 1 space
            const rect = currentMount.getBoundingClientRect();
            mouseRef.current = {
                x: ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1,
                y: -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1,
            };
        };

        if (interactive) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };

        window.addEventListener("resize", handleResize);

        // Animation Loop
        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.005;

            particlesSystem.rotation.y = time * 0.1;
            particlesSystem.rotation.x = time * 0.05;

            if (interactive) {
                const positions = geometry.attributes.position.array as Float32Array;

                // Target rotation based on mouse
                const targetX = mouseRef.current.y * 0.5;
                const targetY = mouseRef.current.x * 0.5;

                // Smoothly interpolate rotation
                particlesSystem.rotation.x += (targetX - particlesSystem.rotation.x) * 0.05;
                particlesSystem.rotation.y += (targetY - particlesSystem.rotation.y) * 0.05;
            }

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (interactive) {
                window.removeEventListener("mousemove", handleMouseMove);
            }
            currentMount.removeChild(renderer.domElement);
            cancelAnimationFrame(animationFrameId);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [color, count, size, interactive]);

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}

"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FiberGlobe = () => {
    const globeRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    // Generate random points on sphere for "nodes"
    const nodes = useMemo(() => {
        const points = [];
        for (let i = 0; i < 40; i++) {
            const phi = Math.acos(-1 + (2 * i) / 40);
            const theta = Math.sqrt(40 * Math.PI) * phi;
            const x = 2 * Math.cos(theta) * Math.sin(phi);
            const y = 2 * Math.sin(theta) * Math.sin(phi);
            const z = 2 * Math.cos(phi);
            points.push(new THREE.Vector3(x, y, z));
        }
        return points;
    }, []);

    useFrame((state) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.002;
            globeRef.current.rotation.z += 0.001;
        }

        // Mouse interaction
        const mouseX = (state.mouse.x * Math.PI) / 10;
        const mouseY = (state.mouse.y * Math.PI) / 10;
        if (meshRef.current) {
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.1);
        }
    });

    return (
        <group ref={globeRef}>
            {/* Core Sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <MeshDistortMaterial
                    color="#111"
                    speed={2}
                    distort={0.4}
                    radius={1}
                />
            </mesh>

            {/* Wireframe Glow */}
            <mesh>
                <sphereGeometry args={[2.05, 32, 32]} />
                <meshBasicMaterial
                    color="#F5FF00"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Connection Lines (Network Fiber) */}
            <group>
                {nodes.map((point, i) => (
                    <mesh key={i} position={point}>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshBasicMaterial color="#F5FF00" />
                    </mesh>
                ))}
            </group>

            {/* Dynamic Rings */}
            <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3, 0.005, 16, 100]} />
                    <meshBasicMaterial color="#F5FF00" transparent opacity={0.3} />
                </mesh>
            </Float>
            <Float speed={2} rotationIntensity={2} floatIntensity={1}>
                <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                    <torusGeometry args={[3.2, 0.005, 16, 100]} />
                    <meshBasicMaterial color="#F5FF00" transparent opacity={0.2} />
                </mesh>
            </Float>
        </group>
    );
};

export default FiberGlobe;

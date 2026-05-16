"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Build particle buffers outside of React render to keep the component pure.
function buildParticleBuffers(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#6CCFFF"),
    new THREE.Color("#A78BFA"),
    new THREE.Color("#F5E0AA"),
  ];
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    const c = palette[i % palette.length];
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { positions, colors };
}

// Pre-built at module load time — stable reference, no per-render randomness.
const PARTICLE_BUFFERS = buildParticleBuffers(800);

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = PARTICLE_BUFFERS;

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = Math.sin(t * 0.05) * 0.15;
    pointsRef.current.rotation.x = Math.cos(t * 0.04) * 0.08;
    // gentle parallax based on pointer
    pointsRef.current.position.x = state.pointer.x * 0.4;
    pointsRef.current.position.y = state.pointer.y * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function NeuralField() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.3} />
      <Particles />
    </Canvas>
  );
}

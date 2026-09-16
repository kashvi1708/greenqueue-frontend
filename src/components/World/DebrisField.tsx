import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { buildRockGeometry } from "./terrainGeometry";

interface DebrisRockProps {
  radius: number;
  orbitRadius: number;
  orbitHeight: number;
  orbitSpeed: number;
  phase: number;
  seed: number;
  reduceMotion: boolean;
}

function DebrisRock({ radius, orbitRadius, orbitHeight, orbitSpeed, phase, seed, reduceMotion }: DebrisRockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(
    () => buildRockGeometry(radius, 2, { grassAmount: 0, roughness: 0.55, seed }),
    [radius, seed]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = reduceMotion ? phase : state.clock.getElapsedTime() * orbitSpeed + phase;
    meshRef.current.position.set(
      Math.cos(t) * orbitRadius,
      orbitHeight + (reduceMotion ? 0 : Math.sin(t * 1.7) * 0.15),
      Math.sin(t) * orbitRadius
    );
    if (!reduceMotion) {
      meshRef.current.rotation.x += 0.0015;
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.9} metalness={0.03} />
    </mesh>
  );
}

export function DebrisField({ reduceMotion }: { reduceMotion: boolean }) {
  // Fixed, hand-tuned configuration rather than random-at-runtime, so the
  // composition is consistent and art-directed rather than accidental.
  const rocks: DebrisRockProps[] = [
    { radius: 0.32, orbitRadius: 4.2, orbitHeight: 0.6, orbitSpeed: 0.035, phase: 0, seed: 11, reduceMotion },
    { radius: 0.22, orbitRadius: 5.1, orbitHeight: -0.3, orbitSpeed: -0.025, phase: 2.1, seed: 22, reduceMotion },
    { radius: 0.15, orbitRadius: 3.4, orbitHeight: 1.4, orbitSpeed: 0.05, phase: 4.4, seed: 33, reduceMotion },
    { radius: 0.4, orbitRadius: 6.2, orbitHeight: -0.9, orbitSpeed: 0.018, phase: 1.3, seed: 44, reduceMotion },
  ];

  return (
    <group>
      {rocks.map((r, i) => (
        <DebrisRock key={i} {...r} />
      ))}
    </group>
  );
}

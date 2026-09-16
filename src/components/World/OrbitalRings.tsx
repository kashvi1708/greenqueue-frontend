import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface OrbitalRingsProps {
  active: boolean; // true while a job is running — rings speed up, this is real state
  reduceMotion: boolean;
}

const RING_CONFIGS = [
  { radius: 2.1, tube: 0.008, tilt: [1.3, 0.4, 0], speed: 0.08, opacity: 0.35 },
  { radius: 2.7, tube: 0.006, tilt: [0.6, 1.1, 0.3], speed: -0.05, opacity: 0.22 },
  { radius: 3.4, tube: 0.005, tilt: [1.9, -0.3, 0.6], speed: 0.035, opacity: 0.15 },
];

export function OrbitalRings({ active, reduceMotion }: OrbitalRingsProps) {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    if (reduceMotion) return;
    const speedMultiplier = active ? 2.4 : 1;
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.z += RING_CONFIGS[i].speed * speedMultiplier * delta;
    });
  });

  return (
    <group>
      {RING_CONFIGS.map((cfg, i) => (
        <mesh
          key={i}
          ref={(el) => (ringRefs.current[i] = el)}
          rotation={cfg.tilt as [number, number, number]}
        >
          <torusGeometry args={[cfg.radius, cfg.tube, 8, 128]} />
          <meshBasicMaterial color="#2ED8A0" transparent opacity={cfg.opacity} />
        </mesh>
      ))}
    </group>
  );
}

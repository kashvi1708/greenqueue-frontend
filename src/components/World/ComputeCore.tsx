import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface ComputeCoreProps {
  active: boolean; // true while a job is actively "running" through the core
  reduceMotion: boolean;
}

/**
 * The central AI compute core. Layered rather than a single decorative
 * shape: an inner emissive solid, a mid wireframe shell (computational
 * structure), and an outer translucent shell (containment/atmosphere).
 * Pulses faster/brighter when a job is actively executing — this is the
 * one visual cue in the whole scene that directly reflects "something is
 * running right now", read from real job state, not a random animation.
 */
export function ComputeCore({ active, reduceMotion }: ComputeCoreProps) {
  const innerRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulseSpeed = active ? 2.2 : 0.6;
    const pulse = 0.55 + Math.sin(t * pulseSpeed) * (active ? 0.35 : 0.12);

    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = pulse;
    }
    if (!reduceMotion) {
      if (shellRef.current) shellRef.current.rotation.y += 0.0015 * (active ? 2.5 : 1);
      if (outerRef.current) outerRef.current.rotation.y -= 0.0008;
    }
  });

  return (
    <group>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#0F2E29"
          emissive={active ? "#2ED8A0" : "#1B4A41"}
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#2ED8A0" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={outerRef}>
        <sphereGeometry args={[1.55, 24, 24]} />
        <meshBasicMaterial color="#0F2E29" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

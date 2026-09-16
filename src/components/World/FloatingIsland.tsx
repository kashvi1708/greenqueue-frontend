import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { buildRockGeometry } from "./terrainGeometry";

interface FloatingIslandProps {
  radius?: number;
  reduceMotion: boolean;
}

export function FloatingIsland({ radius = 2.2, reduceMotion }: FloatingIslandProps) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(
    () => buildRockGeometry(radius, 5, { grassAmount: 1, roughness: 0.42, seed: 3.1 }),
    [radius]
  );

  useFrame((state) => {
    if (reduceMotion || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Very slow, real physical bob — not a CSS keyframe, an actual
    // position change on a lit 3D object.
    groupRef.current.position.y = Math.sin(t * 0.18) * 0.12;
    groupRef.current.rotation.y = t * 0.015; // one rotation ~7 minutes — barely perceptible, keeps it alive
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.95} metalness={0.02} />
      </mesh>
    </group>
  );
}

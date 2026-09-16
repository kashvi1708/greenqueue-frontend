import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ParticlesProps {
  count: number;
  reduceMotion: boolean;
  spread?: [number, number, number]; // x, y, z half-extents
  zOffset?: number;
  color?: string;
  size?: number;
  opacity?: number;
  speedRange?: [number, number];
}

export function Particles({
  count,
  reduceMotion,
  spread = [18, 10, 24],
  zOffset = -4,
  color = "#2ED8A0",
  size = 0.028,
  opacity = 0.5,
  speedRange = [0.15, 0.5],
}: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread[0] * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1] * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2] * 2 + zOffset;
      spd[i] = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
    }
    return [pos, spd];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame((_, delta) => {
    if (reduceMotion || !pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const halfY = spread[1];
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i) + speeds[i] * delta;
      posAttr.setY(i, y > halfY ? -halfY : y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={opacity} sizeAttenuation depthWrite={false} />
    </points>
  );
}

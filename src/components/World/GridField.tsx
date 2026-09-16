import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface GridFieldProps {
  carbonIntensity: number; // real value from GridState — drives color, not decoration
  threshold: number;
  reduceMotion: boolean;
}

/**
 * The living energy/grid field beneath the world. Color temperature shifts
 * from amber (dirty) toward green (clean) based on the REAL carbon
 * intensity relative to threshold — this is the "grid visualization
 * integrated into the environment" the brief asks for, not a chart bolted
 * on top. Section 05/06 of the story plays out here as carbonIntensity
 * changes across the snapshot.
 */
export function GridField({ carbonIntensity, threshold, reduceMotion }: GridFieldProps) {
  const gridRef = useRef<THREE.GridHelper>(null);
  const materialColor = useMemo(() => {
    const dirty = new THREE.Color("#B8863A"); // restrained amber, never neon
    const clean = new THREE.Color("#2ED8A0");
    // 0 = at/below threshold (clean), 1 = far above (dirty)
    const t = Math.min(1, Math.max(0, (carbonIntensity - threshold) / 250));
    return clean.clone().lerp(dirty, t);
  }, [carbonIntensity, threshold]);

  useFrame((state) => {
    if (!reduceMotion && gridRef.current) {
      const t = state.clock.getElapsedTime();
      gridRef.current.position.y = -1.4 + Math.sin(t * 0.3) * 0.03;
    }
  });

  return (
    <group>
      <gridHelper
        ref={gridRef}
        args={[24, 24, materialColor, materialColor]}
        position={[0, -1.4, -2]}
      />
      <mesh position={[0, -1.41, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color={materialColor} transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

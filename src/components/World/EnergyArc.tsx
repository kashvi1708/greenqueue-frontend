import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface EnergyArcProps {
  from: [number, number, number];
  to: [number, number, number];
  packetCount: number;
  active: boolean; // faster/brighter packets when the pathway is actually in use
  reduceMotion: boolean;
}

export function EnergyArc({ from, to, packetCount, active, reduceMotion }: EnergyArcProps) {
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const offsets = useRef<number[]>(Array.from({ length: packetCount }, (_, i) => i / packetCount));

  const curve = useMemo(() => {
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 + 0.8,
      (from[2] + to[2]) / 2,
    ];
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to),
    ]);
  }, [from, to]);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 40, 0.006, 6, false), [curve]);

  useFrame((_, delta) => {
    if (!packetsRef.current || reduceMotion) return;
    const speed = active ? 0.35 : 0.08;
    const dummy = new THREE.Object3D();
    offsets.current = offsets.current.map((t) => (t + speed * delta) % 1);
    offsets.current.forEach((t, i) => {
      const point = curve.getPoint(t);
      dummy.position.copy(point);
      const scale = active ? 1 : 0.5;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      packetsRef.current!.setMatrixAt(i, dummy.matrix);
    });
    packetsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color="#2ED8A0" transparent opacity={active ? 0.4 : 0.15} />
      </mesh>
      <instancedMesh ref={packetsRef} args={[undefined, undefined, packetCount]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={active ? "#2ED8A0" : "#1B4A41"} />
      </instancedMesh>
    </group>
  );
}

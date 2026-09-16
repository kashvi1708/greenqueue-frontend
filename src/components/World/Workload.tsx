import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { Job } from "../../types/greenqueue";
import { useSceneInteraction } from "../../hooks/useSceneInteraction";

interface WorkloadProps {
  job: Job;
  reduceMotion: boolean;
}

const HOLDING_ZONE: [number, number, number] = [-3.2, 1.4, 1.5];
const CLEAN_GATE: [number, number, number] = [-1.6, 0.6, -0.5];
const CORE_POS: [number, number, number] = [0, 0, -3];
const IMPACT_LAYER: [number, number, number] = [2.5 + Math.random() * 0, 3.5, -8];

/**
 * Target position is a pure function of job.status + job.slot — this is
 * what makes "the same state drives 3D, HUD, queue, scheduler" true
 * structurally rather than by convention. No component anywhere invents
 * a workload position independently.
 */
function targetPositionFor(job: Job): [number, number, number] {
  const spread = job.slot * 0.9;
  switch (job.status) {
    case "waiting":
      return [HOLDING_ZONE[0] + spread * 0.3, HOLDING_ZONE[1] - spread * 0.15, HOLDING_ZONE[2]];
    case "scheduled":
      return [CLEAN_GATE[0] + spread * 0.2, CLEAN_GATE[1], CLEAN_GATE[2]];
    case "running":
      return job.urgency === "urgent" ? [0.6, 0.2, -1.2] : CORE_POS;
    case "completed":
      return [IMPACT_LAYER[0] + spread * 0.6, IMPACT_LAYER[1], IMPACT_LAYER[2]];
    default:
      return HOLDING_ZONE;
  }
}

export function Workload({ job, reduceMotion }: WorkloadProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { hoveredJobId, setHoveredJobId, focusedJobId, setFocusedJobId } = useSceneInteraction();
  const isHighlighted = hoveredJobId === job.id || focusedJobId === job.id;

  const color = job.urgency === "urgent" ? "#C98A3E" : "#2ED8A0";

  useFrame((state) => {
    if (!meshRef.current) return;
    const target = targetPositionFor(job);
    meshRef.current.position.lerp(new THREE.Vector3(...target), reduceMotion ? 0.15 : 0.045);

    if (!reduceMotion) {
      const t = state.clock.getElapsedTime();
      const bob = job.status === "waiting" ? Math.sin(t * 1.2 + job.slot) * 0.06 : 0;
      meshRef.current.position.y += bob * 0.02;
      meshRef.current.rotation.y += job.status === "running" ? 0.03 : 0.006;
    }

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const baseIntensity = job.status === "running" ? 0.9 : job.status === "completed" ? 0.2 : 0.5;
    mat.emissiveIntensity = isHighlighted ? baseIntensity + 0.5 : baseIntensity;
    const scale = isHighlighted ? 1.35 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredJobId(job.id);
      }}
      onPointerOut={() => setHoveredJobId(null)}
      onClick={() => setFocusedJobId(focusedJobId === job.id ? null : job.id)}
    >
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color="#0F2E29" emissive={color} emissiveIntensity={0.5} roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

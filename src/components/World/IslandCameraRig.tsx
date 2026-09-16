import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface IslandCameraRigProps {
  progress: number; // 0..1 scroll progress, for a subtle dolly in
  reduceMotion: boolean;
}

const ORBIT_RADIUS = 7.5;
const ORBIT_HEIGHT = 1.2;
const ORBIT_PERIOD_SECONDS = 95; // one full slow rotation ~95s — matches the reference's lazy drift

export function IslandCameraRig({ progress, reduceMotion }: IslandCameraRigProps) {
  const { camera, pointer } = useThree();
  const angleRef = useRef(0.4); // start partway round, not head-on
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (!reduceMotion) {
      angleRef.current += (Math.PI * 2 * delta) / ORBIT_PERIOD_SECONDS;
    }

    // Scroll dollies the camera slightly closer + lower, so scrolling
    // still does something even though the idle orbit is the main show.
    const dollyRadius = ORBIT_RADIUS - progress * 2.2;
    const dollyHeight = ORBIT_HEIGHT - progress * 0.6;

    const targetX = Math.cos(angleRef.current) * dollyRadius;
    const targetZ = Math.sin(angleRef.current) * dollyRadius;

    const parallax = reduceMotion ? 0 : 0.3;
    const targetPos = new THREE.Vector3(
      targetX + pointer.x * parallax,
      dollyHeight - pointer.y * parallax * 0.4,
      targetZ
    );

    // Frame-rate-independent exponential damping, not naive lerp.
    const posFactor = 1 - Math.exp(-4.0 * delta);
    camera.position.lerp(targetPos, posFactor);

    const lookFactor = 1 - Math.exp(-3.5 * delta);
    currentLook.current.lerp(new THREE.Vector3(0, 0, 0), lookFactor);

    const tempObject = new THREE.Object3D();
    tempObject.position.copy(camera.position);
    tempObject.lookAt(currentLook.current);
    camera.quaternion.slerp(tempObject.quaternion, lookFactor);
  });

  return null;
}

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { cameraTargetFor } from "../../data/timeline";

interface CameraRigProps {
  progress: number;
  reduceMotion: boolean;
}

/**
 * Drives the persistent camera through the CAMERA_KEYFRAMES journey.
 * Position/lookAt are double-smoothed (scroll progress is already lerped
 * in useScrollProgress; this rig lerps again toward the keyframe target)
 * so motion reads as physical inertia, never a snap — this is what
 * "no teleporting, no abrupt transitions" means in practice.
 */
export function CameraRig({ progress, reduceMotion }: CameraRigProps) {
  const { camera, pointer } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0.6, 9));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const target = cameraTargetFor(progress);
    const targetPos = new THREE.Vector3(...target.pos);
    const targetLook = new THREE.Vector3(...target.look);

    currentPos.current.lerp(targetPos, 0.06);
    currentLook.current.lerp(targetLook, 0.06);

    const parallax = reduceMotion ? 0 : 0.25;
    camera.position.set(
      currentPos.current.x + pointer.x * parallax,
      currentPos.current.y - pointer.y * parallax * 0.6,
      currentPos.current.z
    );
    camera.lookAt(currentLook.current);
  });

  return null;
}

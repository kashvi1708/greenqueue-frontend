import { Cloud, Environment, Sky } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

interface SkyEnvironmentProps {
  /** 0 = clean/bright grid, 1 = dirty/hazy grid — drives real light + fog, not a color overlay */
  haze: number;
}

export function SkyEnvironment({ haze }: SkyEnvironmentProps) {
  const sunPosition = useMemo<[number, number, number]>(() => [10, 6 - haze * 2.5, 8], [haze]);

  // Real fog density change, not a CSS filter — genuinely reduces
  // background contrast/visibility the way real haze does.
  const fogColor = useMemo(() => new THREE.Color().lerpColors(
    new THREE.Color("#BFE3EA"), // clean, crisp
    new THREE.Color("#C9B79A"), // hazy, warm dirty-grid tone
    haze
  ), [haze]);

  return (
    <>
      <fog attach="fog" args={[fogColor, 14, 55]} />
      <Sky
        sunPosition={sunPosition}
        turbidity={2 + haze * 8}
        rayleigh={1.2 - haze * 0.5}
        mieCoefficient={0.003 + haze * 0.02}
        mieDirectionalG={0.8}
      />
      <Environment preset="park" environmentIntensity={0.55} />

      <directionalLight
        position={sunPosition}
        intensity={1.6 - haze * 0.5}
        color={haze > 0.5 ? "#F3D9A8" : "#FFFFFF"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <hemisphereLight args={["#BFE3EA", "#4A4030", 0.5]} />

      <Cloud position={[-6, 2, -8]} speed={0.08} opacity={0.35} segments={20} bounds={[6, 1.5, 2]} />
      <Cloud position={[7, 3.5, -12]} speed={0.06} opacity={0.28} segments={16} bounds={[5, 1, 2]} />
      <Cloud position={[2, -2, -14]} speed={0.05} opacity={0.2} segments={14} bounds={[7, 1.2, 2]} />
    </>
  );
}

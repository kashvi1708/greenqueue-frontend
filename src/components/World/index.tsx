import { Canvas } from "@react-three/fiber";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useState } from "react";
import type { GreenQueueSnapshot } from "../../types/greenqueue";
import { Scene } from "./Scene";
import { WorldFallback } from "./WorldFallback";

interface WorldProps {
  snapshot: GreenQueueSnapshot;
  progress: number;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

/**
 * ONE canvas, mounted once, for the entire application. Every DOM section
 * overlays this same canvas rather than mounting its own — see App.tsx.
 *
 * `shadows` is enabled here (was off in the old dark/emissive scheduler
 * scene, which faked depth with fog+emissive instead) because real soft
 * shadows under the island/debris rocks are what sells the "photoreal"
 * read against a physically-lit sky — this is a real cost, not free, but
 * it's the single highest-leverage line for this specific visual goal.
 */
export function World({ snapshot, progress }: WorldProps) {
  const [webglOk, setWebglOk] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setWebglOk(supportsWebGL());
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!webglOk) {
    return <WorldFallback snapshot={snapshot} />;
  }

  return (
    <div className="gq-world-canvas">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 50, near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <Scene snapshot={snapshot} progress={progress} reduceMotion={reduceMotion} />
          {!reduceMotion && (
            <EffectComposer multisampling={0}>
              <Vignette eskil={false} offset={0.3} darkness={0.45} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

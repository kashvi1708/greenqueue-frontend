import type { GreenQueueSnapshot } from "../../types/greenqueue";
import { DebrisField } from "./DebrisField";
import { FloatingIsland } from "./FloatingIsland";
import { IslandCameraRig } from "./IslandCameraRig";
import { SkyEnvironment } from "./SkyEnvironment";

interface SceneProps {
  snapshot: GreenQueueSnapshot;
  progress: number;
  reduceMotion: boolean;
}

/**
 * The floating-island hero world. Carbon intensity (a REAL number from
 * the snapshot, same one the HUD/dashboard read) drives real lighting,
 * fog density, and sky turbidity via `haze` — never a flat color overlay.
 */
export function Scene({ snapshot, progress, reduceMotion }: SceneProps) {
  const { carbonIntensity, threshold } = snapshot.grid;
  const haze = Math.min(1, Math.max(0, (carbonIntensity - threshold + 80) / 300));

  return (
    <>
      <IslandCameraRig progress={progress} reduceMotion={reduceMotion} />
      <SkyEnvironment haze={haze} />
      <FloatingIsland reduceMotion={reduceMotion} />
      <DebrisField reduceMotion={reduceMotion} />
    </>
  );
}

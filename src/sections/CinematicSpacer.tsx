import { STORY_BEATS } from "../data/timeline";

/**
 * Each beat gets one full-viewport-height invisible spacer so scrolling
 * through them IS the camera journey (see useScrollProgress + CameraRig).
 * These render no visuals of their own — the persistent World/HUD layers
 * (fixed-position, see App.tsx) are what the user actually sees.
 */
export function CinematicSpacer() {
  return (
    <div className="gq-cinematic-spacer">
      {STORY_BEATS.map((beat) => (
        <div key={beat.id} className="gq-beat-marker" data-beat={beat.id} />
      ))}
    </div>
  );
}

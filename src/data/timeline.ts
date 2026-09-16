// GreenQueue — scroll timeline constants.
// Centralized per the brief: adjust pacing here, nowhere else.

export interface StoryBeat {
  id: string;
  start: number; // scroll progress 0..1
  end: number;
  label: string; // micro-label, e.g. "01 / WORKLOADS ARRIVE"
}

export const STORY_BEATS: StoryBeat[] = [
  { id: "arrive", start: 0.0, end: 0.12, label: "01 / WORKLOADS ARRIVE" },
  { id: "evaluate", start: 0.12, end: 0.25, label: "02 / GREENQUEUE EVALUATES" },
  { id: "urgent", start: 0.25, end: 0.38, label: "03 / URGENT WORK RUNS" },
  { id: "waiting", start: 0.38, end: 0.52, label: "04 / FLEXIBLE WORK WAITS" },
  { id: "grid", start: 0.52, end: 0.68, label: "05 / THE GRID CHANGES" },
  { id: "cleanwindow", start: 0.68, end: 0.82, label: "06 / CLEAN WINDOW OPENS" },
  { id: "execute", start: 0.82, end: 0.92, label: "07 / WORKLOAD EXECUTES" },
  { id: "impact", start: 0.92, end: 1.0, label: "08 / IMPACT" },
];

export function currentBeat(progress: number): StoryBeat {
  return STORY_BEATS.find((b) => progress >= b.start && progress < b.end) ?? STORY_BEATS[STORY_BEATS.length - 1];
}

export interface CameraKeyframe {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
}

// One camera journey, matched to the beats above. Position/look values are
// in the World's local scene units (see World/Scene.tsx for object layout).
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [0, 0.6, 9], look: [0, 0, 0] },
  { p: 0.12, pos: [1.5, 1.0, 6.5], look: [0.5, 0.2, 0] },
  { p: 0.25, pos: [3, 0.4, 3.5], look: [2.2, 0, -1] },
  { p: 0.38, pos: [-2.5, 0.8, 2.5], look: [-3.4, 0.2, -0.5] },
  { p: 0.52, pos: [0, 2.4, 4], look: [0, 0, -3] },
  { p: 0.68, pos: [-1.5, 1.2, -1], look: [-3, 0.4, -4] },
  { p: 0.82, pos: [0, 0.6, -2.5], look: [0, 0, -5] },
  { p: 0.92, pos: [0, 5, 11], look: [0, 0, -1] },
  { p: 1.0, pos: [0, 7, 15], look: [0, 0, -2] },
];

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function cameraTargetFor(p: number): { pos: [number, number, number]; look: [number, number, number] } {
  const kfs = CAMERA_KEYFRAMES;
  let i = 0;
  while (i < kfs.length - 2 && p > kfs[i + 1].p) i++;
  const a = kfs[i];
  const b = kfs[i + 1];
  const span = b.p - a.p || 1;
  const t = Math.min(1, Math.max(0, (p - a.p) / span));
  return {
    pos: [lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t)],
    look: [lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t)],
  };
}

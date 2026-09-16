import { HudPanel } from "./HudPanel";

export function HeroOverlay({ visible }: { visible: boolean }) {
  return (
    <HudPanel visible={visible} className="gq-hero-overlay">
      <div className="gq-micro-label">AI COMPUTE, SCHEDULED AROUND THE GRID</div>
      <h1 className="gq-hero-headline">GreenQueue</h1>
      <p className="gq-hero-sub">
        Workloads that can wait, run when the electricity grid is cleanest — automatically.
      </p>
      <div className="gq-hero-scroll-cue">Scroll to see it decide ↓</div>
    </HudPanel>
  );
}

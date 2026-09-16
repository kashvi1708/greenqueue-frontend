import type { GreenQueueSnapshot } from "../../types/greenqueue";
import { currentBeat } from "../../data/timeline";
import { CleanWindowHud } from "./CleanWindowHud";
import { GridHud } from "./GridHud";
import { HeroOverlay } from "./HeroOverlay";
import { JobHud } from "./JobHud";

interface HudLayerProps {
  snapshot: GreenQueueSnapshot;
  progress: number;
}

export function HudLayer({ snapshot, progress }: HudLayerProps) {
  const beat = currentBeat(progress);
  const urgentJob = snapshot.jobs.find((j) => j.urgency === "urgent");
  const waitingJob = snapshot.jobs.find((j) => j.status === "waiting" || j.status === "scheduled");

  return (
    <div className="gq-hud-layer">
      <HeroOverlay visible={beat.id === "arrive"} />
      {urgentJob && <JobHud job={urgentJob} visible={beat.id === "urgent"} position="right" />}
      {waitingJob && <JobHud job={waitingJob} visible={beat.id === "waiting"} position="left" />}
      <GridHud grid={snapshot.grid} visible={beat.id === "grid" || beat.id === "cleanwindow"} />
      <CleanWindowHud visible={beat.id === "cleanwindow"} executing={beat.id === "execute"} />
      {waitingJob && <JobHud job={waitingJob} visible={beat.id === "execute"} position="left" />}
    </div>
  );
}

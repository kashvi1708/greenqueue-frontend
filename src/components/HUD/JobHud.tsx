import type { Job } from "../../types/greenqueue";
import { HudPanel } from "./HudPanel";

interface JobHudProps {
  job: Job;
  visible: boolean;
  position: "left" | "right";
}

export function JobHud({ job, visible, position }: JobHudProps) {
  return (
    <HudPanel visible={visible} className={`gq-hud-job gq-hud-${position}`}>
      <div className="gq-micro-label">JOB</div>
      <div className="gq-hud-title">{job.id}</div>
      <div className="gq-hud-row">
        <span className="gq-micro-label">STATUS</span>
        <span className={`gq-hud-status gq-status-${job.status}`}>{job.status.toUpperCase()}</span>
      </div>
      <div className="gq-hud-row">
        <span className="gq-micro-label">DECISION</span>
        <span>{job.decision.runNow ? "RUN NOW" : "WAIT FOR CLEANER WINDOW"}</span>
      </div>
      <div className="gq-hud-reason">{job.decision.reason}</div>
      <div className="gq-hud-row">
        <span className="gq-micro-label">CARBON</span>
        <span>{job.carbonIntensity} gCO₂/kWh</span>
      </div>
      <div className="gq-hud-row">
        <span className="gq-micro-label">COST</span>
        <span>${job.estimatedCost.toFixed(2)}/hr</span>
      </div>
      {job.decision.recommendedWindow && (
        <div className="gq-hud-row">
          <span className="gq-micro-label">WINDOW</span>
          <span>{job.decision.recommendedWindow}</span>
        </div>
      )}
    </HudPanel>
  );
}

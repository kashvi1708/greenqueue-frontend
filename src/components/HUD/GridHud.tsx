import type { GridState } from "../../types/greenqueue";
import { HudPanel } from "./HudPanel";

interface GridHudProps {
  grid: GridState;
  visible: boolean;
}

export function GridHud({ grid, visible }: GridHudProps) {
  // Sample three real trend points (past, now, near-future) rather than
  // fabricating a generic down-arrow sequence.
  const past = grid.trend.find((p) => p.t === -20)?.carbonIntensity;
  const now = grid.carbonIntensity;
  const future = grid.trend.find((p) => p.t === 20)?.carbonIntensity;

  return (
    <HudPanel visible={visible} className="gq-hud-grid">
      <div className="gq-micro-label">GRID CONDITIONS</div>
      <div className="gq-hud-trend">
        {past !== undefined && <span>{past}</span>}
        {past !== undefined && <span className="gq-hud-arrow">→</span>}
        <span className="gq-hud-trend-now">{now}</span>
        {future !== undefined && <span className="gq-hud-arrow">→</span>}
        {future !== undefined && <span>{future}</span>}
        <span className="gq-hud-unit">gCO₂/kWh</span>
      </div>
      <div className="gq-hud-row">
        <span className="gq-micro-label">THRESHOLD</span>
        <span>{grid.threshold} gCO₂/kWh</span>
      </div>
      {grid.cleanWindowEta !== null && (
        <div className="gq-hud-row">
          <span className="gq-micro-label">CLEAN WINDOW</span>
          <span>{grid.cleanWindowEta} min</span>
        </div>
      )}
    </HudPanel>
  );
}

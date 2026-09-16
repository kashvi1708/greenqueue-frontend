import { Suspense, lazy } from "react";
import type { GridState } from "../../types/greenqueue";

const CarbonTrendChart = lazy(() =>
  import("../Charts/CarbonTrendChart").then((m) => ({ default: m.CarbonTrendChart }))
);

export function GridStatus({ grid }: { grid: GridState }) {
  const isClean = grid.carbonIntensity <= grid.threshold;

  return (
    <section className="gq-panel gq-grid-status">
      <div className="gq-panel-header">
        <span className="gq-micro-label">GRID / LIVE</span>
        <h3>Grid intelligence</h3>
      </div>
      <div className="gq-grid-status-body">
        <div className="gq-grid-status-metrics">
          <div>
            <span className="gq-micro-label">CURRENT CARBON INTENSITY</span>
            <div className={`gq-big-number ${isClean ? "gq-clean" : "gq-dirty"}`}>
              {grid.carbonIntensity}
              <span className="gq-unit">gCO₂/kWh</span>
            </div>
          </div>
          <div className="gq-grid-status-row">
            <div>
              <span className="gq-micro-label">THRESHOLD</span>
              <div>{grid.threshold} gCO₂/kWh</div>
            </div>
            <div>
              <span className="gq-micro-label">CLEAN WINDOW</span>
              <div>{grid.cleanWindowEta !== null ? `${grid.cleanWindowEta} min` : "Now"}</div>
            </div>
            <div>
              <span className="gq-micro-label">ESTIMATED COST</span>
              <div>${grid.estimatedCost.toFixed(2)}/kWh</div>
            </div>
          </div>
        </div>
        <div className="gq-grid-status-chart">
          <span className="gq-micro-label">GRID TREND</span>
          <Suspense fallback={<div className="gq-chart-loading" />}>
            <CarbonTrendChart trend={grid.trend} threshold={grid.threshold} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

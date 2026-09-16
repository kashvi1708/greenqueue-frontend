import type { GreenQueueSnapshot } from "../../types/greenqueue";

export function WorldFallback({ snapshot }: { snapshot: GreenQueueSnapshot }) {
  return (
    <div className="gq-world-fallback">
      <div className="gq-world-fallback-inner">
        <div className="gq-micro-label">SYSTEM / 2D MODE</div>
        <h2>GreenQueue</h2>
        <p>Your browser doesn't support WebGL, so the 3D environment is unavailable — the underlying data is still live.</p>
        <div className="gq-fallback-grid">
          <div>
            <span className="gq-micro-label">GRID</span>
            <div className="gq-fallback-value">{snapshot.grid.carbonIntensity} gCO₂/kWh</div>
          </div>
          <div>
            <span className="gq-micro-label">ACTIVE JOBS</span>
            <div className="gq-fallback-value">{snapshot.jobs.filter((j) => j.status !== "completed").length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import type { ImpactMetrics } from "../../types/greenqueue";

function useCountUp(target: number, active: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    function step(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      setValue(target * (1 - Math.pow(1 - t, 3))); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);

  return value;
}

function Metric({ label, value, suffix, active, decimals = 0 }: { label: string; value: number; suffix: string; active: boolean; decimals?: number }) {
  const animated = useCountUp(value, active);
  return (
    <div className="gq-impact-metric">
      <span className="gq-micro-label">{label}</span>
      <div className="gq-big-number gq-clean">
        {animated.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        <span className="gq-unit">{suffix}</span>
      </div>
    </div>
  );
}

export function Impact({ impact, active }: { impact: ImpactMetrics; active: boolean }) {
  return (
    <section className="gq-panel gq-impact">
      <div className="gq-panel-header">
        <span className="gq-micro-label">IMPACT</span>
        <h3>The result of the scheduling decision</h3>
      </div>
      <div className="gq-impact-grid">
        <Metric label="CO₂ AVOIDED" value={impact.carbonAvoidedTons} suffix="tCO₂e" active={active} decimals={1} />
        <Metric label="COST SAVED" value={impact.costSavedUsd} suffix="$" active={active} />
        <Metric label="JOBS OPTIMIZED" value={impact.jobsOptimized} suffix="" active={active} />
        <Metric label="FLEXIBLE COMPUTE" value={impact.flexibleComputeHours} suffix="hrs" active={active} />
      </div>
      <p className="gq-impact-note">Demo values shown — swap in real backend totals via src/api/greenqueue.ts.</p>
    </section>
  );
}

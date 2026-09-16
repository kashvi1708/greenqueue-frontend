import { useEffect, useState } from "react";

const STEPS = [
  "INITIALIZING GRID INTELLIGENCE",
  "CONNECTING TO COMPUTE FABRIC",
  "LOADING WORKLOADS",
  "SYSTEM ONLINE",
];

export function Loading({ onDone }: { onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepDuration = reduceMotion ? 120 : 380;

    const interval = setInterval(() => {
      setStepIndex((i) => {
        if (i >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(onDone, stepDuration);
          return i;
        }
        return i + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="gq-loading">
      <div className="gq-loading-brand">GREENQUEUE</div>
      <div className="gq-loading-step">{STEPS[stepIndex]}</div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

/**
 * Returns global scroll progress as a smoothed 0..1 value, read from the
 * document's scroll position against a tall spacer establish by the page
 * layout (see App.tsx — the whole story lives inside one tall scroll
 * container so this progress value is literally "how far through
 * GreenQueue's world the user has traveled").
 *
 * Smoothing (lerp toward the raw scroll target every animation frame) is
 * what makes camera motion feel physical rather than jumpy — matches the
 * "no teleporting" requirement without needing GSAP for this specific value.
 */
export function useScrollProgress(cinematicHeightVh: number, smoothing = 0.08) {
  const [progress, setProgress] = useState(0);
  const target = useRef(0);
  const current = useRef(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function computeTarget() {
      const scrollTop = window.scrollY;
      const rangePx = cinematicHeightVh * window.innerHeight;
      target.current = Math.min(1, Math.max(0, scrollTop / rangePx));
    }

    computeTarget();
    window.addEventListener("scroll", computeTarget, { passive: true });
    window.addEventListener("resize", computeTarget);

    let raf = 0;
    function tick() {
      const factor = reduceMotion.current ? 1 : smoothing; // no easing lag if reduced motion
      current.current += (target.current - current.current) * factor;
      if (Math.abs(current.current - target.current) < 0.0005) current.current = target.current;
      setProgress(current.current);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", computeTarget);
      window.removeEventListener("resize", computeTarget);
      cancelAnimationFrame(raf);
    };
  }, [cinematicHeightVh, smoothing]);

  return progress;
}

import { useEffect, useState } from "react";
import { fetchSnapshot } from "../api/greenqueue";
import type { GreenQueueSnapshot } from "../types/greenqueue";

/**
 * The single hook every component uses to read GreenQueue state.
 * World, HUD, JobQueue, Scheduler, GridStatus, and Impact all call this
 * hook (or receive the snapshot as a prop from a parent that did) — never
 * a separate hardcoded number per component. This is what Section 20
 * ("synchronized data") actually requires structurally, not just in spirit.
 */
export function useGreenQueue() {
  const [snapshot, setSnapshot] = useState<GreenQueueSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const data = await fetchSnapshot();
    setSnapshot(data);
  }

  useEffect(() => {
    let cancelled = false;
    fetchSnapshot().then((data) => {
      if (!cancelled) {
        setSnapshot(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { snapshot, loading, refresh };
}

// GreenQueue — API abstraction.
// Every component/hook gets state through fetchSnapshot() ONLY. This is
// the single place that knows whether data came from a real backend or
// mock data. If VITE_API_BASE_URL is unset, or the backend is unreachable,
// this silently falls back to demo mode — no ugly error screens mid-demo.

import type { GreenQueueSnapshot } from "../types/greenqueue";
import { getMockSnapshot } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const FETCH_TIMEOUT_MS = 3000;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`GreenQueue API responded ${res.status}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch the full GreenQueue snapshot (jobs, grid, impact) as one call, so
 * every consumer (World, HUD, JobQueue, Scheduler, Impact) reads the exact
 * same state and can never drift into showing disconnected numbers.
 */
export async function fetchSnapshot(): Promise<GreenQueueSnapshot> {
  if (!API_BASE_URL) {
    return getMockSnapshot();
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/snapshot`, FETCH_TIMEOUT_MS);
    const data = (await res.json()) as GreenQueueSnapshot;
    return { ...data, demoMode: false };
  } catch (err) {
    console.warn("GreenQueue: backend unreachable, falling back to demo mode.", err);
    return { ...getMockSnapshot(), demoMode: true };
  }
}


/** Submit a workload to the live GreenQueue scheduler. */
export async function createJob(payload: {
  name: string;
  type: "embed" | "train" | "infer" | "batch";
  urgency: "urgent" | "flexible";
  durationMin: number;
}) {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured. Set VITE_API_BASE_URL in Vercel.");
  }

  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = `GreenQueue API responded ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
    } catch {
      // Keep the HTTP status message when the response is not JSON.
    }
    throw new Error(detail);
  }

  return res.json();
}

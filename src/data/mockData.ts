// GreenQueue — mock data.
// This is the ONLY file that fabricates GreenQueue domain data. Everything
// else (World, HUD, JobQueue, Scheduler, Impact) reads through
// src/api/greenqueue.ts and src/hooks/useGreenQueue.ts — never imports
// this file directly, so swapping in a real backend later means editing
// api/greenqueue.ts only.

import type { GreenQueueSnapshot, GridTrendPoint, Job } from "../types/greenqueue";

const THRESHOLD = 350;

function buildTrend(): GridTrendPoint[] {
  const points: GridTrendPoint[] = [];
  // Past 60 min: dirty and roughly flat/rising. Forecast 60 min: falls
  // below threshold around +25min — this is the "clean window" the
  // waiting job is actually looking for; every HUD number below is
  // derived from this same array, nothing is a separately-typed constant.
  for (let t = -60; t <= 60; t += 10) {
    let value: number;
    if (t <= 0) {
      value = 420 + Math.sin(t / 40) * 30 + (t === 0 ? 0 : Math.random() * 10 - 5);
    } else {
      const fallProgress = Math.min(1, t / 30);
      value = 420 - fallProgress * 180 + Math.sin(t / 15) * 12;
    }
    points.push({ t, carbonIntensity: Math.round(Math.max(120, value)) });
  }
  return points;
}

const trend = buildTrend();
const currentCarbon = trend.find((p) => p.t === 0)!.carbonIntensity;
const cleanPoint = trend.find((p) => p.t > 0 && p.carbonIntensity <= THRESHOLD);

const jobs: Job[] = [
  {
    id: "INFER-204",
    type: "infer",
    urgency: "urgent",
    status: "running",
    carbonIntensity: currentCarbon,
    estimatedCost: 1.12,
    decision: {
      runNow: true,
      reason: "Latency-sensitive — dispatched immediately.",
      expectedCarbon: currentCarbon,
      expectedCost: 1.12,
    },
    submittedAt: Date.now() - 2 * 60_000,
    slot: 0,
  },
  {
    id: "EMBED-042",
    type: "embed",
    urgency: "flexible",
    status: "waiting",
    carbonIntensity: currentCarbon,
    estimatedCost: 0.84,
    decision: {
      runNow: false,
      reason: "Grid carbon intensity is above the dispatch threshold.",
      expectedCarbon: cleanPoint?.carbonIntensity ?? THRESHOLD,
      expectedCost: 0.61,
      recommendedWindow: cleanPoint
        ? new Date(Date.now() + cleanPoint.t * 60_000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : undefined,
    },
    submittedAt: Date.now() - 8 * 60_000,
    slot: 1,
  },
  {
    id: "TRAIN-091",
    type: "train",
    urgency: "flexible",
    status: "scheduled",
    carbonIntensity: currentCarbon,
    estimatedCost: 2.4,
    decision: {
      runNow: false,
      reason: "Clean window found — queued for dispatch.",
      expectedCarbon: cleanPoint?.carbonIntensity ?? THRESHOLD,
      expectedCost: 1.7,
      recommendedWindow: cleanPoint
        ? new Date(Date.now() + cleanPoint.t * 60_000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : undefined,
    },
    submittedAt: Date.now() - 14 * 60_000,
    slot: 2,
  },
  {
    id: "BATCH-118",
    type: "batch",
    urgency: "flexible",
    status: "completed",
    carbonIntensity: 240,
    estimatedCost: 0.38,
    decision: {
      runNow: false,
      reason: "Executed during an earlier clean window.",
      expectedCarbon: 240,
      expectedCost: 0.38,
    },
    submittedAt: Date.now() - 90 * 60_000,
    slot: 3,
  },
];

export function getMockSnapshot(): GreenQueueSnapshot {
  return {
    jobs,
    grid: {
      carbonIntensity: currentCarbon,
      threshold: THRESHOLD,
      cleanWindowEta: cleanPoint ? cleanPoint.t : null,
      estimatedCost: Math.round((currentCarbon / 420) * 0.18 * 100) / 100,
      trend,
    },
    impact: {
      carbonAvoidedTons: 42.6,
      costSavedUsd: 8420,
      jobsOptimized: 486,
      flexibleComputeHours: 1240,
    },
    demoMode: true,
  };
}

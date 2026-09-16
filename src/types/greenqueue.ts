// GreenQueue — core domain types.
// Every component reads state shaped like this, whether it came from
// mock data (src/data/mockData.ts) or a real backend (src/api/greenqueue.ts).
// Never redefine these shapes locally in a component.

export type Urgency = "urgent" | "flexible";

export type JobStatus = "waiting" | "scheduled" | "running" | "completed";

export type JobType = "embed" | "train" | "infer" | "batch";

export interface SchedulingDecision {
  runNow: boolean;
  reason: string;
  expectedCarbon: number; // gCO2/kWh at the decided execution time
  expectedCost: number; // $/hr estimate
  recommendedWindow?: string; // e.g. "14:30" — only set when waiting
}

export interface Job {
  id: string; // e.g. "EMBED-042"
  type: JobType;
  urgency: Urgency;
  status: JobStatus;
  carbonIntensity: number; // gCO2/kWh recorded at last evaluation
  estimatedCost: number; // $/hr
  decision: SchedulingDecision;
  submittedAt: number; // epoch ms
  // 3D world placement — the World layer reads this, never invents its own.
  slot: number; // stable index used to position this job's mesh in the scene
}

export interface GridTrendPoint {
  t: number; // minutes from now (negative = past, positive = forecast)
  carbonIntensity: number;
}

export interface GridState {
  carbonIntensity: number; // current, gCO2/kWh
  threshold: number; // dispatch threshold, gCO2/kWh
  cleanWindowEta: number | null; // minutes until next clean window, null if already clean
  estimatedCost: number; // $/kWh at current intensity
  trend: GridTrendPoint[];
}

export interface ImpactMetrics {
  carbonAvoidedTons: number; // tCO2e
  costSavedUsd: number;
  jobsOptimized: number;
  flexibleComputeHours: number;
}

export interface GreenQueueSnapshot {
  jobs: Job[];
  grid: GridState;
  impact: ImpactMetrics;
  demoMode: boolean;
}

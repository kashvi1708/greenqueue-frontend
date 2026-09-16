import { GridStatus } from "../components/GridStatus";
import { JobQueue } from "../components/JobQueue";
import { Scheduler } from "../components/Scheduler";
import { Impact } from "../components/Impact";
import type { GreenQueueSnapshot, Job } from "../types/greenqueue";

interface DashboardProps {
  snapshot: GreenQueueSnapshot;
  progress: number;
  urgentJob: Job;
  onRefresh: () => Promise<void>;
}

export default function Dashboard({ snapshot, progress, urgentJob, onRefresh }: DashboardProps) {
  return (
    <div className="gq-dashboard">
      <GridStatus grid={snapshot.grid} />
      <JobQueue jobs={snapshot.jobs} onCreated={onRefresh} />
      <Scheduler exampleJob={snapshot.jobs.find((j) => j.status === "waiting") ?? urgentJob} />
      <Impact impact={snapshot.impact} active={progress > 0.9} />
    </div>
  );
}

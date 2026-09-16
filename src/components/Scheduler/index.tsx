import type { Job } from "../../types/greenqueue";

const STAGES = ["INCOMING WORKLOAD", "URGENCY", "CARBON", "COST", "FORECAST", "DECISION"];

export function Scheduler({ exampleJob }: { exampleJob: Job }) {
  return (
    <section className="gq-panel gq-scheduler">
      <div className="gq-panel-header">
        <span className="gq-micro-label">SCHEDULER / OPTIMIZING</span>
        <h3>How a decision gets made</h3>
      </div>

      <div className="gq-scheduler-pipeline">
        {STAGES.map((stage, i) => (
          <div key={stage} className="gq-scheduler-stage">
            <div className="gq-scheduler-stage-label">{stage}</div>
            {i < STAGES.length - 1 && <div className="gq-scheduler-arrow">↓</div>}
          </div>
        ))}
      </div>

      <div className="gq-scheduler-result">
        <div className={`gq-scheduler-verdict ${exampleJob.decision.runNow ? "gq-verdict-run" : "gq-verdict-wait"}`}>
          {exampleJob.decision.runNow ? "RUN NOW" : "WAIT FOR CLEANER WINDOW"}
        </div>
        <div className="gq-scheduler-reason">
          {exampleJob.id} — {exampleJob.decision.reason}
        </div>
      </div>
    </section>
  );
}

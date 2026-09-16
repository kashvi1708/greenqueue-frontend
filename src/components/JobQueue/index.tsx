import { useState } from "react";
import type { Job, JobStatus, JobType, Urgency } from "../../types/greenqueue";
import { useSceneInteraction } from "../../hooks/useSceneInteraction";
import { createJob } from "../../api/greenqueue";

type Filter = "all" | Extract<JobStatus, "running" | "waiting" | "scheduled">;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "running", label: "RUNNING" },
  { id: "waiting", label: "WAITING" },
  { id: "scheduled", label: "SCHEDULED" },
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "batch", label: "Batch" },
  { value: "infer", label: "Inference" },
  { value: "embed", label: "Embedding" },
  { value: "train", label: "Training" },
];

export function JobQueue({ jobs, onCreated }: { jobs: Job[]; onCreated?: () => Promise<void> | void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<JobType>("batch");
  const [urgency, setUrgency] = useState<Urgency>("flexible");
  const [durationMin, setDurationMin] = useState(15);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { hoveredJobId, setHoveredJobId, focusedJobId, setFocusedJobId } = useSceneInteraction();

  const visibleJobs = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createJob({
        name: name.trim(),
        type,
        urgency,
        durationMin,
      });
      setName("");
      setType("batch");
      setUrgency("flexible");
      setDurationMin(15);
      setShowForm(false);
      await onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create workload.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="gq-panel gq-job-queue">
      <div className="gq-panel-header gq-queue-header-row">
        <div>
          <span className="gq-micro-label">QUEUE / ACTIVE</span>
          <h3>Job queue</h3>
        </div>
        <button className="gq-create-job-button" onClick={() => { setShowForm((open) => !open); setError(null); }}>
          {showForm ? "CLOSE" : "+ CREATE WORKLOAD"}
        </button>
      </div>

      {showForm && (
        <form className="gq-create-job-form" onSubmit={handleSubmit}>
          <div className="gq-create-job-title">SUBMIT WORKLOAD</div>
          <div className="gq-create-job-fields">
            <label>
              JOB NAME
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. nightly-embeddings" maxLength={80} />
            </label>
            <label>
              TYPE
              <select value={type} onChange={(e) => setType(e.target.value as JobType)}>
                {JOB_TYPES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label>
              URGENCY
              <select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)}>
                <option value="flexible">Flexible</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <label>
              DURATION (MIN)
              <input type="number" min={1} max={240} value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} />
            </label>
          </div>
          {error && <div className="gq-create-job-error">{error}</div>}
          <div className="gq-create-job-actions">
            <button type="button" className="gq-create-job-cancel" onClick={() => setShowForm(false)}>CANCEL</button>
            <button type="submit" className="gq-create-job-submit" disabled={submitting || durationMin < 1 || durationMin > 240}>
              {submitting ? "SUBMITTING…" : "SCHEDULE WORKLOAD"}
            </button>
          </div>
        </form>
      )}

      <div className="gq-queue-filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={filter === f.id ? "gq-filter-active" : ""}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <table className="gq-queue-table">
        <thead>
          <tr>
            <th>JOB</th>
            <th>TYPE</th>
            <th>URGENCY</th>
            <th>STATUS</th>
            <th>CARBON</th>
            <th>COST</th>
            <th>DECISION</th>
          </tr>
        </thead>
        <tbody>
          {visibleJobs.map((job) => (
            <tr
              key={job.id}
              className={hoveredJobId === job.id || focusedJobId === job.id ? "gq-row-highlight" : ""}
              onMouseEnter={() => setHoveredJobId(job.id)}
              onMouseLeave={() => setHoveredJobId(null)}
              onClick={() => setFocusedJobId(focusedJobId === job.id ? null : job.id)}
            >
              <td>{job.id}</td>
              <td>{job.type.toUpperCase()}</td>
              <td className={job.urgency === "urgent" ? "gq-text-amber" : "gq-text-green"}>
                {job.urgency.toUpperCase()}
              </td>
              <td>
                <span className={`gq-hud-status gq-status-${job.status}`}>{job.status.toUpperCase()}</span>
              </td>
              <td>{job.carbonIntensity} gCO₂/kWh</td>
              <td>${job.estimatedCost.toFixed(2)}/hr</td>
              <td>{job.decision.runNow ? "RUN NOW" : "WAIT"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

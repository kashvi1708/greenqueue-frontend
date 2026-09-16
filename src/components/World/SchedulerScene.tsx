import type { GreenQueueSnapshot } from "../../types/greenqueue";
import { CameraRig } from "./CameraRig";
import { ComputeCore } from "./ComputeCore";
import { EnergyArc } from "./EnergyArc";
import { GridField } from "./GridField";
import { OrbitalRings } from "./OrbitalRings";
import { Particles } from "./Particles";
import { Workload } from "./Workload";

interface SceneProps {
  snapshot: GreenQueueSnapshot;
  progress: number;
  reduceMotion: boolean;
}

export function SchedulerScene({ snapshot, progress, reduceMotion }: SceneProps) {
  const anyRunning = snapshot.jobs.some((j) => j.status === "running");
  const waitingCount = snapshot.jobs.filter((j) => j.status === "waiting" || j.status === "scheduled").length;

  return (
    <>
      <color attach="background" args={["#05100E"]} />
      <fog attach="fog" args={["#05100E", 6, 26]} />

      <ambientLight intensity={0.4} color="#1B4A41" />
      <pointLight position={[3, 4, 4]} intensity={1.2} color="#2ED8A0" />
      <pointLight position={[-4, -2, -4]} intensity={0.35} color="#C98A3E" />

      <CameraRig progress={progress} reduceMotion={reduceMotion} />

      <group position={[0, 0, -3]}>
        <ComputeCore active={anyRunning} reduceMotion={reduceMotion} />
        <OrbitalRings active={anyRunning} reduceMotion={reduceMotion} />
      </group>

      {waitingCount > 0 && (
        <EnergyArc
          from={[-3.2, 1.4, 1.5]}
          to={[0, 0, -3]}
          packetCount={reduceMotion ? 3 : 10}
          active={anyRunning}
          reduceMotion={reduceMotion}
        />
      )}

      <GridField carbonIntensity={snapshot.grid.carbonIntensity} threshold={snapshot.grid.threshold} reduceMotion={reduceMotion} />

      {snapshot.jobs.map((job) => (
        <Workload key={job.id} job={job} reduceMotion={reduceMotion} />
      ))}

      {/* Depth-layered particle fields: distant/slow, mid, and close/fast —
          real spatial depth rather than one flat cloud. */}
      <Particles
        count={reduceMotion ? 60 : 700}
        reduceMotion={reduceMotion}
        spread={[26, 14, 20]}
        zOffset={-30}
        color="#173F38"
        size={0.02}
        opacity={0.35}
        speedRange={[0.03, 0.1]}
      />
      <Particles
        count={reduceMotion ? 50 : 380}
        reduceMotion={reduceMotion}
        spread={[16, 9, 22]}
        zOffset={-10}
        color="#2ED8A0"
        size={0.03}
        opacity={0.5}
        speedRange={[0.15, 0.35]}
      />
      <Particles
        count={reduceMotion ? 30 : 180}
        reduceMotion={reduceMotion}
        spread={[8, 5, 8]}
        zOffset={2}
        color="#ECF3F0"
        size={0.022}
        opacity={0.6}
        speedRange={[0.3, 0.6]}
      />
    </>
  );
}

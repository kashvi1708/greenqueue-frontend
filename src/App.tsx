import { Suspense, lazy, useState } from "react";
import { World } from "./components/World";
import { HudLayer } from "./components/HUD";
import { Navigation } from "./components/Navigation";
import { Loading } from "./components/Loading";
import { CinematicSpacer } from "./sections/CinematicSpacer";
import { useGreenQueue } from "./hooks/useGreenQueue";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { SceneInteractionProvider } from "./hooks/useSceneInteraction";
import { STORY_BEATS } from "./data/timeline";

const Dashboard = lazy(() => import("./sections/Dashboard"));

const CINEMATIC_HEIGHT_VH = STORY_BEATS.length; // one full viewport-height per beat

function AppContent() {
  const { snapshot, loading: dataLoading, refresh } = useGreenQueue();
  const progress = useScrollProgress(CINEMATIC_HEIGHT_VH);
  const [introDone, setIntroDone] = useState(false);

  const showLoading = !introDone || dataLoading || !snapshot;

  if (showLoading) {
    return <Loading onDone={() => setIntroDone(true)} />;
  }

  const urgentJob = snapshot.jobs.find((j) => j.urgency === "urgent") ?? snapshot.jobs[0];

  return (
    <>
      <Navigation demoMode={snapshot.demoMode} />

      <div className="gq-world-fixed">
        <World snapshot={snapshot} progress={progress} />
        <HudLayer snapshot={snapshot} progress={progress} />
      </div>

      {/* Cinematic scroll region — establishes scroll length; the fixed
          World/HUD layers above render the actual visuals as this scrolls. */}
      <CinematicSpacer />

      {/* Operational dashboard — "the control panel of the world we just
          experienced." Scrolls in normal flow, over the same fixed canvas,
          reading the exact same snapshot as everything above. Lazy-loaded:
          it's entirely below the cinematic region, no reason to pay for
          recharts/table code before the user ever scrolls that far. */}
      <Suspense fallback={<div className="gq-dashboard-loading" />}>
        <Dashboard snapshot={snapshot} progress={progress} urgentJob={urgentJob} onRefresh={refresh} />
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <SceneInteractionProvider>
      <AppContent />
    </SceneInteractionProvider>
  );
}

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SceneInteractionValue {
  hoveredJobId: string | null;
  setHoveredJobId: (id: string | null) => void;
  focusedJobId: string | null;
  setFocusedJobId: (id: string | null) => void;
}

const SceneInteractionContext = createContext<SceneInteractionValue | null>(null);

export function SceneInteractionProvider({ children }: { children: ReactNode }) {
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [focusedJobId, setFocusedJobId] = useState<string | null>(null);

  const value = useMemo(
    () => ({ hoveredJobId, setHoveredJobId, focusedJobId, setFocusedJobId }),
    [hoveredJobId, focusedJobId]
  );

  return <SceneInteractionContext.Provider value={value}>{children}</SceneInteractionContext.Provider>;
}

export function useSceneInteraction() {
  const ctx = useContext(SceneInteractionContext);
  if (!ctx) throw new Error("useSceneInteraction must be used within SceneInteractionProvider");
  return ctx;
}

import type { ReactNode } from "react";

interface HudPanelProps {
  className?: string;
  children: ReactNode;
  visible: boolean;
}

export function HudPanel({ className = "", children, visible }: HudPanelProps) {
  return (
    <div className={`gq-hud-panel ${className} ${visible ? "gq-hud-visible" : ""}`}>
      {children}
    </div>
  );
}

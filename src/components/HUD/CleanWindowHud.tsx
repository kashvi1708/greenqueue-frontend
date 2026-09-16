import { HudPanel } from "./HudPanel";

interface CleanWindowHudProps {
  visible: boolean;
  executing: boolean;
}

export function CleanWindowHud({ visible, executing }: CleanWindowHudProps) {
  return (
    <HudPanel visible={visible} className="gq-hud-cleanwindow">
      <div className="gq-micro-label">{executing ? "EXECUTING" : "CLEAN WINDOW"}</div>
      <div className="gq-hud-title">{executing ? "DISPATCHING" : "DETECTED"}</div>
    </HudPanel>
  );
}

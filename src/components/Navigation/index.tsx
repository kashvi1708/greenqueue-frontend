interface NavigationProps {
  demoMode: boolean;
}

function scrollToFraction(fraction: number) {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  window.scrollTo({ top: maxScroll * fraction, behavior: "smooth" });
}

export function Navigation({ demoMode }: NavigationProps) {
  return (
    <nav className="gq-nav">
      <div className="gq-nav-brand">GREENQUEUE</div>
      <div className="gq-nav-links">
        <button onClick={() => scrollToFraction(0.55)}>GRID</button>
        <button onClick={() => scrollToFraction(0.4)}>QUEUE</button>
        <button onClick={() => scrollToFraction(0.15)}>SCHEDULER</button>
        <button onClick={() => scrollToFraction(0.95)}>IMPACT</button>
      </div>
      <div className="gq-nav-status">
        <span className="gq-status-dot" />
        {demoMode ? "DEMO MODE" : "SYSTEM ONLINE"}
      </div>
    </nav>
  );
}

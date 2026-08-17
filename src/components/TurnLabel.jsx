// Wraps a "whose turn" label with a large pulsing arrow pointing toward
// that side's panel — left panel is side 0, right panel is side 1.
function ArrowIcon({ pointLeft }) {
  return (
    <svg
      className="turn-arrow-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={pointLeft ? undefined : { transform: "scaleX(-1)" }}
      aria-hidden="true"
    >
      <path d="M16 3 L7 12 L16 21 L18.5 18.5 L12 12 L18.5 5.5 Z" />
    </svg>
  );
}

export default function TurnLabel({ side, children, className = "turn-info-turn" }) {
  const arrow = (
    <span className="turn-arrow">
      <ArrowIcon pointLeft={side === 0} />
    </span>
  );
  return (
    <div className={className}>
      {side === 0 && arrow}
      {children}
      {side === 1 && arrow}
    </div>
  );
}

// Wraps a "whose turn" label with an arrow pointing toward that side's
// panel — left panel is side 0, right panel is side 1.
export default function TurnLabel({ side, children, className = "turn-info-turn" }) {
  const arrow = <span className="turn-arrow">{side === 0 ? "◀" : "▶"}</span>;
  return (
    <div className={className}>
      {side === 0 && arrow}
      {children}
      {side === 1 && arrow}
    </div>
  );
}

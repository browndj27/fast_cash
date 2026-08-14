import BidSelector from "./BidSelector";
import { ROSTER_SIZE } from "../../hooks/useFastCashGame";
import "./PlayerPanel.css";

export default function PlayerPanel({
  label,
  budget,
  roster,
  bidValue,
  range,
  onBidChange,
  onBid,
  onConcede,
}) {
  const slots = Array.from({ length: ROSTER_SIZE }, (_, i) => roster[i] || null);

  return (
    <div className="player-panel">
      <div className="player-panel-label">{label}</div>
      <div className="player-panel-budget">${budget}</div>

      <div className="draft-boxes">
        {slots.map((name, i) => (
          <div key={i} className={`draft-box${name ? "" : " empty"}`}>
            {name || "-"}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="concede-button"
        disabled={!range.canConcede}
        onClick={onConcede}
      >
        You can have him
      </button>

      <div className="bid-row">
        <BidSelector
          value={bidValue}
          min={range.min}
          max={Math.max(range.min, range.max)}
          disabled={!range.canBid}
          onChange={onBidChange}
        />
        <button
          type="button"
          className="bid-button"
          disabled={!range.canBid}
          onClick={onBid}
        >
          Bid
        </button>
      </div>
    </div>
  );
}

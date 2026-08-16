import BidSelector from "../game/BidSelector";
import PlayerPhoto from "../../components/PlayerPhoto";
import { ROSTER_SLOTS } from "../../hooks/rosterSlots";
import { imageFor } from "../../data/playerImages";
import "../game/PlayerPanel.css";

export default function SkillsPlayerPanel({
  label,
  budget,
  roster,
  bidValue,
  range,
  onBidChange,
  onBid,
  onConcede,
}) {
  return (
    <div className="player-panel">
      <div className="player-panel-label">{label}</div>
      <div className="player-panel-budget">${budget}</div>

      <div className="draft-boxes">
        {ROSTER_SLOTS.map((slot) => {
          const entry = roster.find((e) => e.slot === slot);
          return (
            <div key={slot} className={`draft-box${entry ? "" : " empty"}`}>
              <span className="draft-box-slot">{slot}</span>
              <span className="draft-box-name">{entry ? entry.name : "-"}</span>
              {entry && (
                <PlayerPhoto
                  src={imageFor(entry.position, entry.name)}
                  alt={entry.name}
                  className="draft-box-photo"
                />
              )}
            </div>
          );
        })}
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

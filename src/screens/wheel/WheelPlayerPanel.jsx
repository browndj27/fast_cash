import PlayerPhoto from "../../components/PlayerPhoto";
import { ROSTER_SLOTS } from "../../hooks/rosterSlots";
import { imageFor } from "../../data/playerImages";
import "../game/PlayerPanel.css";

export default function WheelPlayerPanel({ label, roster }) {
  return (
    <div className="player-panel">
      <div className="player-panel-label">{label}</div>

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
    </div>
  );
}

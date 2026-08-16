import { useEffect, useState } from "react";
import MenuBox from "../../components/MenuBox";
import { loadRankings, pointsFor, rankFor } from "../../data/rankings";
import { ROSTER_SLOTS } from "../../hooks/rosterSlots";
import "../ResultsScreen.css";

export default function SkillsResultsScreen({ rosters, vsAI, onBackToHome }) {
  const [rankIndex, setRankIndex] = useState(null);
  const [rankError, setRankError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadRankings()
      .then((index) => !cancelled && setRankIndex(index))
      .catch(() => !cancelled && setRankError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const player2Label = vsAI ? "AI" : "Player 2";

  const bySlot = (roster, slot) => roster.find((entry) => entry.slot === slot) ?? null;

  const scored = rankIndex
    ? rosters.map((roster) =>
        ROSTER_SLOTS.map((slot) => {
          const entry = bySlot(roster, slot);
          if (!entry) return { slot, name: null, rank: null, points: 0 };
          return {
            slot,
            name: entry.name,
            rank: rankFor(rankIndex, entry.position, entry.name),
            points: pointsFor(rankIndex, entry.position, entry.name),
          };
        })
      )
    : null;
  const totals = scored?.map((players) => players.reduce((sum, p) => sum + p.points, 0));

  let winnerLabel = null;
  if (totals) {
    if (totals[0] > totals[1]) winnerLabel = "Player 1";
    else if (totals[1] > totals[0]) winnerLabel = player2Label;
    else winnerLabel = "Tie";
  }

  return (
    <div className="results-screen">
      <div className="results-columns">
        {[0, 1].map((side) => (
          <div className="results-column" key={side}>
            <div className="results-column-label">{side === 0 ? "Player 1" : player2Label}</div>
            {ROSTER_SLOTS.map((slot) => {
              const info = scored ? scored[side].find((p) => p.slot === slot) : null;
              const name = info ? info.name : bySlot(rosters[side], slot)?.name;
              return (
                <div key={slot} className="results-name">
                  <span className="results-slot">{slot}</span>
                  {name ?? "-"}
                  {info?.name && (
                    <span className="results-points">
                      #{info.rank} · {info.points} pts
                    </span>
                  )}
                </div>
              );
            })}
            {totals && <div className="results-total">Total: {totals[side]} pts</div>}
          </div>
        ))}
      </div>

      {!rankIndex && !rankError && <div className="rankings-status">Loading rankings...</div>}
      {rankError && <div className="rankings-status">Couldn't load rankings — scores unavailable.</div>}

      {winnerLabel && <div className="winner-banner">{winnerLabel} Wins!</div>}

      <div className="back-home">
        <MenuBox label="Back to Home" onClick={onBackToHome} />
      </div>
    </div>
  );
}

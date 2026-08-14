import { useEffect, useState } from "react";
import MenuBox from "../components/MenuBox";
import { loadRankings, pointsFor, rankFor } from "../data/rankings";
import "./ResultsScreen.css";

export default function ResultsScreen({ rosters, position, vsAI, onBackToHome }) {
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

  const scored = rankIndex
    ? rosters.map((roster) =>
        roster.map((name) => ({
          name,
          rank: rankFor(rankIndex, position, name),
          points: pointsFor(rankIndex, position, name),
        }))
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
            {(scored ? scored[side] : rosters[side].map((name) => ({ name, rank: null, points: null }))).map(
              ({ name, rank, points }) => (
                <div key={name} className="results-name">
                  {name}
                  {points !== null && (
                    <span className="results-points">
                      #{rank} · {points} pts
                    </span>
                  )}
                </div>
              )
            )}
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

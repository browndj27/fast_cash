import { useEffect, useState } from "react";
import MenuBox from "../../components/MenuBox";
import { loadRankings } from "../../data/rankings";
import { simulateSeason, PLAYOFF_ROUNDS } from "../../hooks/seasonSim";
import { ROSTER_SLOTS } from "../../hooks/rosterSlots";
import "../ResultsScreen.css";
import "./SoloSeasonResultsScreen.css";

export default function SoloSeasonResultsScreen({ roster, onBackToHome }) {
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

  // Simulated once, when rankings become available — not on every render.
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (rankIndex && !result) setResult(simulateSeason(roster, rankIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankIndex]);

  const bySlot = (slot) => roster.find((entry) => entry.slot === slot) ?? null;

  const reachedIndex = result?.reachedRound ? PLAYOFF_ROUNDS.indexOf(result.reachedRound) : -1;

  return (
    <div className="results-screen">
      <div className="results-column">
        <div className="results-column-label">Your Roster</div>
        {ROSTER_SLOTS.map((slot) => {
          const entry = bySlot(slot);
          return (
            <div key={slot} className="results-name">
              <span className="results-slot">{slot}</span>
              {entry ? entry.name : "-"}
            </div>
          );
        })}
      </div>

      {!result && !rankError && <div className="rankings-status">Simulating season...</div>}
      {rankError && <div className="rankings-status">Couldn't load rankings — season unavailable.</div>}

      {result && (
        <div className="season-summary">
          <div className="season-record">
            {result.wins}-{result.losses}
          </div>
          <div className="season-points">{result.pointsFor} pts for the season</div>

          <div className="season-trail">
            {PLAYOFF_ROUNDS.map((round, i) => {
              let state = "unreached";
              if (reachedIndex >= 0) {
                if (i < reachedIndex) state = "won";
                else if (i === reachedIndex) state = result.champion ? "won" : "lost";
              }
              return (
                <div key={round} className={`season-trail-round season-trail-round--${state}`}>
                  {round}
                </div>
              );
            })}
          </div>

          <div className="season-finish">{result.finish}</div>
        </div>
      )}

      <div className="back-home">
        <MenuBox label="Back to Home" onClick={onBackToHome} />
      </div>
    </div>
  );
}

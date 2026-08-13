import { useState } from "react";
import MenuBox from "../components/MenuBox";
import "./ResultsScreen.css";

export default function ResultsScreen({ rosters, vsAI, onBackToHome }) {
  const [winner, setWinner] = useState(null);

  const player2Label = vsAI ? "AI" : "Player 2";
  const winnerLabel = winner === 0 ? "Player 1" : winner === 1 ? player2Label : null;

  return (
    <div className="results-screen">
      <div className="results-columns">
        <div className="results-column">
          <div className="results-column-label">Player 1</div>
          {rosters[0].map((name) => (
            <div key={name} className="results-name">
              {name}
            </div>
          ))}
        </div>
        <div className="results-column">
          <div className="results-column-label">{player2Label}</div>
          {rosters[1].map((name) => (
            <div key={name} className="results-name">
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="winner-boxes">
        <MenuBox label="[ Player 1 Wins ]" onClick={() => setWinner(0)} />
        <MenuBox label={`[ ${player2Label} Wins ]`} onClick={() => setWinner(1)} />
      </div>

      {winnerLabel && <div className="winner-banner">{winnerLabel} Wins!</div>}

      <div className="back-home">
        <MenuBox label="Back to Home" onClick={onBackToHome} />
      </div>
    </div>
  );
}

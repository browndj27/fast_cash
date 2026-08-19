import { useEffect, useState } from "react";
import useSoloWheelGame from "../../hooks/useSoloWheelGame";
import WheelPlayerPanel from "./WheelPlayerPanel";
import Wheel from "./Wheel";
import PlayerPhoto from "../../components/PlayerPhoto";
import { imageFor } from "../../data/playerImages";
import "../game/GameScreen.css";
import "./WheelGameScreen.css";

const SKIP_DELAY_MS = 500;

export default function SoloWheelGameScreen({ onGameOver, onResetGame, onFullRestart }) {
  const game = useSoloWheelGame();
  const {
    roster,
    picksMade,
    totalPicksNeeded,
    phase,
    landedTeam,
    landedTeamIndex,
    candidates,
    eligibleCandidates,
    isGameOver,
    spin,
    pick,
    skipPick,
  } = game;

  // The candidate list stays hidden until the wheel visual finishes
  // spinning, even though the hook has already decided the outcome.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (phase === "idle") setRevealed(false);
  }, [phase]);

  // Auto-skip once revealed if the landed team has nothing usable (every
  // eligible slot for that team's positions is already filled).
  useEffect(() => {
    if (phase !== "spinning" || !revealed) return;
    if (eligibleCandidates.length > 0) return;
    const timer = setTimeout(() => skipPick(), SKIP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase, revealed, eligibleCandidates, skipPick]);

  useEffect(() => {
    if (isGameOver) onGameOver(roster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  if (isGameOver) return null;

  const canSpin = phase === "idle";

  return (
    <div className="game-screen">
      <div className="round-indicator">
        Pick {picksMade + 1} of {totalPicksNeeded}
      </div>

      <div className="game-layout">
        <WheelPlayerPanel label="Your Roster" roster={roster} />

        <div className="center-stage">
          <Wheel
            landedIndex={landedTeamIndex}
            spinning={phase === "spinning" && !revealed}
            onSpinComplete={() => setRevealed(true)}
            onSpinClick={spin}
            canSpin={canSpin}
          />

          {phase === "spinning" && revealed && landedTeam && (
            <div className="wheel-landing">
              <div className="wheel-landing-team" style={{ color: landedTeam.primary }}>
                {landedTeam.name}
              </div>

              {eligibleCandidates.length === 0 ? (
                <div className="uncontested-note">No eligible picks — spinning again...</div>
              ) : (
                <div className="wheel-candidates">
                  {candidates.map((c) => {
                    const isEligible = eligibleCandidates.some((e) => e.name === c.name);
                    return (
                      <button
                        key={c.name}
                        type="button"
                        className="wheel-candidate"
                        disabled={!isEligible}
                        onClick={() => pick(c.name)}
                      >
                        <PlayerPhoto
                          src={imageFor(c.position, c.name)}
                          alt={c.name}
                          className="wheel-candidate-photo"
                        />
                        <span className="wheel-candidate-name">{c.name}</span>
                        <span className="wheel-candidate-pos">{c.position}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="game-controls">
        <button type="button" className="reset-game-button" onClick={onResetGame}>
          Reset Game
        </button>
        <button type="button" className="full-restart-button" onClick={onFullRestart}>
          Full Restart
        </button>
      </div>
    </div>
  );
}

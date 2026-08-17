import { useEffect, useState } from "react";
import useWheelGame from "../../hooks/useWheelGame";
import WheelPlayerPanel from "./WheelPlayerPanel";
import Wheel from "./Wheel";
import PlayerPhoto from "../../components/PlayerPhoto";
import TurnLabel from "../../components/TurnLabel";
import { imageFor } from "../../data/playerImages";
import { loadRankings } from "../../data/rankings";
import { qualityFor } from "../../hooks/aiBidder";
import "../game/GameScreen.css";
import "./WheelGameScreen.css";

const AI_SIDE = 1;
const AI_SPIN_DELAY_MS = 900;
const AI_PICK_DELAY_MS = 900;
const SKIP_DELAY_MS = 500;

export default function WheelGameScreen({ vsAI, onGameOver, onResetGame, onFullRestart }) {
  const game = useWheelGame();
  const {
    rosters,
    picksMade,
    totalPicksNeeded,
    spinTurn,
    phase,
    landedTeam,
    landedTeamIndex,
    candidates,
    eligibleCandidates,
    activePicker,
    isGameOver,
    spin,
    pick,
    skipPick,
  } = game;

  // The candidate list stays hidden until the wheel visual finishes
  // spinning, even though the hook has already decided the outcome.
  const [revealed, setRevealed] = useState(false);

  // Rankings power the AI's sense of player value — see src/hooks/aiBidder.js.
  const [rankIndex, setRankIndex] = useState(null);
  useEffect(() => {
    if (!vsAI) return;
    let cancelled = false;
    loadRankings().then((index) => !cancelled && setRankIndex(index));
    return () => {
      cancelled = true;
    };
  }, [vsAI]);

  useEffect(() => {
    if (phase === "idle") setRevealed(false);
  }, [phase]);

  // Auto-skip once revealed if the active picker has nothing on this team
  // they can use (position already full and FLEX already full too).
  useEffect(() => {
    if (phase !== "spinning" || !revealed) return;
    if (eligibleCandidates.length > 0) return;
    const timer = setTimeout(() => skipPick(), SKIP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase, revealed, eligibleCandidates, skipPick]);

  // AI auto-spin on its turn.
  useEffect(() => {
    if (!vsAI || isGameOver || phase !== "idle" || spinTurn !== AI_SIDE) return;
    const timer = setTimeout(() => spin(), AI_SPIN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [vsAI, isGameOver, phase, spinTurn, spin]);

  // AI auto-pick: takes the highest-ranked eligible candidate instead of a
  // random one — see src/hooks/aiBidder.js.
  useEffect(() => {
    if (!vsAI || activePicker !== AI_SIDE || !revealed) return;
    if (eligibleCandidates.length === 0) return;
    const timer = setTimeout(() => {
      const choice = eligibleCandidates.reduce((best, c) => {
        const q = qualityFor(rankIndex, c.position, c.name);
        return q > best.quality ? { candidate: c, quality: q } : best;
      }, { candidate: eligibleCandidates[0], quality: -1 }).candidate;
      pick(AI_SIDE, choice.name);
    }, AI_PICK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [vsAI, activePicker, revealed, eligibleCandidates, pick, rankIndex]);

  useEffect(() => {
    if (isGameOver) onGameOver(rosters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  if (isGameOver) return null;

  const player1Label = "Player 1";
  const player2Label = vsAI ? "AI" : "Player 2";
  const labelFor = (idx) => (idx === 0 ? player1Label : player2Label);
  const canHumanSpin = phase === "idle" && (!vsAI || spinTurn !== AI_SIDE);

  return (
    <div className="game-screen">
      <div className="round-indicator">
        Pick {picksMade + 1} of {totalPicksNeeded}
      </div>

      <div className="game-layout">
        <WheelPlayerPanel label={player1Label} roster={rosters[0]} />

        <div className="center-stage">
          {phase === "idle" && (
            <div className="turn-info">
              <TurnLabel side={spinTurn}>{labelFor(spinTurn)}'s turn to spin</TurnLabel>
            </div>
          )}

          <Wheel
            landedIndex={landedTeamIndex}
            spinning={phase === "spinning" && !revealed}
            onSpinComplete={() => setRevealed(true)}
            onSpinClick={spin}
            canSpin={canHumanSpin}
          />

          {phase === "spinning" && revealed && landedTeam && (
            <div className="wheel-landing">
              <div className="wheel-landing-team" style={{ color: landedTeam.primary }}>
                {landedTeam.name}
              </div>

              {eligibleCandidates.length === 0 ? (
                <div className="uncontested-note">No eligible picks — spinning again...</div>
              ) : (
                <>
                  {activePicker !== null && (
                    <TurnLabel side={activePicker}>{labelFor(activePicker)}'s pick</TurnLabel>
                  )}
                  <div className="wheel-candidates">
                    {candidates.map((c) => {
                      const isEligible = eligibleCandidates.some((e) => e.name === c.name);
                      const canClick = isEligible && !(vsAI && activePicker === AI_SIDE);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          className="wheel-candidate"
                          disabled={!canClick}
                          onClick={() => pick(activePicker, c.name)}
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
                </>
              )}
            </div>
          )}
        </div>

        <WheelPlayerPanel label={player2Label} roster={rosters[1]} />
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

import { useEffect, useState } from "react";
import useFastCashGame, { ROSTER_SIZE } from "../../hooks/useFastCashGame";
import PlayerPanel from "./PlayerPanel";
import PlayerPhoto from "../../components/PlayerPhoto";
import TurnLabel from "../../components/TurnLabel";
import { imageFor } from "../../data/playerImages";
import { loadRankings } from "../../data/rankings";
import { qualityFor, aiValuation, aiDecision } from "../../hooks/aiBidder";
import "./GameScreen.css";

const AI_SIDE = 1;
const AI_THINK_MS = 900;
const UNCONTESTED_DELAY_MS = 700;

export default function GameScreen({ position, vsAI, onGameOver, onResetGame, onFullRestart }) {
  const game = useFastCashGame(position);
  const {
    budgets,
    rosters,
    roundIndex,
    totalRounds,
    currentPlayerName,
    currentBid,
    currentBidder,
    activeTurn,
    isGameOver,
    isUncontested,
    bidRangeFor,
    placeBid,
    concede,
    awardUncontested,
  } = game;

  // Rankings power the AI's sense of player value — see src/hooks/aiBidder.js.
  // Cached after the first fetch, so this resolves near-instantly on later games.
  const [rankIndex, setRankIndex] = useState(null);
  useEffect(() => {
    if (!vsAI) return;
    let cancelled = false;
    loadRankings().then((index) => !cancelled && setRankIndex(index));
    return () => {
      cancelled = true;
    };
  }, [vsAI]);

  const range0 = bidRangeFor(0);
  const rawRange1 = bidRangeFor(1);
  // When playing vs AI, the AI's own panel is never human-clickable —
  // its actions come only from the AI effect below.
  const range1 = vsAI ? { ...rawRange1, canBid: false, canConcede: false } : rawRange1;

  const [bidValue0, setBidValue0] = useState(range0.min);
  const [bidValue1, setBidValue1] = useState(range1.min);

  // Reset each side's selector whenever a new bidding turn begins.
  useEffect(() => {
    const r0 = bidRangeFor(0);
    const r1 = bidRangeFor(1);
    setBidValue0(r0.canBid ? r0.min : 0);
    setBidValue1(r1.canBid ? r1.min : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex, activeTurn, currentBid, budgets[0], budgets[1]]);

  // Auto-award uncontested rounds once one side's roster is full.
  useEffect(() => {
    if (!isUncontested) return;
    const timer = setTimeout(() => awardUncontested(), UNCONTESTED_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isUncontested, roundIndex, awardUncontested]);

  // AI auto-play: values the player up for bid off Sleeper rankings, weighs
  // that against its remaining budget and roster slots (spend up on studs,
  // save on scrubs), and only raises while the next legal bid is still
  // within what it thinks the player is worth. See src/hooks/aiBidder.js.
  useEffect(() => {
    if (!vsAI || isGameOver || isUncontested || activeTurn !== AI_SIDE) return;
    const timer = setTimeout(() => {
      const range = bidRangeFor(AI_SIDE);
      const remainingSlots = ROSTER_SIZE - rosters[AI_SIDE].length;
      const quality = qualityFor(rankIndex, position, currentPlayerName);
      const valuation = aiValuation({ budget: budgets[AI_SIDE], remainingSlots, quality });
      const decision = aiDecision({ range, currentBidder, valuation });
      if (decision.action === "bid") {
        placeBid(AI_SIDE, decision.amount);
      } else {
        concede(AI_SIDE);
      }
    }, AI_THINK_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vsAI, isGameOver, isUncontested, activeTurn, currentBid, currentBidder, budgets[AI_SIDE], rankIndex]);

  useEffect(() => {
    if (isGameOver) onGameOver(rosters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  if (isGameOver) return null;

  const player1Label = "Player 1";
  const player2Label = vsAI ? "AI" : "Player 2";

  return (
    <div className="game-screen">
      <div className="round-indicator">
        Round {roundIndex + 1} of {totalRounds}
      </div>

      <div className="game-layout">
        <PlayerPanel
          label={player1Label}
          position={position}
          budget={budgets[0]}
          roster={rosters[0]}
          bidValue={bidValue0}
          range={range0}
          onBidChange={setBidValue0}
          onBid={() => placeBid(0, bidValue0)}
          onConcede={() => concede(0)}
        />

        <div className="center-stage">
          {currentPlayerName && (
            <>
              <div className="center-stage-name">{currentPlayerName}</div>
              <PlayerPhoto
                src={imageFor(position, currentPlayerName)}
                alt={currentPlayerName}
                className="center-stage-photo"
              />
              {!isUncontested && (
                <div className="turn-info">
                  <TurnLabel side={activeTurn}>
                    {(activeTurn === 0 ? player1Label : player2Label)}'s turn
                  </TurnLabel>
                  <div className="turn-info-bid">Current bid: ${currentBid}</div>
                </div>
              )}
            </>
          )}
          {isUncontested && <div className="uncontested-note">Uncontested — awarding player...</div>}
        </div>

        <PlayerPanel
          label={player2Label}
          position={position}
          budget={budgets[1]}
          roster={rosters[1]}
          bidValue={bidValue1}
          range={range1}
          onBidChange={setBidValue1}
          onBid={() => placeBid(1, bidValue1)}
          onConcede={() => concede(1)}
        />
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

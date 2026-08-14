import { useState } from "react";
import { drawPlayers } from "../data/playerPools";

const STARTING_BUDGET = 20;
export const ROSTER_SIZE = 5;
const TOTAL_ROUNDS = ROSTER_SIZE * 2;

function makeInitialState(position) {
  return {
    players: drawPlayers(position, TOTAL_ROUNDS),
    roundIndex: 0,
    budgets: [STARTING_BUDGET, STARTING_BUDGET],
    rosters: [[], []],
    currentBid: 0,
    currentBidder: null,
    activeTurn: 0,
  };
}

function resolveRoundAward(prev, winnerIdx, price) {
  const rosters = prev.rosters.map((roster, i) =>
    i === winnerIdx ? [...roster, prev.players[prev.roundIndex]] : roster
  );
  const budgets = prev.budgets.map((b, i) => (i === winnerIdx ? b - price : b));
  const roundIndex = prev.roundIndex + 1;
  return {
    ...prev,
    rosters,
    budgets,
    roundIndex,
    currentBid: 0,
    currentBidder: null,
    activeTurn: roundIndex % 2,
  };
}

function legalRange(budget, currentBid) {
  if (budget === 0) {
    return currentBid === 0 ? { min: 0, max: 0 } : { min: 1, max: 0 };
  }
  return { min: currentBid + 1, max: budget };
}

function isRoundOver(state) {
  return (
    state.roundIndex >= state.players.length ||
    state.rosters[0].length === ROSTER_SIZE ||
    state.rosters[1].length === ROSTER_SIZE
  );
}

export default function useFastCashGame(position) {
  const [state, setState] = useState(() => makeInitialState(position));

  const isGameOver = state.roundIndex >= state.players.length;
  const currentPlayerName = isGameOver ? null : state.players[state.roundIndex];
  const fullSide = state.rosters[0].length === ROSTER_SIZE
    ? 0
    : state.rosters[1].length === ROSTER_SIZE
    ? 1
    : null;
  const isUncontested = !isGameOver && fullSide !== null;

  function bidRangeFor(idx) {
    if (isGameOver || isUncontested || state.activeTurn !== idx) {
      return { min: 0, max: -1, canBid: false, canConcede: false };
    }
    const { min, max } = legalRange(state.budgets[idx], state.currentBid);
    return { min, max, canBid: min <= max, canConcede: state.currentBidder !== null };
  }

  function placeBid(idx, amount) {
    setState((prev) => {
      if (isRoundOver(prev)) return prev;
      if (prev.activeTurn !== idx) return prev;
      const { min, max } = legalRange(prev.budgets[idx], prev.currentBid);
      if (amount < min || amount > max) return prev;
      return {
        ...prev,
        currentBid: amount,
        currentBidder: idx,
        activeTurn: idx === 0 ? 1 : 0,
      };
    });
  }

  function concede(idx) {
    setState((prev) => {
      if (isRoundOver(prev)) return prev;
      if (prev.activeTurn !== idx || prev.currentBidder === null) return prev;
      return resolveRoundAward(prev, prev.currentBidder, prev.currentBid);
    });
  }

  function awardUncontested() {
    setState((prev) => {
      if (prev.roundIndex >= prev.players.length) return prev;
      const winner =
        prev.rosters[0].length === ROSTER_SIZE ? 1 : prev.rosters[1].length === ROSTER_SIZE ? 0 : null;
      if (winner === null) return prev;
      return resolveRoundAward(prev, winner, 0);
    });
  }

  return {
    budgets: state.budgets,
    rosters: state.rosters,
    roundIndex: state.roundIndex,
    totalRounds: state.players.length,
    currentPlayerName,
    currentBid: state.currentBid,
    currentBidder: state.currentBidder,
    activeTurn: state.activeTurn,
    isGameOver,
    isUncontested,
    bidRangeFor,
    placeBid,
    concede,
    awardUncontested,
  };
}

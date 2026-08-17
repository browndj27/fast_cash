import { useEffect, useState } from "react";
import { PLAYER_POOLS, shuffle } from "../data/playerPools";
import { legalRange } from "./bidding";
import { loadRankings, topByRank } from "../data/rankings";

const STARTING_BUDGET = 20;
export const ROSTER_SIZE = 5;
const TOTAL_ROUNDS = ROSTER_SIZE * 2;
// Fast Cash draws only from each position's top 30 by real-world fantasy
// rank, rather than the full ~64-player pool — keeps every round contested
// between recognizable, roughly comparable names.
const TOP_N = 30;

function makeInitialState(position, rankIndex) {
  const pool = topByRank(PLAYER_POOLS[position], position, rankIndex, TOP_N);
  return {
    players: shuffle(pool).slice(0, TOTAL_ROUNDS),
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

function isRoundOver(state) {
  return (
    state.roundIndex >= state.players.length ||
    state.rosters[0].length === ROSTER_SIZE ||
    state.rosters[1].length === ROSTER_SIZE
  );
}

export default function useFastCashGame(position) {
  // Rankings decide the top-30 draw pool, so the game can't start until
  // they're loaded — cached after the first fetch, so this resolves
  // near-instantly on later games. Falls back to an empty index (every
  // player ranks equally) if the fetch fails, rather than blocking forever.
  const [rankIndex, setRankIndex] = useState(null);
  useEffect(() => {
    let cancelled = false;
    loadRankings()
      .then((index) => !cancelled && setRankIndex(index))
      .catch(() => !cancelled && setRankIndex({}));
    return () => {
      cancelled = true;
    };
  }, []);

  const [state, setState] = useState(null);
  useEffect(() => {
    if (rankIndex === null) return;
    setState(makeInitialState(position, rankIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankIndex]);

  const isLoading = state === null;

  const isGameOver = !isLoading && state.roundIndex >= state.players.length;
  const currentPlayerName = !isLoading && !isGameOver ? state.players[state.roundIndex] : null;
  const fullSide = isLoading
    ? null
    : state.rosters[0].length === ROSTER_SIZE
    ? 0
    : state.rosters[1].length === ROSTER_SIZE
    ? 1
    : null;
  const isUncontested = !isLoading && !isGameOver && fullSide !== null;

  function bidRangeFor(idx) {
    if (isLoading || isGameOver || isUncontested || state.activeTurn !== idx) {
      return { min: 0, max: -1, canBid: false, canConcede: false };
    }
    const { min, max } = legalRange(state.budgets[idx], state.currentBid);
    return { min, max, canBid: min <= max, canConcede: state.currentBidder !== null };
  }

  function placeBid(idx, amount) {
    setState((prev) => {
      if (!prev || isRoundOver(prev)) return prev;
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
      if (!prev || isRoundOver(prev)) return prev;
      if (prev.activeTurn !== idx || prev.currentBidder === null) return prev;
      return resolveRoundAward(prev, prev.currentBidder, prev.currentBid);
    });
  }

  function awardUncontested() {
    setState((prev) => {
      if (!prev || prev.roundIndex >= prev.players.length) return prev;
      const winner =
        prev.rosters[0].length === ROSTER_SIZE ? 1 : prev.rosters[1].length === ROSTER_SIZE ? 0 : null;
      if (winner === null) return prev;
      return resolveRoundAward(prev, winner, 0);
    });
  }

  return {
    isLoading,
    rankIndex,
    budgets: isLoading ? [STARTING_BUDGET, STARTING_BUDGET] : state.budgets,
    rosters: isLoading ? [[], []] : state.rosters,
    roundIndex: isLoading ? 0 : state.roundIndex,
    totalRounds: isLoading ? 0 : state.players.length,
    currentPlayerName,
    currentBid: isLoading ? 0 : state.currentBid,
    currentBidder: isLoading ? null : state.currentBidder,
    activeTurn: isLoading ? 0 : state.activeTurn,
    isGameOver,
    isUncontested,
    bidRangeFor,
    placeBid,
    concede,
    awardUncontested,
  };
}

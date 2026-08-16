import { useState } from "react";
import { pickRandomPlayer, FLEX_POSITIONS } from "../data/playerPools";
import { legalRange } from "./bidding";
import { ROSTER_SLOTS, isCategoryFull, openCategories, slotLabelFor } from "./rosterSlots";

const STARTING_BUDGET = 20;

function isRoundBlocked(state) {
  if (!state.currentPlayer) return true;
  return isCategoryFull(state.rosters[0], state.category) || isCategoryFull(state.rosters[1], state.category);
}

// Randomly picks the next category to bid on (from whichever still need
// filling) and one eligible player for it, excluding anyone already
// drafted this game — including across FLEX/RB/WR/TE overlap.
function drawNextPick(rosters, usedNames) {
  const categories = openCategories(rosters);
  if (categories.length === 0) return null;
  const category = categories[Math.floor(Math.random() * categories.length)];
  const positions = category === "FLEX" ? FLEX_POSITIONS : [category];
  const player = pickRandomPlayer(positions, usedNames);
  return player && { category, player };
}

function makeInitialState() {
  const rosters = [[], []];
  const usedNames = [];
  const next = drawNextPick(rosters, usedNames);
  return {
    rosters,
    budgets: [STARTING_BUDGET, STARTING_BUDGET],
    usedNames,
    category: next?.category ?? null,
    currentPlayer: next?.player ?? null,
    currentBid: 0,
    currentBidder: null,
    activeTurn: 0,
  };
}

function resolveRoundAward(prev, winnerIdx, price) {
  const { category, currentPlayer } = prev;
  const slot = slotLabelFor(prev.rosters[winnerIdx], category);
  const entry = { slot, position: currentPlayer.position, name: currentPlayer.name };

  const rosters = prev.rosters.map((roster, i) => (i === winnerIdx ? [...roster, entry] : roster));
  const budgets = prev.budgets.map((b, i) => (i === winnerIdx ? b - price : b));
  const usedNames = [...prev.usedNames, currentPlayer.name];
  const totalPicks = rosters[0].length + rosters[1].length;
  const next = drawNextPick(rosters, usedNames);

  return {
    rosters,
    budgets,
    usedNames,
    category: next?.category ?? null,
    currentPlayer: next?.player ?? null,
    currentBid: 0,
    currentBidder: null,
    activeTurn: totalPicks % 2,
  };
}

export default function useSkillsCashGame() {
  const [state, setState] = useState(makeInitialState);

  const isGameOver = state.currentPlayer === null;
  const fullSide = !isGameOver && isCategoryFull(state.rosters[0], state.category)
    ? 0
    : !isGameOver && isCategoryFull(state.rosters[1], state.category)
    ? 1
    : null;
  const isUncontested = !isGameOver && fullSide !== null;
  const totalPicksNeeded = ROSTER_SLOTS.length * 2;
  const picksMade = state.rosters[0].length + state.rosters[1].length;

  function bidRangeFor(idx) {
    if (isGameOver || isUncontested || state.activeTurn !== idx) {
      return { min: 0, max: -1, canBid: false, canConcede: false };
    }
    const { min, max } = legalRange(state.budgets[idx], state.currentBid);
    return { min, max, canBid: min <= max, canConcede: state.currentBidder !== null };
  }

  function placeBid(idx, amount) {
    setState((prev) => {
      if (isRoundBlocked(prev)) return prev;
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
      if (isRoundBlocked(prev)) return prev;
      if (prev.activeTurn !== idx || prev.currentBidder === null) return prev;
      return resolveRoundAward(prev, prev.currentBidder, prev.currentBid);
    });
  }

  function awardUncontested() {
    setState((prev) => {
      if (!prev.currentPlayer) return prev;
      const winner = isCategoryFull(prev.rosters[0], prev.category)
        ? 1
        : isCategoryFull(prev.rosters[1], prev.category)
        ? 0
        : null;
      if (winner === null) return prev;
      return resolveRoundAward(prev, winner, 0);
    });
  }

  return {
    budgets: state.budgets,
    rosters: state.rosters,
    picksMade,
    totalPicksNeeded,
    currentPick: state.currentPlayer,
    currentCategory: state.category,
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

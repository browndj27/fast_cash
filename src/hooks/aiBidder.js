import { pointsFor } from "../data/rankings";

// How much of a player's Sleeper ranking translates to bid value, 0-1.
// Falls back to a neutral mid-value while rankings are still loading so
// the AI still behaves sensibly on the very first game of a session.
export function qualityFor(rankIndex, position, name) {
  if (!rankIndex) return 0.5;
  return Math.min(1, Math.max(0, pointsFor(rankIndex, position, name) / 1000));
}

// The most the AI is willing to spend on a player of the given quality,
// given its remaining budget and how many more roster slots it still has
// to fill. Spends well above the per-slot average on top-tier players and
// well below it on replacement-level ones — "stars and scrubs" auction
// budgeting — while reserving $1 per slot after this one so it doesn't
// blow its whole budget on one pick and get shut out of the rest.
export function aiValuation({ budget, remainingSlots, quality }) {
  const slots = Math.max(1, remainingSlots);
  const perSlotBudget = budget / slots;
  const jitter = 0.9 + Math.random() * 0.2;
  const multiplier = (0.3 + quality * 2.3) * jitter;
  const reserve = Math.max(0, slots - 1);
  const rawMax = Math.round(perSlotBudget * multiplier);
  return Math.max(0, Math.min(budget - reserve, rawMax));
}

// Decide whether to bid (and how much) or concede, given the legal bid
// range for this turn and what the AI thinks the player is worth.
// When nothing has been bid yet the AI must open — there's no one to
// concede to yet — so it commits a portion of its valuation; once a bid
// is on the table it only raises by the minimum legal step, and only
// while that step is still within what the player is worth to it.
export function aiDecision({ range, currentBidder, valuation }) {
  if (currentBidder === null) {
    if (range.min === 0) return { action: "bid", amount: 0 };
    const open = Math.max(range.min, Math.min(range.max, Math.round(valuation * 0.65)));
    return { action: "bid", amount: open };
  }
  if (!range.canBid) return { action: "concede" };
  if (range.min === 0) return { action: "bid", amount: 0 };
  if (range.min > valuation) return { action: "concede" };
  return { action: "bid", amount: range.min };
}

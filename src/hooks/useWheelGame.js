import { useState } from "react";
import { PLAYER_POOLS } from "../data/playerPools";
import { PLAYER_TEAMS } from "../data/playerTeams";
import { NFL_TEAMS } from "../data/nflTeams";
import { indexKey } from "../data/nameMatch";
import { isCategoryFull, openCategories, slotLabelFor } from "./rosterSlots";

const CANDIDATE_POSITIONS = ["QB", "RB", "WR", "TE"];

// A pick's target slot prefers the direct position (QB/RB/WR/TE) and only
// falls back to FLEX once that position's own slots are full — except QB,
// which never qualifies for FLEX (matching Skills Cash's rule).
function targetCategoryFor(roster, position) {
  if (!isCategoryFull(roster, position)) return position;
  if (position !== "QB" && !isCategoryFull(roster, "FLEX")) return "FLEX";
  return null;
}

function topAvailableForTeam(team, position, usedNames) {
  const used = new Set(usedNames);
  for (const name of PLAYER_POOLS[position]) {
    if (used.has(name)) continue;
    if (PLAYER_TEAMS[indexKey(position, name)] === team) return { position, name };
  }
  return null;
}

function candidatesForTeam(team, usedNames) {
  return CANDIDATE_POSITIONS.map((pos) => topAvailableForTeam(team, pos, usedNames)).filter(Boolean);
}

function activePickerOf(state) {
  if (state.pickStage === "first") return state.spinTurn;
  if (state.pickStage === "second") return state.spinTurn === 0 ? 1 : 0;
  return null;
}

function makeInitialState() {
  return {
    rosters: [[], []],
    usedNames: [],
    spinTurn: 0,
    phase: "idle",
    landedTeamIndex: null,
    candidates: [],
    pickStage: null,
  };
}

// After a pick or a skip: the spinner's turn hands off to the other side
// to pick from what's left; once the other side has also gone, the round
// closes and spin turn passes to whoever didn't spin this round.
//
// Candidates are recomputed for the same team rather than just dropping
// the taken one — e.g. if player 1 takes the team's top WR, player 2 sees
// that team's next-best available WR instead of losing the WR option
// entirely. Applies uniformly to every position, not just WR.
function advance(prev, rosters, usedNames) {
  if (prev.pickStage === "first") {
    const team = NFL_TEAMS[prev.landedTeamIndex].abbr;
    const candidates = candidatesForTeam(team, usedNames);
    return { ...prev, rosters, usedNames, candidates, pickStage: "second" };
  }
  return {
    rosters,
    usedNames,
    spinTurn: prev.spinTurn === 0 ? 1 : 0,
    phase: "idle",
    landedTeamIndex: null,
    candidates: [],
    pickStage: null,
  };
}

export default function useWheelGame() {
  const [state, setState] = useState(makeInitialState);

  const isGameOver = openCategories(state.rosters).length === 0;
  const activePicker = activePickerOf(state);
  const landedTeam = state.landedTeamIndex === null ? null : NFL_TEAMS[state.landedTeamIndex];
  const eligibleCandidates =
    activePicker === null
      ? []
      : state.candidates.filter((c) => targetCategoryFor(state.rosters[activePicker], c.position) !== null);
  const totalPicksNeeded = 14;
  const picksMade = state.rosters[0].length + state.rosters[1].length;

  function spin() {
    setState((prev) => {
      if (prev.phase !== "idle" || isGameOver) return prev;
      const landedTeamIndex = Math.floor(Math.random() * NFL_TEAMS.length);
      const candidates = candidatesForTeam(NFL_TEAMS[landedTeamIndex].abbr, prev.usedNames);
      return { ...prev, phase: "spinning", landedTeamIndex, candidates, pickStage: "first" };
    });
  }

  function pick(idx, name) {
    setState((prev) => {
      if (prev.phase !== "spinning" || activePickerOf(prev) !== idx) return prev;
      const candidate = prev.candidates.find((c) => c.name === name);
      if (!candidate) return prev;
      const category = targetCategoryFor(prev.rosters[idx], candidate.position);
      if (!category) return prev;
      const slot = slotLabelFor(prev.rosters[idx], category);
      const entry = { slot, position: candidate.position, name: candidate.name };
      const rosters = prev.rosters.map((r, i) => (i === idx ? [...r, entry] : r));
      const usedNames = [...prev.usedNames, candidate.name];
      return advance(prev, rosters, usedNames);
    });
  }

  // Called when the active picker has nothing on the landed team they can
  // use — hands off to the other side (or closes the round) automatically.
  function skipPick() {
    setState((prev) => {
      if (prev.phase !== "spinning") return prev;
      return advance(prev, prev.rosters, prev.usedNames);
    });
  }

  return {
    rosters: state.rosters,
    picksMade,
    totalPicksNeeded,
    spinTurn: state.spinTurn,
    phase: state.phase,
    landedTeam,
    landedTeamIndex: state.landedTeamIndex,
    candidates: state.candidates,
    eligibleCandidates,
    activePicker,
    isGameOver,
    spin,
    pick,
    skipPick,
  };
}

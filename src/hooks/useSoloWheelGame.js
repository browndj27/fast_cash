import { useState } from "react";
import { PLAYER_POOLS } from "../data/playerPools";
import { PLAYER_TEAMS } from "../data/playerTeams";
import { NFL_TEAMS } from "../data/nflTeams";
import { indexKey } from "../data/nameMatch";
import { CATEGORIES, ROSTER_SLOTS, isCategoryFull, slotLabelFor } from "./rosterSlots";

const CANDIDATE_POSITIONS = ["QB", "RB", "WR", "TE"];

// Same slot-targeting rule as the head-to-head Wheel mode: prefers the
// player's direct position and only falls back to FLEX once that
// position's own slots are full — QB never qualifies for FLEX.
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

function makeInitialState() {
  return {
    roster: [],
    usedNames: [],
    phase: "idle",
    landedTeamIndex: null,
    candidates: [],
  };
}

// Single-player version of Spin the NFL Wheel — one roster, one spinner:
// spin, land on a team, take the best eligible player from it, repeat until
// every skill slot is filled. See useWheelGame.js for the head-to-head version.
export default function useSoloWheelGame() {
  const [state, setState] = useState(makeInitialState);

  const isGameOver = CATEGORIES.every((category) => isCategoryFull(state.roster, category));
  const landedTeam = state.landedTeamIndex === null ? null : NFL_TEAMS[state.landedTeamIndex];
  const eligibleCandidates = state.candidates.filter(
    (c) => targetCategoryFor(state.roster, c.position) !== null
  );
  const totalPicksNeeded = ROSTER_SLOTS.length;
  const picksMade = state.roster.length;

  function spin() {
    setState((prev) => {
      if (prev.phase !== "idle" || isGameOver) return prev;
      const landedTeamIndex = Math.floor(Math.random() * NFL_TEAMS.length);
      const candidates = candidatesForTeam(NFL_TEAMS[landedTeamIndex].abbr, prev.usedNames);
      return { ...prev, phase: "spinning", landedTeamIndex, candidates };
    });
  }

  function pick(name) {
    setState((prev) => {
      if (prev.phase !== "spinning") return prev;
      const candidate = prev.candidates.find((c) => c.name === name);
      if (!candidate) return prev;
      const category = targetCategoryFor(prev.roster, candidate.position);
      if (!category) return prev;
      const slot = slotLabelFor(prev.roster, category);
      const entry = { slot, position: candidate.position, name: candidate.name };
      return {
        ...prev,
        roster: [...prev.roster, entry],
        usedNames: [...prev.usedNames, candidate.name],
        phase: "idle",
        landedTeamIndex: null,
        candidates: [],
      };
    });
  }

  // Called when the landed team has nothing usable — nothing to do but
  // return to idle so the player can spin again.
  function skipPick() {
    setState((prev) => {
      if (prev.phase !== "spinning") return prev;
      return { ...prev, phase: "idle", landedTeamIndex: null, candidates: [] };
    });
  }

  return {
    roster: state.roster,
    picksMade,
    totalPicksNeeded,
    phase: state.phase,
    landedTeam,
    landedTeamIndex: state.landedTeamIndex,
    candidates: state.candidates,
    eligibleCandidates,
    isGameOver,
    spin,
    pick,
    skipPick,
  };
}

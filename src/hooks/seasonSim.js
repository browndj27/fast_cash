import { pointsFor, topByRank } from "../data/rankings";
import { PLAYER_POOLS } from "../data/playerPools";

const REGULAR_SEASON_WEEKS = 14;
// Fantasy-standard 6-win-or-better bar for a 14-week season — miss it and
// the season ends at the regular-season record.
const PLAYOFF_WIN_THRESHOLD = 9;
export const PLAYOFF_ROUNDS = ["Wild Card", "Semifinal", "Championship"];

// How deep into each position's ranked pool a weekly opponent's roster is
// drawn from. Regular-season opponents are drawn from essentially the
// whole pool (100 exceeds every position's ~64-player pool, so this is
// unrestricted) — a real league has plenty of mediocre-to-bad rosters in
// it, not just good ones. Playoff opponents are drawn from a
// progressively smaller, stronger slice, since only the league's better
// teams get that far — no fixed toughness multiplier, the pool itself
// gets tougher.
const REGULAR_SEASON_POOL_DEPTH = 100;
const PLAYOFF_POOL_DEPTH = [40, 25, 15];

// A roster's average weekly scoring power, from the same Sleeper-rank
// points already used for results scoring elsewhere in the app.
function teamPower(roster, rankIndex) {
  const total = roster.reduce((sum, p) => sum + pointsFor(rankIndex, p.position, p.name), 0);
  return total / roster.length;
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// A plausible opponent roster's average power, drawn fresh for this one
// matchup from the top `depth` players at each position — not literally
// the best available (that's what your own drafted roster competed for),
// but a believable "someone else in the league also drafted well" squad.
// Redrawing it per matchup, rather than reusing one static average, is
// what gives the season real week-to-week variance in who you're facing.
function opponentPower(rankIndex, depth) {
  const starters = [
    ["QB", 1],
    ["RB", 2],
    ["WR", 2],
    ["TE", 1],
  ];

  let total = 0;
  let count = 0;
  for (const [position, slots] of starters) {
    const pool = topByRank(PLAYER_POOLS[position], position, rankIndex, depth);
    for (let i = 0; i < slots; i++) {
      total += pointsFor(rankIndex, position, randomFrom(pool));
      count++;
    }
  }

  const flexPosition = randomFrom(["RB", "WR", "TE"]);
  const flexPool = topByRank(PLAYER_POOLS[flexPosition], flexPosition, rankIndex, depth);
  total += pointsFor(rankIndex, flexPosition, randomFrom(flexPool));
  count++;

  return total / count;
}

// A single week's score for a team of the given average power — real
// fantasy scores swing well above and below a team's true talent week to
// week, so this samples 75%-125% of it rather than returning it flat.
function weeklyScore(power) {
  return power * (0.75 + Math.random() * 0.5);
}

// Simulates a full mock season for a completed roster: a 14-week regular
// season against a fresh plausible opponent each week, then — if the
// record clears the playoff bar — a three-round playoff bracket (Wild
// Card, Semifinal, Championship) against progressively stronger opponents.
export function simulateSeason(roster, rankIndex) {
  const power = teamPower(roster, rankIndex);

  let wins = 0;
  let losses = 0;
  let pointsForTotal = 0;
  for (let week = 0; week < REGULAR_SEASON_WEEKS; week++) {
    const myScore = weeklyScore(power);
    const oppScore = weeklyScore(opponentPower(rankIndex, REGULAR_SEASON_POOL_DEPTH));
    pointsForTotal += myScore;
    if (myScore > oppScore) wins++;
    else losses++;
  }

  const madePlayoffs = wins >= PLAYOFF_WIN_THRESHOLD;
  let finish = "Missed the Playoffs";
  let reachedRound = null;
  let champion = false;

  if (madePlayoffs) {
    for (let i = 0; i < PLAYOFF_ROUNDS.length; i++) {
      const roundName = PLAYOFF_ROUNDS[i];
      reachedRound = roundName;
      const myScore = weeklyScore(power);
      const oppScore = weeklyScore(opponentPower(rankIndex, PLAYOFF_POOL_DEPTH[i]));
      if (myScore > oppScore) {
        if (i === PLAYOFF_ROUNDS.length - 1) {
          champion = true;
          finish = "League Champion";
        }
      } else {
        finish = `Lost in the ${roundName}`;
        break;
      }
    }
  }

  return {
    wins,
    losses,
    regularSeasonWeeks: REGULAR_SEASON_WEEKS,
    pointsFor: Math.round(pointsForTotal),
    madePlayoffs,
    reachedRound,
    champion,
    finish,
  };
}

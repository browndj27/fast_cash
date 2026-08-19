import { pointsFor } from "../data/rankings";
import { PLAYER_POOLS } from "../data/playerPools";

const REGULAR_SEASON_WEEKS = 14;
// Fantasy-standard 6-win-or-better bar for a 14-week season — miss it and
// the season ends at the regular-season record.
const PLAYOFF_WIN_THRESHOLD = 9;
export const PLAYOFF_ROUNDS = ["Wild Card", "Semifinal", "Championship"];
// Playoff opponents get progressively tougher relative to league average.
const PLAYOFF_TOUGHNESS = [1.05, 1.15, 1.25];

// A roster's average weekly scoring power, from the same Sleeper-rank
// points already used for results scoring elsewhere in the app.
function teamPower(roster, rankIndex) {
  const total = roster.reduce((sum, p) => sum + pointsFor(rankIndex, p.position, p.name), 0);
  return total / roster.length;
}

// A "replacement level" opponent's power — the average points a typical
// QB/RB/RB/WR/WR/TE/FLEX lineup would score, drawn from the full player
// pool rather than any specific roster.
function leagueAveragePower(rankIndex) {
  const avgByPosition = {};
  for (const position of ["QB", "RB", "WR", "TE"]) {
    const names = PLAYER_POOLS[position];
    const total = names.reduce((sum, name) => sum + pointsFor(rankIndex, position, name), 0);
    avgByPosition[position] = total / names.length;
  }
  const flexAvg = (avgByPosition.RB + avgByPosition.WR + avgByPosition.TE) / 3;
  const slots = [
    avgByPosition.QB,
    avgByPosition.RB,
    avgByPosition.RB,
    avgByPosition.WR,
    avgByPosition.WR,
    avgByPosition.TE,
    flexAvg,
  ];
  return slots.reduce((a, b) => a + b, 0) / slots.length;
}

// A single week's score for a team of the given average power — real
// fantasy scores swing well above and below a team's true talent week to
// week, so this samples 75%-125% of it rather than returning it flat.
function weeklyScore(power) {
  return power * (0.75 + Math.random() * 0.5);
}

// Simulates a full mock season for a completed roster: a 14-week regular
// season against replacement-level opponents, then — if the record clears
// the playoff bar — a three-round playoff bracket (Wild Card, Semifinal,
// Championship) against progressively tougher opponents.
export function simulateSeason(roster, rankIndex) {
  const power = teamPower(roster, rankIndex);
  const avgPower = leagueAveragePower(rankIndex);

  let wins = 0;
  let losses = 0;
  let pointsForTotal = 0;
  for (let week = 0; week < REGULAR_SEASON_WEEKS; week++) {
    const myScore = weeklyScore(power);
    const oppScore = weeklyScore(avgPower);
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
      const oppScore = weeklyScore(avgPower * PLAYOFF_TOUGHNESS[i]);
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

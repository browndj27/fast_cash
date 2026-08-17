import { indexKey } from "./nameMatch";

const SLEEPER_PLAYERS_URL = "https://api.sleeper.app/v1/players/nfl";
const CACHE_KEY = "fastcash_rank_index_v2";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const RANKED_POSITIONS = ["QB", "RB", "WR", "TE"];

// Names not yet seen by Sleeper (rookies pre-DB-update, typos) fall back
// here — well past our pool's observed rank range (1-524) so they still
// score, just low, instead of crashing the results screen.
const FALLBACK_RANK = 600;
const MAX_POINTS = 1000;

function buildRankIndex(players) {
  const index = {};
  for (const player of Object.values(players)) {
    const { full_name: fullName, position, search_rank: searchRank } = player;
    if (!fullName || !RANKED_POSITIONS.includes(position) || typeof searchRank !== "number") {
      continue;
    }
    const key = indexKey(position, fullName);
    if (!(key in index) || searchRank < index[key]) {
      index[key] = searchRank;
    }
  }
  return index;
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, index } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL_MS) return null;
    return index;
  } catch {
    return null;
  }
}

function writeCache(index) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), index }));
  } catch {
    // Storage unavailable or full — next load just refetches.
  }
}

export async function loadRankings() {
  const cached = readCache();
  if (cached) return cached;

  const res = await fetch(SLEEPER_PLAYERS_URL);
  if (!res.ok) throw new Error(`Sleeper API request failed: ${res.status}`);
  const players = await res.json();
  const index = buildRankIndex(players);
  writeCache(index);
  return index;
}

export function rankFor(index, position, name) {
  return index[indexKey(position, name)] ?? FALLBACK_RANK;
}

export function pointsFor(index, position, name) {
  return Math.max(0, MAX_POINTS - rankFor(index, position, name));
}

// The `count` best names in `pool` for `position`, best (lowest) rank first.
// Without an index yet (rankings still loading/unavailable) every player
// ranks equally, so this just returns the pool's first `count` entries.
export function topByRank(pool, position, index, count) {
  return [...pool]
    .sort((a, b) => rankFor(index, position, a) - rankFor(index, position, b))
    .slice(0, count);
}

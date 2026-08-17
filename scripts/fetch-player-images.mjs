#!/usr/bin/env node
// One-time, manual pull of player headshots from Sleeper's public CDN.
// Not wired into dev/build — run by hand whenever the player pool changes:
//   npm run fetch:images

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { PLAYER_POOLS } from "../src/data/playerPools.js";
import { indexKey, normalizeName } from "../src/data/nameMatch.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/players");
const MANIFEST_PATH = path.join(__dirname, "../src/data/playerImages.json");
const SLEEPER_PLAYERS_URL = "https://api.sleeper.app/v1/players/nfl";
const SLEEPER_IMAGE_URL = (playerId) => `https://sleepercdn.com/content/nfl/players/${playerId}.jpg`;
const RANKED_POSITIONS = ["QB", "RB", "WR", "TE"];

function slugify(position, name) {
  return `${position.toLowerCase()}-${normalizeName(name).replace(/\s+/g, "-")}`;
}

async function buildIdIndex() {
  console.log("Fetching Sleeper player directory...");
  const res = await fetch(SLEEPER_PLAYERS_URL);
  if (!res.ok) throw new Error(`Sleeper API request failed: ${res.status}`);
  const players = await res.json();

  const index = {};
  for (const [playerId, player] of Object.entries(players)) {
    const { full_name: fullName, position, search_rank: searchRank } = player;
    if (!fullName || !RANKED_POSITIONS.includes(position)) continue;
    const key = indexKey(position, fullName);
    const rank = typeof searchRank === "number" ? searchRank : Infinity;
    if (!(key in index) || rank < index[key].rank) {
      index[key] = { playerId, rank };
    }
  }
  return index;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The CDN rate-limits bursts of unthrottled requests — hitting it for all
// ~250 images back-to-back silently drops a chunk of otherwise-available
// photos. A small delay between requests plus a couple of retries on
// failure keeps that from masquerading as "no image on CDN".
async function downloadImage(playerId, destPath, attempt = 1) {
  const res = await fetch(SLEEPER_IMAGE_URL(playerId));
  if (!res.ok) {
    if (attempt < 3) {
      await sleep(400 * attempt);
      return downloadImage(playerId, destPath, attempt + 1);
    }
    return false;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await sharp(buffer).webp({ quality: 82 }).toFile(destPath);
  return true;
}

async function main() {
  const idIndex = await buildIdIndex();
  await mkdir(OUTPUT_DIR, { recursive: true });

  const manifest = {};
  const unmatched = [];
  const failed = [];

  for (const [position, names] of Object.entries(PLAYER_POOLS)) {
    for (const name of names) {
      const match = idIndex[indexKey(position, name)];
      if (!match) {
        unmatched.push(`${position} ${name}`);
        continue;
      }

      const filename = `${slugify(position, name)}.webp`;
      process.stdout.write(`Downloading ${name} (${position})... `);
      const ok = await downloadImage(match.playerId, path.join(OUTPUT_DIR, filename));
      if (ok) {
        manifest[indexKey(position, name)] = `/players/${filename}`;
        console.log("ok");
      } else {
        failed.push(`${position} ${name}`);
        console.log("failed (no image on CDN)");
      }
      await sleep(120);
    }
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`\nDownloaded ${Object.keys(manifest).length} images to ${OUTPUT_DIR}`);
  console.log(`Manifest written to ${MANIFEST_PATH}`);
  if (unmatched.length) {
    console.log(`\nNo Sleeper match (${unmatched.length}):`);
    unmatched.forEach((n) => console.log(`  - ${n}`));
  }
  if (failed.length) {
    console.log(`\nMatched but image unavailable (${failed.length}):`);
    failed.forEach((n) => console.log(`  - ${n}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

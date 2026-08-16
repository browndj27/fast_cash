// Each position pool is capped at its top 30 players by real-world
// fantasy prominence (Sleeper's search_rank) to keep each bidding pool
// small — see the ranking pass in fetch-player-images.mjs/rankings.js.
export const PLAYER_POOLS = {
  QB: [
    "Josh Allen", "Drake Maye", "Lamar Jackson", "Joe Burrow", "Jayden Daniels",
    "Caleb Williams", "Justin Herbert", "Jalen Hurts", "Jaxson Dart", "Patrick Mahomes",
    "Trevor Lawrence", "Bo Nix", "Dak Prescott", "Brock Purdy", "Jordan Love",
    "Jared Goff", "Baker Mayfield", "Matthew Stafford", "Fernando Mendoza", "Tyler Shough",
    "Cam Ward", "C.J. Stroud", "Sam Darnold", "Kyler Murray", "Malik Willis",
    "Bryce Young", "Daniel Jones", "Jacoby Brissett", "Geno Smith", "Tua Tagovailoa",
  ],
  RB: [
    "Jahmyr Gibbs", "Bijan Robinson", "Jonathan Taylor", "James Cook", "Christian McCaffrey",
    "Derrick Henry", "De'Von Achane", "Ashton Jeanty", "Omarion Hampton", "Saquon Barkley",
    "Kyren Williams", "Jeremiyah Love", "Chase Brown", "Kenneth Walker", "Josh Jacobs",
    "Breece Hall", "Javonte Williams", "Bucky Irving", "Travis Etienne Jr.", "Cam Skattebo",
    "TreVeyon Henderson", "Quinshon Judkins", "D'Andre Swift", "David Montgomery", "Jaylen Warren",
    "RJ Harvey", "Tony Pollard", "Aaron Jones", "James Conner", "Jacory Croskey-Merritt",
  ],
  WR: [
    "Puka Nacua", "Jaxon Smith-Njigba", "Amon-Ra St. Brown", "CeeDee Lamb", "Justin Jefferson",
    "Drake London", "A.J. Brown", "Nico Collins", "George Pickens", "Rashee Rice",
    "Malik Nabers", "Chris Olave", "DeVonta Smith", "Tetairoa McMillan", "Garrett Wilson",
    "Ladd McConkey", "Luther Burden III", "Jaylen Waddle", "Zay Flowers", "Davante Adams",
    "Terry McLaurin", "Jameson Williams", "Mike Evans", "Carnell Tate", "Rome Odunze",
    "Jordyn Tyson", "Christian Watson", "Brian Thomas Jr.", "Courtland Sutton", "DK Metcalf",
  ],
  TE: [
    "Trey McBride", "Brock Bowers", "Colston Loveland", "Tyler Warren", "Sam LaPorta",
    "Tucker Kraft", "Kyle Pitts", "Dalton Kincaid", "George Kittle", "Hunter Henry",
    "Dallas Goedert", "Mark Andrews", "Travis Kelce", "Jake Ferguson", "Dalton Schultz",
    "Juwan Johnson", "Brenton Strange", "Isaiah Likely", "David Njoku", "Colby Parkinson",
    "Chig Okonkwo", "T.J. Hockenson", "Mason Taylor", "Theo Johnson", "Cade Otton",
    "Jonnu Smith", "Eric Ebron", "Gunnar Helm", "AJ Barner", "Terrance Ferguson",
  ],
};

export const POSITION_LABELS = {
  QB: "QBs",
  RB: "RBs",
  WR: "WRs",
  TE: "TEs",
};

// Any offensive position except QB — used by the FLEX slot in Skills Cash.
export const FLEX_POSITIONS = ["RB", "WR", "TE"];

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function drawPlayers(position, count) {
  return shuffle(PLAYER_POOLS[position]).slice(0, count);
}

// Picks one random player from the union of the given positions, excluding
// any name already spoken for (e.g. players already drafted this game).
// A single position (e.g. ["RB"]) draws from just that pool; FLEX_POSITIONS
// draws from the shared RB/WR/TE pool used by Skills Cash's FLEX slot.
export function pickRandomPlayer(positions, exclude = []) {
  const excluded = new Set(exclude);
  const pool = positions.flatMap((pos) =>
    PLAYER_POOLS[pos].filter((name) => !excluded.has(name)).map((name) => ({ name, position: pos }))
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

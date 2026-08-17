// Each position pool guarantees the top 2 players by real-world fantasy
// relevance for every one of the 32 NFL teams (64 players per position),
// so every team always has an eligible player at every skill position —
// see src/data/nflTeams.js for the team list and src/data/playerTeams.js
// for the per-player team mapping used by Spin the NFL Wheel.
export const PLAYER_POOLS = {
  QB: [
    "Jacoby Brissett", "Gardner Minshew II", "Michael Penix Jr.", "Tua Tagovailoa", "Lamar Jackson",
    "Tyler Huntley", "Josh Allen", "Kyle Allen", "Bryce Young", "Kenny Pickett",
    "Caleb Williams", "Tyson Bagent", "Joe Burrow", "Joe Flacco", "Shedeur Sanders",
    "Deshaun Watson", "Dak Prescott", "Joe Milton III", "Bo Nix", "Jarrett Stidham",
    "Jared Goff", "Joshua Dobbs", "Jordan Love", "Tyrod Taylor", "C.J. Stroud",
    "Davis Mills", "Daniel Jones", "Riley Leonard", "Trevor Lawrence", "Nick Mullens",
    "Patrick Mahomes", "Justin Fields", "Justin Herbert", "Trey Lance", "Matthew Stafford",
    "Stetson Bennett IV", "Kirk Cousins", "Fernando Mendoza", "Malik Willis", "Quinn Ewers",
    "Kyler Murray", "J.J. McCarthy", "Drake Maye", "Tommy DeVito", "Tyler Shough",
    "Spencer Rattler", "Jaxson Dart", "Jameis Winston", "Geno Smith", "Cade Klubnik",
    "Jalen Hurts", "Tanner McKee", "Aaron Rodgers", "Mason Rudolph", "Sam Darnold",
    "Drew Lock", "Brock Purdy", "Mac Jones", "Baker Mayfield", "Jake Browning",
    "Cam Ward", "Mitchell Trubisky", "Jayden Daniels", "Marcus Mariota",
  ],
  RB: [
    "Jeremiyah Love", "Tyler Allgeier", "Bijan Robinson", "Brian Robinson Jr.", "Derrick Henry",
    "Justice Hill", "James Cook", "Ty Johnson", "Chuba Hubbard", "Jonathon Brooks",
    "D'Andre Swift", "Kyle Monangai", "Chase Brown", "Samaje Perine", "Quinshon Judkins",
    "Dylan Sampson", "Javonte Williams", "Jaydon Blue", "J.K. Dobbins", "RJ Harvey",
    "Jahmyr Gibbs", "Isiah Pacheco", "Josh Jacobs", "MarShawn Lloyd", "David Montgomery",
    "Woody Marks", "Jonathan Taylor", "DJ Giddens", "Bhayshul Tuten", "Chris Rodriguez Jr.",
    "Kenneth Walker", "Emari Demercado", "Omarion Hampton", "Keaton Mitchell", "Kyren Williams",
    "Blake Corum", "Ashton Jeanty", "Mike Washington Jr.", "De'Von Achane", "Jaylen Wright",
    "Aaron Jones", "Jordan Mason", "Rhamondre Stevenson", "TreVeyon Henderson", "Travis Etienne Jr.",
    "Alvin Kamara", "Cam Skattebo", "Tyrone Tracy Jr.", "Breece Hall", "Braelon Allen",
    "Saquon Barkley", "Tank Bigsby", "Jaylen Warren", "Rico Dowdle", "Zach Charbonnet",
    "Jadarian Price", "Christian McCaffrey", "Jordan James", "Bucky Irving", "Kenny Gainwell",
    "Tony Pollard", "Tyjae Spears", "Jacory Croskey-Merritt", "Rachaad White",
  ],
  WR: [
    "Marvin Harrison Jr.", "Michael Wilson", "Drake London", "Jahan Dotson", "Zay Flowers",
    "Rashod Bateman", "DJ Moore", "Khalil Shakir", "Tetairoa McMillan", "Jalen Coker",
    "Rome Odunze", "Luther Burden III", "Ja'Marr Chase", "Tee Higgins", "Denzel Boston",
    "Jerry Jeudy", "CeeDee Lamb", "George Pickens", "Jaylen Waddle", "Courtland Sutton",
    "Amon-Ra St. Brown", "Jameson Williams", "Christian Watson", "Jayden Reed", "Nico Collins",
    "Jayden Higgins", "Alec Pierce", "Josh Downs", "Brian Thomas Jr.", "Jakobi Meyers",
    "Rashee Rice", "Xavier Worthy", "Ladd McConkey", "Quentin Johnston", "Puka Nacua",
    "Davante Adams", "Tre Tucker", "Jalen Nailor", "Malik Washington", "Caleb Douglas",
    "Justin Jefferson", "Jordan Addison", "A.J. Brown", "Romeo Doubs", "Chris Olave",
    "Jordyn Tyson", "Malik Nabers", "Malachi Fields", "Garrett Wilson", "Adonai Mitchell",
    "DeVonta Smith", "Makai Lemon", "DK Metcalf", "Michael Pittman Jr.", "Jaxon Smith-Njigba",
    "Rashid Shaheed", "Mike Evans", "Deebo Samuel", "Emeka Egbuka", "Chris Godwin",
    "Calvin Ridley", "Carnell Tate", "Terry McLaurin", "Stefon Diggs",
  ],
  TE: [
    "Trey McBride", "Elijah Higgins", "Kyle Pitts", "Charlie Woerner", "Mark Andrews",
    "Durham Smythe", "Dalton Kincaid", "Dawson Knox", "Tommy Tremble", "Ja'Tavion Sanders",
    "Colston Loveland", "Cole Kmet", "Drew Sample", "Mike Gesicki", "Harold Fannin Jr.",
    "Blake Whiteheart", "Jake Ferguson", "Brevyn Spann-Ford", "Evan Engram", "Adam Trautman",
    "Sam LaPorta", "Brock Wright", "Tucker Kraft", "Josh Whyle", "Dalton Schultz",
    "Foster Moreau", "Tyler Warren", "Mo Alie-Cox", "Brenton Strange", "Nate Boerkircher",
    "Travis Kelce", "Noah Gray", "Oronde Gadsden II", "Charlie Kolar", "Terrance Ferguson",
    "Colby Parkinson", "Brock Bowers", "Michael Mayer", "Darren Waller", "Pharaoh Brown",
    "T.J. Hockenson", "Josh Oliver", "Hunter Henry", "Eli Raridon", "Juwan Johnson",
    "Noah Fant", "Isaiah Likely", "Theo Johnson", "Mason Taylor", "Kenyon Sadiq",
    "Dallas Goedert", "Johnny Mundt", "Pat Freiermuth", "Darnell Washington", "AJ Barner",
    "Eric Saubert", "George Kittle", "Jake Tonges", "Cade Otton", "Payne Durham",
    "Gunnar Helm", "Daniel Bellinger", "Chig Okonkwo", "John Bates",
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

export function shuffle(array) {
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

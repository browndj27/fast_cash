export const PLAYER_POOLS = {
  QB: [
    "Josh Allen", "Malik Willis", "Shedeur Sanders", "Aaron Rodgers", "C.J. Stroud",
    "Drake Maye", "Geno Smith", "Lamar Jackson", "Joe Burrow", "Deshaun Watson",
    "Daniel Jones", "Trevor Lawrence", "Cam Ward", "Bo Nix", "Patrick Mahomes",
    "Fernando Mendoza", "Kirk Cousins", "Justin Herbert", "Dak Prescott", "Jaxson Dart",
    "Jalen Hurts", "Jayden Daniels", "Caleb Williams", "Jared Goff", "Jordan Love",
    "Kyler Murray", "J.J. McCarthy", "Tua Tagovailoa", "Bryce Young", "Tyler Shough",
    "Baker Mayfield", "Michael Penix Jr.", "Jacoby Brissett", "Matthew Stafford",
    "Brock Purdy", "Sam Darnold",
  ],
  RB: [
    "James Cook", "De'Von Achane", "Breece Hall", "TreVeyon Henderson", "Derrick Henry",
    "Chase Brown", "Dylan Sampson", "Quinshon Judkins", "Jaylen Warren", "David Montgomery",
    "Jonathan Taylor", "Travis Etienne Jr.", "Tony Pollard", "RJ Harvey", "Kenneth Walker",
    "Isiah Pacheco", "Ashton Jeanty", "Omarion Hampton", "Javonte Williams", "Cam Skattebo",
    "Saquon Barkley", "Jacory Croskey-Merritt", "D'Andre Swift", "Jahmyr Gibbs", "Josh Jacobs",
    "Aaron Jones", "Bijan Robinson", "Trevor Etienne", "Alvin Kamara", "Rachaad White",
    "Bucky Irving", "James Conner", "Jeremiyah Love", "Kyren Williams", "Christian McCaffrey",
    "Zach Charbonnet",
  ],
  WR: [
    "Khalil Shakir", "Keon Coleman", "Tyreek Hill", "Jaylen Waddle", "Garrett Wilson",
    "Stefon Diggs", "Romeo Doubs", "A.J. Brown", "Zay Flowers", "Rashod Bateman",
    "Jerry Jeudy", "DK Metcalf", "Michael Pittman Jr.", "Nico Collins", "Alec Pierce",
    "Brian Thomas Jr.", "Travis Hunter", "Calvin Ridley", "Carnell Tate", "Courtland Sutton",
    "Rashee Rice", "Xavier Worthy", "Jakobi Meyers", "Tre Tucker", "Ladd McConkey",
    "Keenan Allen", "CeeDee Lamb", "George Pickens", "Malik Nabers", "Wan'Dale Robinson",
    "DeVonta Smith", "Terry McLaurin", "Rome Odunze", "Luther Burden III", "Amon-Ra St. Brown",
    "Jameson Williams", "Christian Watson", "Justin Jefferson", "Jordan Addison", "Drake London",
    "Jordyn Tyson", "Tetairoa McMillan", "Xavier Legette", "Chris Olave", "Chris Godwin",
    "Marvin Harrison Jr.", "Puka Nacua", "Davante Adams", "Deebo Samuel Sr.", "Mike Evans",
    "Jaxon Smith-Njigba", "Cooper Kupp",
  ],
};

export const POSITION_LABELS = {
  QB: "QBs",
  RB: "RBs",
  WR: "WRs",
};

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

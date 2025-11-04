import { e as ensure_array_like, f as stringify, c as pop, p as push, h as head } from "../../chunks/index.js";
import "clsx";
import { e as escape_html } from "../../chunks/escaping.js";
const replacements = {
  translate: /* @__PURE__ */ new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function attr(name, value, is_boolean = false) {
  if (value == null || !value && is_boolean || value === "" && name === "class") return "";
  const normalized = name in replacements && replacements[name].get(value) || value;
  const assignment = is_boolean ? "" : `="${escape_html(normalized, true)}"`;
  return ` ${name}${assignment}`;
}
function generateAttributes(positionType) {
  const base = {
    kicking: 60 + Math.random() * 30,
    marking: 60 + Math.random() * 30,
    handballing: 60 + Math.random() * 30,
    tackling: 60 + Math.random() * 30,
    speed: 60 + Math.random() * 30,
    endurance: 60 + Math.random() * 30,
    strength: 60 + Math.random() * 30,
    agility: 60 + Math.random() * 30
  };
  switch (positionType) {
    case "forward":
      base.kicking += 10;
      base.marking += 10;
      break;
    case "midfielder":
      base.endurance += 15;
      base.speed += 10;
      base.handballing += 5;
      break;
    case "defender":
      base.tackling += 10;
      base.strength += 10;
      break;
    case "ruck":
      base.strength += 15;
      base.marking += 10;
      base.endurance += 5;
      break;
  }
  Object.keys(base).forEach((key) => {
    base[key] = Math.min(
      100,
      Math.round(base[key])
    );
  });
  return base;
}
function createPlayer(id, firstName, lastName, age, position, number, positionType) {
  return {
    id,
    firstName,
    lastName,
    age,
    position,
    number,
    attributes: generateAttributes(positionType),
    fitness: 85 + Math.random() * 15,
    form: 70 + Math.random() * 30,
    injured: false,
    injuryWeeks: 0,
    morale: 75 + Math.random() * 25,
    gamesPlayed: Math.floor(Math.random() * 150),
    goals: Math.floor(Math.random() * 200),
    behinds: Math.floor(Math.random() * 150),
    disposals: Math.floor(Math.random() * 3e3),
    marks: Math.floor(Math.random() * 800),
    tackles: Math.floor(Math.random() * 600)
  };
}
const firstNames = [
  "Jack",
  "Tom",
  "Charlie",
  "Max",
  "Harry",
  "Lachlan",
  "Patrick",
  "Luke",
  "Josh",
  "Daniel",
  "Sam",
  "Jake",
  "Ryan",
  "Toby",
  "Ben",
  "Matt",
  "Nick",
  "Alex",
  "Angus",
  "Bailey",
  "Callum",
  "Dylan",
  "Ethan",
  "Connor"
];
const lastNames = [
  "Smith",
  "Jones",
  "Williams",
  "Brown",
  "Wilson",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Rodriguez",
  "Lewis",
  "Lee",
  "Walker",
  "Hall",
  "Allen",
  "Young",
  "King",
  "Wright",
  "Scott",
  "Green",
  "Baker",
  "Adams",
  "Nelson",
  "Hill",
  "Mitchell",
  "Campbell",
  "Ryan",
  "Roberts"
];
function generateSquad(teamId, startId) {
  const players = [];
  let playerNum = startId;
  const structure = [
    { positions: ["FF", "CHF", "FP", "FP", "FF", "CHF"], type: "forward" },
    { positions: ["C", "W", "W", "R", "C", "W"], type: "midfielder" },
    { positions: ["CHB", "FB", "BP", "BP", "CHB", "FB"], type: "defender" },
    { positions: ["R", "RR"], type: "ruck" },
    { positions: ["INT", "INT", "INT", "INT", "INT", "INT"], type: "midfielder" }
  ];
  structure.forEach(({ positions, type }) => {
    positions.forEach((position, idx) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const age = 19 + Math.floor(Math.random() * 15);
      const number = playerNum++;
      players.push(
        createPlayer(
          `${teamId}-${number}`,
          firstName,
          lastName,
          age,
          position,
          number,
          type
        )
      );
    });
  });
  return players;
}
const AFL_TEAMS = [
  { id: "adelaide", name: "Adelaide Crows", shortName: "ADEL", colors: { primary: "#002B5C", secondary: "#FFD100" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "brisbane", name: "Brisbane Lions", shortName: "BL", colors: { primary: "#A30046", secondary: "#FDB71A" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "carlton", name: "Carlton Blues", shortName: "CARL", colors: { primary: "#0E1E2D", secondary: "#B1CAD8" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "collingwood", name: "Collingwood Magpies", shortName: "COLL", colors: { primary: "#000000", secondary: "#FFFFFF" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "essendon", name: "Essendon Bombers", shortName: "ESS", colors: { primary: "#CC2031", secondary: "#000000" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "fremantle", name: "Fremantle Dockers", shortName: "FRE", colors: { primary: "#2A1A54", secondary: "#FFFFFF" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "geelong", name: "Geelong Cats", shortName: "GEEL", colors: { primary: "#001F3B", secondary: "#FFFFFF" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "goldcoast", name: "Gold Coast Suns", shortName: "GCFC", colors: { primary: "#CC092F", secondary: "#FFD200" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "gws", name: "GWS Giants", shortName: "GWS", colors: { primary: "#F15B2A", secondary: "#2D2926" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "hawthorn", name: "Hawthorn Hawks", shortName: "HAW", colors: { primary: "#4D2004", secondary: "#FED500" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "melbourne", name: "Melbourne Demons", shortName: "MELB", colors: { primary: "#CC2031", secondary: "#003F87" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "northmelbourne", name: "North Melbourne Kangaroos", shortName: "NMFC", colors: { primary: "#003F87", secondary: "#FFFFFF" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "portadelaide", name: "Port Adelaide Power", shortName: "PORT", colors: { primary: "#008FA1", secondary: "#000000" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "richmond", name: "Richmond Tigers", shortName: "RICH", colors: { primary: "#FFD200", secondary: "#000000" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "stkilda", name: "St Kilda Saints", shortName: "STK", colors: { primary: "#ED0F05", secondary: "#FFFFFF" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "sydney", name: "Sydney Swans", shortName: "SYD", colors: { primary: "#ED171F", secondary: "#FFFFFF" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "westcoast", name: "West Coast Eagles", shortName: "WCE", colors: { primary: "#002B5C", secondary: "#FFC40E" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: "westernbulldogs", name: "Western Bulldogs", shortName: "WB", colors: { primary: "#014896", secondary: "#ED171F" }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 }
];
function initializeTeams() {
  return AFL_TEAMS.map((teamData, index) => ({
    ...teamData,
    players: generateSquad(teamData.id, index * 100 + 1)
  }));
}
({
  season: {
    year: 2025,
    currentRound: 1,
    totalRounds: 23,
    teams: initializeTeams(),
    matches: [],
    playerTeam: {}
    // Will be set when user selects team
  },
  tactics: {
    gameStyle: "balanced",
    forwardPressure: "medium",
    ballMovement: "controlled",
    defendingStyle: "hybrid"
  },
  selectedMatch: void 0,
  viewingStats: false
});
function TeamSelection($$payload, $$props) {
  push();
  let searchQuery = "";
  let hoveredTeam = null;
  let filteredTeams = AFL_TEAMS.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()) || team.shortName.toLowerCase().includes(searchQuery.toLowerCase()));
  const each_array = ensure_array_like(filteredTeams);
  $$payload.out += `<div class="team-selection-screen svelte-w8zg00"><div class="hero svelte-w8zg00"><h1 class="title svelte-w8zg00">AFL MANAGER</h1> <p class="subtitle svelte-w8zg00">Choose Your Team</p> <div class="search-box svelte-w8zg00"><input type="text" placeholder="Search teams..."${attr("value", searchQuery)} class="svelte-w8zg00"></div></div> <div class="teams-grid svelte-w8zg00"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let team = each_array[$$index];
    $$payload.out += `<button${attr("class", `team-card svelte-w8zg00 ${stringify([hoveredTeam === team.id ? "hovered" : ""].filter(Boolean).join(" "))}`)}><div class="team-colors-bg svelte-w8zg00"><div class="color-stripe svelte-w8zg00"${attr("style", `background: ${stringify(team.colors.primary)}`)}></div> <div class="color-stripe svelte-w8zg00"${attr("style", `background: ${stringify(team.colors.secondary)}`)}></div></div> <div class="team-content svelte-w8zg00"><h3 class="team-name svelte-w8zg00">${escape_html(team.name)}</h3> <span class="team-short svelte-w8zg00">${escape_html(team.shortName)}</span></div> <div class="select-arrow svelte-w8zg00">→</div></button>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>AFL Manager</title>`;
  });
  {
    $$payload.out += "<!--[-->";
    TeamSelection($$payload);
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};

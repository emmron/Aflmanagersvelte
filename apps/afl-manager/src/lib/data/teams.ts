import type { Team, Player, Position, PlayerAttributes } from '../types';

// Helper function to generate random attributes
function generateAttributes(
  positionType: 'forward' | 'midfielder' | 'defender' | 'ruck'
): PlayerAttributes {
  const base = {
    kicking: 60 + Math.random() * 30,
    marking: 60 + Math.random() * 30,
    handballing: 60 + Math.random() * 30,
    tackling: 60 + Math.random() * 30,
    speed: 60 + Math.random() * 30,
    endurance: 60 + Math.random() * 30,
    strength: 60 + Math.random() * 30,
    agility: 60 + Math.random() * 30,
  };

  // Boost specific attributes based on position
  switch (positionType) {
    case 'forward':
      base.kicking += 10;
      base.marking += 10;
      break;
    case 'midfielder':
      base.endurance += 15;
      base.speed += 10;
      base.handballing += 5;
      break;
    case 'defender':
      base.tackling += 10;
      base.strength += 10;
      break;
    case 'ruck':
      base.strength += 15;
      base.marking += 10;
      base.endurance += 5;
      break;
  }

  // Cap at 100
  Object.keys(base).forEach((key) => {
    base[key as keyof PlayerAttributes] = Math.min(
      100,
      Math.round(base[key as keyof PlayerAttributes])
    );
  });

  return base;
}

// Helper to create a player
function createPlayer(
  id: string,
  firstName: string,
  lastName: string,
  age: number,
  position: Position,
  number: number,
  positionType: 'forward' | 'midfielder' | 'defender' | 'ruck'
): Player {
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
    disposals: Math.floor(Math.random() * 3000),
    marks: Math.floor(Math.random() * 800),
    tackles: Math.floor(Math.random() * 600),
  };
}

// Common Australian first names
const firstNames = [
  'Jack', 'Tom', 'Charlie', 'Max', 'Harry', 'Lachlan', 'Patrick', 'Luke',
  'Josh', 'Daniel', 'Sam', 'Jake', 'Ryan', 'Toby', 'Ben', 'Matt',
  'Nick', 'Alex', 'Angus', 'Bailey', 'Callum', 'Dylan', 'Ethan', 'Connor'
];

// Common Australian surnames
const lastNames = [
  'Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Anderson',
  'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia',
  'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker',
  'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker',
  'Adams', 'Nelson', 'Hill', 'Mitchell', 'Campbell', 'Ryan', 'Roberts'
];

// Generate a squad of players
function generateSquad(teamId: string, startId: number): Player[] {
  const players: Player[] = [];
  let playerNum = startId;

  // Structure: 6 forwards, 6 midfielders, 6 defenders, 2 rucks, 4 interchange
  const structure = [
    { positions: ['FF', 'CHF', 'FP', 'FP', 'FF', 'CHF'] as Position[], type: 'forward' as const },
    { positions: ['C', 'W', 'W', 'R', 'C', 'W'] as Position[], type: 'midfielder' as const },
    { positions: ['CHB', 'FB', 'BP', 'BP', 'CHB', 'FB'] as Position[], type: 'defender' as const },
    { positions: ['R', 'RR'] as Position[], type: 'ruck' as const },
    { positions: ['INT', 'INT', 'INT', 'INT', 'INT', 'INT'] as Position[], type: 'midfielder' as const },
  ];

  structure.forEach(({ positions, type }) => {
    positions.forEach((position, idx) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const age = 19 + Math.floor(Math.random() * 15); // Age range 19-33
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

// AFL Teams with real team names and colors
export const AFL_TEAMS: Omit<Team, 'players'>[] = [
  { id: 'adelaide', name: 'Adelaide Crows', shortName: 'ADEL', colors: { primary: '#002B5C', secondary: '#FFD100' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'brisbane', name: 'Brisbane Lions', shortName: 'BL', colors: { primary: '#A30046', secondary: '#FDB71A' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'carlton', name: 'Carlton Blues', shortName: 'CARL', colors: { primary: '#0E1E2D', secondary: '#B1CAD8' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'collingwood', name: 'Collingwood Magpies', shortName: 'COLL', colors: { primary: '#000000', secondary: '#FFFFFF' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'essendon', name: 'Essendon Bombers', shortName: 'ESS', colors: { primary: '#CC2031', secondary: '#000000' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'fremantle', name: 'Fremantle Dockers', shortName: 'FRE', colors: { primary: '#2A1A54', secondary: '#FFFFFF' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'geelong', name: 'Geelong Cats', shortName: 'GEEL', colors: { primary: '#001F3B', secondary: '#FFFFFF' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'goldcoast', name: 'Gold Coast Suns', shortName: 'GCFC', colors: { primary: '#CC092F', secondary: '#FFD200' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'gws', name: 'GWS Giants', shortName: 'GWS', colors: { primary: '#F15B2A', secondary: '#2D2926' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'hawthorn', name: 'Hawthorn Hawks', shortName: 'HAW', colors: { primary: '#4D2004', secondary: '#FED500' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'melbourne', name: 'Melbourne Demons', shortName: 'MELB', colors: { primary: '#CC2031', secondary: '#003F87' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'northmelbourne', name: 'North Melbourne Kangaroos', shortName: 'NMFC', colors: { primary: '#003F87', secondary: '#FFFFFF' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'portadelaide', name: 'Port Adelaide Power', shortName: 'PORT', colors: { primary: '#008FA1', secondary: '#000000' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'richmond', name: 'Richmond Tigers', shortName: 'RICH', colors: { primary: '#FFD200', secondary: '#000000' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'stkilda', name: 'St Kilda Saints', shortName: 'STK', colors: { primary: '#ED0F05', secondary: '#FFFFFF' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'sydney', name: 'Sydney Swans', shortName: 'SYD', colors: { primary: '#ED171F', secondary: '#FFFFFF' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'westcoast', name: 'West Coast Eagles', shortName: 'WCE', colors: { primary: '#002B5C', secondary: '#FFC40E' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
  { id: 'westernbulldogs', name: 'Western Bulldogs', shortName: 'WB', colors: { primary: '#014896', secondary: '#ED171F' }, wins: 0, losses: 0, draws: 0, points: 0, percentage: 100 },
];

// Initialize all teams with players
export function initializeTeams(): Team[] {
  return AFL_TEAMS.map((teamData, index) => ({
    ...teamData,
    players: generateSquad(teamData.id, index * 100 + 1),
  }));
}

// AFL Venues
export const AFL_VENUES = [
  'MCG',
  'Marvel Stadium',
  'Adelaide Oval',
  'Optus Stadium',
  'SCG',
  'Gabba',
  'GMHBA Stadium',
  'Blundstone Arena',
  'Metricon Stadium',
  'Giants Stadium',
  'Marvel Stadium',
  'TIO Traeger Park'
];

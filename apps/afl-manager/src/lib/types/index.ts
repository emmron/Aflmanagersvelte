// Player positions in AFL
export type Position =
  | 'FF' | 'CHF' | 'FP'  // Forwards: Full Forward, Center Half Forward, Forward Pocket
  | 'C' | 'W'            // Midfield: Centre, Wing
  | 'CHB' | 'BP' | 'FB'  // Backs: Center Half Back, Back Pocket, Full Back
  | 'R' | 'RR'           // Ruck, Rover, Ruck Rover
  | 'INT';               // Interchange

// Player attributes
export interface PlayerAttributes {
  kicking: number;       // Kicking accuracy and distance (0-100)
  marking: number;       // Ability to take marks (0-100)
  handballing: number;   // Handball accuracy (0-100)
  tackling: number;      // Tackling ability (0-100)
  speed: number;         // Running speed (0-100)
  endurance: number;     // Stamina (0-100)
  strength: number;      // Physical strength (0-100)
  agility: number;       // Agility and evasion (0-100)
}

// Player interface
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  position: Position;
  number: number;
  attributes: PlayerAttributes;

  // Current state
  fitness: number;       // 0-100
  form: number;          // 0-100
  injured: boolean;
  injuryWeeks: number;
  morale: number;        // 0-100

  // Career stats
  gamesPlayed: number;
  goals: number;
  behinds: number;
  disposals: number;
  marks: number;
  tackles: number;
}

// Team interface
export interface Team {
  id: string;
  name: string;
  shortName: string;
  colors: {
    primary: string;
    secondary: string;
  };
  players: Player[];

  // Season stats
  wins: number;
  losses: number;
  draws: number;
  points: number;
  percentage: number;
}

// Match events
export type MatchEventType =
  | 'goal'
  | 'behind'
  | 'mark'
  | 'free_kick'
  | 'tackle'
  | 'boundary'
  | 'quarter_end';

export interface MatchEvent {
  type: MatchEventType;
  quarter: number;
  minute: number;
  teamId: string;
  playerId?: string;
  description: string;
}

// Match stats for a player
export interface PlayerMatchStats {
  playerId: string;
  goals: number;
  behinds: number;
  disposals: number;
  kicks: number;
  handballs: number;
  marks: number;
  tackles: number;
  hitouts: number;
  frees_for: number;
  frees_against: number;
}

// Match result
export interface Match {
  id: string;
  round: number;
  homeTeam: Team;
  awayTeam: Team;

  // Scores
  homeScore: {
    goals: number;
    behinds: number;
    total: number;
  };
  awayScore: {
    goals: number;
    behinds: number;
    total: number;
  };

  // Quarter scores
  quarterScores: {
    home: number[];
    away: number[];
  };

  // Match details
  venue: string;
  completed: boolean;
  currentQuarter: number;

  // Stats
  events: MatchEvent[];
  homeStats: PlayerMatchStats[];
  awayStats: PlayerMatchStats[];
}

// Tactics and strategy
export interface Tactics {
  gameStyle: 'attacking' | 'defensive' | 'balanced';
  forwardPressure: 'high' | 'medium' | 'low';
  ballMovement: 'fast' | 'controlled' | 'slow';
  defendingStyle: 'zone' | 'man-on-man' | 'hybrid';
}

// Season structure
export interface Season {
  year: number;
  currentRound: number;
  totalRounds: number;
  teams: Team[];
  matches: Match[];
  playerTeam: Team;  // The team the player is managing
}

// Game state
export interface GameState {
  season: Season;
  tactics: Tactics;
  selectedMatch?: Match;
  viewingStats: boolean;
}

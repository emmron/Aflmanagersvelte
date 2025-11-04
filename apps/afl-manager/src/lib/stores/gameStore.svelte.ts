import type { Season, Team, Match, Tactics, GameState } from '../types';
import { initializeTeams } from '../data/teams';
import { simulateMatch, updateTeamStats, updatePlayerStats } from '../engine/matchSimulation';

// Create reactive state using Svelte 5 runes
let teamSelected = $state(false);

let gameState = $state<GameState>({
  season: {
    year: 2025,
    currentRound: 1,
    totalRounds: 23,
    teams: initializeTeams(),
    matches: [],
    playerTeam: {} as Team, // Will be set when user selects team
  },
  tactics: {
    gameStyle: 'balanced',
    forwardPressure: 'medium',
    ballMovement: 'controlled',
    defendingStyle: 'hybrid',
  },
  selectedMatch: undefined,
  viewingStats: false,
});

export function getGameState() {
  return gameState;
}

export function isTeamSelected() {
  return teamSelected;
}

// Select team for player to manage
export function selectTeam(teamId: string) {
  const team = gameState.season.teams.find((t) => t.id === teamId);
  if (team) {
    gameState.season.playerTeam = team;
    teamSelected = true;
  }
}

// Generate fixtures for a round (simplified - each team plays once)
export function generateRoundFixtures(round: number): Match[] {
  const teams = [...gameState.season.teams];
  const fixtures: Match[] = [];

  // Shuffle teams
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teams[i], teams[j]] = [teams[j], teams[i]];
  }

  // Create matches (9 matches per round for 18 teams)
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      const isPlayerMatch =
        teams[i].id === gameState.season.playerTeam.id ||
        teams[i + 1].id === gameState.season.playerTeam.id;

      const match: Match = {
        id: `r${round}-${teams[i].id}-${teams[i + 1].id}`,
        round,
        homeTeam: teams[i],
        awayTeam: teams[i + 1],
        homeScore: { goals: 0, behinds: 0, total: 0 },
        awayScore: { goals: 0, behinds: 0, total: 0 },
        quarterScores: { home: [0, 0, 0, 0], away: [0, 0, 0, 0] },
        venue: '',
        completed: false,
        currentQuarter: 0,
        events: [],
        homeStats: [],
        awayStats: [],
      };

      fixtures.push(match);
    }
  }

  return fixtures;
}

// Simulate current round
export function simulateRound() {
  const round = gameState.season.currentRound;

  // Generate fixtures if not already generated
  let roundMatches = gameState.season.matches.filter((m) => m.round === round);

  if (roundMatches.length === 0) {
    roundMatches = generateRoundFixtures(round);
    gameState.season.matches.push(...roundMatches);
  }

  // Simulate all matches
  roundMatches.forEach((match) => {
    const isPlayerHome = match.homeTeam.id === gameState.season.playerTeam.id;
    const isPlayerAway = match.awayTeam.id === gameState.season.playerTeam.id;

    // Use player's tactics if they're playing
    const homeTactics = isPlayerHome ? gameState.tactics : undefined;
    const awayTactics = isPlayerAway ? gameState.tactics : undefined;

    const result = simulateMatch(
      match.homeTeam,
      match.awayTeam,
      round,
      homeTactics,
      awayTactics
    );

    // Update match with results
    Object.assign(match, result);

    // Update team stats
    updateTeamStats(match.homeTeam, match, true);
    updateTeamStats(match.awayTeam, match, false);

    // Update player stats
    updatePlayerStats(match.homeTeam, match.homeStats);
    updatePlayerStats(match.awayTeam, match.awayStats);

    // Store player's match for viewing
    if (isPlayerHome || isPlayerAway) {
      gameState.selectedMatch = match;
    }
  });

  // Move to next round
  if (gameState.season.currentRound < gameState.season.totalRounds) {
    gameState.season.currentRound++;
  }
}

// Get ladder sorted by points and percentage
export function getLadder(): Team[] {
  return [...gameState.season.teams].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.percentage - a.percentage;
  });
}

// Update tactics
export function updateTactics(newTactics: Partial<Tactics>) {
  gameState.tactics = { ...gameState.tactics, ...newTactics };
}

// Get matches for current round
export function getCurrentRoundMatches(): Match[] {
  return gameState.season.matches.filter(
    (m) => m.round === gameState.season.currentRound - 1
  );
}

// Get player's team
export function getPlayerTeam(): Team {
  return gameState.season.playerTeam;
}

// Toggle stats view
export function toggleStatsView() {
  gameState.viewingStats = !gameState.viewingStats;
}

// New season
export function startNewSeason() {
  gameState.season = {
    year: gameState.season.year + 1,
    currentRound: 1,
    totalRounds: 23,
    teams: initializeTeams(),
    matches: [],
    playerTeam: {} as Team,
  };

  // Keep the same team selection
  const teamId = gameState.season.playerTeam.id;
  selectTeam(teamId);
}

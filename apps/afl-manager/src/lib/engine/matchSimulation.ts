import type {
  Match,
  Team,
  Player,
  MatchEvent,
  PlayerMatchStats,
  Tactics,
} from '../types';
import { AFL_VENUES } from '../data/teams';

// Calculate team strength based on player attributes
function calculateTeamStrength(team: Team): number {
  const totalStrength = team.players.reduce((sum, player) => {
    if (player.injured) return sum;

    const attributeSum =
      player.attributes.kicking +
      player.attributes.marking +
      player.attributes.handballing +
      player.attributes.tackling +
      player.attributes.speed +
      player.attributes.endurance +
      player.attributes.strength +
      player.attributes.agility;

    const averageAttribute = attributeSum / 8;
    const playerStrength = averageAttribute * (player.fitness / 100) * (player.form / 100);
    return sum + playerStrength;
  }, 0);

  return totalStrength / team.players.length;
}

// Initialize player stats for a match
function initializePlayerStats(team: Team): PlayerMatchStats[] {
  return team.players.map((player) => ({
    playerId: player.id,
    goals: 0,
    behinds: 0,
    disposals: 0,
    kicks: 0,
    handballs: 0,
    marks: 0,
    tackles: 0,
    hitouts: 0,
    frees_for: 0,
    frees_against: 0,
  }));
}

// Simulate a scoring opportunity
function simulateScoringChance(
  team: Team,
  isHome: boolean,
  events: MatchEvent[],
  quarter: number,
  minute: number,
  stats: PlayerMatchStats[]
): { goals: number; behinds: number } {
  const forwards = team.players.filter(
    (p) => !p.injured && (p.position === 'FF' || p.position === 'CHF' || p.position === 'FP')
  );

  if (forwards.length === 0) return { goals: 0, behinds: 0 };

  const shooter = forwards[Math.floor(Math.random() * forwards.length)];
  const shooterStats = stats.find((s) => s.playerId === shooter.id)!;

  // Calculate success chance based on kicking skill and pressure
  const successChance = (shooter.attributes.kicking / 100) * (shooter.form / 100) * 0.7;

  let goals = 0;
  let behinds = 0;

  if (Math.random() < successChance) {
    // Goal!
    goals = 1;
    shooterStats.goals++;
    events.push({
      type: 'goal',
      quarter,
      minute,
      teamId: team.id,
      playerId: shooter.id,
      description: `GOAL! ${shooter.firstName} ${shooter.lastName}`,
    });
  } else {
    // Behind
    behinds = 1;
    shooterStats.behinds++;
    events.push({
      type: 'behind',
      quarter,
      minute,
      teamId: team.id,
      playerId: shooter.id,
      description: `Behind - ${shooter.firstName} ${shooter.lastName}`,
    });
  }

  shooterStats.kicks++;
  shooterStats.disposals++;

  return { goals, behinds };
}

// Simulate other match events
function simulateMatchEvents(
  homeTeam: Team,
  awayTeam: Team,
  quarter: number,
  minute: number,
  events: MatchEvent[],
  homeStats: PlayerMatchStats[],
  awayStats: PlayerMatchStats[]
) {
  // Random chance for marks, tackles, etc.
  const eventRoll = Math.random();

  if (eventRoll < 0.15) {
    // Mark
    const team = Math.random() < 0.5 ? homeTeam : awayTeam;
    const stats = team === homeTeam ? homeStats : awayStats;
    const markers = team.players.filter(
      (p) => !p.injured && p.attributes.marking > 70
    );

    if (markers.length > 0) {
      const marker = markers[Math.floor(Math.random() * markers.length)];
      const markerStats = stats.find((s) => s.playerId === marker.id)!;
      markerStats.marks++;
      markerStats.disposals++;

      events.push({
        type: 'mark',
        quarter,
        minute,
        teamId: team.id,
        playerId: marker.id,
        description: `Mark - ${marker.firstName} ${marker.lastName}`,
      });
    }
  } else if (eventRoll < 0.25) {
    // Tackle
    const team = Math.random() < 0.5 ? homeTeam : awayTeam;
    const stats = team === homeTeam ? homeStats : awayStats;
    const tacklers = team.players.filter(
      (p) => !p.injured && p.attributes.tackling > 70
    );

    if (tacklers.length > 0) {
      const tackler = tacklers[Math.floor(Math.random() * tacklers.length)];
      const tacklerStats = stats.find((s) => s.playerId === tackler.id)!;
      tacklerStats.tackles++;

      events.push({
        type: 'tackle',
        quarter,
        minute,
        teamId: team.id,
        playerId: tackler.id,
        description: `Tackle - ${tackler.firstName} ${tackler.lastName}`,
      });
    }
  }

  // Random disposals throughout
  [homeTeam, awayTeam].forEach((team, idx) => {
    if (Math.random() < 0.3) {
      const stats = idx === 0 ? homeStats : awayStats;
      const activePlayers = team.players.filter((p) => !p.injured);
      if (activePlayers.length > 0) {
        const player = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        const playerStats = stats.find((s) => s.playerId === player.id)!;

        if (Math.random() < 0.6) {
          playerStats.kicks++;
        } else {
          playerStats.handballs++;
        }
        playerStats.disposals++;
      }
    }
  });
}

// Simulate a quarter
function simulateQuarter(
  homeTeam: Team,
  awayTeam: Team,
  quarter: number,
  events: MatchEvent[],
  homeStats: PlayerMatchStats[],
  awayStats: PlayerMatchStats[],
  homeTactics?: Tactics,
  awayTactics?: Tactics
): { homeScore: number; awayScore: number } {
  let homeGoals = 0;
  let homeBehinds = 0;
  let awayGoals = 0;
  let awayBehinds = 0;

  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);

  // Tactics modifiers
  let homeAttackMod = 1.0;
  let awayAttackMod = 1.0;

  if (homeTactics) {
    homeAttackMod *= homeTactics.gameStyle === 'attacking' ? 1.2 : homeTactics.gameStyle === 'defensive' ? 0.8 : 1.0;
  }
  if (awayTactics) {
    awayAttackMod *= awayTactics.gameStyle === 'attacking' ? 1.2 : awayTactics.gameStyle === 'defensive' ? 0.8 : 1.0;
  }

  const adjustedHomeStrength = homeStrength * homeAttackMod;
  const adjustedAwayStrength = awayStrength * awayAttackMod;
  const totalStrength = adjustedHomeStrength + adjustedAwayStrength;

  // Quarter is approximately 20 minutes of game time
  for (let minute = 1; minute <= 25; minute++) {
    // Determine possession
    const homeHasBall = Math.random() < adjustedHomeStrength / totalStrength;

    // Simulate other events
    simulateMatchEvents(homeTeam, awayTeam, quarter, minute, events, homeStats, awayStats);

    // Scoring chances (roughly every 3-4 minutes)
    if (Math.random() < 0.25) {
      if (homeHasBall) {
        const score = simulateScoringChance(homeTeam, true, events, quarter, minute, homeStats);
        homeGoals += score.goals;
        homeBehinds += score.behinds;
      } else {
        const score = simulateScoringChance(awayTeam, false, events, quarter, minute, awayStats);
        awayGoals += score.goals;
        awayBehinds += score.behinds;
      }
    }
  }

  events.push({
    type: 'quarter_end',
    quarter,
    minute: 0,
    teamId: '',
    description: `End of Quarter ${quarter}`,
  });

  const homeScore = homeGoals * 6 + homeBehinds;
  const awayScore = awayGoals * 6 + awayBehinds;

  return { homeScore, awayScore };
}

// Main match simulation function
export function simulateMatch(
  homeTeam: Team,
  awayTeam: Team,
  round: number,
  homeTactics?: Tactics,
  awayTactics?: Tactics
): Match {
  const events: MatchEvent[] = [];
  const homeStats = initializePlayerStats(homeTeam);
  const awayStats = initializePlayerStats(awayTeam);

  const quarterScores = {
    home: [0, 0, 0, 0],
    away: [0, 0, 0, 0],
  };

  let homeGoals = 0;
  let homeBehinds = 0;
  let awayGoals = 0;
  let awayBehinds = 0;

  // Simulate all 4 quarters
  for (let quarter = 1; quarter <= 4; quarter++) {
    const result = simulateQuarter(
      homeTeam,
      awayTeam,
      quarter,
      events,
      homeStats,
      awayStats,
      homeTactics,
      awayTactics
    );

    quarterScores.home[quarter - 1] = result.homeScore;
    quarterScores.away[quarter - 1] = result.awayScore;
  }

  // Calculate final scores
  const homeTotalScore = quarterScores.home.reduce((a, b) => a + b, 0);
  const awayTotalScore = quarterScores.away.reduce((a, b) => a + b, 0);

  // Calculate goals and behinds from total score
  homeGoals = homeStats.reduce((sum, s) => sum + s.goals, 0);
  homeBehinds = homeStats.reduce((sum, s) => sum + s.behinds, 0);
  awayGoals = awayStats.reduce((sum, s) => sum + s.goals, 0);
  awayBehinds = awayStats.reduce((sum, s) => sum + s.behinds, 0);

  const venue = AFL_VENUES[Math.floor(Math.random() * AFL_VENUES.length)];

  return {
    id: `r${round}-${homeTeam.id}-${awayTeam.id}`,
    round,
    homeTeam,
    awayTeam,
    homeScore: {
      goals: homeGoals,
      behinds: homeBehinds,
      total: homeTotalScore,
    },
    awayScore: {
      goals: awayGoals,
      behinds: awayBehinds,
      total: awayTotalScore,
    },
    quarterScores,
    venue,
    completed: true,
    currentQuarter: 4,
    events,
    homeStats,
    awayStats,
  };
}

// Update team ladder stats after a match
export function updateTeamStats(team: Team, match: Match, isHome: boolean) {
  const teamScore = isHome ? match.homeScore.total : match.awayScore.total;
  const opponentScore = isHome ? match.awayScore.total : match.homeScore.total;

  if (teamScore > opponentScore) {
    team.wins++;
    team.points += 4;
  } else if (teamScore < opponentScore) {
    team.losses++;
  } else {
    team.draws++;
    team.points += 2;
  }

  // Calculate percentage (points for / points against * 100)
  const totalFor = team.wins * 100 + team.draws * 50; // Simplified
  const totalAgainst = team.losses * 100 + team.draws * 50;
  team.percentage = totalAgainst > 0 ? (totalFor / totalAgainst) * 100 : 100;
}

// Update player stats after a match
export function updatePlayerStats(team: Team, stats: PlayerMatchStats[]) {
  stats.forEach((matchStats) => {
    const player = team.players.find((p) => p.id === matchStats.playerId);
    if (player) {
      player.gamesPlayed++;
      player.goals += matchStats.goals;
      player.behinds += matchStats.behinds;
      player.disposals += matchStats.disposals;
      player.marks += matchStats.marks;
      player.tackles += matchStats.tackles;

      // Update form based on performance
      const performance =
        matchStats.goals * 6 +
        matchStats.marks * 2 +
        matchStats.tackles * 2 +
        matchStats.disposals;

      if (performance > 20) {
        player.form = Math.min(100, player.form + 5);
      } else if (performance < 10) {
        player.form = Math.max(0, player.form - 3);
      }
    }
  });
}

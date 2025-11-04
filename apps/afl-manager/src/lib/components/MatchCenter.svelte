<script lang="ts">
  import type { Match, MatchEvent } from '../types';

  interface Props {
    match: Match;
    onClose: () => void;
  }

  let { match, onClose }: Props = $props();

  let selectedTab = $state<'summary' | 'events' | 'stats'>('summary');

  let quarterEvents = $derived(() => {
    const quarters: MatchEvent[][] = [[], [], [], []];
    match.events.forEach(event => {
      if (event.quarter >= 1 && event.quarter <= 4) {
        quarters[event.quarter - 1].push(event);
      }
    });
    return quarters;
  });

  function getEventIcon(type: string): string {
    switch(type) {
      case 'goal': return '⚽';
      case 'behind': return '◉';
      case 'mark': return '✋';
      case 'tackle': return '💪';
      case 'free_kick': return '🚩';
      case 'quarter_end': return '⏱️';
      default: return '•';
    }
  }

  function getEventColor(type: string): string {
    switch(type) {
      case 'goal': return '#00ff88';
      case 'behind': return '#ffaa00';
      case 'mark': return '#00d4ff';
      case 'tackle': return '#ff6b6b';
      case 'free_kick': return '#ffd700';
      default: return '#aaa';
    }
  }

  let topPerformers = $derived(() => {
    const homeStats = [...match.homeStats].sort((a, b) => {
      const aScore = a.goals * 6 + a.disposals + a.marks * 2 + a.tackles * 2;
      const bScore = b.goals * 6 + b.disposals + b.marks * 2 + b.tackles * 2;
      return bScore - aScore;
    }).slice(0, 5);

    const awayStats = [...match.awayStats].sort((a, b) => {
      const aScore = a.goals * 6 + a.disposals + a.marks * 2 + a.tackles * 2;
      const bScore = b.goals * 6 + b.disposals + b.marks * 2 + b.tackles * 2;
      return bScore - aScore;
    }).slice(0, 5);

    return { home: homeStats, away: awayStats };
  });

  function getPlayerName(playerId: string) {
    const player = [...match.homeTeam.players, ...match.awayTeam.players].find(p => p.id === playerId);
    return player ? `${player.firstName[0]}. ${player.lastName}` : 'Unknown';
  }
</script>

<div class="modal-backdrop" onclick={onClose}>
  <div class="match-center" onclick={(e) => e.stopPropagation()}>
    <button class="close-btn" onclick={onClose}>✕</button>

    <div class="match-header">
      <div class="venue-info">
        <span class="venue">{match.venue}</span>
        <span class="round">Round {match.round}</span>
      </div>

      <div class="scoreboard">
        <div class="team-score home">
          <h3>{match.homeTeam.shortName}</h3>
          <div class="score-display">
            <span class="goals">{match.homeScore.goals}</span>
            <span class="sep">.</span>
            <span class="behinds">{match.homeScore.behinds}</span>
            <span class="total">({match.homeScore.total})</span>
          </div>
        </div>

        <div class="vs">VS</div>

        <div class="team-score away">
          <h3>{match.awayTeam.shortName}</h3>
          <div class="score-display">
            <span class="goals">{match.awayScore.goals}</span>
            <span class="sep">.</span>
            <span class="behinds">{match.awayScore.behinds}</span>
            <span class="total">({match.awayScore.total})</span>
          </div>
        </div>
      </div>

      <div class="quarter-breakdown">
        {#each [1, 2, 3, 4] as q}
          <div class="quarter-score">
            <span class="q-label">Q{q}</span>
            <span class="q-scores">
              {match.quarterScores.home[q-1]} - {match.quarterScores.away[q-1]}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <div class="tabs">
      <button
        class:active={selectedTab === 'summary'}
        onclick={() => selectedTab = 'summary'}
      >
        Summary
      </button>
      <button
        class:active={selectedTab === 'events'}
        onclick={() => selectedTab = 'events'}
      >
        Play-by-Play
      </button>
      <button
        class:active={selectedTab === 'stats'}
        onclick={() => selectedTab = 'stats'}
      >
        Player Stats
      </button>
    </div>

    <div class="match-content">
      {#if selectedTab === 'summary'}
        <div class="summary-view">
          <h3>Top Performers</h3>

          <div class="performers-grid">
            <div class="team-performers">
              <h4>{match.homeTeam.shortName}</h4>
              {#each topPerformers.home as stat}
                {@const player = match.homeTeam.players.find(p => p.id === stat.playerId)}
                {#if player}
                  <div class="performer">
                    <span class="player-name">{player.firstName[0]}. {player.lastName}</span>
                    <div class="player-stats">
                      {#if stat.goals > 0}<span class="stat">{stat.goals}G</span>{/if}
                      <span class="stat">{stat.disposals}D</span>
                      <span class="stat">{stat.marks}M</span>
                      <span class="stat">{stat.tackles}T</span>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>

            <div class="team-performers">
              <h4>{match.awayTeam.shortName}</h4>
              {#each topPerformers.away as stat}
                {@const player = match.awayTeam.players.find(p => p.id === stat.playerId)}
                {#if player}
                  <div class="performer">
                    <span class="player-name">{player.firstName[0]}. {player.lastName}</span>
                    <div class="player-stats">
                      {#if stat.goals > 0}<span class="stat">{stat.goals}G</span>{/if}
                      <span class="stat">{stat.disposals}D</span>
                      <span class="stat">{stat.marks}M</span>
                      <span class="stat">{stat.tackles}T</span>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        </div>
      {:else if selectedTab === 'events'}
        <div class="events-view">
          {#each quarterEvents as events, index}
            <div class="quarter-section">
              <h3>Quarter {index + 1}</h3>
              <div class="events-list">
                {#each events as event}
                  <div class="event-item" style="border-left-color: {getEventColor(event.type)}">
                    <span class="event-icon">{getEventIcon(event.type)}</span>
                    <span class="event-time">Q{event.quarter} {event.minute}'</span>
                    <span class="event-desc">{event.description}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="stats-view">
          <div class="stats-comparison">
            <div class="stats-team">
              <h4>{match.homeTeam.shortName}</h4>
              <div class="stats-list">
                {#each match.homeStats as stat}
                  {@const player = match.homeTeam.players.find(p => p.id === stat.playerId)}
                  {#if player && (stat.goals > 0 || stat.disposals > 5)}
                    <div class="stat-row">
                      <span class="stat-player">{player.firstName[0]}. {player.lastName}</span>
                      <span class="stat-value">{stat.goals}G {stat.behinds}B {stat.disposals}D {stat.marks}M {stat.tackles}T</span>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>

            <div class="stats-team">
              <h4>{match.awayTeam.shortName}</h4>
              <div class="stats-list">
                {#each match.awayStats as stat}
                  {@const player = match.awayTeam.players.find(p => p.id === stat.playerId)}
                  {#if player && (stat.goals > 0 || stat.disposals > 5)}
                    <div class="stat-row">
                      <span class="stat-player">{player.firstName[0]}. {player.lastName}</span>
                      <span class="stat-value">{stat.goals}G {stat.behinds}B {stat.disposals}D {stat.marks}M {stat.tackles}T</span>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .match-center {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
    border: 2px solid #00d4ff;
    border-radius: 16px;
    max-width: 1000px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    animation: slideUp 0.3s ease-out;
    box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #ff4444;
    border-color: #ff4444;
    transform: rotate(90deg);
  }

  .match-header {
    padding: 2rem;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 2px solid rgba(0, 212, 255, 0.3);
  }

  .venue-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: #aaa;
  }

  .venue {
    color: #00d4ff;
    font-weight: 600;
  }

  .scoreboard {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .team-score {
    text-align: center;
  }

  .team-score h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.25rem;
    color: #00d4ff;
  }

  .score-display {
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }

  .goals {
    color: #00ff88;
  }

  .behinds {
    color: #ffaa00;
  }

  .sep {
    color: #666;
  }

  .total {
    color: #fff;
    margin-left: 0.5rem;
  }

  .vs {
    font-size: 1.5rem;
    color: #666;
    font-weight: 700;
  }

  .quarter-breakdown {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .quarter-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .q-label {
    font-size: 0.75rem;
    color: #00d4ff;
    font-weight: 600;
  }

  .q-scores {
    font-size: 1rem;
    color: #fff;
  }

  .tabs {
    display: flex;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tabs button {
    flex: 1;
    padding: 1rem;
    background: transparent;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
  }

  .tabs button:hover {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
  }

  .tabs button.active {
    color: #00d4ff;
    border-bottom-color: #00d4ff;
    background: rgba(0, 212, 255, 0.05);
  }

  .match-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  .summary-view h3 {
    margin: 0 0 1.5rem 0;
    color: #00d4ff;
    text-align: center;
  }

  .performers-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .team-performers h4 {
    margin: 0 0 1rem 0;
    color: #00d4ff;
    font-size: 1.125rem;
  }

  .performer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    margin-bottom: 0.5rem;
    border-left: 3px solid #00d4ff;
  }

  .player-name {
    font-weight: 600;
    color: #fff;
  }

  .player-stats {
    display: flex;
    gap: 0.75rem;
  }

  .stat {
    font-size: 0.875rem;
    color: #00ff88;
    font-weight: 600;
  }

  .events-view {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .quarter-section h3 {
    margin: 0 0 1rem 0;
    color: #00d4ff;
  }

  .events-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .event-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    border-left: 3px solid;
  }

  .event-icon {
    font-size: 1.25rem;
  }

  .event-time {
    font-weight: 600;
    color: #00d4ff;
    min-width: 50px;
  }

  .event-desc {
    color: #ccc;
  }

  .stats-view {
    overflow-x: auto;
  }

  .stats-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .stats-team h4 {
    margin: 0 0 1rem 0;
    color: #00d4ff;
    font-size: 1.125rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.875rem;
  }

  .stat-player {
    font-weight: 600;
    color: #fff;
  }

  .stat-value {
    color: #aaa;
  }

  @media (max-width: 768px) {
    .match-center {
      max-height: 95vh;
    }

    .scoreboard {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .vs {
      display: none;
    }

    .performers-grid,
    .stats-comparison {
      grid-template-columns: 1fr;
    }

    .quarter-breakdown {
      gap: 1rem;
    }

    .score-display {
      font-size: 1.5rem;
    }
  }
</style>

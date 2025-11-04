<script lang="ts">
  import { getGameState, getLadder, getCurrentRoundMatches } from '../stores/gameStore.svelte';
  import Ladder from './Ladder.svelte';
  import MatchResults from './MatchResults.svelte';
  import TeamView from './TeamView.svelte';
  import TacticsPanel from './TacticsPanel.svelte';
  import FixturesView from './FixturesView.svelte';
  import StatsLeaders from './StatsLeaders.svelte';
  import MatchCenter from './MatchCenter.svelte';
  import PlayerModal from './PlayerModal.svelte';
  import type { Match, Player } from '../types';

  let gameState = $derived(getGameState());
  let ladder = $derived(getLadder());
  let matches = $derived(getCurrentRoundMatches());

  let activeTab = $state<'overview' | 'team' | 'tactics' | 'ladder' | 'fixtures' | 'stats'>('overview');
  let selectedMatch = $state<Match | null>(null);
  let selectedPlayer = $state<Player | null>(null);
</script>

<div class="dashboard">
  <header class="header">
    <h1>AFL Manager</h1>
    <div class="season-info">
      <span>Season {gameState.season.year}</span>
      <span>Round {gameState.season.currentRound} of {gameState.season.totalRounds}</span>
    </div>
  </header>

  <nav class="tabs">
    <button
      class:active={activeTab === 'overview'}
      onclick={() => activeTab = 'overview'}
    >
      🏠 Overview
    </button>
    <button
      class:active={activeTab === 'team'}
      onclick={() => activeTab = 'team'}
    >
      👥 My Team
    </button>
    <button
      class:active={activeTab === 'tactics'}
      onclick={() => activeTab = 'tactics'}
    >
      📋 Tactics
    </button>
    <button
      class:active={activeTab === 'fixtures'}
      onclick={() => activeTab = 'fixtures'}
    >
      📅 Fixtures
    </button>
    <button
      class:active={activeTab === 'ladder'}
      onclick={() => activeTab = 'ladder'}
    >
      🏆 Ladder
    </button>
    <button
      class:active={activeTab === 'stats'}
      onclick={() => activeTab = 'stats'}
    >
      📊 Leaders
    </button>
  </nav>

  <main class="content">
    {#if activeTab === 'overview'}
      <div class="overview">
        <div class="team-card">
          <h2>{gameState.season.playerTeam.name}</h2>
          <div class="team-stats">
            <div class="stat">
              <span class="stat-label">Wins</span>
              <span class="stat-value">{gameState.season.playerTeam.wins}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Losses</span>
              <span class="stat-value">{gameState.season.playerTeam.losses}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Draws</span>
              <span class="stat-value">{gameState.season.playerTeam.draws}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Points</span>
              <span class="stat-value">{gameState.season.playerTeam.points}</span>
            </div>
          </div>
        </div>

        <div class="recent-matches">
          <h3>Recent Matches</h3>
          <MatchResults matches={matches} onMatchClick={(match) => selectedMatch = match} />
        </div>

        <div class="ladder-preview">
          <h3>Ladder Position</h3>
          <Ladder teams={ladder.slice(0, 8)} />
        </div>
      </div>
    {:else if activeTab === 'team'}
      <TeamView team={gameState.season.playerTeam} onPlayerClick={(player) => selectedPlayer = player} />
    {:else if activeTab === 'tactics'}
      <TacticsPanel />
    {:else if activeTab === 'fixtures'}
      <FixturesView matches={gameState.season.matches} currentRound={gameState.season.currentRound} />
    {:else if activeTab === 'ladder'}
      <Ladder teams={ladder} />
    {:else if activeTab === 'stats'}
      <StatsLeaders teams={gameState.season.teams} />
    {/if}
  </main>

  {#if selectedMatch}
    <MatchCenter match={selectedMatch} onClose={() => selectedMatch = null} />
  {/if}

  {#if selectedPlayer}
    <PlayerModal player={selectedPlayer} onClose={() => selectedPlayer = null} />
  {/if}
</div>

<style>
  .dashboard {
    min-height: 100vh;
    background: linear-gradient(to bottom, #1a1a2e, #0f0f1e);
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .header {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #00d4ff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h1 {
    margin: 0;
    font-size: 2rem;
    color: #00d4ff;
  }

  .season-info {
    display: flex;
    gap: 2rem;
    font-size: 1rem;
    color: #aaa;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid #333;
    overflow-x: auto;
  }

  .tabs button {
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: 1px solid #444;
    color: #aaa;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    white-space: nowrap;
    font-weight: 600;
  }

  .tabs button:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: #00d4ff;
    color: #00d4ff;
  }

  .tabs button.active {
    background: #00d4ff;
    border-color: #00d4ff;
    color: #000;
  }

  .content {
    padding: 2rem;
  }

  .overview {
    display: grid;
    gap: 2rem;
  }

  .team-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .team-card h2 {
    margin: 0 0 1.5rem 0;
    color: #00d4ff;
  }

  .team-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #00d4ff;
  }

  .recent-matches,
  .ladder-preview {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .recent-matches h3,
  .ladder-preview h3 {
    margin: 0 0 1rem 0;
    color: #00d4ff;
  }
</style>

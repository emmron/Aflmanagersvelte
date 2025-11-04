<script lang="ts">
  import type { Match } from '../types';

  interface Props {
    matches: Match[];
  }

  let { matches }: Props = $props();
</script>

<div class="match-results">
  {#if matches.length === 0}
    <p class="no-matches">No matches played yet</p>
  {:else}
    {#each matches as match}
      <div class="match-card">
        <div class="match-header">
          <span class="round">Round {match.round}</span>
          <span class="venue">{match.venue}</span>
        </div>

        <div class="match-body">
          <div class="team">
            <span class="team-name">{match.homeTeam.shortName}</span>
            <span class="score {match.homeScore.total > match.awayScore.total ? 'winner' : ''}">
              {match.homeScore.goals}.{match.homeScore.behinds} ({match.homeScore.total})
            </span>
          </div>

          <div class="vs">vs</div>

          <div class="team">
            <span class="team-name">{match.awayTeam.shortName}</span>
            <span class="score {match.awayScore.total > match.homeScore.total ? 'winner' : ''}">
              {match.awayScore.goals}.{match.awayScore.behinds} ({match.awayScore.total})
            </span>
          </div>
        </div>

        <div class="quarter-scores">
          {#each [1, 2, 3, 4] as quarter}
            <div class="quarter">
              <span class="label">Q{quarter}</span>
              <span>{match.quarterScores.home[quarter - 1]} - {match.quarterScores.away[quarter - 1]}</span>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .match-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .no-matches {
    color: #aaa;
    text-align: center;
    padding: 2rem;
  }

  .match-card {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #444;
    border-radius: 6px;
    padding: 1rem;
  }

  .match-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #aaa;
  }

  .round {
    font-weight: 600;
    color: #00d4ff;
  }

  .match-body {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .team {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .team-name {
    font-weight: 600;
    font-size: 1.125rem;
  }

  .score {
    font-weight: bold;
    font-size: 1.25rem;
    color: #aaa;
  }

  .score.winner {
    color: #00ff88;
  }

  .vs {
    color: #666;
    font-size: 0.875rem;
    text-align: center;
  }

  .quarter-scores {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #333;
  }

  .quarter {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
  }

  .quarter .label {
    color: #aaa;
    font-weight: 600;
  }
</style>

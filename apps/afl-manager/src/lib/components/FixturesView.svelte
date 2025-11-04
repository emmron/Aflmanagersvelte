<script lang="ts">
  import type { Match } from '../types';

  interface Props {
    matches: Match[];
    currentRound: number;
  }

  let { matches, currentRound }: Props = $props();

  let selectedRound = $state(currentRound - 1 || 1);

  let rounds = $derived(() => {
    const roundMap = new Map<number, Match[]>();
    matches.forEach(match => {
      if (!roundMap.has(match.round)) {
        roundMap.set(match.round, []);
      }
      roundMap.get(match.round)!.push(match);
    });
    return roundMap;
  });

  let currentMatches = $derived(rounds.get(selectedRound) || []);
</script>

<div class="fixtures-view">
  <h2>Fixtures & Results</h2>

  <div class="round-selector">
    <button
      class="nav-btn"
      disabled={selectedRound <= 1}
      onclick={() => selectedRound--}
    >
      ←
    </button>

    <div class="round-display">
      <span class="round-label">Round</span>
      <span class="round-number">{selectedRound}</span>
    </div>

    <button
      class="nav-btn"
      disabled={selectedRound >= 23}
      onclick={() => selectedRound++}
    >
      →
    </button>
  </div>

  <div class="matches-container">
    {#if currentMatches.length === 0}
      <div class="no-matches">
        <p>No matches for this round yet</p>
      </div>
    {:else}
      {#each currentMatches as match}
        <div class="match-fixture" class:completed={match.completed}>
          <div class="match-teams">
            <div class="team">
              <span class="team-name">{match.homeTeam.name}</span>
              {#if match.completed}
                <span class="team-score" class:winner={match.homeScore.total > match.awayScore.total}>
                  {match.homeScore.goals}.{match.homeScore.behinds} ({match.homeScore.total})
                </span>
              {/if}
            </div>

            <div class="vs-divider">
              {#if match.completed}
                <span class="final">FINAL</span>
              {:else}
                <span>VS</span>
              {/if}
            </div>

            <div class="team">
              <span class="team-name">{match.awayTeam.name}</span>
              {#if match.completed}
                <span class="team-score" class:winner={match.awayScore.total > match.homeScore.total}>
                  {match.awayScore.goals}.{match.awayScore.behinds} ({match.awayScore.total})
                </span>
              {/if}
            </div>
          </div>

          <div class="match-venue">
            <span>{match.venue}</span>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .fixtures-view {
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .fixtures-view h2 {
    margin: 0 0 2rem 0;
    color: #00d4ff;
    text-align: center;
  }

  .round-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .nav-btn {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
    color: #00d4ff;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover:not(:disabled) {
    background: rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
    transform: scale(1.1);
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .round-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .round-label {
    font-size: 0.875rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .round-number {
    font-size: 3rem;
    font-weight: 900;
    color: #00d4ff;
  }

  .matches-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .no-matches {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .match-fixture {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #444;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.2s;
  }

  .match-fixture:hover {
    border-color: #00d4ff;
    background: rgba(0, 212, 255, 0.05);
  }

  .match-teams {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .team {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .team:last-child {
    align-items: flex-end;
  }

  .team-name {
    font-weight: 600;
    font-size: 1.125rem;
    color: #fff;
  }

  .team-score {
    font-size: 1.5rem;
    font-weight: 700;
    color: #aaa;
  }

  .team-score.winner {
    color: #00ff88;
  }

  .vs-divider {
    color: #666;
    font-weight: 700;
    text-align: center;
  }

  .final {
    color: #00ff88;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .match-venue {
    text-align: center;
    font-size: 0.875rem;
    color: #aaa;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    .match-teams {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .vs-divider {
      order: 2;
    }

    .team:last-child {
      order: 3;
      align-items: flex-start;
    }

    .round-number {
      font-size: 2rem;
    }
  }
</style>

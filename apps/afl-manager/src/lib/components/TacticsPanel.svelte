<script lang="ts">
  import { getGameState, updateTactics } from '../stores/gameStore.svelte';
  import type { Tactics } from '../types';

  let gameState = $derived(getGameState());
  let tactics = $derived(gameState.tactics);

  function handleTacticsChange(field: keyof Tactics, value: string) {
    updateTactics({ [field]: value });
  }
</script>

<div class="tactics-panel">
  <h2>Team Tactics</h2>
  <p class="description">
    Customize your team's playing style and strategy. These settings will affect match outcomes.
  </p>

  <div class="tactics-grid">
    <div class="tactic-group">
      <h3>Game Style</h3>
      <p class="help-text">Overall approach to the game</p>
      <div class="options">
        <button
          class:active={tactics.gameStyle === 'attacking'}
          onclick={() => handleTacticsChange('gameStyle', 'attacking')}
        >
          Attacking
        </button>
        <button
          class:active={tactics.gameStyle === 'balanced'}
          onclick={() => handleTacticsChange('gameStyle', 'balanced')}
        >
          Balanced
        </button>
        <button
          class:active={tactics.gameStyle === 'defensive'}
          onclick={() => handleTacticsChange('gameStyle', 'defensive')}
        >
          Defensive
        </button>
      </div>
      <div class="description-box">
        {#if tactics.gameStyle === 'attacking'}
          <p>Focus on scoring. Higher risk, higher reward.</p>
        {:else if tactics.gameStyle === 'balanced'}
          <p>Equal focus on attack and defense.</p>
        {:else}
          <p>Prioritize defense to limit opponent's scoring.</p>
        {/if}
      </div>
    </div>

    <div class="tactic-group">
      <h3>Forward Pressure</h3>
      <p class="help-text">How aggressively you press in the forward line</p>
      <div class="options">
        <button
          class:active={tactics.forwardPressure === 'high'}
          onclick={() => handleTacticsChange('forwardPressure', 'high')}
        >
          High
        </button>
        <button
          class:active={tactics.forwardPressure === 'medium'}
          onclick={() => handleTacticsChange('forwardPressure', 'medium')}
        >
          Medium
        </button>
        <button
          class:active={tactics.forwardPressure === 'low'}
          onclick={() => handleTacticsChange('forwardPressure', 'low')}
        >
          Low
        </button>
      </div>
      <div class="description-box">
        {#if tactics.forwardPressure === 'high'}
          <p>Aggressive tackling in the forward 50. Higher energy cost.</p>
        {:else if tactics.forwardPressure === 'medium'}
          <p>Moderate pressure on opposition defenders.</p>
        {:else}
          <p>Conserve energy, focus on positioning.</p>
        {/if}
      </div>
    </div>

    <div class="tactic-group">
      <h3>Ball Movement</h3>
      <p class="help-text">Pace of moving the ball forward</p>
      <div class="options">
        <button
          class:active={tactics.ballMovement === 'fast'}
          onclick={() => handleTacticsChange('ballMovement', 'fast')}
        >
          Fast
        </button>
        <button
          class:active={tactics.ballMovement === 'controlled'}
          onclick={() => handleTacticsChange('ballMovement', 'controlled')}
        >
          Controlled
        </button>
        <button
          class:active={tactics.ballMovement === 'slow'}
          onclick={() => handleTacticsChange('ballMovement', 'slow')}
        >
          Slow
        </button>
      </div>
      <div class="description-box">
        {#if tactics.ballMovement === 'fast'}
          <p>Quick kicks and handballs. More turnovers but more scoring chances.</p>
        {:else if tactics.ballMovement === 'controlled'}
          <p>Balanced approach with good field position.</p>
        {:else}
          <p>Possession-based, minimal turnovers but fewer scoring chances.</p>
        {/if}
      </div>
    </div>

    <div class="tactic-group">
      <h3>Defending Style</h3>
      <p class="help-text">How your team defends</p>
      <div class="options">
        <button
          class:active={tactics.defendingStyle === 'zone'}
          onclick={() => handleTacticsChange('defendingStyle', 'zone')}
        >
          Zone
        </button>
        <button
          class:active={tactics.defendingStyle === 'hybrid'}
          onclick={() => handleTacticsChange('defendingStyle', 'hybrid')}
        >
          Hybrid
        </button>
        <button
          class:active={tactics.defendingStyle === 'man-on-man'}
          onclick={() => handleTacticsChange('defendingStyle', 'man-on-man')}
        >
          Man-on-Man
        </button>
      </div>
      <div class="description-box">
        {#if tactics.defendingStyle === 'zone'}
          <p>Defend spaces rather than players. Better against team play.</p>
        {:else if tactics.defendingStyle === 'hybrid'}
          <p>Mix of zone and man-on-man defending.</p>
        {:else}
          <p>Tight marking on individual opponents. Effective against star players.</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .tactics-panel {
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .tactics-panel h2 {
    margin: 0 0 0.5rem 0;
    color: #00d4ff;
  }

  .description {
    color: #aaa;
    margin: 0 0 2rem 0;
  }

  .tactics-grid {
    display: grid;
    gap: 2rem;
  }

  .tactic-group {
    background: rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    border-radius: 6px;
    border: 1px solid #444;
  }

  .tactic-group h3 {
    margin: 0 0 0.25rem 0;
    color: #00d4ff;
  }

  .help-text {
    font-size: 0.875rem;
    color: #888;
    margin: 0 0 1rem 0;
  }

  .options {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .options button {
    flex: 1;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    color: #aaa;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    font-weight: 500;
  }

  .options button:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: #00d4ff;
    color: #00d4ff;
  }

  .options button.active {
    background: #00d4ff;
    border-color: #00d4ff;
    color: #000;
  }

  .description-box {
    background: rgba(0, 212, 255, 0.05);
    border-left: 3px solid #00d4ff;
    padding: 0.75rem;
    border-radius: 3px;
  }

  .description-box p {
    margin: 0;
    font-size: 0.875rem;
    color: #ccc;
  }
</style>

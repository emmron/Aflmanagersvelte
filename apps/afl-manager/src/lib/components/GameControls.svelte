<script lang="ts">
  import { getGameState, simulateRound, startNewSeason } from '../stores/gameStore.svelte';

  let gameState = $derived(getGameState());
  let isSimulating = $state(false);

  async function handleSimulateRound() {
    isSimulating = true;

    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));

    simulateRound();
    isSimulating = false;
  }

  function handleNewSeason() {
    if (confirm('Start a new season? Current progress will be reset.')) {
      startNewSeason();
    }
  }
</script>

<div class="game-controls">
  <div class="round-info">
    <h3>Round {gameState.season.currentRound - 1} Complete</h3>
    <p>Simulate the next round to continue</p>
  </div>

  <div class="buttons">
    <button
      class="simulate-btn"
      onclick={handleSimulateRound}
      disabled={isSimulating || gameState.season.currentRound > gameState.season.totalRounds}
    >
      {#if isSimulating}
        Simulating...
      {:else if gameState.season.currentRound > gameState.season.totalRounds}
        Season Complete
      {:else}
        Simulate Round {gameState.season.currentRound}
      {/if}
    </button>

    {#if gameState.season.currentRound > gameState.season.totalRounds}
      <button class="new-season-btn" onclick={handleNewSeason}>
        Start New Season
      </button>
    {/if}
  </div>

  <div class="progress">
    <div class="progress-bar">
      <div
        class="progress-fill"
        style="width: {((gameState.season.currentRound - 1) / gameState.season.totalRounds) * 100}%"
      ></div>
    </div>
    <span class="progress-text">
      {gameState.season.currentRound - 1} / {gameState.season.totalRounds} rounds
    </span>
  </div>
</div>

<style>
  .game-controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    border-top: 2px solid #00d4ff;
    padding: 1.5rem 2rem;
    z-index: 1000;
  }

  .round-info {
    margin-bottom: 1rem;
  }

  .round-info h3 {
    margin: 0 0 0.25rem 0;
    color: #00d4ff;
    font-size: 1.125rem;
  }

  .round-info p {
    margin: 0;
    color: #aaa;
    font-size: 0.875rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .simulate-btn,
  .new-season-btn {
    flex: 1;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .simulate-btn {
    background: linear-gradient(135deg, #00d4ff, #0099cc);
    color: #000;
  }

  .simulate-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
  }

  .simulate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .new-season-btn {
    background: linear-gradient(135deg, #00ff88, #00cc66);
    color: #000;
  }

  .new-season-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
  }

  .progress {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d4ff, #00ff88);
    transition: width 0.3s ease;
  }

  .progress-text {
    color: #aaa;
    font-size: 0.875rem;
    white-space: nowrap;
  }
</style>

<script lang="ts">
  import type { Team } from '../types';

  interface Props {
    teams: Team[];
  }

  let { teams }: Props = $props();

  let category = $state<'goals' | 'disposals' | 'marks' | 'tackles'>('goals');

  let topPlayers = $derived(() => {
    const allPlayers = teams.flatMap(team =>
      team.players.map(player => ({
        ...player,
        teamName: team.shortName,
        teamColors: team.colors
      }))
    );

    return allPlayers
      .sort((a, b) => b[category] - a[category])
      .slice(0, 20);
  });

  function getCategoryLabel(cat: string): string {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  function getCategoryIcon(cat: string): string {
    switch(cat) {
      case 'goals': return '⚽';
      case 'disposals': return '🏃';
      case 'marks': return '✋';
      case 'tackles': return '💪';
      default: return '📊';
    }
  }
</script>

<div class="stats-leaders">
  <h2>League Leaders</h2>

  <div class="category-tabs">
    <button
      class:active={category === 'goals'}
      onclick={() => category = 'goals'}
    >
      <span class="icon">⚽</span>
      <span>Goals</span>
    </button>
    <button
      class:active={category === 'disposals'}
      onclick={() => category = 'disposals'}
    >
      <span class="icon">🏃</span>
      <span>Disposals</span>
    </button>
    <button
      class:active={category === 'marks'}
      onclick={() => category = 'marks'}
    >
      <span class="icon">✋</span>
      <span>Marks</span>
    </button>
    <button
      class:active={category === 'tackles'}
      onclick={() => category = 'tackles'}
    >
      <span class="icon">💪</span>
      <span>Tackles</span>
    </button>
  </div>

  <div class="leaders-list">
    {#each topPlayers as player, index}
      <div class="leader-item" class:top-three={index < 3}>
        <div class="rank" class:gold={index === 0} class:silver={index === 1} class:bronze={index === 2}>
          {index + 1}
        </div>

        <div class="player-info">
          <div class="player-name">{player.firstName} {player.lastName}</div>
          <div class="player-team">
            <div class="team-colors">
              <div class="color" style="background: {player.teamColors.primary}"></div>
              <div class="color" style="background: {player.teamColors.secondary}"></div>
            </div>
            <span>{player.teamName}</span>
          </div>
        </div>

        <div class="stat-value">
          {player[category]}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .stats-leaders {
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .stats-leaders h2 {
    margin: 0 0 2rem 0;
    color: #00d4ff;
    text-align: center;
  }

  .category-tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .category-tabs button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #444;
    color: #aaa;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .category-tabs button:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: #00d4ff;
    color: #00d4ff;
  }

  .category-tabs button.active {
    background: rgba(0, 212, 255, 0.15);
    border-color: #00d4ff;
    color: #00d4ff;
  }

  .icon {
    font-size: 1.5rem;
  }

  .leaders-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .leader-item {
    display: grid;
    grid-template-columns: 50px 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #444;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .leader-item:hover {
    background: rgba(0, 212, 255, 0.05);
    border-color: #00d4ff;
    transform: translateX(5px);
  }

  .leader-item.top-three {
    border-width: 2px;
  }

  .rank {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    font-weight: 900;
    font-size: 1.125rem;
    color: #fff;
  }

  .rank.gold {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }

  .rank.silver {
    background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
    color: #000;
    box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
  }

  .rank.bronze {
    background: linear-gradient(135deg, #CD7F32, #B87333);
    color: #000;
    box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
  }

  .player-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .player-name {
    font-weight: 700;
    font-size: 1.125rem;
    color: #fff;
  }

  .player-team {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #aaa;
  }

  .team-colors {
    display: flex;
    gap: 2px;
  }

  .color {
    width: 10px;
    height: 16px;
    border-radius: 2px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 900;
    color: #00d4ff;
  }

  @media (max-width: 768px) {
    .category-tabs {
      grid-template-columns: repeat(2, 1fr);
    }

    .leader-item {
      grid-template-columns: 40px 1fr auto;
    }

    .player-name {
      font-size: 1rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }
  }
</style>

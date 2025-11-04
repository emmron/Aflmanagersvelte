<script lang="ts">
  import type { Team, Player } from '../types';

  interface Props {
    team: Team;
    onPlayerClick?: (player: Player) => void;
  }

  let { team, onPlayerClick }: Props = $props();

  let sortBy = $state<'position' | 'name' | 'form' | 'fitness'>('position');

  let sortedPlayers = $derived(() => {
    const players = [...team.players];

    switch (sortBy) {
      case 'name':
        return players.sort((a, b) => a.lastName.localeCompare(b.lastName));
      case 'form':
        return players.sort((a, b) => b.form - a.form);
      case 'fitness':
        return players.sort((a, b) => b.fitness - a.fitness);
      case 'position':
      default:
        const positionOrder = ['FF', 'CHF', 'FP', 'W', 'C', 'R', 'RR', 'CHB', 'BP', 'FB', 'INT'];
        return players.sort((a, b) => {
          const aIndex = positionOrder.indexOf(a.position);
          const bIndex = positionOrder.indexOf(b.position);
          return aIndex - bIndex;
        });
    }
  }());

  function getFormColor(form: number): string {
    if (form >= 80) return '#00ff88';
    if (form >= 60) return '#00d4ff';
    if (form >= 40) return '#ffaa00';
    return '#ff4444';
  }

  function getFitnessColor(fitness: number): string {
    if (fitness >= 90) return '#00ff88';
    if (fitness >= 70) return '#00d4ff';
    if (fitness >= 50) return '#ffaa00';
    return '#ff4444';
  }
</script>

<div class="team-view">
  <div class="team-header">
    <h2>{team.name}</h2>
    <div class="team-colors">
      <div class="color-block" style="background-color: {team.colors.primary}"></div>
      <div class="color-block" style="background-color: {team.colors.secondary}"></div>
    </div>
  </div>

  <div class="controls">
    <label>
      Sort by:
      <select bind:value={sortBy}>
        <option value="position">Position</option>
        <option value="name">Name</option>
        <option value="form">Form</option>
        <option value="fitness">Fitness</option>
      </select>
    </label>
  </div>

  <div class="player-list">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Pos</th>
          <th>Age</th>
          <th>Form</th>
          <th>Fitness</th>
          <th>Games</th>
          <th>Goals</th>
          <th>Disposals</th>
        </tr>
      </thead>
      <tbody>
        {#each sortedPlayers as player}
          <tr
            class:injured={player.injured}
            class:clickable={onPlayerClick}
            onclick={() => onPlayerClick && onPlayerClick(player)}
          >
            <td class="number">{player.number}</td>
            <td class="name">
              {player.firstName} {player.lastName}
              {#if player.injured}
                <span class="injury-badge">INJ</span>
              {/if}
            </td>
            <td>{player.position}</td>
            <td>{player.age}</td>
            <td>
              <div class="stat-bar">
                <div class="bar" style="width: {player.form}%; background-color: {getFormColor(player.form)}"></div>
                <span class="value">{Math.round(player.form)}</span>
              </div>
            </td>
            <td>
              <div class="stat-bar">
                <div class="bar" style="width: {player.fitness}%; background-color: {getFitnessColor(player.fitness)}"></div>
                <span class="value">{Math.round(player.fitness)}</span>
              </div>
            </td>
            <td>{player.gamesPlayed}</td>
            <td>{player.goals}</td>
            <td>{player.disposals}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .team-view {
    background: rgba(255, 255, 255, 0.05);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #333;
  }

  .team-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .team-header h2 {
    margin: 0;
    color: #00d4ff;
  }

  .team-colors {
    display: flex;
    gap: 0.5rem;
  }

  .color-block {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #666;
  }

  .controls {
    margin-bottom: 1.5rem;
  }

  .controls label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #aaa;
  }

  .controls select {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    color: #fff;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .player-list {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: rgba(0, 0, 0, 0.3);
  }

  th {
    padding: 0.75rem;
    text-align: left;
    color: #00d4ff;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #333;
  }

  tr:hover {
    background: rgba(0, 212, 255, 0.05);
  }

  tr.clickable {
    cursor: pointer;
  }

  tr.clickable:hover {
    background: rgba(0, 212, 255, 0.1);
  }

  tr.injured {
    opacity: 0.6;
  }

  .number {
    font-weight: bold;
    color: #00d4ff;
  }

  .name {
    font-weight: 600;
  }

  .injury-badge {
    display: inline-block;
    background: #ff4444;
    color: #fff;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    font-size: 0.625rem;
    font-weight: bold;
    margin-left: 0.5rem;
  }

  .stat-bar {
    position: relative;
    width: 80px;
    height: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transition: width 0.3s;
  }

  .value {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.75rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 50px;
  }

  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4),
  th:nth-child(7),
  td:nth-child(7),
  th:nth-child(8),
  td:nth-child(8),
  th:nth-child(9),
  td:nth-child(9) {
    text-align: center;
  }
</style>

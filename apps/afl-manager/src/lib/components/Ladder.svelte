<script lang="ts">
  import type { Team } from '../types';

  interface Props {
    teams: Team[];
  }

  let { teams }: Props = $props();
</script>

<div class="ladder">
  <table>
    <thead>
      <tr>
        <th>Pos</th>
        <th>Team</th>
        <th>W</th>
        <th>L</th>
        <th>D</th>
        <th>Pts</th>
        <th>%</th>
      </tr>
    </thead>
    <tbody>
      {#each teams as team, index}
        <tr>
          <td class="pos">{index + 1}</td>
          <td class="team-name">
            <div class="team-colors">
              <div class="color" style="background-color: {team.colors.primary}"></div>
              <div class="color" style="background-color: {team.colors.secondary}"></div>
            </div>
            {team.name}
          </td>
          <td>{team.wins}</td>
          <td>{team.losses}</td>
          <td>{team.draws}</td>
          <td class="points">{team.points}</td>
          <td>{team.percentage.toFixed(1)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .ladder {
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

  .pos {
    font-weight: bold;
    color: #00d4ff;
  }

  .team-name {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .team-colors {
    display: flex;
    gap: 2px;
  }

  .color {
    width: 12px;
    height: 24px;
    border-radius: 2px;
  }

  .points {
    font-weight: bold;
    color: #00d4ff;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 50px;
  }

  th:nth-child(3),
  th:nth-child(4),
  th:nth-child(5),
  th:nth-child(6),
  th:nth-child(7),
  td:nth-child(3),
  td:nth-child(4),
  td:nth-child(5),
  td:nth-child(6),
  td:nth-child(7) {
    text-align: center;
  }
</style>

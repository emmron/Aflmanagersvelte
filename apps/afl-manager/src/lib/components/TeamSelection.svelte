<script lang="ts">
  import type { Team } from '../types';
  import { AFL_TEAMS } from '../data/teams';

  interface Props {
    onSelectTeam: (teamId: string) => void;
  }

  let { onSelectTeam }: Props = $props();

  let searchQuery = $state('');
  let hoveredTeam = $state<string | null>(null);

  let filteredTeams = $derived(
    AFL_TEAMS.filter(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.shortName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function handleTeamSelect(teamId: string) {
    // Add a small delay for animation
    setTimeout(() => {
      onSelectTeam(teamId);
    }, 300);
  }
</script>

<div class="team-selection-screen">
  <div class="hero">
    <h1 class="title">AFL MANAGER</h1>
    <p class="subtitle">Choose Your Team</p>
    <div class="search-box">
      <input
        type="text"
        placeholder="Search teams..."
        bind:value={searchQuery}
      />
    </div>
  </div>

  <div class="teams-grid">
    {#each filteredTeams as team}
      <button
        class="team-card"
        class:hovered={hoveredTeam === team.id}
        onclick={() => handleTeamSelect(team.id)}
        onmouseenter={() => hoveredTeam = team.id}
        onmouseleave={() => hoveredTeam = null}
      >
        <div class="team-colors-bg">
          <div class="color-stripe" style="background: {team.colors.primary}"></div>
          <div class="color-stripe" style="background: {team.colors.secondary}"></div>
        </div>

        <div class="team-content">
          <h3 class="team-name">{team.name}</h3>
          <span class="team-short">{team.shortName}</span>
        </div>

        <div class="select-arrow">→</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .team-selection-screen {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%);
    padding: 2rem;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .hero {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
  }

  .title {
    font-size: 4rem;
    font-weight: 900;
    margin: 0;
    background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.1em;
    text-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
    animation: titleGlow 2s ease-in-out infinite alternate;
  }

  @keyframes titleGlow {
    from { filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.5)); }
    to { filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.5)); }
  }

  .subtitle {
    font-size: 1.5rem;
    color: #aaa;
    margin: 1rem 0 2rem 0;
    letter-spacing: 0.05em;
  }

  .search-box {
    max-width: 500px;
    margin: 0 auto;
  }

  .search-box input {
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(0, 212, 255, 0.3);
    border-radius: 50px;
    color: #fff;
    outline: none;
    transition: all 0.3s;
  }

  .search-box input:focus {
    border-color: #00d4ff;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  .teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .team-card {
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 150px;
  }

  .team-card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: #00d4ff;
    box-shadow: 0 12px 40px rgba(0, 212, 255, 0.4);
    background: rgba(0, 212, 255, 0.05);
  }

  .team-colors-bg {
    position: absolute;
    inset: 0;
    display: flex;
    opacity: 0.15;
    transition: opacity 0.3s;
  }

  .team-card:hover .team-colors-bg {
    opacity: 0.25;
  }

  .color-stripe {
    flex: 1;
  }

  .team-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 1.5rem;
    gap: 0.5rem;
  }

  .team-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #fff;
    text-align: center;
    transition: all 0.3s;
  }

  .team-card:hover .team-name {
    color: #00d4ff;
    transform: scale(1.05);
  }

  .team-short {
    font-size: 1rem;
    color: #888;
    font-weight: 600;
    letter-spacing: 0.1em;
  }

  .select-arrow {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%) translateX(10px);
    font-size: 2rem;
    color: #00d4ff;
    opacity: 0;
    transition: all 0.3s;
  }

  .team-card:hover .select-arrow {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  @media (max-width: 768px) {
    .title {
      font-size: 2.5rem;
    }

    .teams-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .team-card {
      height: 120px;
    }

    .team-name {
      font-size: 1.25rem;
    }
  }
</style>

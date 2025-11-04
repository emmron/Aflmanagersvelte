<script lang="ts">
  import { isTeamSelected, selectTeam } from '../lib/stores/gameStore.svelte';
  import TeamSelection from '../lib/components/TeamSelection.svelte';
  import Dashboard from '../lib/components/Dashboard.svelte';
  import GameControls from '../lib/components/GameControls.svelte';

  let teamSelected = $derived(isTeamSelected());
</script>

<svelte:head>
  <title>AFL Manager</title>
</svelte:head>

{#if !teamSelected}
  <TeamSelection onSelectTeam={selectTeam} />
{:else}
  <div class="app">
    <Dashboard />
    <GameControls />
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: #0a0a1a;
    color: #fff;
    overflow-x: hidden;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(::-webkit-scrollbar) {
    width: 10px;
    height: 10px;
  }

  :global(::-webkit-scrollbar-track) {
    background: rgba(0, 0, 0, 0.2);
  }

  :global(::-webkit-scrollbar-thumb) {
    background: rgba(0, 212, 255, 0.3);
    border-radius: 5px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: rgba(0, 212, 255, 0.5);
  }

  :global {
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  }

  .app {
    padding-bottom: 200px; /* Space for fixed game controls */
    animation: slideIn 0.5s ease-out;
  }
</style>

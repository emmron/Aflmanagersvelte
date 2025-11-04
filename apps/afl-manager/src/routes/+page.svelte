<script lang="ts">
  import Dashboard from '../lib/components/Dashboard.svelte';
  import GameControls from '../lib/components/GameControls.svelte';
</script>

<svelte:head>
  <title>AFL Manager</title>
</svelte:head>

<div class="app">
  <Dashboard />
  <GameControls />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app {
    padding-bottom: 200px; /* Space for fixed game controls */
  }
</style>

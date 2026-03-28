<script lang="ts">
  interface Props {
    onclose: () => void;
  }

  let { onclose }: Props = $props();

  interface LogEntry {
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
  }

  let logs: LogEntry[] = $state([]);
  let filter: 'all' | 'info' | 'warn' | 'error' = $state('all');
  let autoScroll = $state(true);
  let scrollContainer: HTMLDivElement | undefined = $state();

  let filteredLogs = $derived(
    filter === 'all' ? logs : logs.filter((l) => l.level === filter)
  );

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };

  function capture(level: LogEntry['level'], args: any[]) {
    const message = args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ');
    logs.push({ timestamp: Date.now(), level, message });

    if (autoScroll && scrollContainer) {
      requestAnimationFrame(() => {
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      });
    }
  }

  console.log = (...args: any[]) => {
    originalConsole.log(...args);
    capture('info', args);
  };
  console.warn = (...args: any[]) => {
    originalConsole.warn(...args);
    capture('warn', args);
  };
  console.error = (...args: any[]) => {
    originalConsole.error(...args);
    capture('error', args);
  };

  function clearLogs() {
    logs = [];
  }

  function downloadLogs() {
    const content = filteredLogs
      .map((l) => `[${new Date(l.timestamp).toISOString()}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString(undefined, { hour12: false, fractionalSecondDigits: 3 });
  }

  // Restore console on destroy
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });
</script>

<div class="flex flex-col h-full w-full bg-base-900 text-base-200">
  <div class="flex items-center justify-between p-2 px-4 bg-base-800 border-b border-base-700">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium">Logs</span>
      <span class="text-xs text-base-400">({filteredLogs.length})</span>
    </div>
    <div class="flex items-center gap-2">
      <select
        bind:value={filter}
        class="text-xs bg-base-700 border border-base-600 rounded px-2 py-1"
      >
        <option value="all">All</option>
        <option value="info">Info</option>
        <option value="warn">Warnings</option>
        <option value="error">Errors</option>
      </select>
      <label class="flex items-center gap-1 text-xs text-base-400">
        <input type="checkbox" bind:checked={autoScroll} class="w-3 h-3" />
        Auto-scroll
      </label>
      <button onclick={downloadLogs} class="btn-outline text-xs !px-2 !py-1" title="Download logs">
        Download
      </button>
      <button onclick={clearLogs} class="btn-outline text-xs !px-2 !py-1" title="Clear logs">
        Clear
      </button>
      <button onclick={onclose} class="btn-outline text-xs !px-2 !py-1" title="Close">
        Close
      </button>
    </div>
  </div>

  <div bind:this={scrollContainer} class="flex-1 overflow-y-auto overflow-x-hidden font-mono text-xs p-2">
    {#if filteredLogs.length === 0}
      <p class="text-base-500 text-center py-8">No logs to display.</p>
    {:else}
      {#each filteredLogs as log}
        <div
          class="flex gap-2 py-0.5 px-1 hover:bg-base-800 rounded"
          class:text-base-400={log.level === 'info'}
          class:text-amber-400={log.level === 'warn'}
          class:text-red-400={log.level === 'error'}
        >
          <span class="text-base-600 shrink-0">{formatTime(log.timestamp)}</span>
          <span class="shrink-0 w-12 uppercase">{log.level}</span>
          <pre class="whitespace-pre-wrap break-all flex-1">{log.message}</pre>
        </div>
      {/each}
    {/if}
  </div>
</div>

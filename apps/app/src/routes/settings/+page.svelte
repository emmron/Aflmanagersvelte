<script lang="ts">
  import { focus_trap, TOAST_SETTINGS } from 'roguelighter-core';
  import { PUBLIC_APP_VERSION } from '$env/static/public';
  import toast from '$lib/svelte-french-toast/core/toast.js';

  // Keybinding settings
  let switchViewKey = $state('Ctrl + KeyT');
  let saveKey = $state('Ctrl + KeyS');
  let editingKey = $state<string | null>(null);

  function startEditing(key: string) {
    editingKey = key;
  }

  function stopEditing() {
    editingKey = null;
  }

  function handle(e: KeyboardEvent) {
    if (!editingKey) return;

    e.preventDefault();
    e.stopPropagation();

    let prefix = '';
    if (e.ctrlKey) prefix += 'Ctrl + ';
    if (e.shiftKey) prefix += 'Shift + ';
    if (e.altKey) prefix += 'Alt + ';

    const newValue = prefix + e.code;

    if (editingKey === 'switchView') {
      switchViewKey = newValue;
    } else if (editingKey === 'save') {
      saveKey = newValue;
    }

    editingKey = null;
    toast.success('Keybinding updated', TOAST_SETTINGS);
  }

  function handleClickOutside() {
    if (editingKey) {
      editingKey = null;
    }
  }
</script>

<svelte:window onkeydown={handle} onclick={handleClickOutside} />

<main class="w-full h-full flex flex-col items-center overflow-y-auto">
  <div class="w-full max-w-xl p-4">
    <div class="flex flex-row items-center justify-between mb-6">
      <h3>Settings</h3>
      <a
        href="/"
        aria-label="Back to home"
        class="p-2 rounded hover:bg-base-700 duration-150 ease-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6 hover:text-emerald-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </a>
    </div>

    <!-- Keybindings Section -->
    <section class="mb-8">
      <h4 class="text-base-300 text-sm uppercase tracking-wide mb-3">Keybindings</h4>

      <div class="flex flex-col gap-2">
        <!-- Switch View Keybinding -->
        <div
          class="flex flex-row gap-2 bg-base-800 items-center p-4 w-full justify-between rounded"
        >
          <span>Switch View (Code/Scene/Game)</span>
          <div class="flex items-center gap-2">
            <button
              onclick={(e) => { e.stopPropagation(); startEditing('switchView'); }}
              use:focus_trap={editingKey === 'switchView'}
              class:border-amber-400={editingKey === 'switchView'}
              class:border-transparent={editingKey !== 'switchView'}
              class="border px-3 py-1 rounded bg-base-700 hover:bg-base-600 min-w-[120px] text-center"
            >
              {editingKey === 'switchView' ? 'Press a key...' : switchViewKey}
            </button>
          </div>
        </div>

        <!-- Save Keybinding -->
        <div
          class="flex flex-row gap-2 bg-base-800 items-center p-4 w-full justify-between rounded"
        >
          <span>Save Project</span>
          <div class="flex items-center gap-2">
            <button
              onclick={(e) => { e.stopPropagation(); startEditing('save'); }}
              use:focus_trap={editingKey === 'save'}
              class:border-amber-400={editingKey === 'save'}
              class:border-transparent={editingKey !== 'save'}
              class="border px-3 py-1 rounded bg-base-700 hover:bg-base-600 min-w-[120px] text-center"
            >
              {editingKey === 'save' ? 'Press a key...' : saveKey}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="mt-auto pt-8 border-t border-base-700">
      <h4 class="text-base-300 text-sm uppercase tracking-wide mb-3">About</h4>

      <div class="bg-base-800 rounded p-4 flex flex-col gap-2">
        <div class="flex justify-between">
          <span class="text-base-400">Version</span>
          <span>{PUBLIC_APP_VERSION}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-base-400">Engine</span>
          <span>Roguelighter</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-base-400">Source Code</span>
          <a
            href="https://github.com/roguelighterengine/roguelighter"
            target="_blank"
            rel="noopener noreferrer"
            class="text-emerald-400 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</main>

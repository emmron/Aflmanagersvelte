<script lang="ts">
  import type { RoguelighterProject } from '../types/engine';
  import { DEFAULT_MAP_WIDTH, DEFAULT_CAMERA_ZOOM } from '../constants';

  interface Props {
    project: RoguelighterProject;
    onclose: () => void;
    onsave: () => void;
  }

  let { project = $bindable(), onclose, onsave }: Props = $props();

  let startingSceneId = $state(project.starting_scene_id);
  let scenes = $derived(Array.from(project.scenes.entries()));

  function save() {
    project.starting_scene_id = startingSceneId;
    onsave();
  }
</script>

<div class="flex flex-col h-full w-full bg-base-900 text-base-200">
  <div class="flex items-center justify-between p-2 px-4 bg-base-800 border-b border-base-700">
    <span class="text-sm font-medium">Project Options</span>
    <div class="flex items-center gap-2">
      <button onclick={() => { save(); onclose(); }} class="btn-outline text-xs !px-2 !py-1">
        Save & Close
      </button>
      <button onclick={onclose} class="btn-outline text-xs !px-2 !py-1">
        Close
      </button>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto p-4">
    <div class="max-w-md flex flex-col gap-6">
      <!-- Project Info -->
      <section>
        <h4 class="text-base-300 text-sm uppercase tracking-wide mb-3">Project</h4>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label for="project-name" class="text-xs text-base-400">Name</label>
            <input
              id="project-name"
              type="text"
              value={project.name}
              disabled
              class="bg-base-800 border border-base-700 rounded px-3 py-2 text-sm opacity-60"
            />
          </div>
        </div>
      </section>

      <!-- Scene Settings -->
      <section>
        <h4 class="text-base-300 text-sm uppercase tracking-wide mb-3">Scenes</h4>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label for="starting-scene" class="text-xs text-base-400">Starting Scene</label>
            <select
              id="starting-scene"
              bind:value={startingSceneId}
              class="bg-base-800 border border-base-700 rounded px-3 py-2 text-sm"
            >
              {#each scenes as [id, scene]}
                <option value={id}>{scene.name || `Scene ${id}`}</option>
              {/each}
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs text-base-400">Total Scenes</span>
            <span class="text-sm">{project.scenes.size}</span>
          </div>
        </div>
      </section>

      <!-- Keyboard Shortcuts Reference -->
      <section>
        <h4 class="text-base-300 text-sm uppercase tracking-wide mb-3">Keyboard Shortcuts</h4>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between bg-base-800 rounded px-3 py-2">
            <span class="text-sm">Switch Scene/Game</span>
            <kbd class="text-xs bg-base-700 px-2 py-0.5 rounded">Ctrl + T</kbd>
          </div>
          <div class="flex justify-between bg-base-800 rounded px-3 py-2">
            <span class="text-sm">Save Project</span>
            <kbd class="text-xs bg-base-700 px-2 py-0.5 rounded">Ctrl + S</kbd>
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

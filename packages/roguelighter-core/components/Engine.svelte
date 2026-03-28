<script lang="ts">
  import JSON5 from 'json5';
  import CodeEditor from './ide/CodeEditor.svelte';
  import SceneEditor from './editor/SceneEditor.svelte';
  import Game from './game/Game.svelte';
  import Logs from './Logs.svelte';
  import Options from './Options.svelte';
  import {
    code_string_to_json,
    generate_asset_urls,
    process_entries_recursively,
    extract_tailwind_classes
  } from '../utils';
  import { DEFAULT_SCENE_ID, EXPORT_DIR, MAPS, PROJECTS_DIR, baseDir } from '../constants';
  import { exit } from '@tauri-apps/plugin-process';
  import { readDir, watchImmediate, writeTextFile } from '@tauri-apps/plugin-fs';
  import { join } from '@tauri-apps/api/path';
  import { Command } from '@tauri-apps/plugin-shell';
  import type { OnError, ParseErrorObject, RoguelighterProject } from '../types/engine';
  import type { RoguelighterDataFile, View } from '../types/engine';
  import type { Setup } from '../types/game';
  import { onDestroy } from 'svelte';

  interface Props {
    DEV?: boolean;
    isWeb?: boolean;
    project: RoguelighterProject;
    document_path: string;
    process_classes: Function;
    exportCSS: Function;
    on_error: OnError;
  }

  let {
    project = $bindable(),
    DEV = true,
    isWeb = false,
    document_path,
    process_classes,
    exportCSS,
    on_error
  }: Props = $props();
  let current_scene_id = $state(DEFAULT_SCENE_ID);

  let view: View = $state('code');
  let previousView: View = $state('scene');
  let code_button: HTMLButtonElement | undefined = $state();
  let scene_button: HTMLButtonElement | undefined = $state();
  // @ts-expect-error
  let agents: Setup['agents'] = $state();
  let code_editor: any = $state();
  let initialized = $state(false);
  let exporting = $state(false);
  let show_options = $state(false);
  let export_status = $state('');
  let code_with_errors = $state('');
  let error_line = $state(0);
  let parse_errors: ParseErrorObject = $state({ code: '', json_string: '', error: '' });
  let agents_file_path = '';
  let bg_file_path = '';
  let bg_entries, agents_entries;

  function switch_to_game() {
    let current_scene = project.scenes.get(current_scene_id);

    if (view == 'scene') {
      if (!current_scene) {
        on_error('NO_SCENE_IS_SELECTED', '');
        return;
      }
    }

    change_view('game');
  }

  function handle(e: KeyboardEvent) {
    if (e.ctrlKey) {
      switch (e.code) {
        case 'KeyT': {
          if (view == 'scene') {
            switch_to_game();
          } else if (view == 'game') {
            view = 'scene';
          }
          break;
        }
        case 'KeyS': {
          code_editor.format_document();
          recalculate();
          save_file();
          break;
        }
      }
    }
  }

  let bg_asset_urls = $state(new Map<string, string>());
  let agent_asset_urls = $state(new Map<string, any>());

  export function save_file(code?: string) {
    let scenes = structuredClone(project.scenes);

    for (let scene of scenes.values()) {
      for (let map of MAPS) {
        // @ts-expect-error
        scene[map] = Array.from(scene[map]);
      }
    }

    let obj: RoguelighterDataFile = {
      code: code || project.code,
      scenes: Array.from(scenes),
      starting_scene_id: project.starting_scene_id,
      scene_index: project.scene_index
    };
    let file_contents = JSON5.stringify(obj);

    writeTextFile(`${PROJECTS_DIR}\\${project.name}\\data.json`, file_contents, {
      baseDir
    });
  }

  const commands: Array<string> = [
    // # Create Roguelighter Exports/cache
    // # git clone --filter=blob:none --sparse https://github.com/roguelighter
    // # git sparse-checkout add apps/export-app
    // # npm i
    // # git sparse-checkout add packages/roguelighter-core
    // # manipulate apps/export-app/src/routes/+page.svelte to match the project (reset every time)
    // # delete everything in static, copy assets from original project to static, generate asset_urls
    // # get to the root of export-app
    // # npm run tauri build
    // # wait for build
    // # cd src-tauri/target/release
    // # copy roguelighter-export-app.exe to Roguelighter Projects/[project]/export/[platform]
    'export'
    // 'export'
  ];

  async function copy_assets(source_path: string, dest_path: string) {
    try {
      // Use platform-appropriate copy command
      const isWindows = navigator.userAgent.includes('Windows');
      let copyCommand: ReturnType<typeof Command.create>;

      if (isWindows) {
        copyCommand = Command.create('cmd', ['/C', `xcopy "${source_path}" "${dest_path}" /E /I /Y`], {
          encoding: 'utf-8'
        });
      } else {
        copyCommand = Command.create('sh', ['-c', `cp -r "${source_path}"/* "${dest_path}/"`], {
          encoding: 'utf-8'
        });
      }

      await copyCommand.execute();
    } catch (e) {
      console.error('Failed to copy assets:', e);
      throw e;
    }
  }

  async function export_game() {
    if (exporting || isWeb) return;

    exporting = true;
    export_status = 'Saving project...';

    try {
      // First save the current state
      save_file();

      const project_path = await join(document_path, `${PROJECTS_DIR}/${project.name}`);
      const export_path = await join(document_path, EXPORT_DIR);
      const export_project_path = await join(export_path, project.name);

      export_status = 'Creating export directory...';

      const isWindows = navigator.userAgent.includes('Windows');
      const bat_name = isWindows ? 'export.bat' : 'export.sh';

      // Create export script content based on platform
      let script_content: string;

      if (isWindows) {
        script_content = `@echo off
cd /d "${document_path}"

if not exist "${EXPORT_DIR}" (
  mkdir "${EXPORT_DIR}"
)

cd "${EXPORT_DIR}"

if not exist "${project.name}" (
  git clone --filter=blob:none --sparse https://github.com/roguelighterengine/roguelighter "${project.name}"
  cd "${project.name}"
  git sparse-checkout add apps/export-app
  git sparse-checkout add packages/roguelighter-core
) else (
  cd "${project.name}"
  git pull
)

call npm install
cd apps\\export-app
call npm install

if not exist "static\\assets" mkdir "static\\assets"
xcopy "${project_path}\\assets" "static\\assets" /E /I /Y

copy "${project_path}\\data.json" "src\\lib\\data.json" /Y

call npm run build

echo.
echo Export completed! Check ${export_project_path}\\apps\\export-app\\build
pause
`;
      } else {
        script_content = `#!/bin/bash
cd "${document_path}"

mkdir -p "${EXPORT_DIR}"
cd "${EXPORT_DIR}"

if [ ! -d "${project.name}" ]; then
  git clone --filter=blob:none --sparse https://github.com/roguelighterengine/roguelighter "${project.name}"
  cd "${project.name}"
  git sparse-checkout add apps/export-app
  git sparse-checkout add packages/roguelighter-core
else
  cd "${project.name}"
  git pull
fi

npm install
cd apps/export-app
npm install

mkdir -p static/assets
cp -r "${project_path}/assets/"* static/assets/

cp "${project_path}/data.json" src/lib/data.json

npm run build

echo ""
echo "Export completed! Check ${export_project_path}/apps/export-app/build"
`;
      }

      export_status = 'Writing export script...';
      await writeTextFile(`${project_path}/${bat_name}`, script_content);

      export_status = 'Starting export process...';

      // Execute the export script
      let exportCommand: ReturnType<typeof Command.create>;

      if (isWindows) {
        exportCommand = Command.create('cmd', ['/C', `"${project_path}\\${bat_name}"`], {
          cwd: project_path,
          encoding: 'utf-8'
        });
      } else {
        // Make script executable first
        await Command.create('sh', ['-c', `chmod +x "${project_path}/${bat_name}"`], {
          encoding: 'utf-8'
        }).execute();

        exportCommand = Command.create('sh', ['-c', `"${project_path}/${bat_name}"`], {
          cwd: project_path,
          encoding: 'utf-8'
        });
      }

      exportCommand.on('close', (data) => {
        if (data.code === 0) {
          export_status = 'Export completed successfully!';
        } else {
          export_status = `Export finished with code ${data.code}`;
        }
        setTimeout(() => {
          exporting = false;
          export_status = '';
        }, 3000);
      });

      exportCommand.on('error', (error) => {
        console.error(`Export error: "${error}"`);
        export_status = `Export failed: ${error}`;
        setTimeout(() => {
          exporting = false;
          export_status = '';
        }, 3000);
      });

      exportCommand.stdout.on('data', (line) => {
        console.log(`export stdout: "${line}"`);
        if (line.trim()) {
          export_status = line.trim().slice(0, 50);
        }
      });

      exportCommand.stderr.on('data', (line) => {
        console.log(`export stderr: "${line}"`);
      });

      await exportCommand.execute();

    } catch (e) {
      console.error('Export failed:', e);
      export_status = `Export failed: ${e}`;
      setTimeout(() => {
        exporting = false;
        export_status = '';
      }, 3000);
    }
  }

  async function recalculate() {
    let parsed = code_string_to_json(project.code);
    if (!parsed) throw new Error('Parsing result is undefined');

    if ((parsed as ParseErrorObject).error) {
      parse_errors = parsed as ParseErrorObject;
      code_with_errors = (parsed as ParseErrorObject).code;
      error_line = parseInt(parse_errors.error?.split('at')[1]?.split(':')[0]) || 0;
      return;
    }

    const extracted_classes = extract_tailwind_classes(JSON5.stringify((parsed as Setup).gui));
    // console.log(extracted_classes);
    process_classes(extracted_classes);
    // console.log(exportCSS());

    [agent_asset_urls, bg_asset_urls] = await Promise.all([
      generate_asset_urls(project.name, 'agents', document_path),
      generate_asset_urls(project.name, 'backgrounds', document_path)
    ]);
    agents = (parsed as Setup).agents;
    initialized = true;
  }

  function change_view(v: View) {
    previousView = view;
    view = v;
    save_file();
    recalculate();
  }

  function highlight(pre: HTMLPreElement) {
    const lines = pre.textContent?.split('\n');
    if (!lines || !parse_errors.error || !parse_errors.error.includes('at')) return;

    let line_number = parseInt(parse_errors?.error?.split('at')[1].split(':')[0]) || 0;

    const line = lines[line_number - 1];

    if (line) {
      let text = pre.innerHTML?.replace(
        line,
        `<span id="error" class="bg-red-600 w-full">${line}</span>`
      );
      pre.innerHTML = text;
    }
  }

  function unfocus_from_code_editor() {
    code_button?.focus();
  }

  function unfocus_from_scene_editor() {
    scene_button?.focus();
  }

  let unwatch: any;

  (async () => {
    if (!isWeb) {
      agents_file_path = await join(
        document_path as string,
        `${PROJECTS_DIR}/${project.name}/assets/agents`
      );
      bg_file_path = await join(
        document_path as string,
        `${PROJECTS_DIR}/${project.name}/assets/backgrounds`
      );
    }

    unwatch = await watchImmediate(
      [bg_file_path, agents_file_path],
      async () => {
        if (code_editor) {
          [bg_entries, agents_entries] = await Promise.all([
            process_entries_recursively(bg_file_path, await readDir(bg_file_path), 'backgrounds'),
            process_entries_recursively(agents_file_path, await readDir(agents_file_path), 'agents')
          ]);

          code_editor.process_and_update(bg_entries, agents_entries);
        }
      },
      {
        recursive: true
      }
    );
  })();
  onDestroy(() => unwatch());

  recalculate();
</script>

<svelte:window onkeydown={handle} />

{#if initialized}
  <main class="relative flex flex-col w-full h-full overflow-hidden select-none">
    <nav
      class:opacity-50={view == 'game'}
      class="absolute top-0 z-40 bg-base-800 w-full h-12 flex flex-row items-center justify-between p-2 px-4 text-base-200"
    >
      <a aria-label="Home" href="/" class=""
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 hover:text-emerald-400 duration-150 ease-out"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125
            1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </a>
      <div class="flex flex-row gap-2">
        <button
          bind:this={code_button}
          class:btn-primary={view == 'code'}
          class="btn-outline"
          onclick={() => {
            previousView = view;
            change_view('code');
          }}
          >Code
        </button>
        <button
          bind:this={scene_button}
          class:btn-primary={view == 'scene'}
          class="btn-outline"
          onclick={() => {
            change_view('scene');
          }}>Scene</button
        >
        <button
          class:btn-primary={view == 'logs'}
          class="btn-outline"
          onclick={() => change_view('logs')}>Logs</button
        >
      </div>
      <div class="flex flex-row gap-2">
        <button
          class="btn-outline"
          onclick={() => { show_options = !show_options; }}
          title="Project Options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
        <button
          class="btn-outline hover:btn-primary disabled:opacity-50"
          onclick={export_game}
          disabled={exporting || isWeb}
          title={isWeb ? 'Export is only available in the desktop app' : ''}
        >
          {#if exporting}
            <span class="animate-pulse">{export_status || 'Exporting...'}</span>
          {:else}
            Export
          {/if}
        </button>
      </div>
    </nav>
    {#if show_options}
      <div class="absolute top-12 left-0 w-full h-[calc(100%-3rem)] z-30">
        <Options
          bind:project
          onclose={() => { show_options = false; }}
          onsave={save_file}
        />
      </div>
    {/if}
    {#if view == 'scene'}
      <SceneEditor
        bind:agents
        bind:project
        bind:bg_asset_urls
        bind:agent_asset_urls
        bind:current_scene_id
        {save_file}
        {switch_to_game}
        {unfocus_from_scene_editor}
      />
    {:else if view == 'logs'}
      <div class="absolute top-12 left-0 w-full h-[calc(100%-3rem)] z-20">
        <Logs onclose={() => change_view(previousView)} />
      </div>
    {:else if view == 'game'}
      <svelte:boundary>
        <Game
          DEV
          {project}
          {bg_asset_urls}
          {agent_asset_urls}
          {current_scene_id}
          {on_error}
          on_exit={DEV ? () => change_view('scene') : exit}
        />

        {#snippet failed(error, reset)}
          <div class="pl-4 pt-16">
            <p>An error occured while running the game</p>
            <pre class="text-xs">{error}</pre>
            <button class="self-start btn-secondary !px-8 mt-4" onclick={reset}>Retry</button>
          </div>
        {/snippet}
      </svelte:boundary>
    {/if}
    <div
      class="absolute top-12 left-0 h-screen w-screen {view == 'code' ? 'z-10' : '-z-10 hidden'}"
    >
      <CodeEditor
        bind:view
        bind:project
        bind:this={code_editor}
        {unfocus_from_code_editor}
        {save_file}
      ></CodeEditor>
    </div>
  </main>
{:else}
  <main class="bg-base-700 h-full text-white p-4 flex flex-col gap-2">
    <p>Engine has failed to initialize.</p>
    <a href="/" class="text-emerald-400 underline">Back to home</a>
    {#if parse_errors.error}
      {@const line_count = parse_errors.code.split('\n').length}
      <div
        class="relative overflow-y-auto overflow-x-hidden h-full w-full bg-base-800 rounded p-2 pl-12"
      >
        <pre
          class="absolute top-2 left-12 bg-transparent z-[10] w-full text-sm font-mono whitespace-pre-wrap"
          use:highlight>{code_with_errors}</pre>
        {#each { length: line_count }, i}
          <div
            id={i.toString()}
            class:is_error_line={error_line == i}
            class="z-[9] absolute left-2 text-sm mono text-base-500 w-full"
            style="top: {i * 24 + 16}px;"
          >
            {i}
          </div>
        {/each}
      </div>

      <div class="inline-flex justify-between">
        <p class="text-red-400">{parse_errors.error}</p>
        <a class="btn-outline" href="#{error_line}">Show error line </a>
      </div>
      <button
        onclick={() => {
          project.code = code_with_errors;
          save_file();
          recalculate();
        }}>Save changes</button
      >
    {/if}
  </main>
{/if}

<style>
  .is_error_line {
    @apply bg-red-400/50;
  }
</style>



export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CdxvYRUE.js","_app/immutable/chunks/disclose-version.zBriJVu8.js","_app/immutable/chunks/runtime.DIIb9lBB.js","_app/immutable/chunks/legacy.CUi2P1D8.js"];
export const stylesheets = [];
export const fonts = [];

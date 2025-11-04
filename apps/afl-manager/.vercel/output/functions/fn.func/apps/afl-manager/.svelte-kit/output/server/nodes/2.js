

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.7lyUWQMp.js","_app/immutable/chunks/disclose-version.zBriJVu8.js","_app/immutable/chunks/runtime.DIIb9lBB.js","_app/immutable/chunks/render.CppXmGHI.js","_app/immutable/chunks/if.QXWaYwBI.js"];
export const stylesheets = ["_app/immutable/assets/2.DBakUhKX.css"];
export const fonts = [];

export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.10KO7qts.js","app":"_app/immutable/entry/app.CIquoxiy.js","imports":["_app/immutable/entry/start.10KO7qts.js","_app/immutable/chunks/entry.CDxLrDf4.js","_app/immutable/chunks/runtime.DIIb9lBB.js","_app/immutable/chunks/index-client.NquYrcoQ.js","_app/immutable/entry/app.CIquoxiy.js","_app/immutable/chunks/runtime.DIIb9lBB.js","_app/immutable/chunks/render.CppXmGHI.js","_app/immutable/chunks/disclose-version.zBriJVu8.js","_app/immutable/chunks/if.QXWaYwBI.js","_app/immutable/chunks/index-client.NquYrcoQ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

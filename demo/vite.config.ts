import path from 'path';

export default {
	root: __dirname,
	server: {
		port: 5174,
	},
	preview: {
		port: 4174,
	},
	esbuild: {
		jsx: 'automatic',
		jsxImportSource: 'ovee.js',
	} as any,
	optimizeDeps: {
		exclude: ['ovee.js', '@ovee.js/toolkit', '@ovee.js/toolkit-integrations'],
	},
	resolve: {
		alias: [
			{
				find: /^@ovee\.js\/toolkit$/,
				replacement: path.resolve(__dirname, '../packages/core/index.ts'),
			},
			{
				find: /^@ovee\.js\/toolkit\/(.*)$/,
				replacement: path.resolve(__dirname, '../packages/core/$1'),
			},
			{
				find: /^@ovee\.js\/toolkit-integrations$/,
				replacement: path.resolve(__dirname, '../packages/integrations/index.ts'),
			},
			{
				find: /^@ovee\.js\/toolkit-integrations\/(.*)$/,
				replacement: path.resolve(__dirname, '../packages/integrations/$1'),
			},
			{
				find: /^@playground$/,
				replacement: path.resolve(__dirname, 'src'),
			},
			{
				find: /^~$/,
				replacement: __dirname,
			},
			{
				find: /^~\/(.*)$/,
				replacement: `${__dirname}/$1`,
			},
		],
	},
};

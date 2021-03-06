import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	root: __dirname,

	resolve: {
		alias: {
			// pre-configured aliases, change them freely!
			'~': __dirname,
			'@playground': path.resolve(__dirname, 'src'),
			'@ovee.js/toolkit': path.resolve(__dirname, '../packages/core'),
			'@ovee.js/toolkit-integrations': path.resolve(__dirname, '../packages/integrations'),
		},
	},
});

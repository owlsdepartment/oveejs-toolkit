import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	root: __dirname,

	resolve: {
		alias: {
			// pre-configured aliases, change them freely!
			'~': __dirname,
			'@playground': path.resolve(__dirname, 'src'),
			'@': path.resolve(__dirname, '../src'),
		},
	},
});

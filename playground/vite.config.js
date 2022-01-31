import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			// pre-configured aliases, change them freely!
			'~': __dirname,
			'@': path.resolve(__dirname, 'src'),
			'@components': path.resolve(__dirname, '../src'),
		},
	},
});

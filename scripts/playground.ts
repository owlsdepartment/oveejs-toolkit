import { copyFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';

const PLAYGROUND_PATH = path.resolve(__dirname, '../playground');
const INDEX = path.resolve(PLAYGROUND_PATH, 'index.html');
const COMPONENTS = path.resolve(PLAYGROUND_PATH, 'src/components.ts');
const TEMPLATES = path.resolve(__dirname, 'templates/playground');

const COMMAND_MAP: Record<string, () => void> = {
	init: init,
	reset: reset,
	clear: clear,
};

function main() {
	const args = process.argv.slice(2);
	const commandName = args[0] || 'init';
	const command = COMMAND_MAP[commandName];

	if (!command) {
		const allowedCommands = Object.keys(COMMAND_MAP)
			.map(k => `'${k}'`)
			.join(', ');

		console.error(
			`[playground] Unrecognized command. Received: '${commandName}', expected one of: ${allowedCommands}`
		);
		return;
	}

	command();
}

function init(silent = false) {
	if (!existsSync(INDEX)) {
		copyFileSync(path.resolve(TEMPLATES, '_index.html'), INDEX);
	}

	if (!existsSync(COMPONENTS)) {
		copyFileSync(path.resolve(TEMPLATES, '_components.ts'), COMPONENTS);
	}

	if (silent) return;

	console.error(`[playground] Init done.`);
}

function clear(silent = false) {
	if (existsSync(INDEX)) unlinkSync(INDEX);

	if (existsSync(COMPONENTS)) unlinkSync(COMPONENTS);

	if (silent) return;

	console.error(`[playground] Clear done.`);
}

function reset() {
	clear(true);
	init(true);

	console.error(`[playground] Reset done.`);
}

main();

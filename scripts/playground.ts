import { Command } from 'commander';
import { copyFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';

const PLAYGROUND_PATH = path.resolve(__dirname, '../playground');
const INDEX = path.resolve(PLAYGROUND_PATH, 'index.html');
const COMPONENTS = path.resolve(PLAYGROUND_PATH, 'src/components.ts');
const TEMPLATES = path.resolve(__dirname, 'templates/playground');

const program = new Command();

program
	.command('init')
	.description('initialize playground')
	.action(() => init());

program
	.command('reset')
	.description('reset playground')
	.action(() => reset());

program
	.command('clear')
	.description('clear playground')
	.action(() => clear());

function main() {
	program.parse();
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

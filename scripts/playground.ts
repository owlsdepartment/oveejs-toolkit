import { Command } from 'commander';
import { copyFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';

const PLAYGROUND_PATH = path.resolve(__dirname, '../playground');
const INDEX = path.resolve(PLAYGROUND_PATH, 'index.html');
const COMPONENTS = path.resolve(PLAYGROUND_PATH, 'src/components.ts');
const MODULES = path.resolve(PLAYGROUND_PATH, 'src/modules.ts');
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
	createViaTemplate(INDEX, '_index.html');
	createViaTemplate(COMPONENTS, '_components.ts');
	createViaTemplate(MODULES, '_modules.ts');

	if (silent) return;

	console.error(`[playground] Init done.`);
}

function clear(silent = false) {
	removeFile(INDEX);
	removeFile(COMPONENTS);
	removeFile(MODULES);

	if (silent) return;

	console.error(`[playground] Clear done.`);
}

function reset() {
	clear(true);
	init(true);

	console.error(`[playground] Reset done.`);
}

function createViaTemplate(target: string, templateName: string) {
	if (!existsSync(target)) {
		copyFileSync(path.resolve(TEMPLATES, templateName), target);
	}
}

function removeFile(target: string) {
	if (existsSync(target)) unlinkSync(target);
}

main();

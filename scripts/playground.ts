import { Command } from 'commander';
import { copyFileSync, existsSync, unlinkSync } from 'fs';
import path from 'path';

interface FileEntry {
	folder: string;
	fileName: string;
}

const PLAYGROUND_PATH = path.resolve(__dirname, '../playground');
const TEMPLATES = path.resolve(__dirname, 'templates/playground');
const FILES: FileEntry[] = [
	{ folder: 'src', fileName: 'components.ts' },
	{ folder: 'src', fileName: 'modules.ts' },
	{ folder: 'src', fileName: 'main.ts' },
	{ folder: 'styles', fileName: 'main.scss' },
	{ folder: '', fileName: 'index.html' },
];

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

/**
 * Init playground with missing files
 */
function init(silent = false) {
	for (const file of FILES) {
		createViaTemplate(file);
	}

	if (silent) return;

	console.error(`[playground] Init done.`);
}

/**
 * Clear playground by removing all files
 */
function clear(silent = false) {
	for (const file of FILES) {
		removeFile(file);
	}

	if (silent) return;

	console.error(`[playground] Clear done.`);
}

/**
 * Remove existing files and init with new ones
 */
function reset() {
	clear(true);
	init(true);

	console.error(`[playground] Reset done.`);
}

// ----- Helpers
function createViaTemplate(entry: FileEntry) {
	const target = getEntryFullPath(entry);

	if (!existsSync(target)) {
		copyFileSync(path.resolve(TEMPLATES, `_${entry.fileName}`), target);
	}
}

function removeFile(entry: FileEntry) {
	const target = getEntryFullPath(entry);

	if (existsSync(target)) unlinkSync(target);
}

function getEntryFullPath(entry: FileEntry) {
	return `${path.resolve(PLAYGROUND_PATH, entry.folder, entry.fileName)}`;
}
// ----- Helpers end

main();

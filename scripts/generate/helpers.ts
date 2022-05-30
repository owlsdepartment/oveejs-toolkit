import { ESLint } from 'eslint';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { last, trimEnd, trimStart } from 'lodash';
import path from 'path';

import { README_TEMPLATE, ROOT_DIR } from './constants';

export function trimPath(path: string) {
	return trimStart(trimEnd(path, '/'), '/');
}

/**
 * Creates missing `index.ts` files in provided path, with imports and ESLint fixes
 *
 * @param args.folders accepts folders path to final index
 * @param args.relativeTo base folder, that all folders from `folders` array are relative to
 */
export async function fillMissingBarrels({
	folders,
	relativeTo,
}: {
	folders: string[];
	relativeTo: string;
}) {
	const concatanatedFolders = folders.reduce((acc, f, idx) => {
		const prev = acc[idx - 1];
		const folder = prev ? `${prev}/${f}` : f;

		acc.push(folder);

		return acc;
	}, new Array<string>());
	const mappedFolders = concatanatedFolders.map(f => path.resolve(relativeTo, f));

	for await (const [idx, folderPath] of Object.entries(mappedFolders)) {
		const indexPath = path.resolve(folderPath, 'index.ts');
		const nextFolder = folders[+idx + 1];
		const importLine = `export * from './${nextFolder}'`;

		if (!nextFolder) return;

		if (!existsSync(indexPath)) {
			mkdirSync(folderPath, { recursive: true });
			writeFileSync(indexPath, importLine);
		} else {
			const content = readFileSync(indexPath);

			if (content.includes(importLine)) return;

			appendFileSync(indexPath, importLine);
		}

		await eslintAutofix(indexPath);
	}
}

export async function eslintAutofix(path: string) {
	const eslint = new ESLint({ fix: true, cwd: ROOT_DIR });
	const results = await eslint.lintFiles([path]);

	await ESLint.outputFixes(results);
}

export function doesModuleExists(basePath: string) {
	return existsSync(path.resolve(basePath, 'index.ts'));
}

export function getGeneratedElementParams({
	name,
	path,
	otherDir,
	baseDir,
}: {
	path: string;
	name: string;
	otherDir: string;
	baseDir: string;
}) {
	let outputName: string;
	let directoryPath: string;

	if (!name) {
		const splitted = trimPath(path).split('/');

		if (splitted.length === 1) {
			outputName = path;
			directoryPath = `${otherDir}/${outputName}`;
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			outputName = last(splitted)!;
			directoryPath = `${baseDir}/${splitted.join('/')}`;
		}
	} else {
		const trimmedPath = trimPath(path);

		outputName = name;
		directoryPath = `${baseDir}/${trimmedPath}`;
	}

	return {
		outputName,
		directoryPath,
	};
}

export function generateReadme(basePath: string, targetName?: string) {
	let readmeContent = readFileSync(README_TEMPLATE, 'utf-8');

	if (targetName) {
		readmeContent = readmeContent.replace(/{{ComponentName}}/g, targetName);
	}

	writeFileSync(path.resolve(basePath, 'README.md'), readmeContent);
}

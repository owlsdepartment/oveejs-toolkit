import { mkdirSync, writeFileSync } from 'fs';
import { camelCase, upperFirst } from 'lodash';
import _path from 'path';

import { MODULES_DIR, OTHER_MODULES_DIR, ROOT_DIR } from './constants';
import {
	doesModuleExists,
	fillMissingBarrels,
	generateReadme,
	getGeneratedElementParams,
	trimPath,
} from './helpers';

export async function generateModule(path: string, name: string) {
	const { directoryPath: dirPath, outputName: moduleName } = getGeneratedElementParams({
		name,
		path,
		otherDir: OTHER_MODULES_DIR,
		baseDir: MODULES_DIR,
	});
	const fullPath = _path.resolve(ROOT_DIR, dirPath);
	const camelCaseName = camelCase(moduleName);
	const pascalCaseName = upperFirst(camelCaseName);

	if (doesModuleExists(fullPath)) {
		console.error(`[generate ~ module] Module under path '${dirPath}' already exists. Aborting`);
		return;
	}

	console.log(
		`[generate ~ module] Generating module '${pascalCaseName}' in directory '${dirPath}' ...`
	);

	await fillMissingBarrels({
		folders: ['.', ...trimPath(dirPath.replace(MODULES_DIR, '')).split('/')],
		relativeTo: _path.resolve(ROOT_DIR, MODULES_DIR),
	});

	mkdirSync(fullPath, { recursive: true });

	writeFileSync(
		_path.resolve(fullPath, 'index.ts'),
		`// export all code you want to be available on the outside
export * from './${pascalCaseName}';
`
	);

	writeFileSync(
		_path.resolve(fullPath, `${pascalCaseName}.ts`),
		`import { Module } from 'ovee.js';

export class ${pascalCaseName} extends Module {
	init() {
		// write your code here
	}

	static getName(): string {
		return '${pascalCaseName}';
	}
}
`
	);

	generateReadme(fullPath, pascalCaseName);

	console.log(`[generate ~ module] Generation completed successfully!`);
}

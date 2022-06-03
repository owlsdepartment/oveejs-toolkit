import { appendFileSync, mkdirSync, writeFileSync } from 'fs';
import { camelCase, upperFirst } from 'lodash';
import _path from 'path';

import { MODULES_DIR, OTHER_MODULES_DIR } from './constants';
import {
	doesModuleExists,
	fillMissingBarrels,
	generateReadme,
	getGeneratedElementParams,
	getPackageDir,
	trimPath,
} from './helpers';
import { WithIntegrations, WithStyles } from './options';

export async function generateModule(
	path: string,
	name: string,
	options: WithStyles & WithIntegrations
) {
	const { integrations: toIntegrations, styles: withStyles } = options;
	const { directoryPath: dirPath, outputName: moduleName } = getGeneratedElementParams({
		name,
		path,
		toIntegrations,
		otherDir: OTHER_MODULES_DIR,
		baseDir: MODULES_DIR,
	});
	const packageDir = getPackageDir(toIntegrations);
	const fullPath = _path.resolve(packageDir, dirPath);
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
		folders: toIntegrations ? ['.'] : [...trimPath(dirPath).split('/')],
		relativeTo: packageDir,
	});

	mkdirSync(fullPath, { recursive: true });

	writeFileSync(_path.resolve(fullPath, 'index.ts'), `export * from './${pascalCaseName}';\n`);

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

	if (withStyles) {
		writeFileSync(
			_path.resolve(fullPath, 'styles.scss'),
			`// write and import all your styles here';
`
		);

		appendFileSync(
			_path.resolve(fullPath, 'README.md'),
			`## Styling
<!-- TODO: add notes about styling your module -->
`
		);
	}

	console.log(`[generate ~ module] Generation completed successfully!`);
}

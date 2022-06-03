import { mkdirSync, writeFileSync } from 'fs';
import { camelCase, upperFirst } from 'lodash';
import _path from 'path';

import { MIXINS_DIR } from './constants';
import {
	doesModuleExists,
	fillMissingBarrels,
	generateReadme,
	getGeneratedElementParams,
	getPackageDir,
	trimPath,
} from './helpers';
import { WithIntegrations } from './options';

export async function generateMixin(path: string, name: string, options: WithIntegrations) {
	const { integrations: toIntegrations } = options;
	const { directoryPath: dirPath, outputName: mixinName } = getGeneratedElementParams({
		name,
		path,
		toIntegrations,
		otherDir: MIXINS_DIR,
		baseDir: MIXINS_DIR,
	});
	const packageDir = getPackageDir(toIntegrations);
	const fullPath = _path.resolve(packageDir, dirPath);
	const camelCaseName = camelCase(mixinName);
	const pascalCaseName = upperFirst(camelCaseName);

	if (doesModuleExists(fullPath)) {
		console.error(`[generate ~ mixin] Mixin under path '${dirPath}' already exists. Aborting`);
		return;
	}

	console.log(
		`[generate ~ mixin] Generating mixin '${pascalCaseName}' in directory '${dirPath}' ...`
	);

	await fillMissingBarrels({
		folders: toIntegrations ? ['.'] : [...trimPath(dirPath).split('/')],
		relativeTo: packageDir,
	});

	mkdirSync(fullPath, { recursive: true });

	writeFileSync(_path.resolve(fullPath, 'index.ts'), `export * from './${pascalCaseName}';\n`);

	writeFileSync(
		_path.resolve(fullPath, `${pascalCaseName}.ts`),
		`import { ClassConstructor, Component } from 'ovee.js';

export function ${pascalCaseName}<Base extends ClassConstructor<Component>>(Ctor: Base) {
	class _${pascalCaseName} extends Ctor {
		// write your mixin
	}

	return _${pascalCaseName};
}
`
	);

	generateReadme(fullPath, pascalCaseName);

	console.log(`[generate ~ mixin] Generation completed successfully!`);
}

import { mkdirSync, writeFileSync } from 'fs';
import { camelCase, upperFirst } from 'lodash';
import _path from 'path';

import { MIXINS_DIR, ROOT_DIR } from './constants';
import {
	doesModuleExists,
	fillMissingBarrels,
	generateReadme,
	getGeneratedElementParams,
	trimPath,
} from './helpers';

export async function generateMixin(path: string, name: string) {
	const { directoryPath: dirPath, outputName: mixinName } = getGeneratedElementParams({
		name,
		path,
		otherDir: MIXINS_DIR,
		baseDir: MIXINS_DIR,
	});
	const fullPath = _path.resolve(ROOT_DIR, dirPath);
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
		folders: ['.', ...trimPath(dirPath.replace(MIXINS_DIR, '')).split('/')],
		relativeTo: _path.resolve(ROOT_DIR, MIXINS_DIR),
	});

	mkdirSync(fullPath, { recursive: true });

	writeFileSync(_path.resolve(fullPath, 'index.ts'), `export * from './${pascalCaseName}';\n`);

	writeFileSync(
		_path.resolve(fullPath, `${pascalCaseName}.ts`),
		`import { ClassConstructor, Component } from 'ovee.js';

export function ${pascalCaseName}<Base extends ClassConstructor<Component>>(Ctor: Base) {
	class ${pascalCaseName} extends Ctor {
		// write your mixin
	}

	return ${pascalCaseName};
}
`
	);

	generateReadme(fullPath, pascalCaseName);

	console.log(`[generate ~ mixin] Generation completed successfully!`);
}

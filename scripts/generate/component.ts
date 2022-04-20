import { appendFileSync, mkdirSync, writeFileSync } from 'fs';
import { camelCase, kebabCase, upperFirst } from 'lodash';
import _path from 'path';

import { COMPONENTS_DIR, OTHER_COMPONENTS_DIR, ROOT_DIR } from './constants';
import {
	doesModuleExists,
	fillMissingBarrels,
	generateReadme,
	getGeneratedElementParams,
	trimPath,
} from './helpers';

export async function generateComponent(path: string, name: string, withStyles: boolean) {
	const { directoryPath: dirPath, outputName: componentName } = getGeneratedElementParams({
		name,
		path,
		otherDir: OTHER_COMPONENTS_DIR,
		baseDir: COMPONENTS_DIR,
	});
	const fullPath = _path.resolve(ROOT_DIR, dirPath);
	const kebabCaseName = kebabCase(componentName);
	const camelCaseName = camelCase(componentName);
	const pascalCaseName = upperFirst(camelCaseName);

	if (doesModuleExists(fullPath)) {
		console.error(
			`[generate ~ component] Component under path '${dirPath}' already exists. Aborting`
		);
		return;
	}

	if (kebabCaseName.split('-').length < 2) {
		console.error(
			`[generate ~ component] Component name must consist of at least two words. Aborting`
		);
		return;
	}

	console.log(
		`[generate ~ component] Generating component '${kebabCaseName}' in directory '${dirPath}' ...`
	);

	await fillMissingBarrels({
		folders: ['.', ...trimPath(dirPath.replace(COMPONENTS_DIR, '')).split('/')],
		relativeTo: _path.resolve(ROOT_DIR, COMPONENTS_DIR),
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
		`import { Component, register } from 'ovee.js';

@register('${kebabCaseName}')
export class ${pascalCaseName} extends Component {
	// write your code
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
<!-- TODO: add notes about styling you component -->
`
		);
	}

	console.log(`[generate ~ component] Generation completed successfully!`);
}

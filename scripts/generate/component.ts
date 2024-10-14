import { appendFileSync, mkdirSync, writeFileSync } from 'fs';
import { camelCase, kebabCase, upperFirst } from 'lodash';
import _path from 'path';

import { COMPONENTS_DIR, OTHER_COMPONENTS_DIR } from './constants';
import {
	doesModuleExists,
	fillMissingBarrels,
	generateReadme,
	getGeneratedElementParams,
	getPackageDir,
	trimPath,
} from './helpers';
import { WithIntegrations, WithStyles } from './options';

export async function generateComponent(
	path: string,
	name: string,
	options: WithStyles & WithIntegrations
) {
	const { styles: withStyles, integrations: toIntegrations } = options;
	const { directoryPath: dirPath, outputName: componentName } = getGeneratedElementParams({
		name,
		path,
		toIntegrations,
		otherDir: OTHER_COMPONENTS_DIR,
		baseDir: COMPONENTS_DIR,
	});
	const packageDir = getPackageDir(toIntegrations);
	const fullPath = _path.resolve(packageDir, dirPath);
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
		folders: toIntegrations ? ['.'] : [...trimPath(dirPath).split('/')],
		relativeTo: packageDir,
	});

	mkdirSync(fullPath, { recursive: true });

	writeFileSync(_path.resolve(fullPath, 'index.ts'), `export * from './${pascalCaseName}';\n`);

	writeFileSync(
		_path.resolve(fullPath, `${pascalCaseName}.ts`),
		`import { defineComponent } from 'ovee.js';

export const ${pascalCaseName} = defineComponent((element, {
	app, on, off, emit, name, options
}) => {
	console.log('hi from component!')
});
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
<!-- TODO: add notes about styling your component -->
`
		);
	}

	console.log(`[generate ~ component] Generation completed successfully!`);
}

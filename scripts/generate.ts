import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { camelCase, kebabCase, last, trimEnd, trimStart, upperFirst } from 'lodash';
import path from 'path';

const COMPONENTS_DIR = 'src/components';
const OTHER_COMPONENTS_DIR = `${COMPONENTS_DIR}/other`;
const ROOT_DIR = path.resolve(__dirname, '..');

enum GeneratedType {
	component = 'component',
	c = 'c',
}

const generatorMap: Record<`${GeneratedType}`, (args: string[]) => void> = {
	component: generateComponent,
	c: generateComponent,
};

/**
 * Format:
 * yarn run create <what> <name>
 * yarn run create <what> <path> <name>
 */

function init() {
	const possibleTypes = Object.values(GeneratedType);
	const args = process.argv.slice(2);
	const type = args[0];

	if (!type) {
		console.error(
			` -- Missing first required argument 'type'. Possible values: ${possibleTypes.join(', ')}.`
		);
		return;
	}

	if (!possibleTypes.includes(type as any)) {
		console.error(
			` -- Wrong value for first argument 'type'. Received: '${type}', expected one of: ${possibleTypes.join(
				', '
			)}.`
		);
		return;
	}

	generatorMap[type as GeneratedType](args.slice(1));
}

function generateComponent(args: string[]) {
	if (!args.length) {
		console.error(
			`[generate ~ component] Component generator requires from 1 to 2 arguments. Received 0.`
		);
		return;
	}

	const readmeTemplatePath = path.resolve(ROOT_DIR, '.github/readme_template.md');
	let dirPath: string;
	let componentName: string;

	const withStyles = args.includes('--styles');

	if (withStyles) {
		args.splice(args.indexOf('--styles'), 1);
	}

	if (args.length === 1) {
		const splitted = trimStart(trimEnd(args[0], '/'), '/').split('/');

		if (splitted.length === 1) {
			componentName = args[0];
			dirPath = `${OTHER_COMPONENTS_DIR}/${componentName}`;
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			componentName = last(splitted)!;
			dirPath = `${COMPONENTS_DIR}/${splitted.join('/')}`;
		}
	} else {
		const trimmedPath = trimStart(trimEnd(args[0], '/'), '/');

		componentName = args[1];
		dirPath = `${COMPONENTS_DIR}/${trimmedPath}`;
	}

	const kebabCaseName = kebabCase(componentName);
	const camelCaseName = camelCase(componentName);
	const pascalCaseName = upperFirst(camelCaseName);

	const fullPath = path.resolve(ROOT_DIR, dirPath);

	if (existsSync(fullPath)) {
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

	mkdirSync(fullPath, { recursive: true });

	writeFileSync(
		path.resolve(fullPath, 'index.ts'),
		`// export all code you want to be available on the outside
export * from './${pascalCaseName}';
`
	);

	writeFileSync(
		path.resolve(fullPath, `${pascalCaseName}.ts`),
		`import { Component, register } from 'ovee.js';

@register('${kebabCaseName}')
export class ${pascalCaseName} extends Component {
	// write your code
}
`
	);

	const readmeContent = readFileSync(readmeTemplatePath, 'utf-8').replace(
		/{{ComponentName}}/g,
		pascalCaseName
	);

	writeFileSync(path.resolve(fullPath, 'README.md'), readmeContent);

	if (withStyles) {
		writeFileSync(
			path.resolve(fullPath, 'styles.scss'),
			`// write and import all your styles here';
`
		);

		appendFileSync(
			path.resolve(fullPath, 'README.md'),
			`## Styling
<!-- TODO: add notes about styling you component -->
`
		);
	}

	console.log(`[generate ~ component] Generation completed successfully!`);
}

init();

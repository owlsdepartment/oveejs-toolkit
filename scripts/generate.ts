import { Command } from 'commander';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { camelCase, kebabCase, last, trimEnd, trimStart, upperFirst } from 'lodash';
import _path from 'path';

const COMPONENTS_DIR = 'src/components';
const OTHER_COMPONENTS_DIR = `${COMPONENTS_DIR}/other`;
const ROOT_DIR = _path.resolve(__dirname, '..');

const program = new Command();

program
	.command('component')
	.alias('c')
	.description('generate boilerplate for new component')
	.argument('<path>', 'component path. If used alone, component name will be infered')
	.argument('[name]', 'component name')
	.option('-s, --styles', 'generate styles file', false)
	.action((path: string, name: string | undefined, options: { styles: boolean }) => {
		generateComponent(path, name ?? '', options.styles);
	});

/**
 * Format:
 * yarn run generate <what> <path> [name]
 */

function init() {
	program.parse();
}

function generateComponent(path: string, name: string, withStyles: boolean) {
	const readmeTemplatePath = _path.resolve(ROOT_DIR, '.github/readme_template.md');
	let dirPath: string;
	let componentName: string;

	if (!name) {
		const splitted = trimStart(trimEnd(path, '/'), '/').split('/');

		if (splitted.length === 1) {
			componentName = path;
			dirPath = `${OTHER_COMPONENTS_DIR}/${componentName}`;
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			componentName = last(splitted)!;
			dirPath = `${COMPONENTS_DIR}/${splitted.join('/')}`;
		}
	} else {
		const trimmedPath = trimStart(trimEnd(path, '/'), '/');

		componentName = name;
		dirPath = `${COMPONENTS_DIR}/${trimmedPath}`;
	}

	const kebabCaseName = kebabCase(componentName);
	const camelCaseName = camelCase(componentName);
	const pascalCaseName = upperFirst(camelCaseName);

	const fullPath = _path.resolve(ROOT_DIR, dirPath);

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

	const readmeContent = readFileSync(readmeTemplatePath, 'utf-8').replace(
		/{{ComponentName}}/g,
		pascalCaseName
	);

	writeFileSync(_path.resolve(fullPath, 'README.md'), readmeContent);

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

init();

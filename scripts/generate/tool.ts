import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { camelCase, last, upperFirst } from 'lodash';
import _path from 'path';

import { ROOT_DIR, TOOLS_DIR } from './constants';
import { doesModuleExists, fillMissingBarrels, trimPath } from './helpers';

export async function generateTool(path: string) {
	const readmeTemplatePath = _path.resolve(ROOT_DIR, '.github/readme_template.md');
	const trimmedPath = trimPath(path);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const toolName = last(trimmedPath.split('/'))!;
	const pascalCaseName = upperFirst(camelCase(toolName));
	const dirPath = `${TOOLS_DIR}/${trimmedPath}`;
	const fullPath = _path.resolve(ROOT_DIR, dirPath);

	if (doesModuleExists(fullPath)) {
		console.error(`[generate ~ tool] Tool under path '${path}' already exists. Aborting`);
		return;
	}

	console.log(`[generate ~ tool] Generating tool '${toolName}' in directory '${dirPath}' ...`);

	const dirs = ['.', ...trimmedPath.split('/')];
	const toolsDir = _path.resolve(ROOT_DIR, TOOLS_DIR);

	await fillMissingBarrels({ folders: dirs, relativeTo: toolsDir });

	mkdirSync(fullPath, { recursive: true });

	// index.ts
	writeFileSync(_path.resolve(fullPath, 'index.ts'), `export * from './${toolName}';\n`);

	// {toolName}.ts
	writeFileSync(
		_path.resolve(fullPath, `${toolName}.ts`),
		`// TODO: write your tool\nexport {};\n`
	);

	// README.md
	const readmeContent = readFileSync(readmeTemplatePath, 'utf-8').replace(
		/{{ComponentName}}/g,
		`${pascalCaseName}`
	);

	writeFileSync(_path.resolve(fullPath, 'README.md'), readmeContent);

	console.log(`[generate ~ tool] Generation completed successfully!`);
}

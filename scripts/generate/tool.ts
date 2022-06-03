import { mkdirSync, writeFileSync } from 'fs';
import { camelCase, last, upperFirst } from 'lodash';
import _path from 'path';

import { TOOLS_DIR } from './constants';
import {
	doesModuleExists,
	fillMissingBarrels,
	generateReadme,
	getPackageDir,
	trimPath,
} from './helpers';
import { WithIntegrations } from './options';

export async function generateTool(path: string, options: WithIntegrations) {
	const { integrations: toIntegrations } = options;
	const trimmedPath = trimPath(path);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const toolName = last(trimmedPath.split('/'))!;
	const pascalCaseName = upperFirst(camelCase(toolName));
	const dirPath = toIntegrations ? `${toolName}` : `${TOOLS_DIR}/${trimmedPath}`;
	const packageDir = getPackageDir(toIntegrations);
	const fullPath = _path.resolve(packageDir, dirPath);

	if (doesModuleExists(fullPath)) {
		console.error(`[generate ~ tool] Tool under path '${path}' already exists. Aborting`);
		return;
	}

	console.log(`[generate ~ tool] Generating tool '${toolName}' in directory '${dirPath}' ...`);

	await fillMissingBarrels({
		folders: toIntegrations ? ['.'] : [...trimPath(dirPath).split('/')],
		relativeTo: packageDir,
	});

	mkdirSync(fullPath, { recursive: true });

	// index.ts
	writeFileSync(_path.resolve(fullPath, 'index.ts'), `export * from './${toolName}';\n`);

	// {toolName}.ts
	writeFileSync(
		_path.resolve(fullPath, `${toolName}.ts`),
		`// TODO: write your tool\nexport {};\n`
	);

	generateReadme(fullPath, pascalCaseName);

	console.log(`[generate ~ tool] Generation completed successfully!`);
}

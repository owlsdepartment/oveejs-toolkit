import fs from 'fs';
import path from 'path';

import { version } from '../package.json';
import { ROOT_DIR } from './generate/constants';

const packages = ['core', 'integrations'];

for (const name of packages) {
	const packageJson = path.resolve(ROOT_DIR, `packages/${name}/package.json`);
	let content = fs.readFileSync(packageJson, { encoding: 'utf-8' });

	content = content.replace(/"version": ".*"/gm, `"version": "${version}"`);

	fs.writeFileSync(packageJson, content);
}

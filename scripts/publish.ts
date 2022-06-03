import { execSync } from 'child_process';
import path from 'path';

import { version } from '../package.json';
import { ROOT_DIR } from './generate/constants';

const packages = ['core', 'integrations'];

execSync('yarn version_sync', { stdio: 'inherit' });
execSync('yarn build', { stdio: 'inherit' });

let command = 'npm publish --access public';

if (version.includes('beta')) {
	command += ' --tag beta';
}

for (const name of packages) {
	const distPath = path.resolve(ROOT_DIR, 'packages', name, 'dist');

	execSync(command, { stdio: 'inherit', cwd: distPath });

	console.log(`Published package '${name}'`);
}

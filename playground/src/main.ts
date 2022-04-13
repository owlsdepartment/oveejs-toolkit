import '~/styles/main.scss';

import { App } from 'ovee.js';

import components from './components';

const root = document.getElementById('app');
const app = new App({
	components,
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
app.run(root!);

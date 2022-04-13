import '~/styles/main.scss';

import { App } from 'ovee.js';

const root = document.getElementById('app');
const app = new App({});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
app.run(root!);

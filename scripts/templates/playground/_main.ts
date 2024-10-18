import '~/styles/main.scss';

import { createApp } from 'ovee.js';

import components from './components';
import modules from './modules';

const root = document.getElementById('app');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createApp().components(components).useMany(modules).run(root!);

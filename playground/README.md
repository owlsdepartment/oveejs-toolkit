# Ovee UI Playground

To first time initialize a playground, run this command in root folder:

```bash
yarn playground
# or
yarn playground init
```

To start a playground:

```bash
yarn dev
# or
yarn serve
```

## Available commands

```bash
# clear playground environment
yarn playground clear

# reset playground environment
yarn playground reset
```

## Usage

Import component you would like to test in `src/components.ts` from `@components`. Example:

```ts
import { TestComponent } from '@components';
import { Class, Component } from 'ovee.js';

const components: Class<Component, typeof Component>[] = [TestComponent];

export default components;
```

Use then in `index.html` like this:
```html
<!-- some code ... -->
<test-component></test-component>
<!-- some code ... -->
```

__IMPORTANT NOTES__: Never commit any changes from `playground` folder to repository. You can change `index.html` and `src/components.ts` freely as they are git-ignored and won't be included in the changes.

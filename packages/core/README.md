# Ovee.js Toolkit

It's a package with components, modules, tools, and many more, for `Ovee.js` framework.

## Installation

```bash
npm install --save @ovee.js/toolkit
# for yarn
yarn add @ovee.js/toolkit
```

Additionally, it is required to install these packages:

```bash
npm install --save ovee.js gsap lodash
# for yarn
yarn add ovee.js gsap lodash
```

They are included as peer dependencies, as they are pretty common and we want to avoid multiplying packages instances and versions.

## Usage notes

All tools are exposed in root package, so to use them, just write

```ts
import { BaseDialog } from '@ovee.js/toolkit'
```

Every tool has seperate `README` with specific guide on how to install it, use it, and it's full API.

## All Tools

### Components

 - [BaseAccordion](./components/base/accordion/README.md)
 - [BaseCookies](./components/base/cookies/README.md)
 - [BaseDialog](./components/base/dialog/README.md)
 - [CollapsingHeader](./components/other/collapsing-header/README.md)
 - [CursorModifier](./components/other/cursor-modifier/README.md)
 - [NavToggle](./components/other/nav-toggle/README.md)
 - [ParallaxEffect](./components/other/parallax-effect/README.md)
 - [ParallaxEffect](./components/utils/in-viewport/README.md)

### Modules
 - [CustomCursor](./modules/custom-cursor/README.md)
 - [VhFix](./modules/vh-fix/README.md)

### Mixins

 - [WithInViewport](./mixins/WithInViewport/README.md)

### Tools

 - [observeIntersections](./tools/observeIntersections/README.md)
 - [OveeStore](./tools/store/README.md)


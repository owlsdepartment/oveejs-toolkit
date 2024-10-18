# Viewport

## Registration and configuration

See [Modules registration](/docs/registration.md#modules)

To add styles

```scss
@import '@ovee.js/toolkit/styles/viewport-units';
```

This import enables function `vh()` in SCSS.

## Usage example

`ViewportUnits` module adds `--vh` and `--vw` CSS variables, that reflects real vh and vw on all devices, including mobile

```css
.element {
	min-height: vh(100);
}
```

Module provides reactive viewport height (`vh`) and width (`vw`) units.

```ts
import { ViewportUnits } from '@ovee.js/toolkit'

export const SomeComponent = defineComponent(() => {
    const { vh, vw } = useModule(ViewportUnits)
})
```

Also this module adds to `app` reactive computeds `$vh` and `$vw`.

```ts
import { useApp } from 'ovee.js'

export const SomeComponent = defineComponent(() => {
    const app = useApp();

	console.log(app.$vh, app.$vw);
})
```

## Composables

- [useViewportUnits](./composables/README.md)
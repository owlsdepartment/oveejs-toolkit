# VhFix

## Installation and configuration

```ts
import { VhFix } from '@owlsdepartment/modules';
```

```ts
const app = new App({
    modules: [
        VhFix,
    ]
});
```

or

```ts
app.use(VhFix);
```

## Requirements

Don't forget to import scss function which calcs vh.

## Usage example

`VhFix` module adds `--vh` css variable, that reflects real vh on all devices, includes mobile

```css
.element {
	min-height: vh(100);
}
```

Also this module adds to `this.$app` reactive computed $vh which means in each component you can take the vh value with `this.$app.$vh.value`.
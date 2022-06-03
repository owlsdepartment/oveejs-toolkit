# VhFix

## Installation and configuration

See [Configuration](/docs/components_installation.md#modules)

To add styles

```scss
@import '@ovee.js/toolkit/styles/vh-fix';
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

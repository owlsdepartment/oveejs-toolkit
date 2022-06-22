# Viewport

## Registration and configuration

See [Modules registration](/docs/registration.md#modules)

To add styles

```scss
@import '@ovee.js/toolkit/styles/viewport';
```

This import enables function `vh()` in SCSS.

## Usage example

`Viewport` module adds `--vh` and `--vw` css variables, that reflects real vh and vw on all devices, including mobile

```css
.element {
	min-height: vh(100);
}
```

Also this module adds to `this.$app` reactive computeds `$vh` and `$vw`, which means in each component you can take these values with `this.$app.$vh.value` or `this.$app.$vw.value`.

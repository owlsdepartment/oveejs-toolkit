# CursorModifier

## Registration and configuration

See [Components registration](/docs/registration.md#components)

## Usage example

`CursorModifer` component extends the functionality of the `CustomCursor` module.

### Mode

Setting `data-cursor-mode` on a `CursorModifier` component will add this value to `data-mode` attribute on the cursor itself when hovering over that element.

```html
<div class="header" data-cursor-modifier data-cursor-mode="slider">
	...
</div>
```

It then can be styles as such:

```scss
.cursor__background {
	[data-mode='slider'] & {
		background-color: blue;
	}
}
```

### Text

Setting `data-cursor-mode` in conjunction with `data-cursor-text` can be used to inject a text string into the `CustomCursor` element.

```html
<div class="header" data-cursor-modifier data-cursor-mode="text" data-cursor-text="Click me">
	...
</div>
```

Note that by default, the text will be hidden in any mode different than `data-cursor-mode="text"` and its visibility should be enabled in other modes in CSS as such:

```scss
[data-mode='slider'] & {
	visibility: visible;
	transform: scale(1);
	opacity: 1;
}
```

### Theme 

Using `data-cursor-theme` can be combined with `data-cursor-mode` to provide alternative styling to already established cursor behaviors.

```html
<div class="header" data-cursor-modifier data-cursor-mode="slider" data-cursor-theme="inversed">
	...
</div>
```

```scss
.cursor__background {
	[data-mode='slider'][data-theme='inversed'] & {
		background-color: white;
	}
}
.cursor__text {
	[data-theme='inversed'] & {
		color: blue;
	}
}
```
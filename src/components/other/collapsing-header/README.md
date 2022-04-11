# CollapsingHeader

## Requirements
 - `lodash`
 - `ovee.js`

For sticky:
	Don't animate height on `<header>`, because it triggers the scroll event. `position:sticky` occupies space in DOM.

## Installation and configuration

```ts
import { CollapsingHeader, updateConfig } from '@owlsdepartment/components';

updateConfig(CollapsingHeader, { throttle: 200 });

export default [
    // ... other components ...
    CollapsingHeader
];
```

```scss
@import '@owlsdepartment/components/styles/collapsing-header';
```

## Usage example

### Basic usage

```html
<header class="header" data-collapsing-header>
    <div class="header__container"></div>
</header>
```

`CollapsingHeader` appends/removes classes to/from `<html>` tag based on scroll.

### Collapsing Header / Default

Will add `.header-collapsed` class when scrolling down.
Will add `.header-modified` class when scrolled past a trigger.

```html
<header class="header" data-collapsing-header>
    <div class="header__container"></div>
</header>
```

### Fixed Header

Will add `.header-modified` class when scrolled past a trigger.

```html
<header class="header" data-collapsing-header="fixed">
    <div class="header__container"></div>
</header>
```

### Sticky Header

Will add `.header-visible` class when scrolling up past a trigger.
Will add `.header-modified` class when scrolled past a trigger.

```html
<header class="header" data-collapsing-header="sticky">
    <div class="header__container"></div>
</header>
```

You can also modify the trigger using `data-trigger-offset` and `data-offset-multiplier` parameters.

```html
<header
	class="header"
	data-collapsing-header="sticky"
	data-trigger-offset="header"
	data-offset-multiplier="2.5"
>
    <div class="header__container"></div>
</header>
```

The config above will set trigger position to an offset equal to 2.5 heights of the `CollapsingHeader` element.

Available `data-trigger-offset` values:
- window - offset set to `window.innerHeight`
- header - offset set to `CollapsingHeader` clientHeight
- none - offset set to `0`
- default
	- for 'collapsing/default' -> none
	- for 'fixed' -> none
	- for 'sticky' -> window
- element

`data-offset-multiplier` is only applied if `data-trigger-offset` is set to `window` or `header`.

When setting `data-trigger-offset` to `element`, pass a string for `querySelector` to find an element and use its `offsetTop` as the offset value. If the element is not found, the value will fallback to `default`.

Examples:

```html
<header
	class="header"
	data-collapsing-header="fixed"
	data-trigger-offset=".example-class"
>
    <div class="header__container"></div>
</header>

<div class="example-class"></div>
```

```html
<header
	class="header"
	data-collapsing-header="fixed"
	data-trigger-offset="#example-id"
>
    <div class="header__container"></div>
</header>

<div id="example-id"></div>
```

## Styling

When appling `transitions` to `CollapsingHeader` element set to `sticky`, avoid animating `height` on that element. This technique uses `position: sticky` and the header occupies space in `DOM`. Changing the height will cause page reflow and fire `scroll event`. This may result in buggy behavior when scrolling near the `data-trigger-offset` value. You can animate `height` on the inner element of the main tag and offset them using `transform`.

When using `CollapsingHeader` set to `sticky`, make sure none of the parent elements up to `<body>` has `overflow` value set to `hidden`. This will prevent `position: sticky` from working. You can apply `overflow` to the `<html>` element.

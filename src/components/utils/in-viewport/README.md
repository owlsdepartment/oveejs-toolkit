# InViewport

## Requirements
 - `lodash`

## Installation and configuration

```ts
import { InViewport, updateConfig } from '@owlsdepartment/components';

updateConfig(InViewport, { threshold: 0.3 });

export default [
    // ... other components ...
    InViewport
];
```

## Usage example

Basic usage

```html
<div class="img-wrapper">
    <img class="very-big-image" data-in-viewport />
</div>
```

After appearing `InViewport`, `img` with class `very-big-image` will receive class `in-viewport`, when you can add your styles which make your component appear with cool fade or slide in.

You can change threshold which controls when image will appear.

```html
<div class="img-wrapper">
    <!-- load image only when image fully enter the viewport -->
    <img class="very-big-image" data-in-viewport data-threshold="1" />
    <!-- load image when 10% of it will enter the viewport -->
    <img class="very-big-image" data-in-viewport data-threshold="0.1" />
</div>
```

`data-threshold` param is parsed with JSON parser and passed directly to [IntesectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver), so you can pass there either a number, or an array of numbers. Look official documentation of [IntesectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver) to see how it works.

If you would like to watch over some nested element inside `InViewport`, than you should specify `data-selector` param, which accepts normal `querySelector` values.

```html
<div class="img-wrapper" data-in-viewport data-selector=".very-big-image">
    <h1>Some title</h1>

    <img class="very-big-image" />
</div>
```

In this example, we would like to animate `img-wrapper` element, but observe `very-big-image`. When our image will appear inn viewport, `img-wrapper` will receive `is-in-viewport` class.

## Styling

We can style `InViewport` easily with `CSS` attribute selector, no `JS` animations required.

```scss
[data-in-viewport='fade'] {
    transition: opacity 800ms ease-out;
	opacity: 0;

    &.is-in-viewport {
        opacity: 1;
    }
}
```

## API

### Attributes

 - `data-threshold` - optional, accepts number or array of numbers. Similar like `threshold` in [InterectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)
 - `data-selector` - optional, accepts query selector for nested element to observe for

<!-- TODO: modes: normal, above, always -->

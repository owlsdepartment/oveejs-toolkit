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

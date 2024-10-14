# LazyLoad

The `LazyLoad` component is a wrapper around the [`useLazyLoad`](./composables/README.md) composable, providing a declarative way to use lazy loading in `ovee.js` components.

## Requirements
 - [`vanilla-lazyload`](https://github.com/verlok/vanilla-lazyload)

## Registration and configuration

See [Components instalation](/docs/registration.md)

## Usage example

```html
<img data-src="example.jpg" alt="" data-lazy-load />
<video data-src="example.mp4" data-lazy-load></video>
```

This component is a wrapper for `vanilla-lazyload` library. Here is the full documentation: [https://github.com/verlok/vanilla-lazyload#-getting-started---html]().

To change options you can pass options while registering a component:

```ts
import { LazyLoad } from '@ovee.js/toolkit-integrations/lazy-load'

createApp()
    .component(LazyLoad, { unobserve_entered: true })
```
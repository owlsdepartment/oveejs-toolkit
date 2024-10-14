# useLazyLoad

The `useLazyLoad` function is a composable that integrates the `vanilla-lazyload` library with the `ovee.js` framework to provide lazy loading functionality for images and other elements.

## Usage

```ts
import { useLazyLoad } from '@ovee.js/toolkit-integrations/lazy-load';

export const MyComponent = defineComponent(() => {
	useLazyLoad({
		unobserve_entered: true
	})
});
```

### Parameters

- `options` (optional): An object of type [`ILazyLoadOptions`](https://github.com/verlok/vanilla-lazyload?tab=readme-ov-file#options) that contains configuration options for the `vanilla-lazyload` instance.

### Returns

- `lazyLoadInstance`: A shallow reference to the `ILazyLoadInstance`.
- `destroy`: A function to destroy the `vanilla-lazyload` instance.

### Events

- `lazy-load:loaded`: Emitted when an element is successfully loaded.
- `lazy-load:error`: Emitted when an element fails to load.

### Note

The `useLazyLoad` composable can only be used within a component. It relies on the component's lifecycle hooks (`onMounted` and `onUnmounted`) provided by `ovee.js` to initialize and destroy the `vanilla-lazyload` instance. 
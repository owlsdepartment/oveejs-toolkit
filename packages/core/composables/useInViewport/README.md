# useInViewport

The `useInViewport` function is a composable that allows you to detect when an element enters or exits the viewport using the Intersection Observer API. It provides a reactive `isIntersecting` state and a callback function that is triggered when the element's visibility changes.

### Options

- `callback`: A function that is called whenever the element's intersection state changes. It receives an `IntersectionObserverEntry` object as its argument.
- `options` (optional): An object that extends `IntersectionObserverInit` with additional properties: 
  - `once`: A boolean that determines if the observer should stop observing after the element intersects once. Default is `true`.
  - `shouldRemoveClass`: A boolean that determines if the `is-in-viewport` class should be removed when the element is no longer intersecting. Default is `true`.

The default value of `threshold` is `[0, 1]`.

### Returns

- `isIntersecting`: A reactive reference that indicates whether the element is currently intersecting the viewport.
- `stop`: A function to manually stop observing the element.

### Usage

```ts
import { useInViewport } from '@ovee.js/toolkit';

export const MyComponent = defineComponent((element) => {
    const { stop } = useInViewport((entry) => {
		if(entry.isIntersecting) {
			entry.target.classList.add('is-visible');
		}
	}, {
		once: true,
		threshold: 0
	})
})
```

### Notes

- The `useInViewport` function uses the `useIntersectionObserver` composable from [`@ovee.js/toolkit/composables`](/packages/core//composables/useIntersectionObserver/README.md) to observe the element.
- The `useComponentContext` function from `ovee.js` is used to get the current component's context, specifically the element.
- The `onMounted` and `onUnmounted` lifecycle hooks from `ovee.js` are used to start and stop observing the element.
- When the element intersects the viewport, the `is-in-viewport` class is added to the element. If the `once` option is set to `true` and the element intersects, the observer stops observing. If the `once` option is `false`, the `is-in-viewport` class is removed when the element is no longer intersecting (you can change it with the `shouldRemoveClass` prop).
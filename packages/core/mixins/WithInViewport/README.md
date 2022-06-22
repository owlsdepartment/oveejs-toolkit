# WithInViewport

## Registration and configuration

Configuration via `updateConfig`. See [`updateConfig` helper](/docs/registration.md#updateconfig-helper)

## Usage example

This mixin adds `InViewport` callback method on intersection, with possibility of customizable config

```ts
import { Component } from 'ovee.js'

@register('my-component')
class MyComponent extends WithInViewport(Component) {
	onIntersection(entry) {
		// handle intersection
	}
}
```

Custom `IntersectionObserver` config

```ts
import { Component } from 'ovee.js'

@register('my-component')
class MyComponent extends WithInViewport(Component) {
	onIntersection(entry) {
		// handle intersection
	}
}
```

## API

<!-- TODO: put detailed API specification here -->
### Methods

 - `onIntersection(entry: IntersectionObserverEntry): void` - abstract method that receives entry on every intersection
 - `get observerOptions(): IntersectionObserverInit` - getter for overriding `IntersectionObserver` options. Use `super.observerOptions` to get default options

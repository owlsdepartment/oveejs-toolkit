# ObserveIntersections

## Installation and configuration

See [Components installation](/docs/components_installation.md#other)

## Usage example

This tool improves and simplifies usage of `IntersectionObserver`, by reusing single instances of `IntersectionObserver` with similar parameters for multiple elements. It's API is is similar to [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)

```ts
observeIntersections(
	// target element to watch
	target1,
	// callback called on every intersection update with element entry
	entry => {
		console.log('target isIntersecting: ', entry.isIntersecting)
	},
	// optional options, the same as in IntersectionObserver
	{
		threshold: 0.5
	}
)

// returns callback that can be used later to remove observer
const unobserve = observeIntersections(target2, () => {
	console.log('target2 intersection callback')
}, {
	threshold: [0, 1],
	root: customRoot
})

// ... in some onDestroy callback
unobserve()
```

<!-- TMP -->
Both calls of `observeIntersections` creates only one `IntersectionObserver` instance which is reused again, because they share the same default parameters.

## API

```ts
function observeIntersections(target: Element, callback: (entry: IntersectionObserverEntry) => void, options?: IntersectionObserverInit): () => void;
```

### Parameters

 - `target: Element` - target element to observe
 - `callback: (entry: IntersectionObserverEntry) => void` - callback called with single `IntersectionEntry`
 - `options?: IntersectionObserverInit` - optional options. Same as `options` in [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#parameters)

### Returns

Return value is a callback function to stop observer.

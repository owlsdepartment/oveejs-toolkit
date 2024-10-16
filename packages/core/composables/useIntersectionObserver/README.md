# useIntersectionObserver

## Registration and configuration

No configuration is needed.

## Usage

This composable improves and simplifies usage of `IntersectionObserver`, by reusing single instances of `IntersectionObserver` with similar parameters for multiple elements. It's API is is similar to [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)

```ts
useIntersectionObserver(
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
const unobserve = useIntersectionObserver(target2, () => {
	console.log('target2 intersection callback')
}, {
	threshold: [0, 1],
	root: customRoot
})

// ... in some onDestroy callback
unobserve()
```

<!-- TMP -->
Both calls of `useIntersectionObserver` creates only one `IntersectionObserver` instance which is reused again, because they share the same default parameters.

## API

```ts
function useIntersectionObserver(target: MaybeRefOrGetter<MaybeElement | MaybeElement[]>, callback: (entry: IntersectionObserverEntry) => void, options?: IntersectionObserverInit): () => void;
```

### Parameters

 - `target: MaybeRefOrGetter<MaybeElement | MaybeElement[]>` - the target element(s) to observe. This can be a single element or an array of elements. `MaybeRefOrGetter` allows the target to be a reference or a getter function that returns the element(s).
 - `callback: (entry: IntersectionObserverEntry) => void` - callback called with single `IntersectionEntry`
 - `options?: IntersectionObserverInit` - optional options. Same as `options` in [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#parameters)

### Returns

Return value is a callback function to stop observer.

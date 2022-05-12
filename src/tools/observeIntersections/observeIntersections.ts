export type IntersectionCallback = (entry: IntersectionObserverEntry) => void;
export type ObserversMap = Map<string, ObserverEntry>;
export type Unobserve = () => void;

const rootsMap = new Map<Element | Document | null | undefined, ObserversMap>();

/**
 * Allows you to create a new observer or to connect to the existing one.
 * Returns method to unobserve the element.
 */
export function observeIntersections(
	element: Element,
	callback: IntersectionCallback,
	options: IntersectionObserverInit = {}
): Unobserve {
	const { root = null, rootMargin = '0px 0px 0px 0px', threshold = 0 } = options;

	if (!rootsMap.has(root)) {
		rootsMap.set(root, new Map());
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const map = rootsMap.get(root)!;
	const key = getObserverKey(rootMargin, threshold);

	if (!map.has(key)) {
		map.set(key, new ObserverEntry(key, { root, rootMargin, threshold }));
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const entry = map.get(key)!;

	entry.observe(element, callback);

	return () => entry.unobserve(element);
}

function getObserverKey(rootMargin: string, threshold: number | number[]): string {
	const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : `${threshold}`;

	return `${rootMargin}|${thresholdKey}`;
}

export class ObserverEntry {
	callbacks = new Map<Element, IntersectionCallback>();
	observer: IntersectionObserver;

	constructor(public key: string, public options: IntersectionObserverInit) {
		this.observer = new IntersectionObserver(entries => {
			for (const entry of entries) {
				if (this.callbacks.has(entry.target)) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const cb = this.callbacks.get(entry.target)!;

					cb(entry);
				}
			}
		}, options);
	}

	// allow multiple callbacks in the future
	observe(element: Element, callback: IntersectionCallback) {
		if (this.callbacks.has(element)) return;

		this.observer.observe(element);
		this.callbacks.set(element, callback);
	}

	unobserve(element: Element) {
		this.observer.unobserve(element);
		this.callbacks.delete(element);

		this.tryToDestroy();
	}

	tryToDestroy() {
		if (this.callbacks.size > 0) return;

		this.observer.disconnect();

		rootsMap.get(this.options.root)?.delete(this.key);
	}
}

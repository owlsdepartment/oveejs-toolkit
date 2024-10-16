/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad and https://github.com/vueuse/ */

import { onUnmounted, ref } from 'ovee.js';

const queries = new Map<string, MediaQueryList>();
const isSupported = window && 'matchMedia' in window && typeof window.matchMedia === 'function';

export function useMediaQuery(query: string) {
	let mediaQuery: MediaQueryList | undefined;
	const matches = ref(false);

	init();

	function handler(event: MediaQueryListEvent) {
		matches.value = event.matches;
	}

	function cleanup() {
		if (!mediaQuery) {
			return;
		}

		if ('removeEventListener' in mediaQuery) {
			mediaQuery.removeEventListener('change', handler);
		} else {
			// @ts-expect-error deprecated API
			mediaQuery.removeListener(handler);
		}

		queries.delete(query);
	}

	function init() {
		if (!isSupported) {
			return;
		}

		mediaQuery = queries.get(query);

		if (!mediaQuery) {
			mediaQuery = window.matchMedia(query);
			queries.set(query, mediaQuery);
		}

		if ('addEventListener' in mediaQuery) {
			mediaQuery.addEventListener('change', handler);
		} else {
			// @ts-expect-error deprecated API
			mediaQuery.addListener(handler);
		}

		matches.value = mediaQuery.matches;
	}

	onUnmounted(() => {
		cleanup();
		mediaQuery = undefined;
	});

	return matches;
}

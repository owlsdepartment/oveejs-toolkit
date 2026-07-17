import { useIntersectionObserver } from '@ovee.js/toolkit';
import isNumber from 'lodash/isNumber';
import { computed, onUnmounted, Ref, ref, useComponentContext, useDataAttr } from 'ovee.js';

export type UseInViewportOptions = IntersectionObserverInit & {
	once?: boolean;
	shouldRemoveClass?: boolean;
};

export interface UseInViewportReturn {
	isIntersecting: Ref<boolean>;
	stop: () => void;
}

export function useInViewport(
	callback: (entry: IntersectionObserverEntry) => void,
	options: UseInViewportOptions = {
		threshold: [0, 1],
		once: true,
		shouldRemoveClass: true,
	}
) {
	const { element } = useComponentContext();
	const dataThreshold = useDataAttr('threshold');
	const dataSelector = useDataAttr('selector');
	const isIntersecting = ref(false);

	const threshold = computed<number | number[]>(() => {
		if (dataThreshold.value == null) {
			return options.threshold ?? 0;
		}

		try {
			const parsed = JSON.parse(dataThreshold.value);

			return Array.isArray(parsed) || isNumber(parsed) ? parsed : options.threshold ?? 0;
		} catch {
			const numeric = Number(dataThreshold.value);

			return Number.isNaN(numeric) ? options.threshold ?? 0 : numeric;
		}
	});

	const target = computed(() => {
		return dataSelector.value ? element.querySelector<HTMLElement>(dataSelector.value) : element;
	});

	const shouldRemoveClass = options?.shouldRemoveClass ?? true;

	const unobserver = useIntersectionObserver(
		target,
		entry => {
			isIntersecting.value = entry.isIntersecting;

			if (entry.isIntersecting) {
				entry.target.classList.add('is-in-viewport');

				if (options?.once) {
					unobserver?.();
				}
			} else {
				if (shouldRemoveClass) {
					entry.target.classList.remove('is-in-viewport');
				}
			}

			callback(entry);
		},
		{
			...options,
			threshold: threshold.value,
		}
	);

	onUnmounted(() => {
		unobserver?.();
	});

	return {
		isIntersecting,
		stop: unobserver,
	};
}

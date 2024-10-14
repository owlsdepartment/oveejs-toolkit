import { observeIntersections, Unobserve } from '@ovee.js/toolkit/tools';
import { isNumber } from 'lodash';
import { computed, onMounted, onUnmounted, ref, useComponentContext, useDataAttr } from 'ovee.js';

export type UseInViewportOptions = IntersectionObserverInit & {
	once?: boolean;
	shouldRemoveClass?: boolean;
};

export function useInViewport(
	callback: (entry: IntersectionObserverEntry) => void,
	options: UseInViewportOptions = {
		threshold: [0, 1],
		once: true,
		shouldRemoveClass: true,
	}
) {
	let unobserver: Unobserve | undefined;

	const { element } = useComponentContext();
	const dataThreshold = useDataAttr('threshold');
	const dataSelector = useDataAttr('selector');
	const isIntersecting = ref(false);

	const threshold = computed<number | number[]>(() => {
		const parsed = JSON.parse(dataThreshold.value ?? `${options?.threshold ?? '0'}`);

		return Array.isArray(parsed) || isNumber(parsed) ? parsed : options.threshold ?? 0;
	});

	const target = computed(() => {
		return dataSelector.value ? element.querySelector<HTMLElement>(dataSelector.value) : element;
	});

	onMounted(() => {
		if (!target.value) {
			return;
		}

		const shouldRemoveClass = options?.shouldRemoveClass ?? true;

		unobserver = observeIntersections(
			target.value,
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
	});

	onUnmounted(() => {
		unobserver?.();
	});

	return {
		isIntersecting,
		stop: unobserver,
	};
}

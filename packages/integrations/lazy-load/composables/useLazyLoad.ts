import { onMounted, onUnmounted, ref, shallowRef, useComponentContext } from 'ovee.js';
import VanillaLazyLoad, { ILazyLoadInstance, ILazyLoadOptions } from 'vanilla-lazyload';

export function useLazyLoad(options?: ILazyLoadOptions) {
	const { element, emit } = useComponentContext();
	const lazyLoadInstance = shallowRef<ILazyLoadInstance>();
	const isDestroying = ref(false);

	options ??= {};

	onMounted(() => {
		if (!element.dataset.src) {
			return;
		}

		lazyLoadInstance.value = new VanillaLazyLoad(
			{
				...options,
				callback_loaded: (el, instance) => {
					options?.callback_loaded?.(el, instance);
					emit('lazy-load:loaded');
				},
				callback_error: (el, instance) => {
					options?.callback_error?.(el, instance);
					emit('lazy-load:error');
				},
			},
			[element] as unknown as NodeListOf<HTMLElement>
		);
	});

	onUnmounted(destroy);

	// https://github.com/verlok/vanilla-lazyload/blob/50a721a8dc7712870488877e6933925d45549e1a/demos/restore_destroy.html#L497
	function destroy() {
		if (!lazyLoadInstance.value || isDestroying.value) {
			return;
		}

		isDestroying.value = true;

		const destroyInterval = setInterval(function () {
			if ((lazyLoadInstance.value?.loadingCount ?? 0) > 0) {
				return;
			}

			clearInterval(destroyInterval);

			lazyLoadInstance.value?.destroy();
			lazyLoadInstance.value = undefined;
		}, 250);
	}

	return {
		lazyLoadInstance,
		destroy,
	};
}

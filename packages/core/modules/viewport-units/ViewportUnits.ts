import { computed, ComputedRef, defineModule, onInit, ref } from 'ovee.js';

declare module 'ovee.js' {
	interface App {
		$vh: ComputedRef<number>;
		$vw: ComputedRef<number>;
	}
}

export const ViewportUnits = defineModule(({ app }) => {
	const vh = ref(0);
	const vw = ref(0);

	onInit(() => {
		app.$vh = computed(() => vh.value);
		app.$vw = computed(() => vh.value);
		app.$on('resize', updateUnits, { target: window });

		updateUnits();
	});

	function updateUnits() {
		vh.value = document.documentElement.clientHeight / 100;
		vw.value = window.innerWidth / 100;

		document.documentElement.style.setProperty('--vh', `${vh.value}px`);
		document.documentElement.style.setProperty('--vw', `${vw.value}px`);
	}

	return {
		vh,
		vw,
		updateUnits,
	};
});

import { defineModule, onInit, ref } from 'ovee.js';

export const ViewportUnits = defineModule(({ app }) => {
	const vh = ref(0);
	const vw = ref(0);

	onInit(() => {
		updateUnits();

		app.$on('resize', updateUnits, { target: window });
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

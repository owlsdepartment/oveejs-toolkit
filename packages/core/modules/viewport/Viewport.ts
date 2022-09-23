import { ComputedRef, makeComputed, Module, ref } from 'ovee.js';

declare module 'ovee.js' {
	interface App {
		$vh: ComputedRef<number>;
		$vw: ComputedRef<number>;
	}
}

export class Viewport extends Module {
	vh = ref(0);
	vw = ref(0);

	init() {
		this.updateUnits();
		this.$app.$on('resize', () => this.updateUnits(), { target: window });

		this.$app.$vh = makeComputed(() => this.vh.value);
		this.$app.$vw = makeComputed(() => this.vw.value);
	}

	updateUnits() {
		this.vh.value = document.documentElement.clientHeight / 100;
		this.vw.value = window.innerWidth / 100;

		window.document.documentElement.style.setProperty('--vh', `${this.vh.value}px`);
		window.document.documentElement.style.setProperty('--vw', `${this.vw.value}px`);
	}

	static getName() {
		return 'Viewport';
	}
}

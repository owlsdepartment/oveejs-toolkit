import { ComputedRef, makeComputed, Module, reactive } from 'ovee.js';

declare module 'ovee.js' {
	interface App {
		$vh: ComputedRef<number>;
		$vw: ComputedRef<number>;
	}
}

export class Viewport extends Module {
	@reactive() vh = 0;
	@reactive() vw = 0;

	init() {
		this.updateUnits();
		this.$app.$on('resize', window as any, () => this.updateUnits());

		this.$app.$vh = makeComputed(() => this.vh);
		this.$app.$vw = makeComputed(() => this.vw);
	}

	updateUnits() {
		this.vh = document.documentElement.clientHeight / 100;
		this.vw = window.innerWidth / 100;

		window.document.documentElement.style.setProperty('--vh', `${this.vh}px`);
		window.document.documentElement.style.setProperty('--vw', `${this.vw}px`);
	}

	static getName() {
		return 'Viewport';
	}
}

import { ComputedRef, makeComputed, Module, reactive } from 'ovee.js';

declare module 'ovee.js' {
	interface App {
		$vh: ComputedRef<number>;
	}
}

export class VhFix extends Module {
	@reactive()
	vh = 0;

	init() {
		this.updateVh();
		this.$app.$on('resize', window as any, () => this.updateVh());

		this.$app.$vh = makeComputed(() => this.vh);
	}

	updateVh() {
		this.vh = window.innerHeight / 100;
		window.document.documentElement.style.setProperty('--vh', `${this.vh}px`);
	}

	static getName() {
		return 'VhFix';
	}
}

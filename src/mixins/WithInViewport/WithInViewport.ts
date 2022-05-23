import { ClassConstructor, Component } from 'ovee.js';

import { observeIntersections, Unobserve } from '@/tools';

const DEFAULT_THRESHOLD = [0, 1];

export function WithInViewport<Base extends ClassConstructor<Component>>(Ctor: Base) {
	class _WithInViewport extends Ctor {
		unobserve?: Unobserve;

		get observerOptions(): IntersectionObserverInit {
			return {
				threshold: WithInViewport.config,
			};
		}

		init() {
			super.init();

			this.unobserve = observeIntersections(
				this.$element,
				entry => {
					this.onIntersection(entry);
				},
				this.observerOptions
			);
		}

		destroy() {
			this.unobserve?.();

			super.destroy();
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onIntersection(entry: IntersectionObserverEntry) {
			//
		}
	}

	return _WithInViewport;
}

WithInViewport.config = DEFAULT_THRESHOLD as number | number[];

import { observeIntersections, Unobserve } from '@ovee.js/toolkit/tools';
import { isNumber } from 'lodash';
import { Component, dataParam, register } from 'ovee.js';

export interface InViewportOptions {
	threshold: number;
}

export const IN_VIEWPORT_DEFAULT_OPTIONS: InViewportOptions = {
	threshold: 0.5,
};

@register('in-viewport')
export class InViewport extends Component {
	unonbserve?: Unobserve;

	@dataParam('threshold')
	_threshold = `${this.options.threshold}`;

	@dataParam()
	selector = '';

	get options(): InViewportOptions {
		return {
			...IN_VIEWPORT_DEFAULT_OPTIONS,
			...this.$options,
		};
	}

	get threshold(): number | number[] {
		const parsed = JSON.parse(this._threshold);

		return Array.isArray(parsed) || isNumber(parsed) ? parsed : this.options.threshold;
	}

	init() {
		const $el = this.$element as HTMLElement;
		const context = $el.dataset.selector ? $el.querySelector($el.dataset.selector) ?? $el : $el;

		this.unonbserve = observeIntersections(
			context,
			entry => {
				if (entry.isIntersecting) {
					this.showTarget(entry.target);
				}
			},
			{ threshold: this.threshold }
		);
	}

	destroy() {
		this.unonbserve?.();
	}

	showTarget(target: Element) {
		target.classList.add('is-in-viewport');
	}
}

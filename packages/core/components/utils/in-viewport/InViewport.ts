import { observeIntersections, Unobserve } from '@ovee.js/toolkit/tools';
import { isNumber } from 'lodash';
import { Component, dataParam, register } from 'ovee.js';

export interface InViewportConfig {
	threshold: number;
}

export const IN_VIEWPORT_DEFAULT_CONFIG: InViewportConfig = {
	threshold: 0.5,
};

@register('in-viewport')
export class InViewport extends Component {
	static config: InViewportConfig = IN_VIEWPORT_DEFAULT_CONFIG;

	unonbserve?: Unobserve;

	@dataParam('threshold')
	_threshold = `${InViewport.config.threshold}`;

	@dataParam()
	selector = '';

	get threshold(): number | number[] {
		const parsed = JSON.parse(this._threshold);

		return Array.isArray(parsed) || isNumber(parsed) ? parsed : InViewport.config.threshold;
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

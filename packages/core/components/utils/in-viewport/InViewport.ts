import { observeIntersections, Unobserve } from '@ovee.js/toolkit/tools';
import { isNumber } from 'lodash';
import { Component, dataParam, register } from 'ovee.js';

export interface InViewportOptions {
	threshold: number;
}

@register('in-viewport')
export class InViewport extends Component {
	static defaultOptions(): InViewportOptions {
		return {
			threshold: 0.5,
		};
	}

	unonbserve?: Unobserve;

	@dataParam('threshold')
	_threshold = `${this.options.threshold}`;

	@dataParam()
	selector = '';

	get threshold(): number | number[] {
		const parsed = JSON.parse(this._threshold);

		return Array.isArray(parsed) || isNumber(parsed) ? parsed : this.options.threshold;
	}

	get options() {
		return this.$options;
	}

	init() {
		const { $element } = this;
		const context = $element.dataset.selector
			? $element.querySelector($element.dataset.selector) ?? $element
			: $element;

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

import { isNumber } from 'lodash';
import { Component, dataParam, register } from 'ovee.js';

const DEFAULT_THRESHOLD = 0.5;

@register('in-viewport')
export class InViewport extends Component {
	observer: IntersectionObserver;

	@dataParam('threshold')
	_threshold = '0.3';

	get threshold(): number | number[] {
		const parsed = JSON.parse(this._threshold);

		return Array.isArray(parsed) || isNumber(parsed) ? parsed : DEFAULT_THRESHOLD;
	}

	init() {
		this.observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						this.showTarget(entry.target);
					}
				});
			},
			{ threshold: this.threshold }
		);

		this.observer.observe(this.$element);
	}

	destroy() {
		this.observer.disconnect();
	}

	showTarget(target: Element) {
        target.classList.add('is-in-viewport');
	}
}

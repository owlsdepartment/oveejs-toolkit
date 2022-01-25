import { isNumber } from 'lodash';
import { Component, dataParam, register } from 'ovee.js';

export interface InViewportConfig {
    threshold: number;
}

export const DEFAULT_CONFIG: InViewportConfig = {
    threshold: 0.5
}

@register('in-viewport')
export class InViewport extends Component {
    static config: InViewportConfig = DEFAULT_CONFIG;

	observer: IntersectionObserver;

	@dataParam('threshold')
	_threshold = `${InViewport.config.threshold}`;

	get threshold(): number | number[] {
		const parsed = JSON.parse(this._threshold);

		return Array.isArray(parsed) || isNumber(parsed) ? parsed : InViewport.config.threshold;
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

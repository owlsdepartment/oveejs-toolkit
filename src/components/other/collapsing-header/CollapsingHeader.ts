import { isNumber, throttle } from 'lodash';
import { Component, dataParam, register } from 'ovee.js';

export type TriggerOffsetConst = 'window' | 'header' | 'none' | 'default';
export type TriggerOffset = TriggerOffsetConst | string;

const calcOffsetMap: Record<
	TriggerOffsetConst | 'triggerPoint',
	(self: CollapsingHeader) => number | undefined
> = {
	window: self => {
		return window.innerHeight * self.multiplier;
	},
	header: self => {
		return self.headerHeight * self.multiplier;
	},
	none: self => {
		let offset = 0;
		if (self.collapsingHeader === 'sticky') {
			offset = self.headerHeight;
		}

		return offset;
	},
	default: self => {
		return self.numberOffset;
	},
	triggerPoint: self => {
		self.triggerEl = self.html.querySelector(self.triggerOffset);

		if (self.triggerEl) {
			return self.triggerEl.getBoundingClientRect().top;
		}

		return self.numberOffset;
	},
};

export interface CollapsingHeaderConfig {
	throttle: number;
}

export const COLLAPSING_HEADER_DEFAULT_CONFIG: CollapsingHeaderConfig = {
	throttle: 100,
};

@register('collapsing-header')
export class CollapsingHeader extends Component {
	static config: CollapsingHeaderConfig = COLLAPSING_HEADER_DEFAULT_CONFIG;

	@dataParam()
	collapsingHeader: string;

	@dataParam()
	triggerOffset: TriggerOffset = 'default';

	@dataParam()
	offsetMultiplier: string;

	@dataParam('throttleValue')
	_throttleValue = `${CollapsingHeader.config.throttle}`;

	html: HTMLElement;
	triggerEl: HTMLElement | null;

	currentPosition = 0;
	lastPosition = 0;
	headerHeight: number;
	numberOffset = 0;

	isScrollingDown = true;
	pastTrigger = false;

	scrollListener: any;

	get throttleValue(): number {
		const parsed = JSON.parse(this._throttleValue);

		return isNumber(parsed) ? parsed : CollapsingHeader.config.throttle;
	}

	get isShown() {
		return this.html.classList.contains('header-visible');
	}

	get isModified() {
		return this.html.classList.contains('header-modified');
	}

	get isCollapsed() {
		return this.html.classList.contains('header-collapsed');
	}

	get multiplier() {
		return this.offsetMultiplier ? parseFloat(parseFloat(this.offsetMultiplier).toPrecision(2)) : 1;
	}

	init() {
		this.html = document.documentElement;
		this.headerHeight = this.$element.getBoundingClientRect().height;

		if (this.collapsingHeader === 'sticky') {
			this.numberOffset = window.innerHeight;
			this.scrollListener = throttle(this.scrollSticky, this.throttleValue);
		} else if (this.collapsingHeader === 'fixed') {
			this.scrollListener = throttle(this.scrollFixed, this.throttleValue);
		} else {
			this.scrollListener = throttle(this.scrollCollapsing, this.throttleValue);
		}

		this.calcOffsets();
		this.bind();
	}

	show() {
		if (!this.isShown) {
			this.html.classList.add('header-visible');
		}
	}

	hide() {
		if (this.isShown) {
			this.html.classList.remove('header-visible');
		}
	}

	collapse() {
		if (!this.isCollapsed) {
			this.html.classList.add('header-collapsed');
		}
	}

	uncollapse() {
		if (this.isCollapsed) {
			this.html.classList.remove('header-collapsed');
		}
	}

	addModifier() {
		if (!this.isModified) {
			this.html.classList.add('header-modified');
		}
	}

	removeModifier() {
		if (this.isModified) {
			this.html.classList.remove('header-modified');
		}
	}

	calcOffsets() {
		if (this.triggerOffset in calcOffsetMap) {
			this.numberOffset =
				calcOffsetMap[this.triggerOffset as TriggerOffsetConst](this) ?? this.numberOffset;
		} else {
			this.numberOffset = calcOffsetMap.triggerPoint(this) ?? this.numberOffset;
		}
	}

	scrollStart() {
		this.currentPosition = window.pageYOffset || document.documentElement.scrollTop;
		this.isScrollingDown = !(this.currentPosition < this.lastPosition);
		this.pastTrigger = this.currentPosition > this.numberOffset;
	}

	scrollEnd() {
		this.lastPosition = this.currentPosition;
	}

	scrollSticky() {
		this.scrollStart();

		if (!this.isScrollingDown && this.pastTrigger) {
			this.show();
		} else {
			this.hide();
		}

		if (this.pastTrigger) {
			this.addModifier();
		} else {
			this.removeModifier();
		}

		this.scrollEnd();
	}

	scrollFixed() {
		this.scrollStart();

		if (this.pastTrigger) {
			this.addModifier();
		} else {
			this.removeModifier();
		}

		this.scrollEnd();
	}

	scrollCollapsing() {
		this.scrollStart();

		if (!this.isScrollingDown) {
			this.uncollapse();
		} else {
			this.collapse();
		}

		if (this.pastTrigger) {
			this.addModifier();
		} else {
			this.removeModifier();
		}

		this.scrollEnd();
	}

	bind() {
		this.$on('scroll load ajaxload', window as any, this.scrollListener);
		this.$on('resize', window as any, this.calcOffsets);
	}

	destroy() {
		this.$off('scroll load ajaxload', window as any, this.scrollListener);
		this.$off('resize', window as any, this.calcOffsets);
	}
}

import { bind, Component, dataParam, emitEvent, Logger, register } from 'ovee.js';

type toggleEvent = CustomEvent<boolean>;

const logger = new Logger('NavToggle');
const DEFAULT_NAV_NAME = 'menu';

@register('nav-toggle')
export class NavToggle extends Component {
	nav: HTMLElement;
	animStarted: boolean;
	html = document.documentElement;

	@dataParam('navToggle')
	navName: string;

	@dataParam('nav')
	navSelector: string;

	@dataParam('showImmediately')
	protected _showImmediately: string;

	@dataParam('hideImmediately')
	protected _hideImmediately: string;

	isOpen = false;

	get showImmediately() {
		return this._showImmediately === 'true';
	}

	get hideImmediately() {
		return this._hideImmediately === 'true';
	}

	init() {
		if (!this.navName) {
			this.navName = DEFAULT_NAV_NAME;
		}

		if (!this.navSelector) {
			logger.error(`Attribute 'data-nav' with value is required`);
			return;
		}

		const nav = document.querySelector<HTMLElement>(this.navSelector);

		if (!nav) {
			logger.error(`Could not find nav with selector: '${this.navSelector}'`);
			return;
		}

		this.nav = nav;

		this.bind();
	}

	bind() {
		this.$on('nav-toggle:show', this.onNavShow);
		this.$on('nav-toggle:hide', this.onNavHide);
		this.$on('transitionstart', this.animStart, { target: this.nav });
		this.$on('transitionend', this.animEnd, { target: this.nav });
	}

	@bind('click')
	onClick(e: Event) {
		e.preventDefault();
		e.stopPropagation();

		if (this.isOpen) {
			this.hide(this.hideImmediately);
		} else {
			this.show(this.showImmediately);
		}
	}

	onNavShow(e: toggleEvent) {
		this.show(e.detail);
	}

	onNavHide(e: toggleEvent) {
		this.hide(e.detail);
	}

	animStart(e: Event) {
		if (e.target !== this.nav) {
			return;
		}

		if (this.animStarted) {
			return;
		}

		this.animStarted = true;

		if (this.isOpen) {
			this.html.classList.add(`${this.navName}-anim`);
		} else {
			this.html.classList.add(`${this.navName}-hide-anim`);
		}
	}

	animEnd(e: Event) {
		if (e.target !== this.nav) {
			return;
		}

		if (!this.animStarted) {
			return;
		}

		this.animStarted = false;

		if (this.isOpen) {
			this.html.classList.remove(`${this.navName}-anim`);
		} else {
			this.html.classList.remove(`${this.navName}-hide-anim`);
		}
	}

	show(immediately = false) {
		this.isOpen = true;

		if (immediately) {
			this.html.classList.add(`${this.navName}-show-immediately`);

			requestAnimationFrame(() => {
				this.html.classList.remove(`${this.navName}-show-immediately`);
			});
		}

		this.html.classList.add(`${this.navName}-visible`);
		this.$element.setAttribute('aria-expanded', 'true');

		this.$emit('nav-toggle:visible', this.$element);
		emitEvent(window as any, 'nav-toggle:visible', {
			element: this.$element,
			navName: this.navName,
		});
	}

	hide(immediately = false) {
		this.isOpen = false;

		if (immediately) {
			this.html.classList.add(`${this.navName}-hide-immediately`);

			requestAnimationFrame(() => {
				this.html.classList.remove(`${this.navName}-hide-immediately`);
			});
		}

		this.html.classList.remove(`${this.navName}-visible`);
		this.$element.setAttribute('aria-expanded', 'false');

		this.$emit('nav-toggle:hidden', this.$element);
		emitEvent(window as any, 'nav-toggle:hidden', {
			element: this.$element,
			navName: this.navName,
		});
	}
}

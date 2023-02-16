import { bind, Component, dataParam, Logger, register } from 'ovee.js';

export interface BaseCookiesOptions {
	storageKey: string;
}

const logger = new Logger('BaseCookies');

@register('base-cookies')
export class BaseCookies extends Component<HTMLElement, BaseCookiesOptions> {
	storageKey: string;

	@dataParam('storageKey')
	_storageKey?: string;

	get cookiesAccepted(): boolean {
		return localStorage.getItem(this.storageKey) === 'true';
	}

	static defaultOptions(): BaseCookiesOptions {
		return {
			storageKey: 'cookies_accepted',
		};
	}

	get options() {
		return this.$options;
	}

	init() {
		const key = this._storageKey || this.options.storageKey;

		if (!key) {
			logger.error(
				`No 'storageKey' option is provided via config nor via data param. This option is required`
			);

			return;
		}

		this.storageKey = key;

		this.statusCheck();
	}

	@bind('storage', { target: window })
	statusCheck() {
		if (!this.cookiesAccepted) {
			this.showPopup();
		} else {
			this.hidePopup();
		}
	}

	@bind('click', { target: '.cookies__button' })
	onClick() {
		this.hidePopup();
	}

	showPopup() {
		this.$element.classList.add('is-visible');
		this.$element.setAttribute('aria-hidden', 'false');
	}

	hidePopup() {
		localStorage.setItem(this.storageKey, 'true');
		this.$element.classList.remove('is-visible');
		this.$element.setAttribute('aria-hidden', 'true');
	}
}

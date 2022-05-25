import { Component, register, bind, Logger } from 'ovee.js';

const logger = new Logger('BaseCookies');

@register('base-cookies')
export default class extends Component {
	siteUrl: string | undefined;
	storageKey: string;
	$element: any;

	init() {
		this.siteUrl = document.body.dataset.baseHref;
        this.statusCheck = this.statusCheck.bind(this);
        this.storageKey = `${this.siteUrl}cookies_accepted`;

		this.statusCheck();
		this.bind();
    }
    
    get cookiesAccepted() {
        return localStorage.getItem(this.storageKey);
    }

    hidePopup() {
        localStorage.setItem(this.storageKey, 'true');
        this.$element.classList.remove('is-visible');
        this.$element.setAttribute('aria-hidden', 'true');
    }

    showPopup() {
        this.$element.classList.add('is-visible');
		this.$element.setAttribute('aria-hidden', 'false');
    }

	statusCheck() {
		if(!this.cookiesAccepted) {
			this.showPopup()
		} else {
			this.hidePopup();
		}
    }
    
    @bind('click', '.cookies__button')
    clsButtonClick() {
        this.hidePopup();
    }

	bind() {
		this.$on('storage', window, this.statusCheck);
    }
    
    destroy() {
        this.$off('storage', window, this.statusCheck);
    }
}

import { CookiesConsent } from '@ovee.js/toolkit/modules';
import { defineComponent, Logger, useModule, watch } from 'ovee.js';

const logger = new Logger('BaseCookiesEdit');

export const BaseCookiesEdit = defineComponent<HTMLElement>((element, { on }) => {
	const moduleInstance = useModule(CookiesConsent, true);

	if (!moduleInstance) {
		logger.warn(`Module 'CookiesConsent' is required for BaseCookiesEdit.`);
		return;
	}
	const consent = moduleInstance;

	render();
	watch(consent.hasInteracted, render);
	watch(consent.isOpen, render);

	on('click', event => {
		event.preventDefault();
		consent.open('manage');
	});

	function render() {
		const visible = consent.hasInteracted.value;
		element.classList.toggle('is-visible', visible);
		element.setAttribute('aria-hidden', visible ? 'false' : 'true');
		element.setAttribute('aria-expanded', consent.isOpen.value ? 'true' : 'false');
	}
});

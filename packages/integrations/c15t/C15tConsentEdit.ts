import { defineComponent, Logger, useModule, watch } from 'ovee.js';

import { C15tConsentModule } from './C15tConsentModule';

const logger = new Logger('C15tConsentEdit');

export const C15tConsentEdit = defineComponent<HTMLElement>((element, { on }) => {
	const moduleInstance = useModule(C15tConsentModule, true);

	if (!moduleInstance) {
		logger.warn(`Module 'C15tConsentModule' is required for C15tConsentEdit.`);
		return;
	}

	const consent = moduleInstance;

	render();
	watch(consent.hasConsented, render);
	watch(consent.activeUI, render);

	on('click', event => {
		event.preventDefault();
		consent.openPreferences();
	});

	function render() {
		const visible = consent.hasConsented.value;

		element.classList.toggle('is-visible', visible);
		element.setAttribute('aria-hidden', visible ? 'false' : 'true');
		element.setAttribute('aria-expanded', consent.activeUI.value === 'dialog' ? 'true' : 'false');
	}
});

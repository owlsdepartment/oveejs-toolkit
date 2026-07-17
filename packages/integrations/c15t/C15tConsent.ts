import { defineComponent, Logger, onMounted, useModule, watch } from 'ovee.js';

import { C15tConsentModule } from './C15tConsentModule';

const logger = new Logger('C15tConsent');

export const C15tConsent = defineComponent<HTMLElement>((element, { on }) => {
	const moduleInstance = useModule(C15tConsentModule, true);

	if (!moduleInstance) {
		logger.warn(`Module 'C15tConsentModule' is required for C15tConsent.`);
		return;
	}

	const consent = moduleInstance;

	onMounted(() => {
		render();
		syncCheckboxes();
	});

	watch(consent.activeUI, () => {
		render();
		syncCheckboxes();
	});

	on('click', handleButtonClick);
	on('change', handleGroupChange, { target: '[data-c15t-group]' });

	function handleButtonClick(event: Event) {
		const target = event.target as HTMLElement;
		const button = target.closest<HTMLElement>('[data-button]');

		if (!button) {
			return;
		}

		event.preventDefault();

		const action = button.dataset.button;

		if (action === 'accept-all') {
			void consent.saveAll();
		} else if (action === 'reject-all' || action === 'deny-all') {
			void consent.saveNecessary();
		} else if (action === 'manage') {
			consent.openPreferences();
		} else if (action === 'save-selected') {
			stageAllCheckboxes();
			void consent.saveCustom();
		} else if (action === 'back-banner' || action === 'back-basic') {
			consent.openBanner();
		} else if (action === 'close') {
			void consent.saveNecessary();
		}
	}

	function handleGroupChange(event: Event) {
		const checkbox = event.target as HTMLInputElement;

		if (!checkbox.name || checkbox.disabled) {
			return;
		}

		consent.stageConsent(checkbox.name, checkbox.checked);
	}

	function stageAllCheckboxes() {
		element.querySelectorAll<HTMLInputElement>('[data-c15t-group]').forEach(checkbox => {
			if (!checkbox.name || checkbox.disabled) {
				return;
			}

			consent.stageConsent(checkbox.name, checkbox.checked);
		});
	}

	function syncCheckboxes() {
		if (consent.activeUI.value !== 'dialog') {
			return;
		}

		const selected = consent.getSelectedConsents();

		element.querySelectorAll<HTMLInputElement>('[data-c15t-group]').forEach(checkbox => {
			if (!checkbox.name || checkbox.disabled) {
				return;
			}

			const value = selected[checkbox.name];

			if (value !== undefined) {
				checkbox.checked = value;
			}
		});
	}

	function render() {
		const ui = consent.activeUI.value;
		const visible = ui !== 'none';

		element.classList.toggle('is-visible', visible);
		element.setAttribute('aria-hidden', visible ? 'false' : 'true');

		element.querySelectorAll<HTMLElement>('[data-c15t-dialog]').forEach(dialog => {
			const panelId = dialog.dataset.c15tDialog;

			dialog.hidden = panelId !== ui;
		});
	}
});

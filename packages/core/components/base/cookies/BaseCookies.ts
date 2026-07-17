import { CookiesConsent, CookiesConsentValues } from '@ovee.js/toolkit/modules';
import { defineComponent, Logger, onMounted, useDataAttr, useModule, watch } from 'ovee.js';

export interface BaseCookiesOptions {
	storageKey?: string;
}

const logger = new Logger('BaseCookies');

export const BaseCookies = defineComponent<HTMLElement, BaseCookiesOptions>(
	(element, { on }, options) => {
		const moduleInstance = useModule(CookiesConsent, true);
		const storageKeyAttr = useDataAttr('storage-key');

		if (!moduleInstance) {
			logger.warn(`Module 'CookiesConsent' is required for BaseCookies.`);
			return;
		}
		const consent = moduleInstance;

		onMounted(() => {
			const key = storageKeyAttr.value || options?.storageKey;

			if (key) {
				consent.setStorageKey(key);
			}

			render();
			syncInputsFromState();
		});

		watch(consent.mode, () => {
			render();
			syncInputsFromState();
		});

		watch(consent.isOpen, render);
		watch(consent.hasInteracted, render);
		watch(consent.values, syncInputsFromState, { deep: true });

		on('click', handleButtonClick);
		on('change', syncPreviewState, { target: '[data-cookies-group]' });

		function handleButtonClick(event: Event) {
			const target = event.target as HTMLElement;
			const button = target.closest<HTMLElement>('[data-button]');

			if (!button) {
				return;
			}

			event.preventDefault();

			const action = button.dataset.button;
			if (!action) {
				return;
			}

			if (action === 'accept-all') {
				consent.acceptAll();
				return;
			}

			if (action === 'deny-all' || action === 'reject-all') {
				consent.denyAll();
				return;
			}

			if (action === 'manage') {
				consent.open('manage');
				return;
			}

			if (action === 'save-selected') {
				consent.saveSelected(readFormValues());
				return;
			}

			if (action === 'back-basic' || action === 'back-banner') {
				consent.open('basic');
				return;
			}

			if (action === 'close') {
				consent.close();
			}
		}

		function readFormValues(): Partial<CookiesConsentValues> {
			const checkboxes = element.querySelectorAll<HTMLInputElement>('[data-cookies-group]');
			const selected: Partial<CookiesConsentValues> = {};

			checkboxes.forEach(checkbox => {
				const key = checkbox.name as keyof CookiesConsentValues;
				if (!checkbox.name || checkbox.disabled) {
					return;
				}

				selected[key] = checkbox.checked as never;
			});

			return selected;
		}

		function syncInputsFromState() {
			const values = consent.values;
			const checkboxes = element.querySelectorAll<HTMLInputElement>('[data-cookies-group]');

			checkboxes.forEach(checkbox => {
				const key = checkbox.name as keyof CookiesConsentValues;
				if (!key || !(key in values)) {
					return;
				}

				checkbox.checked = !!values[key];
			});

			syncPreviewState();
		}

		function syncPreviewState() {
			element.querySelectorAll<HTMLElement>('[data-cookies-state-key]').forEach(stateEl => {
				const key = stateEl.dataset.cookiesStateKey;
				if (!key) {
					return;
				}

				const checkbox = element.querySelector<HTMLInputElement>(
					`[data-cookies-group][name="${key}"]`
				);
				const value = checkbox
					? checkbox.checked
					: !!consent.values[key as keyof CookiesConsentValues];
				stateEl.textContent = value ? 'granted' : 'denied';
			});
		}

		function render() {
			const open = consent.isOpen.value;
			const activeMode = consent.mode.value;

			element.classList.toggle('is-visible', open);
			element.classList.toggle('cookies-manage', open && activeMode === 'manage');
			element.setAttribute('aria-hidden', open ? 'false' : 'true');

			element.querySelectorAll<HTMLElement>('[data-cookies-dialog]').forEach(dialog => {
				dialog.hidden = dialog.dataset.cookiesDialog !== activeMode;
			});
		}
	}
);

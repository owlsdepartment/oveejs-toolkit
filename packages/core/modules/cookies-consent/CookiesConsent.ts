import { computed, defineModule, onDestroy, onInit, reactive, readonly, Ref, ref } from 'ovee.js';

export type CookiesConsentMode = 'basic' | 'manage';

export interface CookiesConsentValues {
	required: true;
	analytics_storage: boolean;
	ad_storage: boolean;
	ad_user_data: boolean;
	ad_personalization: boolean;
}

export interface CookiesConsentState {
	isOpen: boolean;
	mode: CookiesConsentMode;
	hasInteracted: boolean;
	storageKey: string;
	values: CookiesConsentValues;
}

export interface CookiesConsentOptions {
	storageKey?: string;
	consentKeyBuilder?: (storageKey: string, key: ConsentStorageKey) => string;
	autoOpen?: boolean;
	syncGtm?: boolean;
	onUpdate?: (state: CookiesConsentState) => void;
	onOpen?: (mode: CookiesConsentMode) => void;
	onClose?: () => void;
}

export interface CookiesConsentReturn {
	storageKey: Ref<string>;
	isOpen: Ref<boolean>;
	mode: Ref<CookiesConsentMode>;
	hasInteracted: Ref<boolean>;
	values: CookiesConsentValues;
	state: Ref<CookiesConsentState>;
	open: (mode?: CookiesConsentMode) => void;
	close: () => void;
	acceptAll: () => void;
	denyAll: () => void;
	saveSelected: (values: Partial<CookiesConsentValues>) => void;
	setStorageKey: (value: string) => void;
	reset: () => void;
	updateGtmConsent: () => void;
}

interface GtagFunction {
	(...args: any[]): void;
}

export type ConsentStorageKey = Exclude<keyof CookiesConsentValues, 'required'>;

const defaultOptions: Required<
	Pick<CookiesConsentOptions, 'storageKey' | 'autoOpen' | 'syncGtm' | 'consentKeyBuilder'>
> = {
	storageKey: 'cookies_consent',
	consentKeyBuilder: (baseStorageKey, key) => `${baseStorageKey}.${key}`,
	autoOpen: true,
	syncGtm: true,
};

const consentKeys: ConsentStorageKey[] = [
	'analytics_storage',
	'ad_storage',
	'ad_user_data',
	'ad_personalization',
];

export const CookiesConsent = defineModule<CookiesConsentOptions, CookiesConsentReturn>(
	({ options }) => {
		const resolvedOptions = {
			...defaultOptions,
			...(options ?? {}),
		};
		const storageKey = ref(resolvedOptions.storageKey);
		const isOpen = ref(false);
		const mode = ref<CookiesConsentMode>('basic');
		const hasInteracted = ref(false);
		const values = reactive<CookiesConsentValues>({
			required: true,
			analytics_storage: false,
			ad_storage: false,
			ad_user_data: false,
			ad_personalization: false,
		});

		const state = computed<CookiesConsentState>(() => {
			return {
				isOpen: isOpen.value,
				mode: mode.value,
				hasInteracted: hasInteracted.value,
				storageKey: storageKey.value,
				values: {
					...values,
				},
			};
		});

		onInit(() => {
			readFromStorage();

			if (resolvedOptions.syncGtm) {
				setDefaultGtmConsent();
				updateGtmConsent();
			}

			if (resolvedOptions.autoOpen && !hasInteracted.value) {
				open('basic');
			}

			window.addEventListener('storage', onStorageChange);
		});

		onDestroy(() => {
			window.removeEventListener('storage', onStorageChange);
		});

		function onStorageChange(event: StorageEvent) {
			if (!event.key || !isRelatedStorageKey(event.key)) {
				return;
			}

			readFromStorage();
			emitUpdate();
		}

		function open(nextMode: CookiesConsentMode = 'basic') {
			mode.value = nextMode;
			isOpen.value = true;
			options?.onOpen?.(nextMode);
			emitWindowEvent('open');
		}

		function close() {
			isOpen.value = false;
			options?.onClose?.();
			emitWindowEvent('close');
		}

		function acceptAll() {
			applyValues(
				{
					analytics_storage: true,
					ad_storage: true,
					ad_user_data: true,
					ad_personalization: true,
				},
				true
			);
			close();
		}

		function denyAll() {
			applyValues(
				{
					analytics_storage: false,
					ad_storage: false,
					ad_user_data: false,
					ad_personalization: false,
				},
				true
			);
			close();
		}

		function saveSelected(nextValues: Partial<CookiesConsentValues>) {
			applyValues(nextValues, true);
			close();
		}

		function setStorageKey(value: string) {
			if (!value || value === storageKey.value) {
				return;
			}

			storageKey.value = value;
			readFromStorage();
			if (resolvedOptions.syncGtm) {
				updateGtmConsent();
			}
			emitUpdate();
		}

		function reset() {
			hasInteracted.value = false;
			values.analytics_storage = false;
			values.ad_storage = false;
			values.ad_user_data = false;
			values.ad_personalization = false;

			if (isStorageAvailable()) {
				localStorage.removeItem(storageKey.value);
				consentKeys.forEach(key => {
					localStorage.removeItem(getStorageConsentKey(key));
				});
			}

			if (resolvedOptions.syncGtm) {
				updateGtmConsent();
			}

			emitUpdate();
		}

		function applyValues(nextValues: Partial<CookiesConsentValues>, decided: boolean) {
			values.analytics_storage = !!nextValues.analytics_storage;
			values.ad_storage = !!nextValues.ad_storage;
			values.ad_user_data = !!nextValues.ad_user_data;
			values.ad_personalization = !!nextValues.ad_personalization;

			hasInteracted.value = decided;
			persistToStorage();

			if (resolvedOptions.syncGtm) {
				updateGtmConsent();
			}

			emitUpdate();
		}

		function readFromStorage() {
			if (!isStorageAvailable()) {
				return;
			}

			hasInteracted.value = localStorage.getItem(storageKey.value) === 'true';
			values.analytics_storage = readBool(getStorageConsentKey('analytics_storage'));
			values.ad_storage = readBool(getStorageConsentKey('ad_storage'));
			values.ad_user_data = readBool(getStorageConsentKey('ad_user_data'));
			values.ad_personalization = readBool(getStorageConsentKey('ad_personalization'));
		}

		function persistToStorage() {
			if (!isStorageAvailable()) {
				return;
			}

			if (hasInteracted.value) {
				localStorage.setItem(storageKey.value, 'true');
			} else {
				localStorage.removeItem(storageKey.value);
			}

			localStorage.setItem(
				getStorageConsentKey('analytics_storage'),
				stringifyBool(values.analytics_storage)
			);
			localStorage.setItem(getStorageConsentKey('ad_storage'), stringifyBool(values.ad_storage));
			localStorage.setItem(
				getStorageConsentKey('ad_user_data'),
				stringifyBool(values.ad_user_data)
			);
			localStorage.setItem(
				getStorageConsentKey('ad_personalization'),
				stringifyBool(values.ad_personalization)
			);
		}

		function updateGtmConsent() {
			const gtag = ensureGtag();

			if (!gtag) {
				return;
			}

			gtag('consent', 'update', {
				ad_storage: values.ad_storage ? 'granted' : 'denied',
				analytics_storage: values.analytics_storage ? 'granted' : 'denied',
				ad_user_data: values.ad_user_data ? 'granted' : 'denied',
				ad_personalization: values.ad_personalization ? 'granted' : 'denied',
			});
		}

		function setDefaultGtmConsent() {
			const gtag = ensureGtag();

			if (!gtag) {
				return;
			}

			gtag('consent', 'default', {
				ad_storage: 'denied',
				analytics_storage: 'denied',
				ad_user_data: 'denied',
				ad_personalization: 'denied',
				wait_for_update: 500,
			});
		}

		function ensureGtag() {
			if (typeof window === 'undefined') {
				return null;
			}

			const scopedWindow = window as Window & {
				dataLayer?: unknown[];
				gtag?: GtagFunction;
			};

			scopedWindow.dataLayer = scopedWindow.dataLayer || [];
			scopedWindow.gtag =
				scopedWindow.gtag ||
				function (...args: any[]) {
					scopedWindow.dataLayer?.push(args);
				};

			return scopedWindow.gtag;
		}

		function emitUpdate() {
			const snapshot = state.value;

			options?.onUpdate?.(snapshot);
			emitWindowEvent('update');
		}

		function emitWindowEvent(type: 'open' | 'close' | 'update') {
			if (typeof window === 'undefined') {
				return;
			}

			window.dispatchEvent(
				new CustomEvent(`cookies-consent:${type}`, {
					detail: state.value,
				})
			);
		}

		function getStorageConsentKey(key: ConsentStorageKey) {
			return resolvedOptions.consentKeyBuilder(storageKey.value, key);
		}

		function isRelatedStorageKey(key: string) {
			if (key === storageKey.value) {
				return true;
			}

			return consentKeys.some(consentKey => {
				return getStorageConsentKey(consentKey) === key;
			});
		}

		return {
			storageKey,
			isOpen,
			mode,
			hasInteracted,
			values: readonly(values) as CookiesConsentValues,
			state,
			open,
			close,
			acceptAll,
			denyAll,
			saveSelected,
			setStorageKey,
			reset,
			updateGtmConsent,
		};
	}
);

function readBool(key: string) {
	if (!isStorageAvailable()) {
		return false;
	}

	return localStorage.getItem(key) === 'true';
}

function stringifyBool(value: boolean) {
	return value ? 'true' : 'false';
}

function isStorageAvailable() {
	if (typeof window === 'undefined') {
		return false;
	}

	try {
		return typeof localStorage !== 'undefined';
	} catch {
		return false;
	}
}

import type { ActiveUI } from 'c15t';
import { getOrCreateConsentRuntime } from 'c15t';
import defaultsDeep from 'lodash/defaultsDeep';
import type { Ref } from 'ovee.js';
import { defineModule, onDestroy, onInit, ref } from 'ovee.js';

interface C15tStoreState {
	activeUI: ActiveUI;
	selectedConsents: Record<string, boolean>;
	hasConsented: () => boolean;
	has: (category: string) => boolean;
	saveConsents: (type: 'all' | 'necessary' | 'custom') => Promise<void>;
	setSelectedConsent: (name: string, value: boolean) => void;
	setActiveUI: (ui: ActiveUI) => void;
	resetConsents: () => void;
}

export interface C15tConsentOptions {
	mode?: 'offline' | 'hosted' | 'custom';
	backendURL?: string;
	consentCategories?: string[];
	/** When false, suppress the initial banner even if consent is missing. Default: true. */
	autoOpen?: boolean;
	scripts?: Array<{ id: string; src: string; category: string; [key: string]: unknown }>;
	callbacks?: {
		onConsentChanged?: (params: {
			allowedCategories: string[];
			deniedCategories: string[];
		}) => void;
	};
	debug?: boolean;
	endpointHandlers?: Record<string, (...args: unknown[]) => Promise<unknown>>;
}

export interface C15tConsentModuleReturn {
	activeUI: Ref<ActiveUI>;
	hasConsented: Ref<boolean>;
	openBanner: () => void;
	openPreferences: () => void;
	closeUI: () => void;
	saveAll: () => Promise<void>;
	saveNecessary: () => Promise<void>;
	saveCustom: () => Promise<void>;
	stageConsent: (name: string, value: boolean) => void;
	getSelectedConsents: () => Record<string, boolean>;
	resetConsents: () => void;
}

const DEFAULT_OPTIONS: Partial<C15tConsentOptions> = {
	mode: 'offline',
	autoOpen: true,
	consentCategories: ['necessary', 'measurement', 'marketing'],
};

export const C15tConsentModule = defineModule<C15tConsentOptions, C15tConsentModuleReturn>(
	({ options }) => {
		const resolvedOptions = defaultsDeep({}, options ?? {}, DEFAULT_OPTIONS);
		const activeUI = ref<ActiveUI>('none');
		const hasConsented = ref(false);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let rawStore: any = null;
		let unsubscribe: (() => void) | null = null;

		const getState = (): C15tStoreState | null =>
			rawStore ? (rawStore.getState() as C15tStoreState) : null;

		onInit(() => {
			const { consentStore } = getOrCreateConsentRuntime(resolvedOptions);
			rawStore = consentStore;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const sync = (state: any) => {
				activeUI.value = (state.activeUI as ActiveUI) ?? 'none';
				hasConsented.value =
					typeof state.hasConsented === 'function' ? (state.hasConsented() as boolean) : false;

				if (typeof window !== 'undefined') {
					window.dispatchEvent(
						new CustomEvent('c15t-consent:update', {
							detail: { activeUI: activeUI.value, hasConsented: hasConsented.value },
						})
					);
				}
			};

			sync(consentStore.getState());

			// Suppress the first-paint banner when autoOpen is disabled (e.g. demos
			// that also mount BaseCookies and would otherwise stack both overlays).
			if (resolvedOptions.autoOpen === false) {
				consentStore.getState().setActiveUI('none');
				activeUI.value = 'none';
			}

			unsubscribe = consentStore.subscribe(sync);
		});

		onDestroy(() => {
			unsubscribe?.();
		});

		return {
			activeUI,
			hasConsented,

			openBanner: () => getState()?.setActiveUI('banner'),
			openPreferences: () => getState()?.setActiveUI('dialog'),
			closeUI: () => getState()?.setActiveUI('none'),

			saveAll: async () => {
				await getState()?.saveConsents('all');
			},
			saveNecessary: async () => {
				await getState()?.saveConsents('necessary');
			},
			saveCustom: async () => {
				await getState()?.saveConsents('custom');
			},

			stageConsent: (name, value) => getState()?.setSelectedConsent(name, value),
			getSelectedConsents: () =>
				(rawStore?.getState() as C15tStoreState | null)?.selectedConsents ?? {},
			resetConsents: () => getState()?.resetConsents(),
		};
	}
);

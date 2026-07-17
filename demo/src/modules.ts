import type { ConsentStorageKey } from '@ovee.js/toolkit';
import { CookiesConsent, CustomCursor, ViewportUnits } from '@ovee.js/toolkit';
import { C15tConsentModule } from '@ovee.js/toolkit-integrations/c15t';
import { AnyModule, ModuleOptions } from 'ovee.js';

const modules: Record<string, AnyModule | [AnyModule] | [AnyModule, ModuleOptions | undefined]> = {
	cookiesConsent: [
		CookiesConsent,
		{
			storageKey: 'cookies_consent',
			consentKeyBuilder: (storageKey: string, key: ConsentStorageKey) => `${storageKey}.${key}`,
			autoOpen: true,
			syncGtm: false,
		},
	],
	customCursor: [
		CustomCursor,
		{
			hideDefault: true,
			shadow: true,
			ripple: true,
		},
	],
	viewportUnits: ViewportUnits,
	c15tConsent: [
		C15tConsentModule,
		{
			mode: 'offline',
			autoOpen: false,
			consentCategories: ['necessary', 'measurement', 'marketing'],
		},
	],
};

export default modules;

import { defineComponent } from 'ovee.js';
import { ILazyLoadOptions } from 'vanilla-lazyload';

import { useLazyLoad } from './composables/useLazyLoad';

export const LazyLoad = defineComponent<HTMLElement, ILazyLoadOptions>((_, { options }) => {
	useLazyLoad(options);
});

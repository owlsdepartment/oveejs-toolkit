import { defineComponent } from 'ovee.js';
import { ILazyLoadOptions } from 'vanilla-lazyload';

import { useLazyLoad } from './composable/useLazyLoad';

export const LazyLoad = defineComponent<HTMLElement, ILazyLoadOptions>((_, _ctx, options) => {
	useLazyLoad(options);
});

import { defineComponent } from 'ovee.js';

import { useParallaxEffect, UseParallaxEffectOptions, UseParallaxEffectReturn } from './composable';

export const ParallaxEffect = defineComponent<
	HTMLElement,
	UseParallaxEffectOptions,
	UseParallaxEffectReturn
>((element, { options }) => {
	return useParallaxEffect(element, options);
});

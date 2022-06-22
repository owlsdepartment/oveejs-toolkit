import gsap from 'gsap';

import { slideDownFade } from './slideDownFade';
import { slideUpFade } from './slideUpFade';
import { SlideFadeOptions } from './types';

export function slideFadeToggle<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideFadeOptions = {}
) {
	if (gsap.getProperty(target, 'display') === 'none') {
		return slideDownFade(target, duration, options);
	}

	return slideUpFade(target, duration, options);
}

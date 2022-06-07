import gsap from 'gsap';

import { fadeIn } from './fadeIn';
import { fadeOut } from './fadeOut';
import { FadeOptions } from './types';

export function fadeToggle<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: FadeOptions = {}
) {
	if (gsap.getProperty(target, 'display') === 'none') {
		return fadeIn(target, duration, options);
	}

	return fadeOut(target, duration, options);
}

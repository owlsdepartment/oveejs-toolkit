import gsap from 'gsap';

import { slideDown } from './slideDown';
import { slideUp } from './slideUp';
import { SlideOptions } from './types';

export function slideToggle<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideOptions = {}
) {
	if (gsap.getProperty(target, 'display') === 'none') {
		return slideDown(target, duration, options);
	}

	return slideUp(target, duration, options);
}

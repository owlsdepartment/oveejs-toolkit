import { slideDown } from './slideDown';
import { SlideFadeOptions } from './types';

export function slideDownFade<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideFadeOptions = {}
) {
	return slideDown(target, duration, {
		...options,
		fade: true,
	});
}

import { slideUp } from './slideUp';
import { SlideFadeOptions } from './types';

export function slideUpFade<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideFadeOptions = {}
) {
	return slideUp(target, duration, {
		...options,
		fade: true,
	});
}

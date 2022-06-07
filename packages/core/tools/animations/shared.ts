import gsap from 'gsap';

import { Options } from './types';

export function complete(resolve: () => void, options: Options) {
	if (typeof options?.onComplete === 'function') {
		options?.onComplete();
	}

	resolve();
}

export function getInitialValues(target: HTMLElement, keys: string[]) {
	const initials: Record<string, string | number> = {};

	keys.forEach(key => {
		initials[key] = gsap.getProperty(target, key);
	});

	return initials;
}

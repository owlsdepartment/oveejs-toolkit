import gsap from 'gsap';

import { complete } from './shared';
import { FadeOptions } from './types';

export function fadeIn<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: FadeOptions = {}
) {
	return new Promise<void>((resolve, reject) => {
		gsap.killTweensOf(target);

		if (gsap.getProperty(target, 'alpha') !== 0 && gsap.getProperty(target, 'display') !== 'none') {
			complete(resolve, options);
			return;
		}

		gsap.set(target, {
			display: options?.display ?? '',
			autoAlpha: 0,
		});

		if (gsap.getProperty(target, 'display') === 'none') {
			gsap.set(target, {
				display: options?.display ?? 'block',
			});
		}

		const tween = gsap.to(target, {
			autoAlpha: 1,
			duration,
			ease: options?.ease ?? 'power2.out',
			delay: options?.delay,

			onComplete() {
				complete(resolve, options);
			},

			onUpdate() {
				options?.onUpdate?.();
			},

			onStart() {
				options?.onStart?.();
			},

			onInterrupt: reject,
		});

		options?.onInit?.(tween);
	});
}

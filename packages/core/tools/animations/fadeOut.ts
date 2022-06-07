import gsap from 'gsap';

import { complete } from './shared';
import { FadeOptions } from './types';

export function fadeOut<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: FadeOptions = {}
) {
	return new Promise<void>((resolve, reject) => {
		gsap.killTweensOf(target);

		const tween = gsap.to(target, {
			autoAlpha: 0,
			duration,
			ease: options?.ease ?? 'power2.out',
			delay: options?.delay,

			onComplete() {
				gsap.set(target, {
					display: 'none',
				});

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

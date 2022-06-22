import gsap from 'gsap';

import { complete } from './shared';
import { SlideOptions } from './types';

export function slideUp<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideOptions = {}
) {
	return new Promise<void>((resolve, reject) => {
		gsap.killTweensOf(target);

		gsap.set(target, {
			overflow: 'hidden',
		});

		const tween = gsap.to(target, {
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
			duration,
			autoAlpha: options.fade ? 0 : undefined,
			ease: options?.ease ?? 'power2.out',
			delay: options?.delay,

			onComplete() {
				gsap.set(target, {
					display: 'none',
					height: '',
					paddingTop: '',
					paddingBottom: '',
					overflow: '',
					alpha: options?.fade ? '' : undefined,
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

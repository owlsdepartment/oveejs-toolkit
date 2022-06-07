import gsap from 'gsap';

import { complete } from './shared';
import { SlideOptions } from './types';

export function slideDown<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideOptions = {}
) {
	return new Promise<void>((resolve, reject) => {
		gsap.killTweensOf(target);

		if (
			gsap.getProperty(target, 'height') !== 0 &&
			gsap.getProperty(target, 'display') !== 'none'
		) {
			complete(resolve, options);
			return;
		}

		gsap.set(target, {
			display: options?.display ?? 'block',
			height: '',
			paddingTop: '',
			paddingBottom: '',
			overflow: 'hidden',
		});

		const paddingTop = parseFloat(getComputedStyle(target).paddingTop);
		const paddingBottom = parseFloat(getComputedStyle(target).paddingBottom);
		const height = parseFloat(getComputedStyle(target).height);

		gsap.set(target, {
			height: 0,
			paddingTop: 0,
			paddingBottom: 0,
			autoAlpha: options.fade ? 0 : undefined,
			overflow: 'hidden',
			willChange: 'padding,height,opacity',
		});

		if (gsap.getProperty(target, 'display') === 'none') {
			gsap.set(target, {
				display: options?.display ?? 'block',
			});
		}

		const tween = gsap.to(target, {
			height,
			paddingTop,
			paddingBottom,
			duration,
			ease: options?.ease ?? 'power2.out',
			autoAlpha: options.fade ? 1 : undefined,
			delay: options?.delay,

			onComplete() {
				gsap.set(target, {
					overflow: '',
					height: '',
					paddingTop: '',
					paddingBottom: '',
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

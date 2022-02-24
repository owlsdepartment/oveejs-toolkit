import gsap from 'gsap';

import { AnimationArguments } from '../types';

export const showAnimation = (args: AnimationArguments): void => {
	const { trigger, item, content, immediate, speed, ease } = args;

	trigger.setAttribute('aria-expanded', 'true');
	content.style.pointerEvents = 'all';
	const height = item.dataset.activeHeight ?? 'auto';

	if (immediate === true) {
		item.style.height = `${height}px`;
		content.style.opacity = '1';
	} else {
		gsap.to(item, {
			duration: speed,
			ease,
			height,
			clearProps: 'all',
		});

		gsap.to(content, {
			duration: speed / 2,
			ease: 'none',
			opacity: 1,
			delay: speed / 1.5,
			clearProps: 'all',
		});
	}
};

export const hideAnimation = (args: AnimationArguments) => {
	const { trigger, item, content, height, immediate, speed, ease } = args;
	const blockHeight = height ?? item.dataset.reducedHeight;

	trigger.setAttribute('aria-expanded', 'false');
	content.style.pointerEvents = 'none';

	if (immediate == true) {
		item.style.height = `${blockHeight}px`;
		content.style.opacity = '0';
	} else {
		gsap.to(item, {
			duration: speed,
			ease,
			height: blockHeight,
			delay: 0.1,
		});

		gsap.to(content, {
			duration: speed / 2,
			ease: 'none',
			opacity: 0,
		});
	}
};

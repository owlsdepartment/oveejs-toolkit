import gsap from 'gsap';
import { Logger } from 'ovee.js';

import { AnimationArguments } from '../types';

const logger = new Logger('BaseAccordion - animations');

export const showAnimation = (args: AnimationArguments) => {
	const { item, immediate, speed, ease } = args;
	const { _trigger: trigger, _content: content } = item;

	if (!trigger || !content) {
		return logger.error('Missing trigger or content element');
	}

	trigger.setAttribute('aria-expanded', 'true');
	content.style.pointerEvents = 'all';
	const height = item.dataset.activeHeight ?? 'auto';

	if (immediate === true) {
		item.style.height = `${height}px`;
		content.style.opacity = '1';

		return Promise.resolve();
	} else {
		gsap.to(content, {
			duration: speed / 2,
			ease: 'none',
			opacity: 1,
			delay: speed / 1.5,
			clearProps: 'all',
		});

		return gsap.to(item, {
			duration: speed,
			ease,
			height,
			clearProps: 'all',
		});
	}
};

export const hideAnimation = (args: AnimationArguments) => {
	const { item, height, immediate, speed, ease } = args;
	const { _trigger: trigger, _content: content } = item;
	const blockHeight = height ?? item.dataset.reducedHeight;

	if (!trigger || !content) {
		return logger.error('Missing trigger or content element');
	}

	trigger.setAttribute('aria-expanded', 'false');
	content.style.pointerEvents = 'none';

	if (immediate == true) {
		item.style.height = `${blockHeight}px`;
		content.style.opacity = '0';

		return Promise.resolve();
	} else {
		gsap.to(content, {
			duration: speed / 2,
			ease: 'none',
			opacity: 0,
		});

		return gsap.to(item, {
			duration: speed,
			ease,
			height: blockHeight,
			delay: 0.1,
		});
	}
};

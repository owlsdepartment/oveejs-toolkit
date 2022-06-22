import { slideDownFade, slideUpFade } from '@ovee.js/toolkit/tools/animations';
import { Logger } from 'ovee.js';

import { AnimationArguments } from '../types';

const logger = new Logger('BaseAccordion - animations');

export const showAnimation = (args: AnimationArguments) => {
	const { item, immediate, duration, ease, display, onInit } = args;
	const { _trigger: trigger, _content: content } = item;

	if (!trigger || !content) {
		logger.error('Missing trigger or content element');
		return Promise.reject();
	}

	trigger.setAttribute('aria-expanded', 'true');
	content.style.pointerEvents = 'all';

	return slideDownFade(content, immediate ? 0 : duration, {
		ease,
		display,
		onInit,
	});
};

export const hideAnimation = (args: AnimationArguments) => {
	const { item, immediate, duration, ease, display, onInit } = args;
	const { _trigger: trigger, _content: content } = item;

	if (!trigger || !content) {
		logger.error('Missing trigger or content element');
		return Promise.reject();
	}

	trigger.setAttribute('aria-expanded', 'false');
	content.style.pointerEvents = 'none';

	return slideUpFade(content, immediate ? 0 : duration, {
		ease,
		display,
		onInit,
	});
};

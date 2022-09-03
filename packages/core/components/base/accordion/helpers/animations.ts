import { slideDownFade, slideUpFade } from '@ovee.js/toolkit/tools/animations';
import { Logger } from 'ovee.js';

import { AnimationArguments } from '../types';

const logger = new Logger('BaseAccordion - animations');

export const showAnimation = (args: AnimationArguments) => {
	const { item, immediate, duration, ease, display, onInit } = args;
	const { _triggers: triggers, _content: content } = item;

	if (!triggers.length) {
		logger.error('Missing trigger elements');
		return Promise.reject();
	}

	if (!content) {
		logger.error('Missing content element');
		return Promise.reject();
	}

	triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'true'));
	content.style.pointerEvents = 'all';

	return slideDownFade(content, immediate ? 0 : duration, {
		ease,
		display,
		onInit,
	});
};

export const hideAnimation = (args: AnimationArguments) => {
	const { item, immediate, duration, ease, display, onInit } = args;
	const { _triggers: triggers, _content: content } = item;

	if (!triggers.length) {
		logger.error('Missing trigger elements');
		return Promise.reject();
	}

	if (!content) {
		logger.error('Missing content element');
		return Promise.reject();
	}

	triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
	content.style.pointerEvents = 'none';

	return slideUpFade(content, immediate ? 0 : duration, {
		ease,
		display,
		onInit,
	});
};

import { AccordionElement } from '../types';

export const calcHeights = (items: AccordionElement[], resize: boolean) => {
	if (!items.length) {
		return;
	}

	items.forEach(item => {
		const { _trigger: trigger, _content: content } = item;

		if (!trigger || !content) {
			return;
		}

		const triggerHeight = trigger.offsetHeight;
		const contentHeight = content.offsetHeight;
		const itemData = item.dataset;

		itemData.reducedHeight = `${triggerHeight}`;
		itemData.activeHeight = `${triggerHeight + contentHeight}`;

		if (resize) {
			if (trigger.getAttribute('aria-expanded') === 'true') {
				item.style.height = `${itemData.activeHeight}px`;
			} else {
				item.style.height = `${itemData.reducedHeight}px`;
			}
		}
	});
};

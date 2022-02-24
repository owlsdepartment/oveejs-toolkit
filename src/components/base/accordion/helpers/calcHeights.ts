import { AccordionElement } from '../types';

export const calcHeights = (items: AccordionElement[], resize: boolean) => {
	if (!items) {
		return;
	}

	items.forEach(obj => {
		const btn = obj.querySelector('[data-accordion-trigger]') as HTMLElement;
		const btnHeight = btn.offsetHeight;
		const content = obj.querySelector('[data-accordion-content]') as HTMLElement;
		const contentHeight = content.offsetHeight;
		const objData = obj.dataset;

		objData.reducedHeight = `${btnHeight}`;
		objData.activeHeight = `${btnHeight + contentHeight}`;

		if (resize === true) {
			if (btn.getAttribute('aria-expanded') === 'true') {
				obj.style.height = `${objData.activeHeight}px`;
			} else {
				obj.style.height = `${objData.reducedHeight}px`;
			}
		}
	});
};

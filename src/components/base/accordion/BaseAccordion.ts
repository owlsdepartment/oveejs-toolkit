import { Component, el, Logger, register } from 'ovee.js';

import { CONFIG_DEFAULTS } from './constants';
import { calcHeights, hideAnimation, showAnimation } from './helpers';
import { AccordionElement, BaseAccordionConfig } from './types';

const logger = new Logger('BaseAccordion');

@register('base-accordion')
export class BaseAccordion extends Component {
	static config: BaseAccordionConfig = CONFIG_DEFAULTS;

	@el('[data-accordion-item]', { list: true })
	items: AccordionElement[];

	init() {
		if (!this.items.length) {
			return logger.warn(
				'No accordion items were found. You should specify them with data-accordion-item attribute'
			);
		}

		this.initAttributes();
		this.calcHeights();
		this.setInitHeights();
		this.bind();
	}

	initAttributes() {
		this.items.forEach(item => {
			const trigger = item.querySelector<HTMLElement>('[data-accordion-trigger]');
			const content = item.querySelector('[data-accordion-content]') as HTMLElement;
			const timestamp = Date.now();
			const id = `accordion-${timestamp + Math.floor(Math.random() * (timestamp - 0)) + 0}`;

			if (!trigger) {
				return logger.warn(
					'Missing trigger element. You should specify it with data-accordion-trigger attribute'
				);
			} else if (!content) {
				return logger.warn(
					'Missing content element. You should specify it with data-accordion-content attribute'
				);
			}

			item._trigger = trigger;
			item._content = content;

			this.setAttributes(content, {
				id,
			});

			this.setAttributes(trigger, {
				tabindex: '0',
				'aria-controls': id,
				'aria-expanded': 'false',
			});
		});
	}

	setAttributes(el: HTMLElement, attrs: { [key: string]: string }) {
		for (const key in attrs) {
			el.setAttribute(key, attrs[key]);
		}
	}

	calcHeights() {
		calcHeights(this.items, true);
	}

	setInitHeights() {
		const { config: options } = BaseAccordion;

		this.items.forEach((obj, i) => {
			const { _trigger: btn, _content: cnt } = obj;

			if (!btn || !cnt) {
				return;
			}

			if (options.firstActive === true && i === 0) {
				this.show(btn, obj, cnt, options.immediate, options.speed, options.ease);
			} else {
				this.hide(btn, obj, cnt, options.immediate, options.speed, options.ease);
			}
		});
	}

	show(
		trigger: HTMLElement,
		item: HTMLElement,
		content: HTMLElement,
		immediate = false,
		speed: number,
		ease: string
	) {
		showAnimation({ trigger, item, content, immediate, speed, ease });
	}

	hide(
		trigger: HTMLElement,
		item: HTMLElement,
		content: HTMLElement,
		immediate = false,
		speed: number,
		ease: string
	) {
		hideAnimation({ trigger, item, content, immediate, speed, ease });
	}

	handleTriggerEvent(e: Event) {
		const trigger = e.target as HTMLElement;
		const item = trigger.closest('[data-accordion-item]') as AccordionElement;
		const content = item._content as HTMLElement;
		const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
		const { config: options } = BaseAccordion;

		if (options.autoCollapse == true) {
			this.items.forEach(obj => {
				const { _trigger: button, _content: content } = obj;

				if (!button || !content) {
					logger.warn('Missing trigger or content');
				} else if (button.getAttribute('aria-expanded') === 'true') {
					this.hide(button, obj, content, false, options.speed, options.ease);
				}
			});
		}

		if (!isExpanded) {
			this.show(trigger, item, content, false, options.speed, options.ease);
		} else {
			this.hide(trigger, item, content, false, options.speed, options.ease);
		}
	}

	clickHandler(e: MouseEvent) {
		this.handleTriggerEvent(e);
	}

	keyDownHandler(e: KeyboardEvent) {
		if (e.code === 'Space' || e.code === 'Enter') {
			this.handleTriggerEvent(e);
		}
	}

	bind() {
		if (!this.items) return;

		this.items.forEach(({ _trigger: trigger }) => {
			if (!trigger) {
				return logger.warn('Failed to bind event listener. Missing trigger element.');
			}

			this.$on('click', trigger, this.clickHandler);
			this.$on('keydown', trigger, this.keyDownHandler);
		});
	}

	destroy() {
		this.items.forEach(({ _trigger: trigger }) => {
			if (!trigger) {
				return;
			}

			this.$off('click', trigger, this.clickHandler);
			this.$on('keydown', trigger, this.keyDownHandler);
		});
	}
}

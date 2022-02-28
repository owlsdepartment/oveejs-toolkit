import { Component, el, Logger, register } from 'ovee.js';

import { CONFIG_DEFAULTS } from './constants';
import { calcHeights, hideAnimation, showAnimation } from './helpers';
import { AccordionElement, AnimationArguments, BaseAccordionConfig } from './types';

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
			const content = item.querySelector<HTMLElement>('[data-accordion-content]');
			const timestamp = Date.now();
			const id = `accordion-${timestamp + Math.floor(Math.random() * (timestamp - 0)) + 0}`;

			if (!trigger) {
				return logger.error(
					'Missing trigger element. You should specify it with data-accordion-trigger attribute'
				);
			}

			if (!content) {
				return logger.error(
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

		this.items.forEach((item, i) => {
			const animationConfig = {
				item,
				immediate: options.immediate,
				speed: options.speed,
				ease: options.ease,
			};

			if (options.firstActive && i === 0) {
				this.show(animationConfig);
			} else {
				this.hide(animationConfig);
			}
		});
	}

	show(args: AnimationArguments) {
		showAnimation(args);
		this.$emit('base-accordion:show', args.item);
	}

	hide(args: AnimationArguments) {
		hideAnimation(args);
		this.$emit('base-accordion:hide', args.item);
	}

	handleTriggerEvent(e: Event) {
		const trigger = e.target as HTMLElement;
		const item = trigger.closest<AccordionElement>('[data-accordion-item]');
		const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
		const { config: options } = BaseAccordion;

		if (!item) {
			return logger.error('Failed to handle triggered event. Missing item element');
		}

		const animationConfig = {
			item,
			immediate: options.immediate,
			speed: options.speed,
			ease: options.ease,
		};

		if (options.autoCollapse) {
			this.items.forEach(item => {
				const { _trigger: trigger, _content: content } = item;

				if (!trigger || !content) {
					return logger.error('Missing trigger or content element');
				}

				if (trigger.getAttribute('aria-expanded') === 'true') {
					this.hide(animationConfig);
				}
			});
		}

		if (!isExpanded) {
			this.show(animationConfig);
		} else {
			this.hide(animationConfig);
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
				return logger.error('Failed to bind event listener. Missing trigger element');
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
			this.$off('keydown', trigger, this.keyDownHandler);
		});
	}
}

import gsap from 'gsap';
import { Component, el, Logger, register } from 'ovee.js';

import { hideAnimation, showAnimation } from './helpers';
import { AccordionElement, AnimationArguments, BaseAccordionOptions } from './types';

const logger = new Logger('BaseAccordion');

export const BASE_ACCORDION_DEFAULT_OPTIONS: Required<BaseAccordionOptions> = {
	firstActive: false,
	autoCollapse: false,
	immediate: false,
	duration: 0.4,
	ease: 'power2.inOut',
	openClass: 'is-open',
	collapsedClass: 'is-collapsed',
	display: 'block',
};

@register('base-accordion')
export class BaseAccordion extends Component {
	@el('[data-accordion-item]', { list: true })
	items: AccordionElement[];

	options: Required<BaseAccordionOptions>;

	init() {
		this.options = {
			...BASE_ACCORDION_DEFAULT_OPTIONS,
			...this.$options,
		};

		if (!this.items.length) {
			return logger.warn(
				'No accordion items were found. You should specify them with data-accordion-item attribute'
			);
		}

		this.initAttributes();
		this.setInitHeights();
		this.bind();
	}

	initAttributes() {
		this.items.forEach(item => {
			const triggers = Array.from(item.querySelectorAll<HTMLElement>('[data-accordion-trigger]'));
			const content = item.querySelector<HTMLElement>('[data-accordion-content]');
			const timestamp = Date.now();
			const id = `accordion-${timestamp + Math.floor(Math.random() * (timestamp - 0)) + 0}`;

			if (!triggers.length) {
				return logger.error(
					'Missing trigger elements. You should specify them with data-accordion-trigger attribute'
				);
			}

			if (!content) {
				return logger.error(
					'Missing content element. You should specify it with data-accordion-content attribute'
				);
			}

			item._triggers = triggers;
			item._content = content;

			this.setAttributes(content, {
				id,
			});

			triggers.forEach(trigger =>
				this.setAttributes(trigger, {
					tabindex: '0',
					'aria-controls': id,
					'aria-expanded': 'false',
				})
			);
		});
	}

	setAttributes(el: HTMLElement, attrs: { [key: string]: string }) {
		for (const key in attrs) {
			el.setAttribute(key, attrs[key]);
		}
	}

	setInitHeights() {
		const { duration, ease, firstActive } = this.options;

		this.items.forEach((item, i) => {
			const animationConfig = {
				item,
				immediate: true,
				duration,
				ease,
			};

			if (firstActive && i === 0) {
				this.show(animationConfig);
			} else {
				this.hide(animationConfig);
			}
		});
	}

	bind() {
		if (!this.items) return;

		this.items.forEach(({ _triggers: triggers }) => {
			if (!triggers.length) {
				return logger.error('Failed to bind event listener. Missing trigger elements');
			}

			triggers.forEach(trigger => {
				this.$on('click', trigger, this.clickHandler);
				this.$on('keydown', trigger, this.keyDownHandler);
			});
		});
	}

	async show(args: AnimationArguments) {
		const { openClass, collapsedClass } = this.options;

		this.$emit('base-accordion:will-show', args.item);
		args.item.classList.remove(collapsedClass);
		args.item.classList.add(openClass);

		try {
			await showAnimation(args);
			this.$emit('base-accordion:show', args.item);
		} catch (err) {
			this.$emit('base-accordion:show-interrupted', args.item);
		}
	}

	async hide(args: AnimationArguments) {
		const { openClass, collapsedClass } = this.options;

		this.$emit('base-accordion:will-hide', args.item);
		args.item.classList.remove(openClass);
		args.item.classList.add(collapsedClass);

		try {
			await hideAnimation(args);
			this.$emit('base-accordion:hide', args.item);
		} catch (err) {
			this.$emit('base-accordion:hide-interrupted', args.item);
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

	handleTriggerEvent(e: Event) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-accordion-trigger]')!;
		const item = trigger.closest<AccordionElement>('[data-accordion-item]');
		const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
		const { options } = this;

		if (!item) {
			return logger.error('Failed to handle triggered event. Missing item element');
		}

		const tl = gsap.timeline({ paused: true });
		const animationConfig: AnimationArguments = {
			item,
			immediate: options.immediate,
			duration: options.duration,
			ease: options.ease,
			display: options.display,
			onInit: tween => tl.add(tween, 0),
		};

		if (options.autoCollapse) {
			this.items.forEach(subItem => {
				const { _triggers: triggers, _content: content } = subItem;

				if (item === subItem) return;

				if (!triggers.length) {
					return logger.error('Missing trigger elements');
				}

				if (!content) {
					return logger.error('Missing content element');
				}

				const shouldHide = triggers.some(
					(trigger: HTMLElement) => trigger.getAttribute('aria-expanded') === 'true'
				);

				if (shouldHide) {
					this.hide({
						...animationConfig,
						item: subItem,
					});
				}
			});
		}

		if (!isExpanded) {
			this.show(animationConfig);
		} else {
			this.hide(animationConfig);
		}

		tl.play();
	}
}

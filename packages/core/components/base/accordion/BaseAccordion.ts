import gsap from 'gsap';
import { computed, defineComponent, Logger } from 'ovee.js';

import { hideAnimation, showAnimation } from './helpers';
import { AccordionElement, AnimationArguments, BaseAccordionOptions } from './types';

const logger = new Logger('BaseAccordion');

const defaultOptions: BaseAccordionOptions = {
	firstActive: false,
	autoCollapse: false,
	immediate: false,
	duration: 0.4,
	ease: 'power2.inOut',
	openClass: 'is-open',
	collapsedClass: 'is-collapsed',
	display: 'block',
};

export const BaseAccordion = defineComponent<HTMLElement, BaseAccordionOptions>(
	(element, { on, emit }, options) => {
		const resolvedOptions = computed(() => ({
			...defaultOptions,
			...(options ?? {}),
		}));
		const items = Array.from(element.querySelectorAll<AccordionElement>('[data-accordion-item]'));

		if (!items.length) {
			logger.warn(
				'No accordion items were found. You should specify them with data-accordion-item attribute'
			);
			return;
		}

		initAttributes();
		setInitHeights();
		bind();

		function initAttributes() {
			items.forEach(item => {
				const trigger = item.querySelector<HTMLElement>('[data-accordion-trigger]');
				const content = item.querySelector<HTMLElement>('[data-accordion-content]');
				const timestamp = Date.now();
				const id = `accordion-${timestamp + Math.floor(Math.random() * timestamp)}`;

				if (!trigger) {
					logger.error(
						'Missing trigger element. You should specify it with data-accordion-trigger attribute'
					);
					return;
				}

				if (!content) {
					logger.error(
						'Missing content element. You should specify it with data-accordion-content attribute'
					);
					return;
				}

				item._trigger = trigger;
				item._content = content;

				setAttributes(content, {
					id,
				});

				setAttributes(trigger, {
					tabindex: '0',
					'aria-controls': id,
					'aria-expanded': 'false',
				});
			});
		}

		function setAttributes(target: HTMLElement, attrs: Record<string, string>) {
			for (const key in attrs) {
				target.setAttribute(key, attrs[key]);
			}
		}

		function setInitHeights() {
			const { duration, ease, firstActive } = resolvedOptions.value;

			items.forEach((item, index) => {
				const animationConfig: AnimationArguments = {
					item,
					immediate: true,
					duration,
					ease,
				};

				if (firstActive && index === 0) {
					void show(animationConfig);
					return;
				}

				void hide(animationConfig);
			});
		}

		function bind() {
			items.forEach(({ _trigger: trigger }) => {
				if (!trigger) {
					logger.error('Failed to bind event listener. Missing trigger element');
					return;
				}

				on('click', clickHandler, { target: trigger });
				on('keydown', keydownHandler, { target: trigger });
			});
		}

		async function show(args: AnimationArguments) {
			const { openClass, collapsedClass } = resolvedOptions.value;

			emit('base-accordion:will-show', args.item);
			args.item.classList.remove(collapsedClass);
			args.item.classList.add(openClass);

			try {
				await showAnimation(args);
				emit('base-accordion:show', args.item);
			} catch (err) {
				emit('base-accordion:show-interrupted', args.item);
			}
		}

		async function hide(args: AnimationArguments) {
			const { openClass, collapsedClass } = resolvedOptions.value;

			emit('base-accordion:will-hide', args.item);
			args.item.classList.remove(openClass);
			args.item.classList.add(collapsedClass);

			try {
				await hideAnimation(args);
				emit('base-accordion:hide', args.item);
			} catch (err) {
				emit('base-accordion:hide-interrupted', args.item);
			}
		}

		function clickHandler(event: MouseEvent) {
			handleTriggerEvent(event);
		}

		function keydownHandler(event: KeyboardEvent) {
			if (event.code === 'Space' || event.code === 'Enter') {
				handleTriggerEvent(event);
			}
		}

		function handleTriggerEvent(event: Event) {
			const target = event.target as HTMLElement | null;
			const trigger = target?.closest<HTMLElement>('[data-accordion-trigger]');
			const item = trigger?.closest<AccordionElement>('[data-accordion-item]');
			const isExpanded = trigger?.getAttribute('aria-expanded') === 'true';
			const opts = resolvedOptions.value;

			if (!trigger || !item) {
				logger.error('Failed to handle triggered event. Missing item element');
				return;
			}

			const timeline = gsap.timeline({ paused: true });
			const animationConfig: AnimationArguments = {
				item,
				immediate: opts.immediate,
				duration: opts.duration,
				ease: opts.ease,
				display: opts.display,
				onInit: tween => timeline.add(tween, 0),
			};

			if (opts.autoCollapse) {
				items.forEach(subItem => {
					const { _trigger: subTrigger, _content: subContent } = subItem;

					if (item === subItem) return;

					if (!subTrigger || !subContent) {
						logger.error('Missing trigger or content element');
						return;
					}

					if (subTrigger.getAttribute('aria-expanded') === 'true') {
						void hide({
							...animationConfig,
							item: subItem,
						});
					}
				});
			}

			if (!isExpanded) {
				void show(animationConfig);
			} else {
				void hide(animationConfig);
			}

			timeline.play();
		}
	}
);

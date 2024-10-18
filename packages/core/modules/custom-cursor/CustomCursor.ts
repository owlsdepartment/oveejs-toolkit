import { isAndroid, isIOS, isIOSChrome, isIOSFirefox } from '@ovee.js/toolkit/tools';
import { gsap } from 'gsap';
import { debounce, defaults } from 'lodash';
import { defineModule, onInit, Reactive, reactive, Ref, ref, watch } from 'ovee.js';

type Setter = (val: number) => void;

export interface CustomCursorOptions {
	hideDefault?: boolean;
	cursorLerp?: boolean;
	cursorDuration?: number;
	shadow?: boolean;
	shadowDuration?: number;
	ripple?: boolean;
	rippleThreshold?: number;
	checkIfLink?: (target: HTMLElement) => boolean;
}

export class Point {
	x = 0;
	y = 0;
}

export interface CustomCursorReturn {
	mouse: Reactive<Point>;
	shadowPos: Reactive<Point>;
	cursorPos: Reactive<Point>;
	dragPos: Reactive<Point>;
	isMobile: Ref<boolean>;
	isPressed: Ref<boolean>;
	isInjected: Ref<boolean>;
	isEnabled: Ref<boolean>;
	text: Ref<string>;
	hide: () => void;
	show: () => void;
	addModifier: (element: Element) => void;
	removeModifier: (element: Element) => void;
	setMode: (value: string) => void;
	setTheme: (value: string) => void;
	resetTheme: () => void;
	resetMode: () => void;
	setText: (v: string) => void;
	disable: () => void;
	enable: () => void;
}

export const CustomCursor = defineModule<CustomCursorOptions, CustomCursorReturn>(
	({ app, options }) => {
		const isSupported = !isIOS() && !isIOSChrome() && !isIOSFirefox() && !isAndroid();

		let cursor: HTMLDivElement;
		let shadow: HTMLDivElement;
		let ripple: HTMLDivElement;
		let currentModifier: HTMLElement | null;

		const mouse = reactive(new Point());
		const shadowPos = reactive(new Point());
		const cursorPos = reactive(new Point());
		const dragPos = reactive(new Point());

		const mode = ref<string>();
		const theme = ref<string>();

		const isInjected = ref(false);
		const isBinded = ref(false);
		const isPressed = ref(false);
		const isMobile = ref(false);

		const turnOffMobile = debounce(() => {
			isMobile.value = false;
		}, 50);

		const text = ref();
		const isEnabled = ref(false);

		const isMoving = ref<number | null>();

		let setY: Setter;
		let setX: Setter;

		let setShadowY: Setter;
		let setShadowX: Setter;

		let setRippleY: Setter;
		let setRippleX: Setter;

		const cursorOptions = defaults(options, {
			hideDefault: false,
			cursorLerp: true,
			cursorDuration: 0.4,
			shadow: true,
			shadowDuration: 1,
			ripple: false,
			rippleThreshold: 50,
		});

		const hideDuration =
			cursorOptions.shadow && cursorOptions.shadowDuration > cursorOptions.cursorDuration
				? cursorOptions.shadowDuration * 1000
				: cursorOptions.cursorDuration * 1000;

		onInit(() => {
			initTemplates();
			initSetters();

			isEnabled.value = !!isSupported;
		});

		watch(
			isEnabled,
			enabled => {
				const root = document.documentElement;

				if (!isInjected.value) {
					if (enabled) {
						if (cursorOptions.hideDefault) root.classList.add('no-cursor');

						injectCursor();
						bind();
					} else {
						if (cursorOptions.hideDefault) root.classList.remove('no-cursor');

						hide();
					}
				}
			},
			{ immediate: true }
		);

		watch(
			text,
			newText => {
				const textEl = cursor.querySelector('.cursor__text');

				if (textEl) {
					if (!text.value && textEl.textContent) {
						setTimeout(() => {
							textEl.textContent = newText;
						}, 400);
					} else {
						textEl.textContent = newText;
					}
				}
			},
			{ immediate: true }
		);

		function initTemplates() {
			cursor = document.createElement('div');
			cursor.classList.add('cursor');
			cursor.innerHTML = `
			<div class="cursor__content">
				<div class="cursor__background"></div>
				<p class="cursor__text"></p>
			</div>
		`;

			shadow = document.createElement('div');
			shadow.classList.add('cursor');
			shadow.classList.add('cursor--shadow');
			shadow.innerHTML = `
			<div class="cursor__content">
				<div class="cursor__background"></div>
			</div>
		`;

			ripple = document.createElement('div');
			ripple.classList.add('cursor');
			ripple.classList.add('cursor--ripple');
			ripple.innerHTML = `
			<div class="cursor__content">
				<div class="cursor__background"></div>
			</div>
		`;
		}

		function initSetters() {
			setY = gsap.quickSetter(cursor, 'y', 'px') as Setter;
			setX = gsap.quickSetter(cursor, 'x', 'px') as Setter;

			setShadowY = gsap.quickSetter(shadow, 'y', 'px') as Setter;
			setShadowX = gsap.quickSetter(shadow, 'x', 'px') as Setter;

			setRippleY = gsap.quickSetter(ripple, 'y', 'px') as Setter;
			setRippleX = gsap.quickSetter(ripple, 'x', 'px') as Setter;
		}

		function injectCursor() {
			if (isInjected.value) return;

			isInjected.value = true;
			document.body.appendChild(cursor);

			if (cursorOptions.shadow) {
				document.body.appendChild(shadow);
			}

			disable();
		}

		function bind() {
			if (isBinded.value) return;

			const { documentElement: root, body } = document;

			isBinded.value = true;
			app.$on(
				'mousemove',
				({ clientX, clientY, target }: MouseEvent) => {
					if (isMobile) return;

					updateCursorPosition(clientX, clientY);

					moveHander();
					detectIsOverLink(target as HTMLElement);
				},
				{ target: root }
			);

			app.$on(
				'touchstart touchend touchmove',
				() => {
					hide();
					up();

					isMobile.value = true;
					turnOffMobile();
				},
				{ target: root }
			);

			app.$on(
				'mouseout',
				({ relatedTarget }: MouseEvent) => {
					if (relatedTarget === null || relatedTarget === document.documentElement) {
						hide();
						resetSide();
						up();
					}
				},
				{ target: body }
			);

			app.$on(
				'mousedown',
				() => {
					if (isMobile) return;

					down();
				},
				{ target: root }
			);

			app.$on(
				'mouseup',
				() => {
					if (isMobile) return;
					if (cursorOptions.ripple) createRipple();

					up();
				},
				{ target: root }
			);

			const onScrollDebounce = debounce(
				() => {
					resetMode();
					detectIsOverLink();
				},
				100,
				{ leading: true, trailing: false }
			);

			window.addEventListener('scroll', onScrollDebounce, { passive: true });
		}

		function updateCursorPosition(x: number, y: number) {
			mouse.x = x;
			mouse.y = y;

			if (!cursorOptions.cursorLerp) {
				setX(mouse.x);
				setY(mouse.y);
			}

			onMoveStop();
			setSide(x);
		}

		function updateDragPosition() {
			dragPos.x = mouse.x;
			dragPos.y = mouse.y;
		}

		function onMoveStop() {
			if (isMoving.value) clearTimeout(isMoving.value);
			isMoving.value = window.setTimeout(() => {
				disableTicker();
				isMoving.value = null;
			}, hideDuration);
		}

		function isOverLink(target?: HTMLElement | null) {
			return (
				target &&
				(target.tagName === 'A' ||
					target.tagName === 'BUTTON' ||
					!!target.closest('a,button') ||
					!!options?.checkIfLink?.(target))
			);
		}

		function detectIsOverLink(target?: HTMLElement | null) {
			if (isOverLink(target)) {
				cursor.classList.add('is-over-link');
				if (cursorOptions.shadow) shadow.classList.add('is-over-link');
			} else if (target?.dataset.cursorMode === 'drag') {
				cursor.classList.remove('is-over-link');
				if (cursorOptions.shadow) shadow.classList.remove('is-over-link');
			} else {
				cursor.classList.remove('is-over-link');
				if (cursorOptions.shadow) shadow.classList.remove('is-over-link');
			}
		}

		function lerpHandler() {
			if (cursorOptions.shadow) {
				const dt =
					1.0 - Math.pow(1.0 - 1 / (cursorOptions.shadowDuration * 10), gsap.ticker.deltaRatio());

				shadowPos.x += (mouse.x - shadowPos.x) * dt;
				shadowPos.y += (mouse.y - shadowPos.y) * dt;
				setShadowX(shadowPos.x);
				setShadowY(shadowPos.y);
			}
			if (cursorOptions.cursorLerp) {
				const dt =
					1.0 - Math.pow(1.0 - 1 / (cursorOptions.cursorDuration * 10), gsap.ticker.deltaRatio());

				cursorPos.x += (mouse.x - cursorPos.x) * dt;
				cursorPos.y += (mouse.y - cursorPos.y) * dt;
				setX(cursorPos.x);
				setY(cursorPos.y);
			}
		}

		function down() {
			if (!isPressed.value) {
				cursor.classList.add('is-pressed');
				if (cursorOptions.shadow) shadow.classList.add('is-pressed');
				isPressed.value = true;
				if (cursorOptions.ripple) updateDragPosition();
			}
		}

		function up() {
			if (isPressed.value) {
				cursor.classList.remove('is-pressed');
				if (cursorOptions.shadow) shadow.classList.remove('is-pressed');
				isPressed.value = false;
				if (cursorOptions.ripple) updateDragPosition();
			}
		}

		function disable() {
			isEnabled.value = false;
		}

		function enable() {
			isEnabled.value = isSupported;
		}

		function enableTicker() {
			if (cursorOptions.shadow || cursorOptions.cursorLerp) {
				gsap.ticker.add(lerpHandler);
			}
		}

		function disableTicker() {
			if (cursorOptions.shadow || cursorOptions.cursorLerp) {
				gsap.ticker.remove(lerpHandler);
			}
		}

		function createRipple() {
			const diffX = Math.abs(mouse.x - dragPos.x);
			const diffY = Math.abs(mouse.y - dragPos.y);

			if (diffX <= cursorOptions.rippleThreshold && diffY <= cursorOptions.rippleThreshold) {
				setRippleX(mouse.x);
				setRippleY(mouse.y);

				const _ripple = ripple.cloneNode(true);

				_ripple.addEventListener(
					'animationend',
					() => {
						document.body.removeChild(_ripple);
					},
					{ once: true }
				);

				document.body.appendChild(_ripple);
			}
		}

		function unifyPos() {
			cursorPos.x = mouse.x;
			cursorPos.y = mouse.y;
			shadowPos.x = mouse.x;
			shadowPos.y = mouse.y;

			setX(mouse.x);
			setY(mouse.y);
			setShadowX(mouse.x);
			setShadowY(mouse.y);
		}

		function moveHander() {
			if (!isEnabled.value) {
				unifyPos();
			}

			setTimeout(() => {
				show();
			});
		}

		function show() {
			enable();
			enableTicker();

			if (isEnabled.value) {
				cursor.classList.add('is-visible');

				if (cursorOptions.shadow) {
					shadow.classList.add('is-visible');
				}
			}
		}

		function hide() {
			disable();

			if (isInjected.value) {
				cursor.classList.remove('is-visible');

				if (cursorOptions.shadow) {
					shadow.classList.remove('is-visible');
				}
			}
		}

		function setSide(x: number) {
			if (isEnabled.value) {
				const side = x > window.innerWidth / 2 ? 'right' : 'left';
				const oppositeSide = side === 'left' ? 'right' : 'left';

				cursor.classList.add(`is-${side}`);
				cursor.classList.remove(`is-${oppositeSide}`);

				if (cursorOptions.shadow) {
					shadow.classList.add(`is-${side}`);
					shadow.classList.remove(`is-${oppositeSide}`);
				}
			}
		}

		function resetSide() {
			if (isInjected.value) {
				cursor.classList.remove('is-right');
				cursor.classList.remove('is-left');

				if (cursorOptions.shadow) {
					shadow.classList.remove('is-right');
					shadow.classList.remove('is-left');
				}
			}
		}

		function setMode(value: string) {
			if (mode.value !== value) {
				cursor.dataset.mode = value;
				if (cursorOptions.shadow) shadow.dataset.mode = value;
			}
		}

		function resetMode() {
			cursor.dataset.mode = '';
			if (cursorOptions.shadow) shadow.dataset.mode = '';
		}

		function setTheme(value: string) {
			if (theme.value !== value) {
				cursor.dataset.theme = value;
				if (cursorOptions.shadow) shadow.dataset.theme = value;
			}
		}

		function resetTheme() {
			cursor.dataset.theme = '';
			if (cursorOptions.shadow) shadow.dataset.theme = '';
		}

		function setText(v: string) {
			text.value = v;
		}

		/**
		 * Allows to register dynamic modifiers for cursor on certain element
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		function addModifier(element: Element) {
			element.addEventListener('mouseenter', elementEnterMove);
			element.addEventListener('mousemove', elementEnterMove);
			element.addEventListener('mouseleave', elementLeave);
			element.addEventListener('cursor-modifier-changed', elementModifierChanged);
		}

		/**
		 * Allows to unregister dynamic modifiers for cursor on certain element
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		function removeModifier(element: Element) {
			if (currentModifier === element) {
				resetMode();
				resetTheme();
				currentModifier = null;
			}

			element.removeEventListener('mouseenter', elementEnterMove);
			element.removeEventListener('mousemove', elementEnterMove);
			element.removeEventListener('mouseleave', elementLeave);
			element.removeEventListener('cursor-modifier-changed', elementModifierChanged);
		}

		function elementEnterMove({ currentTarget }: MouseEvent) {
			const target = currentTarget as HTMLElement;

			updateCursorModifiers(target);
			currentModifier = target;
			detectIsOverLink(target);
		}

		function elementModifierChanged({ currentTarget }: MouseEvent) {
			const target = currentTarget as HTMLElement;

			if (target === currentModifier) {
				updateCursorModifiers(target);
			}
		}

		function elementLeave({ currentTarget }: MouseEvent) {
			const target = currentTarget as HTMLElement;

			updateCursorModifiers(target, true);

			if (currentModifier === currentTarget) {
				currentModifier = null;
			}
		}

		function updateCursorModifiers(target: HTMLElement, reset = false) {
			const { cursorMode, cursorTheme, cursorText } = target.dataset;

			if (cursorMode) {
				if (reset) {
					resetMode();
				} else {
					setMode(cursorMode);
				}
			}

			if (cursorTheme) {
				if (reset) {
					resetTheme();
				} else {
					setTheme(cursorTheme);
				}
			}

			if (cursorText) {
				setText(reset ? '' : cursorText);
			}
		}

		return {
			mouse,
			shadowPos,
			cursorPos,
			dragPos,
			isMobile,
			isPressed,
			isInjected,
			isEnabled,
			text,
			hide,
			show,
			addModifier,
			removeModifier,
			setMode,
			setTheme,
			resetTheme,
			resetMode,
			setText,
			disable,
			enable,
		};
	}
);

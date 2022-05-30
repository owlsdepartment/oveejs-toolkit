import { gsap } from 'gsap';
import { debounce } from 'lodash';
import { doWatch, Module, ref } from 'ovee.js';

import { isAndroid, isIOS, isIOSChrome, isIOSFirefox } from '@/tools/browser';

type Setter = (val: number) => void;

export interface CustomCursorConfig {
	hideDefault: boolean;
	cursorLerp: boolean;
	cursorDuration: number;
	shadow: boolean;
	shadowDuration: number;
	ripple: boolean;
	rippleThreshold: number;
}

export const CUSTOM_CURSOR_DEFAULT_CONFIG: CustomCursorConfig = {
	hideDefault: false,
	cursorLerp: true,
	cursorDuration: 0.4,
	shadow: true,
	shadowDuration: 1,
	ripple: false,
	rippleThreshold: 50,
};

export class Point {
	x = 0;
	y = 0;
}

export class CustomCursor extends Module<CustomCursorConfig> {
	cursor: HTMLDivElement;
	shadow: HTMLDivElement;
	ripple: HTMLDivElement;
	currentModifier: HTMLElement | null;

	mouse = new Point();
	shadowPos = new Point();
	cursorPos = new Point();
	dragPos = new Point();

	mode = '';
	theme = '';

	injected = false;
	isSupported = !isIOS() && !isIOSChrome() && !isIOSFirefox() && !isAndroid();
	isBinded = false;
	isPressed = false;
	isMobile = false;
	turnOffMobile = debounce(() => {
		this.isMobile = false;
	}, 50);

	text = ref('');
	isEnabled = ref(false);

	isMoving: number | null = null;

	private setY: Setter;
	private setX: Setter;

	private setShadowY: Setter;
	private setShadowX: Setter;

	private setRippleY: Setter;
	private setRippleX: Setter;

	get hideDuration() {
		return this.options.shadow && this.options.shadowDuration > this.options.cursorDuration
			? this.options.shadowDuration * 1000
			: this.options.cursorDuration * 1000;
	}

	init() {
		this.options = {
			...CUSTOM_CURSOR_DEFAULT_CONFIG,
			...this.options,
		};

		this.initTemplates();
		this.initSetters();

		this.isEnabled.value = !!this.isSupported;

		this.elementEnterMove = this.elementEnterMove.bind(this);
		this.elementLeave = this.elementLeave.bind(this);
		this.elementModifierChanged = this.elementModifierChanged.bind(this);
		this.lerpHandler = this.lerpHandler.bind(this);

		doWatch(this.isEnabled, this.onEnabledChange.bind(this), { immediate: true });
		doWatch(this.text, this.onTextChange.bind(this), { immediate: true });
	}

	initTemplates() {
		this.cursor = document.createElement('div');
		this.cursor.classList.add('cursor');
		this.cursor.innerHTML = `
			<div class="cursor__content">
				<div class="cursor__background"></div>
				<p class="cursor__text"></p>
			</div>
		`;

		this.shadow = document.createElement('div');
		this.shadow.classList.add('cursor');
		this.shadow.classList.add('cursor--shadow');
		this.shadow.innerHTML = `
			<div class="cursor__content">
				<div class="cursor__background"></div>
			</div>
		`;

		this.ripple = document.createElement('div');
		this.ripple.classList.add('cursor');
		this.ripple.classList.add('cursor--ripple');
		this.ripple.innerHTML = `
			<div class="cursor__content">
				<div class="cursor__background"></div>
			</div>
		`;
	}

	initSetters() {
		this.setY = gsap.quickSetter(this.cursor, 'y', 'px') as Setter;
		this.setX = gsap.quickSetter(this.cursor, 'x', 'px') as Setter;

		this.setShadowY = gsap.quickSetter(this.shadow, 'y', 'px') as Setter;
		this.setShadowX = gsap.quickSetter(this.shadow, 'x', 'px') as Setter;

		this.setRippleY = gsap.quickSetter(this.ripple, 'y', 'px') as Setter;
		this.setRippleX = gsap.quickSetter(this.ripple, 'x', 'px') as Setter;
	}

	onEnabledChange() {
		const root = document.documentElement;

		if (!this.injected) {
			if (this.isEnabled.value) {
				if (this.options.hideDefault) root.classList.add('no-cursor');

				this.injectCursor();
				this.bind();
			} else {
				if (this.options.hideDefault) root.classList.remove('no-cursor');

				this.hide();
			}
		}
	}

	onTextChange() {
		const textEl = this.cursor.querySelector('.cursor__text');

		if (textEl) {
			if (!this.text.value && textEl.textContent) {
				setTimeout(() => {
					textEl.textContent = this.text.value;
				}, 400);
			} else {
				textEl.textContent = this.text.value;
			}
		}
	}

	injectCursor() {
		if (this.injected) return;

		this.injected = true;
		document.body.appendChild(this.cursor);

		if (this.options.shadow) {
			document.body.appendChild(this.shadow);
		}

		this.disable();
	}

	bind() {
		if (this.isBinded) return;

		const { documentElement: root, body } = document;

		this.isBinded = true;
		this.$app.$on('mousemove', root, ({ clientX, clientY, target }: MouseEvent) => {
			if (this.isMobile) return;

			this.updateCursorPosition(clientX, clientY);

			this.moveHander();
			this.detectIsOverLink(target as HTMLElement);
		});

		this.$app.$on('touchstart touchend touchmove', root, () => {
			this.hide();
			this.up();

			this.isMobile = true;
			this.turnOffMobile();
		});

		this.$app.$on('mouseout', body, ({ relatedTarget }: MouseEvent) => {
			if (relatedTarget === null || relatedTarget === document.documentElement) {
				this.hide();
				this.resetSide();
				this.up();
			}
		});

		this.$app.$on('mousedown', root, () => {
			if (this.isMobile) return;

			this.down();
		});

		this.$app.$on('mouseup', root, () => {
			if (this.isMobile) return;
			if (this.options.ripple) this.createRipple();

			this.up();
		});

		const onScrollDebounce = debounce(
			() => {
				this.resetMode();
				this.detectIsOverLink();
			},
			100,
			{ leading: true, trailing: false }
		);

		window.addEventListener('scroll', onScrollDebounce, { passive: true });
	}

	updateCursorPosition(x: number, y: number) {
		this.mouse.x = x;
		this.mouse.y = y;

		if (!this.options.cursorLerp) {
			this.setX(this.mouse.x);
			this.setY(this.mouse.y);
		}

		this.onMoveStop();
		this.setSide(x);
	}

	updateDragPosition() {
		this.dragPos.x = this.mouse.x;
		this.dragPos.y = this.mouse.y;
	}

	onMoveStop() {
		if (this.isMoving) clearTimeout(this.isMoving);
		this.isMoving = window.setTimeout(() => {
			this.disableTicker();
			this.isMoving = null;
		}, this.hideDuration);
	}

	detectIsOverLink(target?: HTMLElement | null) {
		if (target?.tagName === 'A' || target?.tagName === 'BUTTON' || !!target?.closest('a,button')) {
			this.cursor.classList.add('is-over-link');
			if (this.options.shadow) this.shadow.classList.add('is-over-link');
		} else if (target?.dataset.cursorMode === 'drag') {
			this.cursor.classList.remove('is-over-link');
			if (this.options.shadow) this.shadow.classList.remove('is-over-link');
		} else {
			this.cursor.classList.remove('is-over-link');
			if (this.options.shadow) this.shadow.classList.remove('is-over-link');
		}
	}

	lerpHandler() {
		if (this.options.shadow) {
			const dt =
				1.0 - Math.pow(1.0 - 1 / (this.options.shadowDuration * 10), gsap.ticker.deltaRatio());

			this.shadowPos.x += (this.mouse.x - this.shadowPos.x) * dt;
			this.shadowPos.y += (this.mouse.y - this.shadowPos.y) * dt;
			this.setShadowX(this.shadowPos.x);
			this.setShadowY(this.shadowPos.y);
		}
		if (this.options.cursorLerp) {
			const dt =
				1.0 - Math.pow(1.0 - 1 / (this.options.cursorDuration * 10), gsap.ticker.deltaRatio());

			this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * dt;
			this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * dt;
			this.setX(this.cursorPos.x);
			this.setY(this.cursorPos.y);
		}
	}

	down() {
		if (!this.isPressed) {
			this.cursor.classList.add('is-pressed');
			if (this.options.shadow) this.shadow.classList.add('is-pressed');
			this.isPressed = true;
			if (this.options.ripple) this.updateDragPosition();
		}
	}

	up() {
		if (this.isPressed) {
			this.cursor.classList.remove('is-pressed');
			if (this.options.shadow) this.shadow.classList.remove('is-pressed');
			this.isPressed = false;
			if (this.options.ripple) this.updateDragPosition();
		}
	}

	disable() {
		this.isEnabled.value = false;
	}

	enable() {
		this.isEnabled.value = this.isSupported;
	}

	enableTicker() {
		if (this.options.shadow || this.options.cursorLerp) {
			gsap.ticker.add(this.lerpHandler);
		}
	}

	disableTicker() {
		if (this.options.shadow || this.options.cursorLerp) {
			gsap.ticker.remove(this.lerpHandler);
		}
	}

	createRipple() {
		const diffX = Math.abs(this.mouse.x - this.dragPos.x);
		const diffY = Math.abs(this.mouse.y - this.dragPos.y);

		if (diffX <= this.options.rippleThreshold && diffY <= this.options.rippleThreshold) {
			this.setRippleX(this.mouse.x);
			this.setRippleY(this.mouse.y);

			const ripple = this.ripple.cloneNode(true);

			ripple.addEventListener(
				'animationend',
				() => {
					document.body.removeChild(ripple);
				},
				{ once: true }
			);

			document.body.appendChild(ripple);
		}
	}

	unifyPos() {
		this.cursorPos.x = this.mouse.x;
		this.cursorPos.y = this.mouse.y;
		this.shadowPos.x = this.mouse.x;
		this.shadowPos.y = this.mouse.y;

		this.setX(this.mouse.x);
		this.setY(this.mouse.y);
		this.setShadowX(this.mouse.x);
		this.setShadowY(this.mouse.y);
	}

	moveHander() {
		if (!this.isEnabled.value) {
			this.unifyPos();
		}

		setTimeout(() => {
			this.show();
		});
	}

	show() {
		this.enable();
		this.enableTicker();

		if (this.isEnabled.value) {
			this.cursor.classList.add('is-visible');

			if (this.options.shadow) {
				this.shadow.classList.add('is-visible');
			}
		}
	}

	hide() {
		this.disable();

		if (this.injected) {
			this.cursor.classList.remove('is-visible');

			if (this.options.shadow) {
				this.shadow.classList.remove('is-visible');
			}
		}
	}

	setSide(x: number) {
		if (this.isEnabled.value) {
			const side = x > window.innerWidth / 2 ? 'right' : 'left';
			const oppositeSide = side === 'left' ? 'right' : 'left';

			this.cursor.classList.add(`is-${side}`);
			this.cursor.classList.remove(`is-${oppositeSide}`);

			if (this.options.shadow) {
				this.shadow.classList.add(`is-${side}`);
				this.shadow.classList.remove(`is-${oppositeSide}`);
			}
		}
	}

	resetSide() {
		if (this.injected) {
			this.cursor.classList.remove('is-right');
			this.cursor.classList.remove('is-left');

			if (this.options.shadow) {
				this.shadow.classList.remove('is-right');
				this.shadow.classList.remove('is-left');
			}
		}
	}

	setMode(mode: string) {
		if (this.mode !== mode) {
			this.cursor.dataset.mode = mode;
			if (this.options.shadow) this.shadow.dataset.mode = mode;
		}
	}

	resetMode() {
		this.cursor.dataset.mode = '';
		if (this.options.shadow) this.shadow.dataset.mode = '';
	}

	setTheme(theme: string) {
		if (this.theme !== theme) {
			this.cursor.dataset.theme = theme;
			if (this.options.shadow) this.shadow.dataset.theme = theme;
		}
	}

	resetTheme() {
		this.cursor.dataset.theme = '';
		if (this.options.shadow) this.shadow.dataset.theme = '';
	}

	setText(text: string) {
		this.text.value = text;
	}

	/**
	 * Allows to register dynamic modifiers for cursor on certain element
	 */
	addModifier(element: Element) {
		element.addEventListener('mouseenter', this.elementEnterMove);
		element.addEventListener('mousemove', this.elementEnterMove);
		element.addEventListener('mouseleave', this.elementLeave);
		element.addEventListener('cursor-modifier-changed', this.elementModifierChanged);
	}

	/**
	 * Allows to unregister dynamic modifiers for cursor on certain element
	 */
	removeModifier(element: Element) {
		if (this.currentModifier === element) {
			this.resetMode();
			this.resetTheme();
			this.currentModifier = null;
		}

		element.removeEventListener('mouseenter', this.elementEnterMove);
		element.removeEventListener('mousemove', this.elementEnterMove);
		element.removeEventListener('mouseleave', this.elementLeave);
		element.removeEventListener('cursor-modifier-changed', this.elementModifierChanged);
	}

	elementEnterMove({ currentTarget }: MouseEvent) {
		const target = currentTarget as HTMLElement;

		this.updateCursorModifiers(target);
		this.currentModifier = target;
		this.detectIsOverLink(target);
	}

	elementModifierChanged({ currentTarget }: MouseEvent) {
		const target = currentTarget as HTMLElement;

		if (target === this.currentModifier) {
			this.updateCursorModifiers(target);
		}
	}

	elementLeave({ currentTarget }: MouseEvent) {
		const target = currentTarget as HTMLElement;

		this.updateCursorModifiers(target, true);

		if (this.currentModifier === currentTarget) {
			this.currentModifier = null;
		}
	}

	private updateCursorModifiers(target: HTMLElement, reset = false) {
		const { cursorMode, cursorTheme } = target.dataset;

		if (cursorMode) {
			reset ? this.resetMode() : this.setMode(cursorMode);
		}

		if (cursorTheme) {
			reset ? this.resetTheme() : this.setTheme(cursorTheme);
		}

		if ('cursorText' in target.dataset) {
			this.setText(reset ? '' : target.dataset.cursorText ?? '');
		}
	}

	static getName() {
		return 'CustomCursor';
	}
}

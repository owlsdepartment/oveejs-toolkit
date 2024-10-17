import { computed, defineComponent, emitEvent, Logger, useDataAttr } from 'ovee.js';

type toggleEvent = CustomEvent<boolean>;

const logger = new Logger('NavToggle');
const DEFAULT_NAV_NAME = 'menu';

export const NavToggle = defineComponent((_, { on, emit }) => {
	const navName = useDataAttr('navToggle');
	const navSelector = useDataAttr('nav');

	const _showImmediately = useDataAttr('showImmediately');
	const showImmediately = computed(() => {
		return _showImmediately.value === 'true';
	});

	const _hideImmediately = useDataAttr('hideImmediately');
	const hideImmediately = computed(() => {
		return _hideImmediately.value === 'true';
	});

	let isOpen = false;

	if (!navName.value) {
		navName.value = DEFAULT_NAV_NAME;
	}

	if (!navSelector.value) {
		logger.error(`Attribute 'data-nav' with value is required`);
		return;
	}

	const nav = document.querySelector<HTMLElement>(navSelector.value);
	let animStarted: boolean;
	const html = document.documentElement;

	if (!nav) {
		logger.error(`Could not find nav with selector: '${navSelector.value}'`);
		return;
	}

	bind();

	function bind() {
		on('click', clickHandler);
		on('nav-toggle:show', onNavShow);
		on('nav-toggle:hide', onNavHide);

		if (nav) {
			on('transitionstart', animStart, { target: nav });
			on('transitionend', animEnd, { target: nav });
		}
	}

	function clickHandler(e: Event) {
		e.preventDefault();
		e.stopPropagation();

		if (isOpen) {
			hide(hideImmediately.value);
		} else {
			show(showImmediately.value);
		}
	}

	function onNavShow(e: toggleEvent) {
		show(e.detail);
	}

	function onNavHide(e: toggleEvent) {
		hide(e.detail);
	}

	function animStart(e: Event) {
		if (e.target !== nav) {
			return;
		}

		if (animStarted) {
			return;
		}

		animStarted = true;

		if (isOpen) {
			html.classList.add(`${navName.value}-anim`);
		} else {
			html.classList.add(`${navName.value}-hide-anim`);
		}
	}

	function animEnd(e: Event) {
		if (e.target !== nav) {
			return;
		}

		if (!animStarted) {
			return;
		}

		animStarted = false;

		if (isOpen) {
			html.classList.remove(`${navName.value}-anim`);
		} else {
			html.classList.remove(`${navName.value}-hide-anim`);
		}
	}

	function show(immediately = false) {
		isOpen = true;

		if (immediately) {
			html.classList.add(`${navName.value}-show-immediately`);

			requestAnimationFrame(() => {
				html.classList.remove(`${navName.value}-show-immediately`);
			});
		}

		html.classList.add(`${navName.value}-visible`);
		nav?.setAttribute('aria-expanded', 'true');

		emit('nav-toggle:visible', nav);
		emitEvent(window as any, 'nav-toggle:visible', {
			element: nav,
			navName: navName.value,
		});
	}

	function hide(immediately = false) {
		isOpen = false;

		if (immediately) {
			html.classList.add(`${navName.value}-hide-immediately`);

			requestAnimationFrame(() => {
				html.classList.remove(`${navName.value}-hide-immediately`);
			});
		}

		html.classList.remove(`${navName.value}-visible`);
		nav?.setAttribute('aria-expanded', 'false');

		emit('nav-toggle:hidden', nav);
		emitEvent(window as any, 'nav-toggle:hidden', {
			element: nav,
			navName: navName.value,
		});
	}
});

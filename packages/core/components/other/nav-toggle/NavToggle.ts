import { computed, defineComponent, emitEvent, Logger, onMounted, ref, useDataAttr } from 'ovee.js';

type toggleEvent = CustomEvent<boolean>;

const logger = new Logger('NavToggle');
const DEFAULT_NAV_NAME = 'menu';

export const NavToggle = defineComponent((element, { on, emit }) => {
	const html = document.documentElement;

	const isOpen = ref(false);
	const animStarted = ref(false);

	const _navSelector = useDataAttr('nav');
	const _navName = useDataAttr('navToggle');
	const _showImmediately = useDataAttr('showImmediately');
	const _hideImmediately = useDataAttr('hideImmediately');

	const navElement = computed(() => {
		if (!_navSelector.value) {
			logger.error(`Attribute 'data-nav' with value is required`);

			return;
		}

		const nav = document.querySelector<HTMLElement>(_navSelector.value);

		if (!nav) {
			logger.error(`Could not find nav with selector: '${_navSelector.value}'`);

			return;
		}

		return nav;
	});

	const navName = computed(() => {
		return _navName.value ?? DEFAULT_NAV_NAME;
	});

	const showImmediately = computed(() => {
		return _showImmediately.value === 'true';
	});

	const hideImmediately = computed(() => {
		return _hideImmediately.value === 'true';
	});

	onMounted(() => {
		if (!navElement.value) {
			return;
		}

		bind();
	});

	function bind() {
		on('click', clickHandler);
		on('nav-toggle:show', onNavShow);
		on('nav-toggle:hide', onNavHide);
		on('transitionstart', animStart, { target: navElement.value });
		on('transitionend', animEnd, { target: navElement.value });
	}

	function clickHandler(e: Event) {
		e.preventDefault();
		e.stopPropagation();

		if (isOpen.value) {
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
		if (e.target !== navElement.value) {
			return;
		}

		if (animStarted.value) {
			return;
		}

		animStarted.value = true;

		if (isOpen.value) {
			html.classList.add(`${navName.value}-anim`);
		} else {
			html.classList.add(`${navName.value}-hide-anim`);
		}
	}

	function animEnd(e: Event) {
		if (e.target !== navElement.value) {
			return;
		}

		if (!animStarted.value) {
			return;
		}

		animStarted.value = false;

		if (isOpen.value) {
			html.classList.remove(`${navName.value}-anim`);
		} else {
			html.classList.remove(`${navName.value}-hide-anim`);
		}
	}

	function show(immediately = false) {
		isOpen.value = true;

		if (immediately) {
			html.classList.add(`${navName.value}-show-immediately`);

			requestAnimationFrame(() => {
				html.classList.remove(`${navName.value}-show-immediately`);
			});
		}

		html.classList.add(`${navName.value}-visible`);
		element.setAttribute('aria-expanded', 'true');

		emit('nav-toggle:visible', element);
		emitEvent(window as any, 'nav-toggle:visible', {
			element: element,
			navName: navName.value,
		});
	}

	function hide(immediately = false) {
		isOpen.value = false;

		if (immediately) {
			html.classList.add(`${navName.value}-hide-immediately`);

			requestAnimationFrame(() => {
				html.classList.remove(`${navName.value}-hide-immediately`);
			});
		}

		html.classList.remove(`${navName.value}-visible`);
		element.setAttribute('aria-expanded', 'false');

		emit('nav-toggle:hidden', element);
		emitEvent(window as any, 'nav-toggle:hidden', {
			element: element,
			navName: navName.value,
		});
	}

	return {
		show,
		hide,
		isOpen,
		animStarted,
		navElement,
		navName,
		showImmediately,
		hideImmediately,
	};
});

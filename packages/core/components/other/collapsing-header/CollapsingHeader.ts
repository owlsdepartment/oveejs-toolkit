import { defaults, isNumber, throttle } from 'lodash';
import { computed, defineComponent, onMounted, ref, useDataAttr } from 'ovee.js';

export interface CollapsingHeaderOptions {
	throttle?: number;
	onScroll?: (currentPosition: number, isScrollingDown: boolean, pastTrigger: boolean) => void;
}

export type TriggerOffsetConst = 'window' | 'header' | 'none' | 'default';
export type TriggerOffset = TriggerOffsetConst | string;

const calcOffsetMap: Record<
	TriggerOffsetConst | 'triggerPoint',
	(props: {
		multiplier: number;
		headerHeight: number;
		collapsingHeader?: string;
		numberOffset: number;
		triggerOffset: string;
		triggerElement: HTMLElement | null;
	}) => number
> = {
	window: props => {
		return window.innerHeight * props.multiplier;
	},
	header: props => {
		return props.headerHeight * props.multiplier;
	},
	none: props => {
		return props.collapsingHeader === 'sticky' ? props.headerHeight : 0;
	},
	default: props => {
		return props.numberOffset;
	},
	triggerPoint: props => {
		if (props.triggerElement) {
			return props.triggerElement.getBoundingClientRect().top;
		}

		return props.numberOffset;
	},
};

export const CollapsingHeader = defineComponent<HTMLElement, CollapsingHeaderOptions>(
	(element, { options, on }) => {
		const html = document.documentElement;
		const headerOptions = defaults(options, {
			throttle: 100,
		});

		const htmlUpdate = ref(0);
		const currentPosition = ref(0);
		const lastPosition = ref(0);
		const numberOffset = ref(0);
		const headerHeight = ref(0);
		const isScrollingDown = ref(true);
		const pastTrigger = ref(false);

		let scrollListener: () => void;

		const collapsingHeader = useDataAttr('collapsingHeader');
		const offsetMultiplier = useDataAttr('offsetMultiplier');
		const _triggerOffset = useDataAttr('triggerOffset');
		const _throttleValue = useDataAttr('throttleValue');

		const triggerOffset = computed(() => {
			return _triggerOffset.value ?? 'default';
		});

		const throttleValue = computed(() => {
			const value = _throttleValue.value ?? `${headerOptions.throttle}`;
			const parsedValue = JSON.parse(value);

			return isNumber(parsedValue) && !isNaN(parsedValue) ? parsedValue : headerOptions.throttle;
		});

		const isShown = computed(() => {
			htmlUpdate.value;
			return html.classList.contains('header-visible');
		});

		const isModified = computed(() => {
			htmlUpdate.value;
			return html.classList.contains('header-modified');
		});

		const isCollapsed = computed(() => {
			htmlUpdate.value;
			return html.classList.contains('header-collapsed');
		});

		const multiplier = computed(() => {
			return offsetMultiplier.value ? parseFloat(offsetMultiplier.value) : 1;
		});

		const triggerElement = computed(() => {
			return document.querySelector<HTMLElement>(triggerOffset.value);
		});

		onMounted(init);

		function init() {
			headerHeight.value = element.getBoundingClientRect().height;

			let scrollCallback: () => void;

			if (collapsingHeader.value === 'sticky') {
				numberOffset.value = window.innerHeight;
				scrollCallback = scrollSticky;
			} else if (collapsingHeader.value === 'fixed') {
				scrollCallback = scrollFixed;
			} else {
				scrollCallback = scrollCollapsing;
			}

			scrollListener = throttle(scrollCallback, throttleValue.value);

			calcOffsets();
			bind();
		}

		function show() {
			if (!isShown.value) {
				updateHtmlClasses('header-visible', 'add');
			}
		}

		function hide() {
			if (isShown.value) {
				updateHtmlClasses('header-visible', 'remove');
			}
		}

		function collapse() {
			if (!isCollapsed.value) {
				updateHtmlClasses('header-collapsed', 'add');
			}
		}

		function uncollapse() {
			if (isCollapsed.value) {
				updateHtmlClasses('header-collapsed', 'remove');
			}
		}

		function addModifier() {
			if (!isModified.value) {
				updateHtmlClasses('header-modified', 'add');
			}
		}

		function removeModifier() {
			if (isModified.value) {
				updateHtmlClasses('header-modified', 'remove');
			}
		}

		function updateHtmlClasses(className: string, action: 'add' | 'remove') {
			htmlUpdate.value += 1;
			html.classList[action](className);
		}

		function calcOffsets() {
			const props = {
				multiplier: multiplier.value,
				collapsingHeader: collapsingHeader.value,
				headerHeight: headerHeight.value,
				numberOffset: numberOffset.value,
				triggerOffset: triggerOffset.value,
				triggerElement: triggerElement.value,
			};

			if (triggerOffset.value in calcOffsetMap) {
				numberOffset.value =
					calcOffsetMap?.[triggerOffset.value as TriggerOffsetConst](props) ?? numberOffset.value;
			} else {
				numberOffset.value = calcOffsetMap.triggerPoint(props) ?? numberOffset.value;
			}
		}

		function scrollStart() {
			currentPosition.value = window.scrollY || document.documentElement.scrollTop;
			isScrollingDown.value = !(currentPosition.value <= lastPosition.value);
			pastTrigger.value = currentPosition.value > numberOffset.value;

			if (headerOptions.onScroll) {
				headerOptions.onScroll(currentPosition.value, isScrollingDown.value, pastTrigger.value);
			}
		}

		function scrollEnd() {
			lastPosition.value = currentPosition.value;
		}

		function scrollSticky() {
			scrollStart();

			if (!isScrollingDown.value && pastTrigger.value) {
				show();
			} else {
				hide();
			}

			if (pastTrigger.value) {
				addModifier();
			} else {
				removeModifier();
			}

			scrollEnd();
		}

		function scrollFixed() {
			scrollStart();

			if (pastTrigger.value) {
				addModifier();
			} else {
				removeModifier();
			}

			scrollEnd();
		}

		function scrollCollapsing() {
			scrollStart();

			if (!isScrollingDown.value) {
				uncollapse();
			} else {
				collapse();
			}

			if (pastTrigger.value) {
				addModifier();
			} else {
				removeModifier();
			}

			scrollEnd();
		}

		function bind() {
			on('scroll load ajaxload', scrollListener, { target: window });
			on('resize', calcOffsets, { target: window });
		}

		return {
			currentPosition,
			lastPosition,
			numberOffset,
			headerHeight,
			pastTrigger,
			isScrollingDown,
			isCollapsed,
			isShown,
			isModified,
			show,
			hide,
			collapse,
			uncollapse,
			addModifier,
			removeModifier,
		};
	}
);

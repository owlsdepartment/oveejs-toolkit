import gsap from 'gsap';
import { SplitText as SplitTextPlugin } from 'gsap/SplitText';
import { debounce, omit } from 'lodash';
import { defineComponent, onUnmounted, shallowRef, useDataAttr } from 'ovee.js';

gsap.registerPlugin(SplitTextPlugin);

interface SplitTextOptions extends SplitText.Vars {
	windowResize?: boolean;
}

export const SplitText = defineComponent<HTMLElement, SplitTextOptions>(
	(element, { on, off, options }) => {
		const text = shallowRef<SplitTextPlugin | null>(null);

		const splitTextType = useDataAttr('split-text-type');
		const linesClass = useDataAttr('lines-class');
		const wordsClass = useDataAttr('words-class');
		const charsClass = useDataAttr('chars-class');

		const resizeHandlerDebounced = debounce(resizeHandler, 100);

		initSplitText();

		if (options?.windowResize) {
			on('resize', resizeHandlerDebounced, {
				target: window,
			});
		}

		onUnmounted(() => {
			if (options?.windowResize) {
				off('resize', resizeHandlerDebounced);
			}
		});

		function initSplitText() {
			text.value = new SplitTextPlugin(element, {
				...omit(options ?? {}, 'windowResize'),
				type: splitTextType.value ?? options?.type,
				linesClass: linesClass.value ?? options?.linesClass,
				wordsClass: wordsClass.value ?? options?.wordsClass,
				charsClass: charsClass.value ?? options?.charsClass,
			});
		}

		function resizeHandler() {
			cleanup();
			initSplitText();
		}

		function cleanup() {
			text.value?.revert();
			text.value = null;
		}

		return {
			instance: text,
		};
	}
);

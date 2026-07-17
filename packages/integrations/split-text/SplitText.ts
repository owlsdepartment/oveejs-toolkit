import { useInViewport } from '@ovee.js/toolkit';
import gsap from 'gsap';
import { SplitText as SplitTextPlugin } from 'gsap/SplitText';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';
import { defineComponent, onUnmounted, shallowRef, useDataAttr } from 'ovee.js';

const DEFAULT_LINES_CLASS = 'split-text__line';
const DEFAULT_WORDS_CLASS = 'split-text__word';
const DEFAULT_CHARS_CLASS = 'split-text__char';

interface SplitTextOptions extends SplitText.Vars {
	windowResize?: boolean;
	inViewport?: boolean;
}

gsap.registerPlugin(SplitTextPlugin);

export const SplitText = defineComponent<HTMLElement, SplitTextOptions>(
	(element, { on, off }, options) => {
		const text = shallowRef<SplitTextPlugin | null>(null);
		const withInViewport = options?.inViewport ?? true;

		const splitTextType = useDataAttr('split-text-type');
		const linesClass = useDataAttr('lines-class');
		const wordsClass = useDataAttr('words-class');
		const charsClass = useDataAttr('chars-class');

		const resizeHandlerDebounced = debounce(resizeHandler, 100);
		if (withInViewport) {
			useInViewport(entry => {
				if (entry.isIntersecting && !text.value) {
					initSplitText();
				}
			});
		} else {
			initSplitText();
		}

		if (options?.windowResize) {
			on('resize', resizeHandlerDebounced, {
				target: window,
			});
		}

		onUnmounted(() => {
			if (options?.windowResize) {
				off('resize', resizeHandlerDebounced);
			}
			cleanup();
		});

		function initSplitText() {
			if (text.value) {
				return;
			}

			const resolvedLinesClass = linesClass.value ?? options?.linesClass ?? DEFAULT_LINES_CLASS;
			const resolvedWordsClass = wordsClass.value ?? options?.wordsClass ?? DEFAULT_WORDS_CLASS;
			const resolvedCharsClass = charsClass.value ?? options?.charsClass ?? DEFAULT_CHARS_CLASS;

			text.value = new SplitTextPlugin(element, {
				...omit(options ?? {}, ['windowResize', 'inViewport']),
				type: splitTextType.value ?? options?.type,
				linesClass: resolvedLinesClass,
				wordsClass: resolvedWordsClass,
				charsClass: resolvedCharsClass,
			});

			applySplitIndexes({
				linesClassName: resolvedLinesClass,
				wordsClassName: resolvedWordsClass,
				charsClassName: resolvedCharsClass,
			});
		}

		function resizeHandler() {
			if (withInViewport && !text.value) {
				return;
			}

			cleanup();
			initSplitText();
		}

		function cleanup() {
			text.value?.revert();
			text.value = null;
		}

		function applySplitIndexes({
			linesClassName,
			wordsClassName,
			charsClassName,
		}: {
			linesClassName: string;
			wordsClassName: string;
			charsClassName: string;
		}) {
			const instance = text.value as unknown as {
				lines?: HTMLElement[];
				words?: HTMLElement[];
				chars?: HTMLElement[];
			} | null;
			if (!instance) {
				return;
			}

			const hasLines = !!instance.lines?.length;
			const hasWords = !!instance.words?.length;

			applyTokenIndexes({
				collection: instance.lines,
				tokenType: 'line',
			});
			applyTokenIndexes({
				collection: instance.words,
				tokenType: 'word',
				parentSelector: hasLines ? classToSelector(linesClassName) : null,
			});
			applyTokenIndexes({
				collection: instance.chars,
				tokenType: 'char',
				parentSelector: hasWords
					? classToSelector(wordsClassName)
					: hasLines
					? classToSelector(linesClassName)
					: null,
				fallbackParentSelector: classToSelector(charsClassName),
			});
		}

		function applyTokenIndexes({
			collection,
			tokenType,
			parentSelector,
			fallbackParentSelector,
		}: {
			collection: HTMLElement[] | undefined;
			tokenType: 'line' | 'word' | 'char';
			parentSelector?: string | null;
			fallbackParentSelector?: string | null;
		}) {
			if (!collection?.length) {
				return;
			}

			const relIndexByGroup = new Map<string, number>();
			const groupKeys = new WeakMap<HTMLElement, string>();
			let groupCounter = 0;

			collection.forEach((token, index) => {
				const primaryGroup = parentSelector
					? token.parentElement?.closest(parentSelector) ?? null
					: null;
				const fallbackGroup = fallbackParentSelector
					? token.parentElement?.closest(fallbackParentSelector) ?? null
					: null;
				const relGroup = primaryGroup || fallbackGroup;
				const relGroupEl = relGroup instanceof HTMLElement ? relGroup : null;
				let relGroupKey = '__global__';
				if (relGroupEl) {
					relGroupKey = getElementKey(relGroupEl, groupKeys, () => {
						groupCounter += 1;
						return `group-${groupCounter}`;
					});
				}
				const relIndex = relIndexByGroup.get(relGroupKey) ?? 0;

				token.style.setProperty(`--${tokenType}Index`, `${index}`);
				token.style.setProperty(`--${tokenType}RelIndex`, `${relIndex}`);

				relIndexByGroup.set(relGroupKey, relIndex + 1);
			});
		}

		function classToSelector(className: string) {
			const firstClass = className.split(/\s+/).find(Boolean);
			return firstClass ? `.${firstClass}` : null;
		}

		function getElementKey(
			node: HTMLElement,
			keyMap: WeakMap<HTMLElement, string>,
			createKey: () => string
		) {
			let key = keyMap.get(node);
			if (!key) {
				key = createKey();
				keyMap.set(node, key);
			}
			return key;
		}

		return {
			instance: text,
		};
	}
);

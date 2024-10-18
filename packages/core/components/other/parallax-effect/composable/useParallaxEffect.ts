import { MaybeElement } from '@ovee.js/toolkit/shared/types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { defaults, omit } from 'lodash';
import {
	computed,
	isDefined,
	Logger,
	MaybeRefOrGetter,
	onUnmounted,
	ShallowRef,
	shallowRef,
	toValue,
	watch,
} from 'ovee.js';

export interface UseParallaxEffectOptions extends ScrollTrigger.StaticVars {
	target?: gsap.DOMTarget;
	desktopBreakpoint?: string;
	tabletBreakpoint?: string;
	mobileBreakpoint?: string;
	disableOnMobile?: boolean;
	disableOnTablet?: boolean;
	tweenVars?: gsap.TweenVars;
}

export interface UseParallaxEffectReturn {
	scrollTrigger: ShallowRef<Array<ScrollTrigger | undefined | null>>;
	tween: ShallowRef<Array<gsap.core.Timeline | undefined | null>>;
	matchMedia: ShallowRef<Array<gsap.MatchMedia | undefined | null>>;
	cleanup: () => void;
}

gsap.registerPlugin(ScrollTrigger);

const logger = new Logger('useParallaxEffect');

export function useParallaxEffect(
	targets: MaybeRefOrGetter<MaybeElement | MaybeElement[]>,
	options?: UseParallaxEffectOptions
): UseParallaxEffectReturn {
	const tl = shallowRef<Array<gsap.core.Timeline | null>>([]);
	const st = shallowRef<Array<ScrollTrigger | null>>([]);
	const mm = shallowRef<Array<gsap.MatchMedia | null>>([]);

	const parallaxOptions = computed(() => (element: NonNullable<MaybeElement>) => {
		const baseOptions = defaults({}, options, {
			scrub: true,
			desktopBreakpoint: '(min-width: 1200px)',
			tabletBreakpoint: '(max-width: 1199px)',
			mobileBreakpoint: '(max-width: 767px), (max-width: 1023px) and (orientation: landscape)',
			disableOnMobile: true,
			disableOnTablet: true,
			tweenVars: {
				y: 100,
			},
		});

		if (!baseOptions.target) {
			baseOptions.target = element;
		}

		const inlineParallaxOptions = (element as HTMLElement).dataset.parallaxOptions;

		if (!inlineParallaxOptions) {
			return baseOptions;
		}

		let inlineOptions: UseParallaxEffectOptions;

		try {
			inlineOptions = JSON.parse(inlineParallaxOptions);
		} catch (e) {
			logger.error('Invalid JSON Config:', inlineParallaxOptions);

			return baseOptions;
		}

		return {
			...baseOptions,
			...inlineOptions,
		};
	});

	watch(
		() => toValue(targets),
		(newTargets, oldTargets) => {
			newTargets = (Array.isArray(newTargets) ? newTargets : [newTargets]).filter(isDefined);
			oldTargets = (Array.isArray(oldTargets) ? oldTargets : [oldTargets]).filter(isDefined);

			const addedTargets = newTargets.filter(target => !oldTargets.includes(target));

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			addedTargets.forEach(target => createParallax(target!));
		},
		{
			immediate: true,
			flush: 'post',
		}
	);

	onUnmounted(cleanup);

	function createParallax(element: NonNullable<MaybeElement>) {
		const elementParallaxOptions = parallaxOptions.value(element);
		const {
			desktopBreakpoint,
			tabletBreakpoint,
			mobileBreakpoint,
			disableOnMobile,
			disableOnTablet,
			tweenVars,
			target,
			trigger,
		} = elementParallaxOptions;

		let breakpoint = desktopBreakpoint;

		if (!disableOnTablet) {
			breakpoint += `, ${tabletBreakpoint}`;
		}

		if (!disableOnMobile) {
			breakpoint += `, ${mobileBreakpoint}`;
		}

		if (!Object.keys(tweenVars).length) {
			logger.error(`Property "tweenVars" is empty - `, element);

			return;
		}

		const to: UseParallaxEffectOptions['tweenVars'] = {};

		for (const prop in tweenVars) {
			if (!Object.prototype.hasOwnProperty.call(tweenVars, prop)) {
				return;
			}

			const value = tweenVars[prop as keyof UseParallaxEffectOptions['tweenVars']];

			to[prop] = value;
		}

		const matchMedia = gsap.matchMedia();

		matchMedia.add(breakpoint, () => {
			const timeline = gsap.timeline({
				paused: true,
			});

			timeline.to(target ?? element, to);

			tl.value.push(timeline);

			if (!trigger) {
				elementParallaxOptions.trigger = target ?? element;
			}

			const scrollTrigger = ScrollTrigger.create({
				...omit(elementParallaxOptions, [
					'target',
					'tweenVars',
					'desktopBreakpoint',
					'tabletBreakpoint',
					'mobileBreakpoint',
					'disableOnMobile',
					'disableOnTablet',
				]),
				animation: timeline,
			});

			st.value.push(scrollTrigger);

			return () => {
				cleanup();
			};
		});

		mm.value.push(matchMedia);
	}

	function cleanup() {
		tl.value?.forEach(timeline => timeline?.kill());
		st.value?.forEach(trigger => trigger?.kill());
		mm.value?.forEach(matchMedia => matchMedia?.kill());
		tl.value = [];
		st.value = [];
		mm.value = [];
	}

	return {
		scrollTrigger: st,
		tween: tl,
		matchMedia: mm,
		cleanup,
	};
}

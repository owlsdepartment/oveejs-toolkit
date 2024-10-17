import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { defaults, omit } from 'lodash';
import {
	computed,
	defineComponent,
	Logger,
	onMounted,
	onUnmounted,
	ShallowRef,
	shallowRef,
	useDataAttr,
} from 'ovee.js';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxEffectOptions extends ScrollTrigger.StaticVars {
	target?: gsap.DOMTarget;
	desktopBreakpoint?: string;
	tabletBreakpoint?: string;
	mobileBreakpoint?: string;
	disableOnMobile?: boolean;
	disableOnTablet?: boolean;
	tweenVars?: gsap.TweenVars;
}

export interface ParallaxEffectReturn {
	scrollTrigger: ShallowRef<ScrollTrigger | undefined | null>;
	tween: ShallowRef<gsap.core.Timeline | undefined | null>;
	matchMedia: ShallowRef<gsap.MatchMedia | undefined | null>;
	cleanup: () => void;
}

const logger = new Logger('ParallaxEffect');

export const ParallaxEffect = defineComponent<
	HTMLElement,
	ParallaxEffectOptions,
	ParallaxEffectReturn
>((element, { options }) => {
	const tl = shallowRef<gsap.core.Timeline | null>();
	const st = shallowRef<ScrollTrigger | null>();
	const mm = shallowRef<gsap.MatchMedia | null>();

	const inlineParallaxOptions = useDataAttr('parallaxOptions');

	const parallaxOptions = computed(() => {
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

		if (!inlineParallaxOptions.value) {
			return baseOptions;
		}

		let inlineOptions: ParallaxEffectOptions;

		try {
			inlineOptions = JSON.parse(inlineParallaxOptions.value);
		} catch (e) {
			logger.error('Invalid JSON Config:', inlineParallaxOptions.value);

			return baseOptions;
		}

		return {
			...baseOptions,
			...inlineOptions,
		};
	});

	onMounted(createParallax);

	function cleanup() {
		tl.value?.kill();
		st.value?.kill();
		mm.value?.kill();
		tl.value = null;
		st.value = null;
		mm.value = null;
	}

	function createParallax() {
		const {
			desktopBreakpoint,
			tabletBreakpoint,
			mobileBreakpoint,
			disableOnMobile,
			disableOnTablet,
			tweenVars,
			target,
			trigger,
		} = parallaxOptions.value;

		let breakpoint = desktopBreakpoint;

		if (!disableOnTablet) {
			breakpoint += `, ${tabletBreakpoint}`;
		}

		if (!disableOnMobile) {
			breakpoint += `, ${mobileBreakpoint}`;
		}

		if (!Object.keys(tweenVars).length) {
			logger.error(`Property "tweenVars" is empty`);

			return;
		}

		const to: ParallaxEffectOptions['tweenVars'] = {};

		for (const prop in tweenVars) {
			if (!Object.prototype.hasOwnProperty.call(tweenVars, prop)) {
				return;
			}

			const value = tweenVars[prop as keyof ParallaxEffectOptions['tweenVars']];

			to[prop] = value;
		}

		mm.value = gsap.matchMedia();

		mm.value.add(breakpoint, () => {
			tl.value = gsap.timeline({
				paused: true,
			});

			tl.value.to(target, to);

			if (!trigger) {
				parallaxOptions.value.trigger = target;
			}

			st.value = ScrollTrigger.create({
				...omit(parallaxOptions.value, [
					'target',
					'tweenVars',
					'desktopBreakpoint',
					'tabletBreakpoint',
					'mobileBreakpoint',
					'disableOnMobile',
					'disableOnTablet',
				]),
				animation: tl.value,
			});

			return () => {
				cleanup();
			};
		});
	}

	onUnmounted(cleanup);

	return {
		scrollTrigger: st,
		tween: tl,
		matchMedia: mm,
		cleanup,
	};
});

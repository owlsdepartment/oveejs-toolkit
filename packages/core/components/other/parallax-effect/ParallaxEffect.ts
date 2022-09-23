import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { Component, dataParam, Logger, register } from 'ovee.js';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxTweenVars {
	x?: gsap.TweenValue;
	y?: gsap.TweenValue;
	xPercent?: gsap.TweenValue;
	yPercent?: gsap.TweenValue;
	ease?: string | gsap.EaseFunction;
}

export interface ParallaxEffectOptions extends ScrollTrigger.StaticVars {
	target: gsap.DOMTarget;
	disableOnMobile: boolean;
	disableOnTablet: boolean;
	tweenVars: ParallaxTweenVars;
}

const logger = new Logger('ParallaxEffect');

@register('parallax-effect')
export class ParallaxEffect extends Component<HTMLElement, ParallaxEffectOptions> {
	static defaultOptions(): ParallaxEffectOptions {
		return {
			scrub: true,
			target: '',
			disableOnMobile: true,
			disableOnTablet: true,
			tweenVars: {
				y: 100,
			},
		};
	}

	tl: gsap.core.Timeline;
	st: ScrollTrigger;

	@dataParam('parallaxOptions')
	_parallaxOptions = '';

	get baseOptions(): ParallaxEffectOptions {
		const { $options } = this;

		if (!$options.target) {
			$options.target = this.$element;
		}

		return $options;
	}

	get parallaxConfig(): ParallaxEffectOptions {
		const { baseOptions } = this;

		if (!this._parallaxOptions) {
			return baseOptions;
		}

		let elementOptions: ParallaxEffectOptions;

		try {
			elementOptions = JSON.parse(this._parallaxOptions);
		} catch (e) {
			logger.error('Invalid JSON Config:', this._parallaxOptions);

			return baseOptions;
		}

		return {
			...baseOptions,
			...elementOptions,
		};
	}

	get desktopBreakpoint() {
		return '(min-width: 1200px)';
	}

	get tabletBreakpoint() {
		return '(max-width: 1199px)';
	}

	get mobileBreakpoint() {
		return '(max-width: 767px), (max-width: 1023px) and (orientation: landscape)';
	}

	init() {
		this.createParallax();
	}

	createParallax(): void {
		const { parallaxConfig, desktopBreakpoint, tabletBreakpoint, mobileBreakpoint } = this;
		const { disableOnMobile, disableOnTablet, tweenVars, target, trigger } = parallaxConfig;

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

		const to: gsap.TweenVars = {};

		for (const prop in tweenVars) {
			if (!Object.prototype.hasOwnProperty.call(tweenVars, prop)) {
				return;
			}

			const value = tweenVars[prop as keyof ParallaxTweenVars];

			to[prop] = value;
		}

		ScrollTrigger.matchMedia({
			[breakpoint]: () => {
				this.tl = gsap.timeline({
					paused: true,
				});

				this.tl.to(target, to);

				if (!trigger) {
					parallaxConfig.trigger = target;
				}

				this.st = ScrollTrigger.create({
					...parallaxConfig,
					animation: this.tl,
				});

				return () => {
					this.tl.kill();
				};
			},
		});
	}

	destroy() {
		this.tl?.kill();
		this.st?.kill();
	}
}

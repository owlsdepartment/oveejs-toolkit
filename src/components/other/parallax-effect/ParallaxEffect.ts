import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Component, dataParam, Logger, register } from 'ovee.js';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxTweenVars {
	x?: gsap.TweenValue;
	y?: gsap.TweenValue;
	xPercent?: gsap.TweenValue;
	yPercent?: gsap.TweenValue;
	ease?: string | gsap.EaseFunction;
}

export interface ParallaxConfig extends ScrollTrigger.StaticVars {
	target: gsap.DOMTarget;
	disableOnMobile: boolean;
	disableOnTablet: boolean;
	tweenVars: ParallaxTweenVars;
}

const logger = new Logger('ParallaxEffect');

@register('parallax-effect')
export class ParallaxEffect extends Component {
	tl: gsap.core.Timeline;
	st: ScrollTrigger;

	defaultParallaxConfig: ParallaxConfig = {
		scrub: true,
		target: this.$element,
		disableOnMobile: true,
		disableOnTablet: true,
		tweenVars: {
			y: 100,
		},
	};

	@dataParam('parallaxConfig')
	_parallaxConfig = '';

	get componentParallaxConfig() {
		return this.$options as ParallaxConfig;
	}

	get parallaxConfig(): ParallaxConfig {
		const baseConfig = {
			...this.defaultParallaxConfig,
			...this.componentParallaxConfig,
		};

		if (!this._parallaxConfig) {
			return baseConfig;
		}

		let elementConfig: ParallaxConfig = this.defaultParallaxConfig;

		try {
			elementConfig = JSON.parse(this._parallaxConfig);
		} catch (e) {
			logger.error('Invalid JSON Config:', this._parallaxConfig);

			return baseConfig;
		}

		return {
			...baseConfig,
			...elementConfig,
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

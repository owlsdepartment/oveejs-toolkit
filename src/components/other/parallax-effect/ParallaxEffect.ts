import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Component, dataParam, Logger, register } from 'ovee.js';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxTweenVars {
	x?: gsap.TweenValue;
	y?: gsap.TweenValue;
	xPercent?: gsap.TweenValue;
	yPercent?: gsap.TweenValue;
}

export interface ParallaxConfig extends ScrollTrigger.StaticVars {
	trigger: gsap.DOMTarget;
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
		trigger: this.$element,
		disableOnMobile: true,
		disableOnTablet: true,
		tweenVars: {
			y: 100,
		},
	};

	@dataParam('parallaxConfig')
	_parallaxConfig = '';

	get parallaxConfig(): ParallaxConfig {
		if (!this._parallaxConfig) {
			return this.defaultParallaxConfig;
		}

		let jsonConfig: ParallaxConfig = {
			...this.defaultParallaxConfig,
		};

		try {
			jsonConfig = JSON.parse(this._parallaxConfig);
		} catch (e) {
			logger.error('Invalid JSON Config:', this._parallaxConfig);

			return {
				...this.defaultParallaxConfig,
			};
		}

		return {
			...this.defaultParallaxConfig,
			...jsonConfig,
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
		const { disableOnMobile, disableOnTablet, tweenVars, trigger } = parallaxConfig;

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

				this.tl.to(trigger, to);

				this.st = ScrollTrigger.create({
					...parallaxConfig,
					scrub: true,
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

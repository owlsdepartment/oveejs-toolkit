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
	tweenProps: ParallaxTweenVars;
}

export interface ParallaxObject {
	scrollTrigger: ScrollTrigger;
	timeline: gsap.core.Timeline;
}

const logger = new Logger('ParallaxEffect');

@register('parallax-effect')
export class ParallaxEffect extends Component {
	parallax: ParallaxObject;

	defaultParallaxConfig: ParallaxConfig = {
		trigger: this.$element,
		disableOnMobile: true,
		disableOnTablet: true,
		tweenProps: {
			x: 100,
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
			logger.error(`Invalid JSON Config: ${this._parallaxConfig}`);

			return {
				...this.defaultParallaxConfig,
			};
		}

		return {
			...this.defaultParallaxConfig,
			...jsonConfig,
		};
	}

	get isTablet() {
		return window.matchMedia('(max-width: 1024px)').matches;
	}

	get isMobile() {
		return (
			window.matchMedia('(max-width: 767px)').matches ||
			window.matchMedia('(max-width: 1023px) and (orientation: landscape)').matches
		);
	}

	init() {
		this.parallax = this.createParallax();
	}

	createParallax(): any {
		const { parallaxConfig, isMobile, isTablet } = this;
		const { disableOnMobile, disableOnTablet, tweenProps, trigger } = parallaxConfig;

		if ((disableOnTablet && isTablet) || (disableOnMobile && isMobile)) {
			return;
		}

		if (!Object.keys(tweenProps).length) {
			logger.error(`Property "tweenProps" is empty`);

			return;
		}

		const tl = gsap.timeline({
			paused: true,
		});
		const to: gsap.TweenVars = {};

		for (const prop in tweenProps) {
			if (!Object.prototype.hasOwnProperty.call(tweenProps, prop)) {
				return;
			}

			const value = tweenProps[prop as keyof ParallaxTweenVars];

			to[prop] = () => {
				return value;
			};
		}

		tl.to(trigger, to);

		const st = ScrollTrigger.create({
			...parallaxConfig,
			scrub: true,
			animation: tl,
		});

		return {
			scrollTrigger: st,
			timeline: tl,
		};
	}

	destroy() {
		if (!this.parallax) {
			return;
		}

		this.parallax.timeline.kill();
		this.parallax.scrollTrigger.kill();
	}
}

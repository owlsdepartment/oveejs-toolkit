export type Options = {
	onComplete?: () => void;
	onStart?: () => void;
	onUpdate?: () => void;
	onInit?: (tween: gsap.core.Tween) => void;
	ease?: string | gsap.EaseFunction;
	delay?: number | string;
};

export type FadeOptions = {
	display?: string;
} & Options;

export type SlideOptions = {
	display?: string;
	fade?: boolean;
} & Options;

export type SlideFadeOptions = {
	display?: string;
} & Options;

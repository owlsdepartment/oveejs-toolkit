declare module 'gsap/ScrollTrigger.js' {
	class _ScrollTrigger extends ScrollTrigger {}
	export { _ScrollTrigger as default, _ScrollTrigger as ScrollTrigger };
}

declare const createFiber: (...args: any[]) => any;
declare const JSX_FRAGMENT: unknown;

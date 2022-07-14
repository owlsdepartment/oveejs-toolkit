export interface AccordionElement extends HTMLElement {
	_triggers: HTMLElement[] | [];
	_content: HTMLElement | null;
}

export interface AnimationArguments {
	item: AccordionElement;
	immediate: boolean;
	duration: number;
	ease: string | gsap.EaseFunction;
	display?: string;
	onInit?: (tween: gsap.core.Tween) => void;
}

export interface BaseAccordionOptions {
	firstActive: boolean;
	autoCollapse: boolean;
	immediate: boolean;
	duration: number;
	ease: string | gsap.EaseFunction;
	openClass?: string;
	collapsedClass?: string;
	display?: string;
}

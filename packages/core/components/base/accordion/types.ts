export interface AccordionElement extends HTMLElement {
	_trigger: HTMLElement | null;
	_content: HTMLElement | null;
}

export interface AnimationArguments {
	item: AccordionElement;
	height?: number;
	immediate: boolean;
	speed: number;
	ease: string;
}

export interface BaseAccordionOptions {
	firstActive: boolean;
	autoCollapse: boolean;
	immediate: boolean;
	speed: number;
	ease: string;
}

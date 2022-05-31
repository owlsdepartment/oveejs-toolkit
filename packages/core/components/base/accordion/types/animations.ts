import { AccordionElement } from './accordion';

export interface AnimationArguments {
	item: AccordionElement;
	height?: number;
	immediate: boolean;
	speed: number;
	ease: string;
}

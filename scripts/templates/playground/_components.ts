import {
	BaseAccordion,
	BaseCookies,
	BaseCookiesEdit,
	BaseDialog,
	CollapsingHeader,
	CursorModifier,
	InViewport,
	NavToggle,
	ParallaxEffect,
} from '@ovee.js/toolkit';
import {
	BaseSlider,
	C15tConsent,
	C15tConsentEdit,
	LazyLoad,
	LottiePlayer,
	SplitText,
	VideoAutoplay,
} from '@ovee.js/toolkit-integrations';
import { AnyComponent, ComponentOptions } from 'ovee.js';

const components: Record<string, AnyComponent | [AnyComponent, ComponentOptions | undefined]> = {
	'base-accordion': [BaseAccordion, { autoCollapse: true }],
	'base-accordion-immediate': [BaseAccordion, { immediate: true, autoCollapse: false }],
	'base-cookies': BaseCookies,
	'base-cookies-edit': BaseCookiesEdit,
	'base-dialog': [BaseDialog, { dialogRoot: '.dialog-root' }],
	'in-viewport': InViewport,
	'collapsing-header': CollapsingHeader,
	'nav-toggle': NavToggle,
	'parallax-effect': ParallaxEffect,
	'cursor-modifier': CursorModifier,
	'lazy-load': LazyLoad,
	'base-slider': BaseSlider,
	'c15t-consent': C15tConsent,
	'c15t-consent-edit': C15tConsentEdit,
	'split-text': [SplitText, { windowResize: true, type: 'lines,words' }],
	'lottie-player': LottiePlayer,
	'video-autoplay': VideoAutoplay,
};

export default components;

import { useInViewport, UseInViewportOptions, UseInViewportReturn } from '@ovee.js/toolkit';
import omit from 'lodash/omit';
import { defineComponent } from 'ovee.js';

export interface InViewportOptions extends UseInViewportOptions {
	callback?: (entry: IntersectionObserverEntry) => void;
}

export const InViewport = defineComponent<HTMLElement, InViewportOptions, UseInViewportReturn>(
	(_, _ctx, options) => {
		return useInViewport(
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			options?.callback ? options.callback : () => {},
			omit(options, 'callback')
		);
	}
);

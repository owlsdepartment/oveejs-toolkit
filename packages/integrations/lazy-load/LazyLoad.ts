import { defaultsDeep, isUndefined } from 'lodash';
import { bind, Component, dataParam, register } from 'ovee.js';
import VanillaLazyLoad, { ILazyLoadOptions } from 'vanilla-lazyload';

import { WithInViewport } from '@core/mixins';

export type LazyLoadEvent = CustomEvent<LazyLoadOptions>;

export interface LazyLoadOptions extends ILazyLoadOptions {
	inViewportClass: string;
}

export const LAZYLOAD_DEFAULT_OPTIONS: LazyLoadOptions = {
	threshold: 0.5,
	inViewportClass: 'is-in-viewport',
};

@register('lazy-load')
export class LazyLoad extends WithInViewport(Component) {
	isLoadingInitialized = false;

	@dataParam()
	target = '';

	get options(): LazyLoadOptions {
		return {
			...LAZYLOAD_DEFAULT_OPTIONS,
			...(this.$options as LazyLoadOptions),
		};
	}

	get observerOptions(): IntersectionObserverInit {
		return {
			threshold: isUndefined(this.options?.threshold)
				? LAZYLOAD_DEFAULT_OPTIONS.threshold
				: this.options.threshold,
		};
	}

	get loadTargets(): HTMLElement[] {
		const targets = this.target
			? Array.from(this.$element.querySelectorAll<HTMLElement>(this.target))
			: [this.$element as HTMLElement];

		if (!targets.length) {
			console.error(
				'[LazyLoad] Target not found when attempting to lazy load. Target selector: ',
				this.target
			);
		}

		return targets;
	}

	onIntersection({ isIntersecting }: IntersectionObserverEntry) {
		if (isIntersecting) {
			this.$element.classList.add(
				this.options?.inViewportClass ?? LAZYLOAD_DEFAULT_OPTIONS.inViewportClass
			);

			if (!this.isLoadingInitialized) {
				this.load();
			}
		}
	}

	@bind('lazy-load:load')
	load(e?: LazyLoadEvent | LazyLoadOptions) {
		const { loadTargets } = this;
		const arg = e instanceof CustomEvent ? e.detail : e;
		const options = defaultsDeep({}, arg ?? {}, this.options) as LazyLoadOptions;

		for (const target of loadTargets) {
			VanillaLazyLoad.load(target, {
				...options,

				callback_loaded: (el, instance) => {
					this.$element.classList.add(options?.class_loaded ?? 'loaded');
					options?.callback_loaded?.(el, instance);
					this.$emit('lazy-load:loaded', null);
				},

				callback_error: (el, instance) => {
					options?.callback_error?.(el, instance);
					this.$emit('lazy-load:error', null);
				},
			});
		}

		this.isLoadingInitialized = true;
	}
}

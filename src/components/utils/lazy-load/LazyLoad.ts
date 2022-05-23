import { defaultsDeep, isUndefined } from 'lodash';
import { bind, Component, dataParam, register } from 'ovee.js';
import VanillaLazyLoad, { ILazyLoadOptions } from 'vanilla-lazyload';

import { WithInViewport } from '@/mixins';

export type LazyLoadEvent = CustomEvent<LazyLoadOptions>;

export interface LazyLoadOptions extends ILazyLoadOptions {
	inViewportClass?: string;
}

@register('lazy-load')
export class LazyLoad extends WithInViewport(Component) {
	isLoadingInitialized = false;

	@dataParam()
	target = '';

	get options(): LazyLoadOptions {
		const defaults = {
			threshold: 0.5,
			inViewportClass: 'is-in-viewport',
		};

		return {
			...defaults,
			...(this.$options as LazyLoadOptions),
		};
	}

	get observerOptions(): IntersectionObserverInit {
		return {
			threshold: isUndefined(this.options?.threshold) ? 0.5 : this.options.threshold,
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
			this.$element.classList.add(this.options?.inViewportClass ?? 'is-in-viewport');

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

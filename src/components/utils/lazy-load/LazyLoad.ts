import { bind, Component, register } from 'ovee.js';
import VanillaLazyLoad, { ILazyLoadInstance, ILazyLoadOptions } from 'vanilla-lazyload';

export type LazyLoadEvent = CustomEvent<ILazyLoadOptions>;

@register('lazy-load')
export class LazyLoad extends Component {
	destroyInterval: null | number = null;
	lazyLoad: ILazyLoadInstance | null;

	get lazyLoadOptions(): ILazyLoadOptions {
		return (this.$options as ILazyLoadOptions) ?? {};
	}

	get elementsToLoad() {
		return [this.$element] as unknown as NodeListOf<HTMLElement>;
	}

	init() {
		const { lazyLoadOptions } = this;
		const { callback_error, callback_loaded } = lazyLoadOptions;

		lazyLoadOptions.callback_loaded = (el, instance) => {
			callback_loaded?.(el, instance);
			this.$emit('lazy-load:loaded', null);
		};

		lazyLoadOptions.callback_error = (el, instance) => {
			callback_error?.(el, instance);
			this.$emit('lazy-load:error', null);
		};

		this.lazyLoad = new VanillaLazyLoad(lazyLoadOptions, this.elementsToLoad);
	}

	@bind('lazy-load:load')
	onLoad(e: LazyLoadEvent) {
		VanillaLazyLoad.load(this.$element as HTMLElement, e.detail ?? this.lazyLoadOptions);
	}

	@bind('lazy-load:update')
	@bind('lazy-load:global-update', window as any)
	onUpdate() {
		if (!this.lazyLoad) {
			return;
		}

		this.lazyLoad.update();
	}

	destroy() {
		this.destroyInterval = window.setInterval(() => {
			if (!this.lazyLoad) {
				return;
			}

			if (this.lazyLoad.loadingCount > 0) {
				return;
			}

			if (this.destroyInterval) {
				clearInterval(this.destroyInterval);
			}

			this.lazyLoad.destroy();
			this.lazyLoad = null;
		}, 250);
	}
}

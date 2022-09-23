import { LazyLoad, LazyLoadOptions } from '@ovee.js/toolkit-integrations/lazy-load';
import { register } from 'ovee.js';

@register('video-autoplay')
export class VideoAutoplay extends LazyLoad {
	playPromise: Promise<void> = Promise.resolve();
	loadPromise: Promise<void>;
	loadPromiseResolve: CallableFunction;

	init() {
		this.isLoadingInitialized = this.videoElement.dataset.src === undefined;

		this.loadPromise = new Promise(resolve => {
			if (this.isLoadingInitialized) {
				this.$element.classList.add(this.options?.class_loaded ?? 'loaded');

				resolve();
			} else {
				this.loadPromiseResolve = resolve;
			}
		});

		super.init();
	}

	get observerOptions(): IntersectionObserverInit {
		return {
			threshold: 0,
		};
	}

	get options(): LazyLoadOptions {
		return {
			...super.$options,
			callback_loaded: () => {
				this.loadPromiseResolve?.();
			},
		};
	}

	get videoElement() {
		return this.$element as HTMLVideoElement;
	}

	get isVideoLoaded() {
		const { videoElement } = this;

		return videoElement.classList.contains('loaded') || videoElement.dataset.llStatus === 'loaded';
	}

	onIntersection(entry: IntersectionObserverEntry) {
		super.onIntersection(entry);

		if (entry.isIntersecting) {
			this.play();
		} else {
			this.pause();
		}
	}

	async play() {
		await this.loadPromise;

		this.playPromise = this.videoElement.play();
	}

	async pause() {
		if (!this.isVideoLoaded) {
			return;
		}

		if (!this.playPromise) {
			this.playPromise = Promise.resolve();
		}

		await this.playPromise;
		this.videoElement?.pause();
	}
}

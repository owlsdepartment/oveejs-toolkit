import { useInViewport } from '@ovee.js/toolkit/composables';
import { useLazyLoad } from '@ovee.js/toolkit-integrations/lazy-load';
import { defineComponent, ref } from 'ovee.js';
import { ILazyLoadOptions } from 'vanilla-lazyload';

interface VideoAutoplayOptions extends ILazyLoadOptions {
	shouldRemoveInViewportClass?: boolean;
	onPlay?: (element: HTMLVideoElement) => void;
	onPause?: (element: HTMLVideoElement) => void;
}

export const VideoAutoplay = defineComponent<HTMLVideoElement, VideoAutoplayOptions>(
	(element, { options }) => {
		const isPlaying = ref(false);

		let playPromise: Promise<void> = Promise.resolve();
		let loadPromiseResolve: CallableFunction;
		const loadedClass = options?.class_loaded ?? 'loaded';
		const hasLazyLoad = element.dataset.src !== undefined;
		const loadPromise = new Promise<void>(resolve => {
			if (hasLazyLoad) {
				loadPromiseResolve = resolve;
			} else {
				element.classList.add(loadedClass);
				resolve();
			}
		});

		useLazyLoad({
			unobserve_entered: true,
			...(options ?? {}),
			threshold: 0,
			callback_loaded: (el, instance) => {
				loadPromiseResolve?.();
				options?.callback_loaded?.(el, instance);
			},
		});

		useInViewport(
			entry => {
				if (entry.isIntersecting) {
					play();
				} else {
					pause();
				}
			},
			{
				threshold: 0,
				once: false,
				shouldRemoveClass: options?.shouldRemoveInViewportClass ?? false,
			}
		);

		function isVideoLoaded() {
			return element.classList.contains(loadedClass) || element.dataset.llStatus === 'loaded';
		}

		async function play() {
			await loadPromise;

			isPlaying.value = true;
			playPromise = element.play();
			options?.onPlay?.(element);
		}

		async function pause() {
			if (!isVideoLoaded()) {
				return;
			}

			if (!playPromise) {
				playPromise = Promise.resolve();
			}

			await playPromise;

			isPlaying.value = false;

			element.pause();
			options?.onPause?.(element);
		}

		return {
			play,
			pause,
			isPlaying,
		};
	}
);

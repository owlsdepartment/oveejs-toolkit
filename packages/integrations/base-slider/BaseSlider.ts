import { defaultsDeep } from 'lodash';
import {
	defineComponent,
	Logger,
	onUnmounted,
	ref,
	shallowRef,
	useQuerySelectorAll,
} from 'ovee.js';
import Swiper from 'swiper';
import { SwiperEvents } from 'swiper/types/swiper-events';
import { SwiperOptions } from 'swiper/types/swiper-options';

interface SliderElement extends HTMLElement {
	swiperInstance?: Swiper;
}

const logger = new Logger('BaseSlider');

export const BaseSlider = defineComponent<SliderElement, Partial<SwiperOptions>>(
	(element, { options, emit }) => {
		const swiperInstance = shallowRef<Swiper>();
		const swiperOptions = ref<SwiperOptions>();
		const swiperContainer = shallowRef(element.querySelector<HTMLElement>('.swiper-container'));
		const swiperSlides = useQuerySelectorAll<HTMLElement>('.slider__slide');

		if (swiperSlides.value.length < 1) {
			return logger.warn('No slider items were found.');
		}

		prepareDom();
		createSlider();

		onUnmounted(() => {
			swiperInstance.value?.destroy();
		});

		function getSwiperOptions(): SwiperOptions {
			const effect = 'slide';
			const speed = 600;

			const on: Partial<SwiperEvents> = {
				transitionEnd: () => {
					emit('base-slider:slide-change');
				},
				sliderFirstMove: () => {
					emit('base-slider:slide-drag');
				},
			};

			return defaultsDeep(options, {
				effect,
				speed,
				on,
			});
		}

		function prepareDom() {
			if (!swiperContainer.value) {
				const container = document.createElement('div');
				container.className = 'swiper';
				container.innerHTML = '<div class="swiper-wrapper"></div>';

				element.appendChild(container);

				swiperSlides.value.forEach((slide, index) => {
					slide.classList.add('swiper-slide');
					slide.dataset.slideNumber = `${index}`;
				});

				container.querySelector<HTMLElement>('.swiper-wrapper')?.append(...swiperSlides.value);

				swiperContainer.value = container;
			}
		}

		function createSlider() {
			if (!swiperContainer.value) {
				logger.warn('No slider container was found.');
				return;
			}

			swiperOptions.value = getSwiperOptions();

			swiperInstance.value = new Swiper(swiperContainer.value, swiperOptions.value);
			element.swiperInstance = swiperInstance.value;

			emit('base-slider:initialized', swiperInstance.value);
		}

		return {
			swiperInstance,
			swiperOptions,
		};
	}
);

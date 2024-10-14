import { defaultsDeep } from 'lodash';
import { defineComponent, Logger, onUnmounted, ref, shallowRef } from 'ovee.js';
import Swiper from 'swiper';
import {
	A11y,
	Autoplay,
	Controller,
	EffectFade,
	FreeMode,
	Grid,
	Keyboard,
	Manipulation,
	Mousewheel,
	Navigation,
	Pagination,
	Parallax,
	Thumbs,
	Virtual,
	Zoom,
} from 'swiper/modules';
import { PaginationOptions } from 'swiper/types/modules/pagination';
import { SwiperEvents } from 'swiper/types/swiper-events';
import { SwiperOptions } from 'swiper/types/swiper-options';

interface SliderElement extends HTMLElement {
	swiperInstance?: Swiper;
}

const logger = new Logger('BaseSlider');

export const BaseSlider = defineComponent<SliderElement, Partial<SwiperOptions>>(
	(element, { options, emit }) => {
		const swiperInstance = shallowRef<Swiper>();
		const swiperContainer = shallowRef(element.querySelector<HTMLElement>('.swiper-container'));
		const swiperOptions = ref<SwiperOptions>();

		const count = element.querySelectorAll('.slider__slide').length;

		if (count < 1) {
			return logger.warn('No slider items were found.');
		}

		prepareDom();
		createSlider();

		onUnmounted(() => {
			swiperInstance.value?.destroy();
		});

		function getSwiperOptions(): SwiperOptions {
			const modules = [
				Keyboard,
				Mousewheel,
				Controller,
				Grid,
				EffectFade,
				Navigation,
				Pagination,
				Autoplay,
				Virtual,
				FreeMode,
				Zoom,
				A11y,
				Thumbs,
				Manipulation,
				Parallax,
			];
			const keyboard = true;
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

			const navigation = {
				prevEl: element.querySelector<HTMLElement>('.button--prev'),
				nextEl: element.querySelector<HTMLElement>('.button--next'),
			};

			const pagination: PaginationOptions | boolean = {
				el: element.querySelector<HTMLElement>('.slider__pagination'),
				clickable: false,
				type: 'fraction',
				renderFraction(currentClass: any, totalClass: any) {
					return `<span class="${currentClass}"></span><span> OF </span><span class="${totalClass}"></span>`;
				},
				modifierClass: 'slider__pagination--',
				clickableClass: 'is-clickable',
			};

			return defaultsDeep(
				{},
				{
					modules,
					keyboard,
					effect,
					speed,
					navigation,
					pagination,
					on,
				},
				options
			);
		}

		function prepareDom() {
			if (!swiperContainer.value) {
				const container = document.createElement('div');
				container.className = 'swiper';
				container.innerHTML = '<div class="swiper-wrapper"></div>';

				element.appendChild(container);

				const slides = Array.from(element.querySelectorAll<HTMLElement>('.slider__slide'));

				slides.forEach((slide, index) => {
					slide.classList.add('swiper-slide');
					slide.dataset.slideNumber = `${index}`;
				});

				container.querySelector<HTMLElement>('.swiper-wrapper')?.append(...slides);

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

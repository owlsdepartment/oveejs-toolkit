import { Component, emitEvent, Logger, register } from 'ovee.js';
import {
	Autoplay,
	EffectFade,
	Keyboard,
	Lazy,
	Navigation,
	Pagination,
	Swiper,
	Virtual,
} from 'swiper';
import {
	LazyOptions,
	NavigationOptions,
	PaginationOptions,
	SwiperEvents,
	SwiperOptions,
} from 'swiper/types';

interface SliderElement extends Element {
	swiperInstance?: Swiper;
}

const logger = new Logger('BaseSlider');

@register('base-slider')
export class BaseSlider extends Component {
	swiper: Swiper;
	count: number;
	curr: number;
	swiperContainer: HTMLElement | null;

	init() {
		this.count = this.$element.querySelectorAll('.slider__slide').length;
		this.curr = 1;

		if (this.count < 1) {
			return logger.warn('No slider items were found.');
		}

		this.prepareDom();
		this.createSlider();
		this.bind();
	}

	prepareDom() {
		this.swiperContainer = this.$element.querySelector('.swiper-container');

		if (!this.swiperContainer) {
			const container = document.createElement('div');
			container.className = 'swiper-container';
			container.innerHTML = '<div class="swiper-wrapper"></div>';

			this.$element.appendChild(container);

			// if ( !container ) return;

			const slides = Array.from(this.$element.querySelectorAll('.slider__slide'));

			(container.querySelector('.swiper-wrapper') as HTMLElement).append(...slides);
			container.querySelectorAll('.slider__slide').forEach((slide: HTMLElement, index) => {
				slide.classList.add('swiper-slide');
				slide.dataset.slideNumber = `${index}`;
			});

			this.swiperContainer = container;
		}
	}

	get swiperOptions(): SwiperOptions {
		const keyboard = true;
		const effect = 'slide';
		const speed = 600;
		const lazyload = !!(this.swiperContainer && this.swiperContainer.querySelector('.swiper-lazy'));
		const lazy: LazyOptions | boolean = lazyload
			? {
					loadPrevNext: lazyload,
					loadPrevNextAmount: 2,
					checkInView: true,
			  }
			: false;

		const on: Partial<SwiperEvents> = {
			lazyImageReady: (swiper, slideEl, imageEl) => {
				imageEl.setAttribute('data-ll-status', 'loaded');

				if (imageEl.parentElement) {
					imageEl.parentElement.classList.add('media-loaded');
				}

				const slideIndex = slideEl.dataset.swiperSlideIndex;
				if (slideIndex) {
					const { slides } = swiper;
					const duplicatedIDs: number[] = [];

					let i = 0;
					slides.forEach((slide: HTMLElement) => {
						if (slide.dataset.swiperSlideIndex === slideIndex) {
							duplicatedIDs.push(i);
						}
						i++;
					});

					if (duplicatedIDs) {
						duplicatedIDs.forEach(id => {
							swiper.lazy.loadInSlide(id);
						});
					}
				}
			},
			transitionEnd: () => {
				emitEvent(window as any, 'slide-change');
			},
			sliderFirstMove: () => {
				emitEvent(window as any, 'slide-drag');
			},
		};

		const navigation: NavigationOptions | boolean = {
			prevEl: this.$element.querySelector('.button--prev') as HTMLElement,
			nextEl: this.$element.querySelector('.button--next') as HTMLElement,
		};

		const pagination: PaginationOptions | boolean = {
			el: this.$element.querySelector('.slider__pagination') as HTMLElement,
			clickable: false,
			type: 'fraction',
			renderFraction(currentClass: any, totalClass: any) {
				return `<span class="${currentClass}"></span><span> OF </span><span class="${totalClass}"></span>`;
			},
			modifierClass: 'slider__pagination--',
			clickableClass: 'is-clickable',
		};

		return {
			keyboard,
			effect,
			speed,
			preloadImages: !lazyload,
			lazy,
			navigation,
			pagination,
			on,
		};
	}

	createSlider() {
		Swiper.use([Keyboard, EffectFade, Lazy, Navigation, Pagination, Autoplay, Virtual]);

		const options = this.swiperOptions;

		if (this.swiperContainer) {
			this.swiper = new Swiper(this.swiperContainer, options);
		}

		// (this.$element as HTMLElement).dataset.swiperInstance = this.swiper;
		(this.$element as SliderElement).swiperInstance = this.swiper;
		this.$emit('sliderInitialized', this.swiper);
	}

	bind() {
		this.$on('imageload', 'img', () => {
			if (this.swiper) {
				this.swiper.update();
			}
		});
	}

	destroy() {
		if (this.swiper) {
			this.swiper.destroy();
		}
	}
}

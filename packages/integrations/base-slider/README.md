# BaseSlider

## Requirements
- [swiper](https://www.npmjs.com/package/swiper)

To install swiper

```bash
npm install --save swiper
# or with yarn
yarn add swiper
```

## Registration and configuration

See [Components registration](/docs/registration.md#components)

## Usage example

1. Basic structure of the slider
```html
<base-slider class="slider">
	<div class="slider__slide">Slide content</div>
</base-slider>
```

2. We can also create the structure manually by adding `swiper-container` & `swiper-wrapper`
```html
<base-slider class="slider">
	<div class="slider__container swiper-container">
		<div class="slider__wrapper swiper-wrapper">
			<div class="slider__slide">Slide content</div>
		</div>
	</div>
</base-slider>
```

## Options

The `BaseSlider` component accepts [options](https://swiperjs.com/swiper-api#parameters) that are passed to the Swiper instance. Here are some of the default options:

- `effect: string`: The transition effect. Default is 'slide'.
- `speed: number`: The transition speed in milliseconds. Default is 600.
- `on: object` Event handlers for Swiper events. By default, it includes:
 - `transitionEnd`: Emits `base-slider:slide-change` event.
 - `sliderFirstMove`: Emits `base-slider:slide-drag` event.
 
You can override these options by passing them to the component.
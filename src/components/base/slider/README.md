# BaseSlider

## Requirements
- [swiper](https://www.npmjs.com/package/swiper)

You can install swiper using npm:
```bash
yarn add swiper
```

## Installation and configuration

See [Components installation](/docs/components_installation.md)

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
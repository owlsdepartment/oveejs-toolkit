# ParallaxEffect

## Requirements
 - [gsap](https://www.npmjs.com/package/gsap)

```bash
yarn add gsap
```

## Installation and configuration

See [Components instalation](/docs/components_instalation.md)

## Usage example

Basic usage

```html
<div 
	data-parallax-effect 
	data-parallax-config='{
		"tweenVars": {
			"y": 200 
		},
		"end": "bottom+=200 top"
	}'
>
	Hello World!
</div>
```

Parallax Effect based on [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger).

To change options you can extend component and override `get parallaxConfig` property (remember to call `super.init()` and `super.destroy()` when overriding `init` and `destroy` hooks), or you can add `data-parallax-config` to element with config as JSON.

## Config

| Name | Type | Default | Description |
| -- | -- | -- | -- |
| `trigger` | `Element | string | null | ArrayLike<Element | string | null>` | `this.$element` | The element whose properties you want to animate |
| `disableOnMobile` | `boolean` | `true` | Disable parallax on mobile |
| `disableOnTable` | `boolean` | `true` | Disable parallax on tablet |
| `tweenVars` | `Object` | `{ y: 100 }` | An object containing properties you want to animate (`y`, `x`, `yPercent`, `xPercent` - [gsap vars](https://greensock.com/docs/v3/GSAP/gsap.to())) |
| ScrollTrigger Options |  |  | You can pass any property of [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.create()). |

# ParallaxEffect

## Installation and configuration

See [Components instalation](/docs/components_instalation.md)

## Usage example

Basic usage

```html
<div 
	data-parallax-effect 
	data-parallax-options='{
		"tweenVars": {
			"y": 200 
		},
		"end": "bottom+=200 top"
	}'
>
	Hello World!
</div>
```

Parallax Effect is based on [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger).

To change options you can extend component and override `get parallaxConfig` property (remember to call `super.init()` and `super.destroy()` when overriding `init` and `destroy` hooks):

```ts
export class CustomParallax extends ParallaxEffect {
    get parallaxConfig(): ParallaxConfig {
		return {
			target: this.$element.querySelector('div'),
			trigger: this.$element,
			disableOnTablet: false,
			disableOnMobile: false,
			tweenVars: {
				y: () => {
					return this.$element.offsetHeight;
				}
			}
		}
    }
}

```

or you can add `data-parallax-options` to element with config as JSON:

```html
<div 
	data-parallax-effect 
	data-parallax-options='{
		"tweenVars": {
			"yPercent": 100 
		},
		"start": "top center",
		"end": "bottom top"
	}'
>
	Hello World!
</div>
```

You can also pass global options while registering a component:

```ts
const app = new App({
    ...
});

app.registerComponent(ParallaxEffect, {
    disableOnTablet: false,
	tweenVars: {
		y: -300,
		end: "bottom-=300 top"
	}
});
```


## Config

| Name | Type | Default | Description |
| -- | -- | -- | -- |
| `target` | `Element \| string \| null \| ArrayLike<Element \| string \| null>` | `this.$element` | The element whose properties you want to animate |
| `disableOnMobile` | `boolean` | `true` | Disable parallax on mobile |
| `disableOnTable` | `boolean` | `true` | Disable parallax on tablet |
| `tweenVars` | `Object` | `{ y: 100 }` | An object containing properties you want to animate (`y`, `x`, `yPercent`, `xPercent`, `ease` - [gsap vars](https://greensock.com/docs/v3/GSAP/gsap.to())) |
| ScrollTrigger Options |  |  | You can pass any property of [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.create()). |

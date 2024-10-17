# ParallaxEffect

## Registration and configuration

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

To change options you can add `data-parallax-options` to element with config as JSON (only primitive values):

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
createApp()
    .component(ParallaxEffect, {
		disableOnTablet: false,
		tweenVars: {
			y: -300,
			end: "bottom-=300 top"
		}
	})
```

<!-- 
### Composable

```ts
import { ParallaxEffect } from '@ovee.js/toolkit'

export const MyComponent = defineComponent(element, () => {
	useComponent(ParallaxEffect, {
		tweenVars: {
			y: element.offsetHeight,
		}
	});
})
```
-->

## Config

| Name | Type | Default | Description |
| -- | -- | -- | -- |
| `target` | `Element \| string \| null \| ArrayLike<Element \| string \| null>` | `element` | The element whose properties you want to animate |
| `desktopBreakpoint` | `string` | `'(min-width: 1200px)'` | The media query breakpoint for desktop devices. |
| `tabletBreakpoint`  | `string` | `'(max-width: 1199px)'` | The media query breakpoint for tablet devices. |
| `mobileBreakpoint`  | `string` | `'(max-width: 767px), (max-width: 1023px) and (orientation: landscape)'` | The media query breakpoint for mobile devices. |
| `disableOnMobile` | `boolean` | `true` | Disable parallax on mobile |
| `disableOnTable` | `boolean` | `true` | Disable parallax on tablet |
| `tweenVars` | `Object` | `{ y: 100 }` | An object containing properties you want to animate (eg. `y`, `x`, `yPercent`, `xPercent` - [gsap vars](https://greensock.com/docs/v3/GSAP/gsap.to())) |
| ScrollTrigger Options |  |  | You can pass any property of [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.create()). |


## Returns

- `scrollTrigger`: A reference to the ScrollTrigger instance.
- `tween`: A reference to the GSAP Timeline instance.
- `matchMedia`: A reference to the GSAP MatchMedia instance.
- `cleanup`: A function to clean up the parallax effect.
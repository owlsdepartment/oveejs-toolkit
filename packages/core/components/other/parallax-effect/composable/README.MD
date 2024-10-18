# useParallaxEffect

`useParallaxEffect` is a composable function that provides a parallax scrolling effect using GSAP and ScrollTrigger. It allows you to define parallax animations for different breakpoints and manage them efficiently.

## Usage

::: code-group
```ts [MyComponent.ts]
import { useParallaxEffect } from '@ovee.js/toolkit'

export const MyComponent = defineComponent(_, () => {
	const children = useQuerySelectorAll<HTMLElement>('.child');

	useParallaxEffect(children, {
		disableOnMobile: true,
		tweenVars: {
			y: (idx, target) => {
				return target.offsetHeight * (idx % 2 === 0 ? -1 : 1);
			},
		}
	});
})
```

```ts [OtherComponent.ts]
import { useParallaxEffect } from '@ovee.js/toolkit'

export const OtherComponent = defineComponent(element, () => {
	useParallaxEffect(element, {
		tweenVars: {
			y: 100,
			x: 50
		}
	});
})
```

```html [index.html]
<my-component>
	<div class="child" data-parallax-config='{ disableOnMobile: false }'></div>
	<div class="child"></div>
</my-component>

<other-component></other-component>
```
:::

## Config

| Name | Type | Default | Description |
| -- | -- | -- | -- |
| `target` | `Element \| string \| null \| ArrayLike<Element \| string \| null>` | passed element(s) | The element whose properties you want to animate |
| `desktopBreakpoint` | `string` | `'(min-width: 1200px)'` | The media query breakpoint for desktop devices. |
| `tabletBreakpoint`  | `string` | `'(max-width: 1199px)'` | The media query breakpoint for tablet devices. |
| `mobileBreakpoint`  | `string` | `'(max-width: 767px), (max-width: 1023px) and (orientation: landscape)'` | The media query breakpoint for mobile devices. |
| `disableOnMobile` | `boolean` | `true` | Disable parallax on mobile |
| `disableOnTable` | `boolean` | `true` | Disable parallax on tablet |
| `tweenVars` | `Object` | `{ y: 100 }` | An object containing properties you want to animate (eg. `y`, `x`, `yPercent`, `xPercent` - [gsap vars](https://greensock.com/docs/v3/GSAP/gsap.to())) |
| ScrollTrigger Options |  |  | You can pass any property of [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.create()). |

::: note
You can change the options by passing `data-parallax-options` to the element with the configuration as a JSON object (only primitive values are allowed).
:::

## Returns

- `scrollTrigger[]`: A reference to the ScrollTrigger instances.
- `tween[]`: A reference to the GSAP Timeline instances.
- `matchMedia[]`: A reference to the GSAP MatchMedia instances.
- `cleanup`: A function to clean up the parallax effects.
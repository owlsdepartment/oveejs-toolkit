# Animation Helpers

A set of handy animation helpers built on top of [GSAP 3](https://greensock.com/docs/v3/GSAP). Aimed for simple use cases, when you just need a clean visible and hidden state of an element.

## Installation and configuration

See [Components installation](/docs/registration.md#other)

## Available animations

| Helper | Description |
|--------|-------------|
| `fadeIn` | Show target element from `display: none` state with fade transition |
| `fadeOut` | Hide target element into `display: none` state with fade transition |
| `fadeToggle` | Toggle target element visibility and display state with fade transition |
| `slideDown` | Show target element from `display: none` state with slide transition |
| `slideUp` | Hide target element into `display: none` state with slide transition |
| `slideToggle` | Toggle target element visibility and display state with slide transition |
| `slideDownFade` | Show target element from `display: none` state with slide and additional fade transition |
| `slideUpFade` | Hide target element into `display: none` state with slide and additional fade transition |
| `slideFadeToggle` | Toggle target element visibility and display state with slide and additional fade transition |

## Usage example
Let's say we have the following markup, showing a button that should trigger a gentle animation to show the details:

```html
<h1>An interesting thing</h1>
<div id="details" style="display:none">
	<p>Lorem ipsum dolor sit amet</p>
</div>
<button type="button" onclick="showDetais">Show details</button>
```

We can use `slideDownFade` animation to handle the animation. What's actually cool is that the animation will automatically calculate the target height of the element, including paddings. It will assume the target `display` value to be `block`, so if you are using something else, you can pass it through options. 

```ts
import { slideDownFade } from '@ovee.js/toolkit';

function showDetais() {
	const target = document.getElementById('#details');

	slideDownFade(target, 0.8, {
		ease: 'power2.out',
		display: 'flex'
	});
}
```

## API

### Fade Animations

#### `fadeIn`

```ts
function fadeIn<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: FadeOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: FadeOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `fadeOut`
```ts
function fadeOut<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: FadeOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: FadeOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `fadeToggle`
```ts
function fadeToggle<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: FadeOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: FadeOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `FadeOptions`
- `onComplete?: () => void;` - optional callback called on animation completion
- `onStart?: () => void;` - optional callback called on animation start
- `onUpdate?: () => void;` - optional callback called every time the animation updates
- `onInit?: (tween: gsap.core.Tween) => void;` - optional callback called immediately (synchronousely) after creating the animation. Use it if you aim to add the animation to a GSAP timeline.
- `ease?: string | gsap.EaseFunction;` - easing definition, following GSAP convention. Follow [the official GSAP docs](https://greensock.com/docs/v3/Eases) for more. `power2.out` will be used, if nothing set.
- `delay?: number | string` - delay for the animation, number or string.  Follow [the official GSAP docs](https://greensock.com/docs/v3/GSAP/Tween) for more.
- `display?: string;` - by default, the `display` property for visible state is set to `block`. pass your desired value if you want something else.

---

### Slide Animations

#### `slideDown`

```ts
function slideDown<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: SlideOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `slideUp`
```ts
function slideUp<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: SlideOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `slideToggle`
```ts
function slideToggle<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: SlideOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `SlideOptions`
- `onComplete?: () => void;` - optional callback called on animation completion
- `onStart?: () => void;` - optional callback called on animation start
- `onUpdate?: () => void;` - optional callback called every time the animation updates
- `onInit?: (tween: gsap.core.Tween) => void;` - optional callback called immediately (synchronousely) after creating the animation. Use it if you aim to add the animation to a GSAP timeline.
- `ease?: string | gsap.EaseFunction;` - easing definition, following GSAP convention. Follow [the official GSAP docs](https://greensock.com/docs/v3/Eases) for more. `power2.out` will be used, if nothing set.
- `delay?: number | string` - delay for the animation, number or string.  Follow [the official GSAP docs](https://greensock.com/docs/v3/GSAP/Tween) for more.
- `display?: string;` - by default, the `display` property for visible state is set to `block`. pass your desired value if you want something else.
- `fade?: boolean;` - if set to `true`, the target element will also fade in/out during the transition.

---

### Slide & Fade Animations

#### `slideDownFade`

```ts
function slideDownFade<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideFadeOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: SlideFadeOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `slideUpFade`
```ts
function slideUpFade<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideFadeOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: SlideFadeOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `slideFadeToggle`
```ts
function slideFadeToggle<T extends HTMLElement = HTMLElement>(
	target: T,
	duration = 0.5,
	options: SlideFadeOptions = {}
): Promise<void>;
```

##### Parameters

 - `target: HTMLElement` - target element to animate, expects `HTMLElement` by default
 - `duration` - animation duration in seconds, `0.5` seconds by default
 - `options?: SlideFadeOptions` - configuration options for fade animations.

##### Returns

Return value is a promise, that resolves when the animation completes. Please mind, that it gets rejected in case of animation interruption.

#### `SlideFadeOptions`
- `onComplete?: () => void;` - optional callback called on animation completion
- `onStart?: () => void;` - optional callback called on animation start
- `onUpdate?: () => void;` - optional callback called every time the animation updates
- `onInit?: (tween: gsap.core.Tween) => void;` - optional callback called immediately (synchronousely) after creating the animation. Use it if you aim to add the animation to a GSAP timeline.
- `ease?: string | gsap.EaseFunction;` - easing definition, following GSAP convention. Follow [the official GSAP docs](https://greensock.com/docs/v3/Eases) for more. `power2.out` will be used, if nothing set.
- `delay?: number | string` - delay for the animation, number or string.  Follow [the official GSAP docs](https://greensock.com/docs/v3/GSAP/Tween) for more.
- `display?: string;` - by default, the `display` property for visible state is set to `block`. pass your desired value if you want something else.
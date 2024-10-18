# ParallaxEffect

It uses the [`useParallaxEffect`](./composables/REAMDE.md) composable.

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

To change options you can add `data-parallax-options` to element with config as JSON (only primitive values are allowed):

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

## Config

See [`useParallaxEffect` - Config](./composable//README.MD#config)

## Returns

See [`useParallaxEffect` - Returns](./composable//README.MD#returns)

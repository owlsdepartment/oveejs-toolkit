# LottiePlayer

## Requirements
 - [lottie-web](https://www.npmjs.com/package/lottie-web)

```bash
yarn add lottie-web
```

## Installation and configuration

See [Components instalation](/docs/components_instalation.md)

## Usage example

Basic usage

```html
<lottie-player autoplay loop data-path="https://assets2.lottiefiles.com/packages/lf20_0ntwvpmb.json"></lottie-player>
```

`LottiePlayer` class is intended to use as a base class for more advanced and customized players. Don't forget to call `super.init()` and `super.destroy()` when overriding `init` and `destroy` hooks.

This component is an integration of `lottie-web`. To see a full usage guide, go to: [https://github.com/airbnb/lottie-web#usage]().

To extend base animation config, override `get animationConfig` property. Example:

```ts
export class CustomLottiePlayer extends LottiePlayer {
	get animationConfig(): AnimationConfigWithPath {
		return {
			...super.animationConfig,

			name: 'custom animation'
		}
	}
}
```

## Attributes

| Attribute | Type | Default | Description |
| -- | -- | -- | -- |
| `data-path` | `string` | - | Specifie path to your Lottie animation |
| `data-renderer` | `'svg'` | 'canvas' | 'html'` | `'svg'` | Change how animation is rendered |
| `autoplay` | `boolean` | `false` | Enable animation autoplay |
| `loop` | `boolean` | `false` | Enable animation loop |

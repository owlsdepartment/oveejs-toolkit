# LottiePlayer

## Requirements
 - [lottie-web](https://www.npmjs.com/package/lottie-web)

```bash
yarn add lottie-web
```

## Registration and configuration

See [Components instalation](/docs/registration.md)

## Usage example

Basic usage

```html
<lottie-player autoplay loop data-path="https://assets2.lottiefiles.com/packages/lf20_0ntwvpmb.json"></lottie-player>
```

This component is an integration of `lottie-web`. To see a full usage guide, go to: [https://github.com/airbnb/lottie-web#usage]().

To change animation config you can pass options while registering a component:

To extend base animation config, override `get animationConfig` property. Example:

```ts
import { LottiePlayer } from '@ovee.js/toolkit-integrations/lottie-player'

createApp()
    .component(LottiePlayer, { loop: true })
```

## Attributes

| Attribute | Type | Default | Description |
| -- | -- | -- | -- |
| `data-path` | `string` | - | Specifie path to your Lottie animation |
| `data-renderer` | `'canvas'`, `'html'` or `'svg'` | `'svg'` | Change how animation is rendered |
| `data-autoplay` | - | - | Enable animation autoplay |
| `data-loop` | - | - | Enable animation loop |

### Note

When configuring the `LottiePlayer`, data attributes on the HTML element take precedence over options passed during component registration. This means that if both a data attribute and an option are provided for the same configuration property, the value from the data attribute will be used.
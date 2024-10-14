# Ovee.js Toolkit Integrations

This package adds components and modules for `Ovee.js`, that heavily rely on external libraries. It's also a part of [`@ovee.js/toolkit`](../core/README.md).

## Installation

```bash
npm install --save @ovee.js/toolkit-integrations
# for yarn
yarn add @ovee.js/toolkit-integrations
```

This package requires `@ovee.js/toolkit`. If you didn't installed it already, follow [this link](/packages/core/README.md#installation) for installation instructions.

## Usage notes

All submodules have their own peer dependencies, so you should check submodule's `README` file to see if anything should be installed additionally, alongside standard configuration.

All imports should be done from specific submodules, f.ex.:

```ts
// Proper way
import { LazyLoad } from '@ovee.js/toolkit-integrations/lazy-load'

// Wrong way
import { LazyLoad } from '@ovee.js/toolkit-integrations'
```

You can do it, but it requires all optional libraries to be installed tho.

## Available submodules

 - [BaseSlider](./base-slider/README.md), using `swiper`
 - [GoogleMap](./google-map/README.md), using `@googlemaps/js-api-loader`
 - [LazyLoad](./lazy-load/README.md), using `vanilla-lazyload`
 - [LottiePlayer](./lottie-player/README.md), using `lottie-web`
 - [SplitText](./split-text/README.md), using `gsap@business`
 - [VideoAutoplay](./video-autoplay/README.md)

## Composables

 - [useLazyLoad](./lazy-load/composables/README.md)

[<- Root](/README.md)

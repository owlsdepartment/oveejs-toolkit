# LazyLoad

## Requirements
 - [`vanilla-lazyload`](https://github.com/verlok/vanilla-lazyload)

## Registration and configuration

See [Components instalation](/docs/components_instalation.md)

## Usage example

Basic usage

```html
<img data-src="example.jpg" alt="" data-lazy-load />
<video data-src="example.mp4" data-lazy-load></video>
```

This component is a wrapper for `vanilla-lazyload` library. Here is the full documentation: [https://github.com/verlok/vanilla-lazyload#-getting-started---html]().

To change options or elements to load, you can extend component and override `get options` and `get loadTargets` property. Remember to call `super.init()` and `super.destroy()` when overriding `init` and `destroy` hooks.

Example:

```ts
export class CustomLazyLoad extends LazyLoad {
    get options() {
        ...super.options,

        threshold: 0
    }

    get loadTargets() {
        return [...document.querySelectorAll('video[data-src]'), ...document.querySelectorAll('.custom-img')]
    }
}

```

or you can pass options while registering a component:

```ts
const app = new App({
    ...
});

app.registerComponent(LazyLoad, {
    threshold: 0
});
```

You can change target load elements via `data-target` attribute.

```html
<div data-lazy-load data-target="img">
    <img data-src="...">
</div>
```

## API

### Options

`inViewportClass: string` - class added when component appears in viewport

Other config options can be found [here](https://github.com/verlok/vanilla-lazyload#options)

### Methods

`load(options?: LazyLoadOptions): void` - method to manually force loading on a component. Accepts custom options, that will override default options. Can also be called through custom event

### Events

All events has effect only on element with this component.

`lazy-load:loaded` - Event is called whenever an element finishes loading.

```ts
export class SomeComponent extends Component {
    @bind('lazy-load:loaded', 'img')
    onImageLoad(element) {
        gsap.fromTo(element, {
            opacity: 0
        }, {
            opacity: 1
        });
    }
}
```

`lazy-load:error` - Event is called whenever an element triggers an error.

```ts
export class SomeComponent extends Component {
    @bind('lazy-load:error', 'img')
    onImageError(element) {
        const errorElement = document.createElement('span');

        errorElement.classList.add('image-error');
        errorElement.innerText = `[LazyLoad] Cannot load image "${element.dataset.src}"`;

        element.parentElement.replaceChild(element, errorElement);
    }
}
```

`lazy-load:load` - To load element from any component or module, you can pass custom options.

```ts
export class SomeComponent extends Component {
    @el('img[data-lazy-load]')
    lazyImage;

    init() {
        emitEvent(this.lazyImage, 'lazy-load:load', {
            threshold: 500
        })
    }
}
```

### Extends

[WithInViewport](/src/mixins/WithInViewport/README)

# LazyLoad

## Requirements
 - `vanilla-lazyload`

## Installation and configuration

See [Components instalation](/docs/components_instalation.md)

## Usage example

Basic usage

```html
<img data-src="example.jpg" alt="" data-lazy-load />
<video data-src="example.mp4" data-lazy-load></video>
```

This component is a wrapper for `vanilla-lazyload` library. Here is the full documentation: [https://github.com/verlok/vanilla-lazyload#-getting-started---html]().

To change options or elements to load, you can extend component and override `get lazyLoadOptions`/`get elementsToLoad` property. Remember to call `super.init()` and `super.destroy()` when overriding `init` and `destroy` hooks.

Example:

```ts
export class CustomLazyLoad extends LazyLoad {
    get lazyLoadOptions() {
        ...super.lazyLoadOptions,
        threshold: 0
    }

    get elementsToLoad() {
        return document.querySelectorAll('video[data-src]')
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

## Events

All events has effect only on element with this component.

`lazy-load:loaded` - Event is called whenever an element finishes loading.

```ts
export class SomeComponent extends Component {
    @bind('lazy-load:loaded', 'img')
    onImageLoad(element) {
        gsap.fromTo(element, {
            opacity: 0
        },
        {
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
        emitEvent(this.lazyImage, {
            threshold: 500
        })
    }
}
```

`lazy-load:update` - Make LazyLoad to re-check the DOM. You should update LazyLoad after added/removed DOM elements.

`lazy-load:global-update` - Like above, but you should trigger event on `window` object, it will trigger update on every element with this component.
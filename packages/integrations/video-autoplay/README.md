# VideAutoplay

## Registration and configuration

See [Components registration](/docs/registration.md#components)

## Usage example

```html
<!-- with lazy load -->
<video data-src="example.mp4" data-video-autoplay muted loop playsinline></video>

<!-- without lazy load -->
<video src="example.mp4" data-video-autoplay muted loop playsinline></video>
```

The component uses `IntersectionObserver` to play `video` when it is in the viewport.

After appearing element, `video` will receive class `in-in-viewport` and `loaded` after loading video.

[Autoplay availability](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide#autoplay_availability)

## API

### Extends

[LazyLoad](/src/components/utils/lazy-load/README.md)

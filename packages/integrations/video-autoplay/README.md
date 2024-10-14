# VideAutoplay

## Registration and configuration

See [Components registration](/docs/registration.md#components)

## Usage example

### With Lazy Load

```html
<video data-src="example.mp4" data-video-autoplay muted loop playsinline></video>
```

### Without Lazy Load

```html
<video src="example.mp4" data-video-autoplay muted loop playsinline></video>
```

The component uses `IntersectionObserver` to play `video` when it is in the viewport.

After appearing element, `video` will receive class `in-in-viewport` and `loaded` after loading video.

[Autoplay availability](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide#autoplay_availability)

### Composable

```ts
import { VideoAutoplay } from '@ovee.js/toolkit-integrations/video-autoplay'
import { watchEffect } from 'ovee.js';

export const MyComponent = defineComponent(() => {
	const { isPlaying } = useComponent(VideoAutoplay);

	watchEffect(() => {
		if(isPlaying.value) {
			// do something
		}
	})
})
```

## API

### Options

The `VideoAutoplay` component extends the `ILazyLoadOptions` interface and adds the following optional properties:

- `shouldRemoveInViewportClass?: boolean`: If `true`, the `in-in-viewport` class will be removed when the video is no longer in the viewport. Default `false`.
- `onPlay?: (element: HTMLVideoElement) => void`: A callback function that is called when the video starts playing.
- `onPause?: (element: HTMLVideoElement) => void`: A callback function that is called when the video is paused.

Other config options can be found [here](https://github.com/verlok/vanilla-lazyload?tab=readme-ov-file#options)

```ts
import { VideoAutoplay } from '@ovee.js/toolkit-integrations/video-autoplay'

createApp()
    .component(VideoAutoplay, { shouldRemoveInViewportClass: true, unobserve_entered: true })
```

### Return Value

- `play()`: Asynchronously plays the video.
- `pause()`: Asynchronously pauses the video.
- `isPlaying`: A reactive reference indicating whether the video is currently playing.
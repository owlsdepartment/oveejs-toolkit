# Medialayer

## Requirements
 - [plyr](https://www.npmjs.com/package/plyr)

```bash
yarn add plyr
```

## Installation and configuration

See [Components instalation](/docs/components_instalation.md)

## Usage example

Basic usage

```html

<!-- Without LazyLoad -->
<video 
	src="file.mp4" 
	data-media-player 
></video>

<!-- With LazyLoad -->
<video 
	data-src="file.mp4" 
	data-media-player 
></video>

<!-- YouTube/Vimeo -->
<div class="video-iframe" data-media-player>
	<iframe
		src="https://www.youtube.com/embed/__ID__" 
		frameborder="0" 
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
		allowfullscreen="" 
		title="__TITLE__"
	></iframe>
</div>

<!-- Audio -->
<audio 
	src="file.mp3" 
	data-media-player 
	data-player-config='{
		"autoplay": true, 
		"muted": true,
		"loop": { 
			"active": true 
		}
	}' 
	controls 
></audio>
```

This component is a wrapper for `plyr` library. Here is the full documentation: [https://github.com/sampotts/plyr]().

To change options you can extend component and override `get playerOptions` property. Remember to call `super.init()` and `super.destroy()` when overriding `init` and `destroy` hooks.

Example:

```ts
export class CustomMediaPlayer extends MediaPlayer {
    get playerOptions() {
		return {
			loop: {
				active: true
			}
		}
	}
}

```

or you can add `data-player-config` / `data-plyr-config` to element with config as JSON:

```html
<video 
	src="file.mp4" 
	data-media-player 
	data-player-config='{
		"loop": {
			"active": true,
		},
		"volume": 0
	}'
></video>
```

You can also pass global options while registering a component:

```ts
const app = new App({
    ...
});

app.registerComponent(MediaPlayer, {
	loop: {
		active: true,
	},
	volume: 0
});
```

## Attributes

| Attribute | Type | Default | Description |
| -- | -- | -- | -- |
| `data-player-config` / `data-plyr-config` | `string (JSON)` | - | [plyr options](https://github.com/sampotts/plyr#options) |

### Extends

[LazyLoad](/src/components/utils/lazy-load/README.md)

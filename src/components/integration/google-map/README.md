# GoogleMap

## Requirements
[Google Maps JavaScript API Loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)

## Installation and configuration

[Components installation](https://github.com/owlsdepartment/owlsdepartment-components/blob/master/docs/components_installation.md)

## Usage example

This component allows to share google map on the website with your own parameters and google map styles.

HTML Markup:

```html
	<div 
		class="map__wrapper"
		data-google-map
		data-lat="50.0"
		data-lng="25.0"
		data-pin="assets/custom-pin.svg"
	></div>
```

To specify google maps API key for all components, you can do this when registering component.

```ts
app.registerComponent(GoogleMap, { gmapsKey: 'MY_KEY' });
```

You can also do this for specific component.

```html
	<div 
		class="map__wrapper"
		data-google-map
		data-key="MY_KEY"
	></div>
```

You can also change other map configs, like this.

```ts
const MAP_STYLES = [
	{
		featureType: 'all',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#072A27',
			},
			{
				visibility: 'on',
			},
		],
	}
];

app.registerComponent(GoogleMap, { styles: MAP_STYLES });
```

All component options can be found [here](#options).

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data-lat` | `string` | - | pass latitude value to map component |
| `data-lng` | `string` | - | pass longitude value to map component |
| `data-pin` | `string` | - | set a pin icon (url) |
| `data-key` | `string` | - | set api key |

All of this params can be set via default component options during registration

### Options

All options are the same as official [MapOptions](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions) with addition of `gmapsKey`, where you can pass API key for google maps.

```ts
interface GoogleMapOptions extends google.maps.MapOptions {
	gmapsKey?: string;
}
```

### Fields and Methods

When extending `GoogleMaps`, you can specify your options overriding `get options` getter

```ts
class MyMap extends GoogleMaps {
	get options() {
		return {
			...super.options,

			zoomControl: false,
		}
	}
}
```

To add custom behaviour after map is initialized, like adding markers, you can override method `onMapInitialized`, that adds center marker by default.

```ts
class MyMap extends GoogleMaps {
	onMapInitialized() {
		// add markers
	}
}
```

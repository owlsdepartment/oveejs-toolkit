# GoogleMap

## Requirements
 - [Google Maps JavaScript API Loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)

## Registration and configuration

See [Components registration](/docs/registration.md#components)

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
import { GoogleMap } from '@ovee.js/toolkit-integrations/google-map';

createApp()
    .component(GoogleMap, { gmapsKey: 'MY_KEY' })
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
import { GoogleMap } from '@ovee.js/toolkit-integrations/google-map'

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

createApp()
    .component(GoogleMap, { 
		styles: MAP_STYLES, 
		zoom: 8,
		onMapInitialized: (map, markerLibrary) => {
       		console.log('Map initialized', map, markerLibrary);
    	} 
	})
```

All component options can be found [here](#options).

### Composable

```ts
import { GoogleMap } from '@ovee.js/toolkit-integrations/google-map'
import { watch } from 'ovee.js';

export const MyComponent = defineComponent(() => {
	const marker = shallowRef();
	const { markerLibrary, map } = useComponent(GoogleMap);
	

	watch(markerLibrary, (markerLib) => {
		if(!markerLib || marker.value) {
			return;
		}

		marker.value = new markerLib.AdvancedMarkerElement({
			map: map.value,
			position: { lat: -25.344, lng: 131.031 },
			title: 'Title',
		});
	})
})
```

#### Returns

- `loader` - The map loader instance.
- `mapsLibrary` - The Google Maps library instance.
- `markerLibrary` - The Google Maps marker library instance.
- `map` - The Google Map instance.
- `lat` - The latitude value.
- `lng` - The longitude value.
- `isMapLoaded` - Boolean indicating if the map is loaded.

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

All options are the same as official [MapOptions](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions) with the following additional properties:

- `gmapsKey?: string` - Google Maps API key.
- `onMapInitialized?: (map?: google.maps.Map | null, markerLibrary?: google.maps.MarkerLibrary) => void` - Callback function called when the map is initialized.
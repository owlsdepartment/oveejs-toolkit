# GoogleMap

## Requirements
[Google Maps JavaScript API Loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)

## Installation and configuration

[Components installation](https://github.com/owlsdepartment/owlsdepartment-components/blob/master/docs/components_installation.md)

## Usage example

### Basic usage

This component allows to share google map on the website with your own parameters and google map styles.

HTML Markup:

```html
	<div 
		class="map__wrapper"
		data-google-map
		data-lat="latitude"
		data-lng="longitude"
		data-pin="pin-url"
	></div>
```

Basically, this component connects to the wordpress function to download API key from the admin panel, but you can also complete the API key by yourself in the code.

```js
export const getKey = (): string => {
	return window.gmaps_key || '';
};
```

Besides main `GoogleMap.ts` file you need to have `get-options.ts` file and `styles.js`.

- `get-options.ts` component gets the exact information about the latitude/longitude, zoom of the map or map markers. Also connects component with map styles file.

- `styles.js` contains and export the styles we want to apply on the map, for example:

```js
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
export default MAP_STYLES;
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data-lat` | `string` | - | pass latitude value to map component |
| `data-lng` | `string` | - | pass longitude value to map component |
| `data-pin` | `string` | - | set a pin icon (url) |


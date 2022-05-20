import { Loader } from '@googlemaps/js-api-loader';
import { Component, dataParam, register } from 'ovee.js';

import { getKey, getMapOptions } from './get-options';

@register('google-map')
export default class GoogleMap extends Component {
	@dataParam('lat')
	lat: number | string;

	@dataParam('lng')
	lng: number | string;

	@dataParam('pin')
	pin: string;

	loader: Loader;
	map: unknown;

	init() {
		this.initLoader();
		this.initMap();
	}

	initLoader() {
		this.loader = new Loader({
			apiKey: getKey(),
			version: 'weekly',
		});
	}

	initMap() {
		if (this.map) return;
		this.loader
			.load()
			.then(google => {
				this.map = new google.maps.Map(this.$element, getMapOptions(+this.lat, +this.lng, 16));

				new google.maps.Marker({
					position: getMapOptions(+this.lat, +this.lng).center,
					map: this.map,
					...(this.pin && {
						icon: {
							url: this.pin,
							size: new google.maps.Size(46, 46),
							origin: new google.maps.Point(0, 0),
						},
					}),
				});
			})
			.catch();
	}
}

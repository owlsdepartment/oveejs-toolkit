import { Loader } from '@googlemaps/js-api-loader';
import { Component, dataParam, Logger, register } from 'ovee.js';

export interface GoogleMapOptions extends google.maps.MapOptions {
	gmapsKey?: string;
}

const logger = new Logger('GoogleMap');

@register('google-map')
export default class GoogleMap extends Component {
	static defaultOptions(): GoogleMapOptions {
		return {
			zoomControl: true,
			fullscreenControl: false,
			zoom: 18,
		};
	}

	@dataParam('lat')
	_lat?: string;

	@dataParam('lng')
	_lng?: string;

	@dataParam('pin')
	pin?: string;

	@dataParam('key')
	_key?: string;

	loader: Loader;
	map: google.maps.Map;

	get lat(): number {
		return this._lat ? parseFloat(this._lat) : 0;
	}

	get lng(): number {
		return this._lng ? parseFloat(this._lng) : 0;
	}

	get apiKey(): string {
		return this._key || this.options.gmapsKey || '';
	}

	get options() {
		return this.$options;
	}

	init() {
		this.initLoader();
		this.initMap();
	}

	initLoader() {
		const { apiKey } = this;

		this.loader = new Loader({
			apiKey,
			version: 'weekly',
		});
	}

	async initMap() {
		if (this.map) return;

		try {
			const google = await this.loader.load();

			this.map = new google.maps.Map(this.$element, this.getMapOptions(this.lat, this.lng));

			this.onMapInitialized();
		} catch (e) {
			logger.error('Something went wrong while loading google map.');
			console.error(e);
		}
	}

	onMapInitialized() {
		const { lat, lng } = this;

		new google.maps.Marker({
			position: { lat, lng },
			map: this.map,
			...(this.pin && {
				icon: {
					url: this.pin,
					size: new google.maps.Size(46, 46),
					origin: new google.maps.Point(0, 0),
				},
			}),
		});
	}

	protected getMapOptions(lat: number, lng: number, zoom?: number): GoogleMapOptions {
		return {
			...this.options,

			center: { lat, lng },
			zoom: zoom ?? this.options.zoom,
		};
	}
}

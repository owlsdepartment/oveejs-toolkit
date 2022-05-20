import MAP_STYLES from './styles';

declare global {
	interface Window {
		gmaps_key: string;
	}
}
interface MapOptions {
	center: {
		lat: number;
		lng: number;
	};
	mapMaker: boolean;
	zoomControl: boolean;
	fullscreenControl: boolean;
	zoom: number;
	styles: typeof MAP_STYLES;
}

export const getMapOptions = (lat: number, lng: number, zoom?: number): MapOptions => {
	return {
		center: {
			lat: lat ?? 0,
			lng: lng ?? 0,
		},
		mapMaker: true,
		zoomControl: true,
		fullscreenControl: false,
		zoom: zoom ?? 18,
		styles: MAP_STYLES,
	};
};

export const getKey = (): string => {
	return window.gmaps_key || '';
};

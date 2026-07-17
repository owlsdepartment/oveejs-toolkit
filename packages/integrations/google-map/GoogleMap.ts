import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import {
	computed,
	defineComponent,
	Logger,
	onMounted,
	onUnmounted,
	ref,
	shallowRef,
	useDataAttr,
} from 'ovee.js';

export interface GoogleMapOptions extends google.maps.MapOptions {
	gmapsKey?: string;
	onMapInitialized?: (
		map?: google.maps.Map | null,
		markerLibrary?: google.maps.MarkerLibrary
	) => void;
}

let isConfigured = false;
const logger = new Logger('GoogleMap');
const mapsLibrary = shallowRef<google.maps.MapsLibrary>();
const markerLibrary = shallowRef<google.maps.MarkerLibrary>();

export function useMapLoader(key: string) {
	if (!isConfigured) {
		setOptions({
			key,
			v: 'weekly',
		});
		isConfigured = true;
	}

	return {
		importLibrary,
	};
}

export const GoogleMap = defineComponent<HTMLElement, GoogleMapOptions>(
	async (element, _ctx, options) => {
		const _lat = useDataAttr('lat');
		const _lng = useDataAttr('lng');
		const _key = useDataAttr('key');
		const pin = useDataAttr('pin');
		const map = shallowRef<google.maps.Map | null>(null);
		const marker = shallowRef<google.maps.Marker | null>(null);
		const { importLibrary: loadLibrary } = useMapLoader(_key.value || options?.gmapsKey || '');
		const isMapLoaded = ref(false);

		const lat = computed(() => {
			return _lat.value ? parseFloat(_lat.value) : 0;
		});

		const lng = computed(() => {
			return _lng.value ? parseFloat(_lng.value) : 0;
		});

		onMounted(async () => {
			await initMap();

			isMapLoaded.value = true;
		});

		onUnmounted(() => {
			element.innerHTML = '';

			marker.value?.setMap(null);
			marker.value = null;

			map.value?.unbindAll();
			map.value = null;
		});

		async function initMap() {
			if (map.value) {
				return;
			}

			try {
				if (!mapsLibrary.value) {
					mapsLibrary.value = await loadLibrary('maps');
				}

				if (!markerLibrary.value) {
					markerLibrary.value = await loadLibrary('marker');
				}

				const MapClass = mapsLibrary.value.Map;
				map.value = new MapClass(element, getMapOptions(lat.value, lng.value));

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				onMapInitialized();
			} catch (e) {
				logger.error('Something went wrong while loading google map.');
				console.error(e);
			}
		}

		async function onMapInitialized() {
			if (options?.onMapInitialized) {
				options.onMapInitialized(map.value, markerLibrary.value);

				return;
			}

			const MarkerClass = markerLibrary.value?.Marker;

			if (MarkerClass) {
				marker.value = new MarkerClass({
					position: { lat: lat.value, lng: lng.value },
					map: map.value ?? undefined,
					...(pin.value && {
						icon: {
							url: pin.value,
							size: new google.maps.Size(46, 46),
							origin: new google.maps.Point(0, 0),
						},
					}),
				});
			}
		}

		function getMapOptions(lat: number, lng: number, zoom?: number): GoogleMapOptions {
			return {
				center: { lat, lng },
				zoom: zoom ?? options.zoom,
				...(options ?? {}),
			};
		}

		return {
			importLibrary: loadLibrary,
			mapsLibrary,
			markerLibrary,
			map,
			lat,
			lng,
			isMapLoaded,
		};
	}
);

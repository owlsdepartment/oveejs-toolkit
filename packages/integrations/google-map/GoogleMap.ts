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

import { useMapLoader } from './composables';

export interface GoogleMapOptions extends google.maps.MapOptions {
	gmapsKey?: string;
	onMapInitialized?: (
		map?: google.maps.Map | null,
		markerLibrary?: google.maps.MarkerLibrary
	) => void;
}

const logger = new Logger('GoogleMap');
const mapsLibrary = shallowRef<google.maps.MapsLibrary>();
const markerLibrary = shallowRef<google.maps.MarkerLibrary>();

export const GoogleMap = defineComponent<HTMLElement, GoogleMapOptions>(
	async (element, { options }) => {
		const _lat = useDataAttr('lat');
		const _lng = useDataAttr('lng');
		const _key = useDataAttr('key');
		const pin = useDataAttr('pin');
		const map = shallowRef<google.maps.Map | null>(null);
		const marker = shallowRef<google.maps.Marker | null>(null);
		const { loader } = useMapLoader(_key.value || options.gmapsKey || '');
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
			if (map.value || !loader) {
				return;
			}

			try {
				if (!mapsLibrary.value) {
					mapsLibrary.value = await loader.importLibrary('maps');
				}

				if (!markerLibrary.value) {
					markerLibrary.value = await loader.importLibrary('marker');
				}

				map.value = new mapsLibrary.value.Map(element, getMapOptions(lat.value, lng.value));

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

			if (markerLibrary.value) {
				marker.value = new markerLibrary.value.Marker({
					position: { lat: lat.value, lng: lng.value },
					map: map.value,
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
			loader,
			mapsLibrary,
			markerLibrary,
			map,
			lat,
			lng,
			isMapLoaded,
		};
	}
);

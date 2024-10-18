import { Loader } from '@googlemaps/js-api-loader';

let loader: Loader | undefined;

export function useMapLoader(key: string) {
	if (!loader) {
		loader = new Loader({
			apiKey: key,
			version: 'weekly',
		});
	}

	return {
		loader,
	};
}

import { useApp } from 'ovee.js';

export function useViewportUnits() {
	const app = useApp();

	return {
		vh: app.$vh,
		vw: app.$vw,
	};
}

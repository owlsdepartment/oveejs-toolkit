import { PlayerOptions } from './types';

export const MEDIA_PLAYER_DEFAULT_OPTIONS: PlayerOptions = {
	autoplay: false,
	muted: false,
	vimeo: {
		loop: false,
		autoplay: false,
		muted: false,
		controls: false,
		playsinline: false,
		byline: false,
		portrait: false,
		title: false,
		speed: true,
		transparent: true,
	},
	youtube: {
		autoplay: 0,
		controls: 0,
		disablekb: 1,
		playsinline: 0,
		enablejsapi: 1,
		origin: window.location.origin,
		modestbranding: 1,
		cc_load_policy: 1,
		rel: 0,
		showinfo: 0,
		iv_load_policy: 3,
	},
};

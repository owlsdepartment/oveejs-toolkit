export interface VimeoOptions {
	id?: number;
	url?: string;
	autopause?: boolean;
	autoplay?: boolean;
	background?: boolean;
	byline?: boolean;
	color?: string;
	controls?: boolean;
	dnt?: boolean;
	height?: number;
	interactive_params?: string;
	keyboard?: boolean;
	loop?: boolean;
	maxheight?: number;
	maxwidth?: number;
	muted?: boolean;
	pip?: boolean;
	playsinline?: boolean;
	portrait: boolean;
	quality?: 'auto' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';
	responsive?: boolean;
	speed?: boolean;
	texttrack?: string;
	title?: boolean;
	transparent?: boolean;
	width?: number;
}

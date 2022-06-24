export type YoutubeOptionBoolean = 0 | 1;

export interface YoutubeOptions {
	autoplay?: YoutubeOptionBoolean;
	cc_load_policy?: YoutubeOptionBoolean;
	color?: 'red' | 'white';
	controls?: 0 | 1 | 2;
	disablekb?: YoutubeOptionBoolean;
	enablejsapi?: YoutubeOptionBoolean;
	end?: number;
	fs?: YoutubeOptionBoolean;
	hl?: string;
	iv_load_policy?: 1 | 3;
	list?: string;
	listType?: 'playlist' | 'search' | 'user_uploads';
	loop?: YoutubeOptionBoolean;
	modestbranding?: YoutubeOptionBoolean;
	origin?: string;
	playlist?: string;
	playsinline?: YoutubeOptionBoolean;
	rel?: YoutubeOptionBoolean;
	showinfo?: YoutubeOptionBoolean;
	start?: number;
}

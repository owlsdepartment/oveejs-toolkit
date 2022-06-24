import Plyr from 'plyr';

export interface Player extends Plyr {
	id: number;
	isVimeo?: boolean;
	isYouTube?: boolean;
}

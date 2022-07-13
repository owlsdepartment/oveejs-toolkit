import Plyr from 'plyr';

import { VimeoOptions } from './VimeoOptions';
import { YoutubeOptions } from './YoutubeOptions';

export interface PlayerOptions extends Plyr.Options {
	youtube?: YoutubeOptions;
	vimeo?: VimeoOptions;
}

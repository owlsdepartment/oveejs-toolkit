import { LazyLoad, LazyLoadOptions } from '@ovee.js/toolkit-integrations';
import { emitEvent, Logger, register } from 'ovee.js';
import Plyr from 'plyr';

import { MEDIA_PLAYER_DEFAULT_OPTIONS } from './constants';
import { Player, PlayerOptions } from './types';

const logger = new Logger('MediaPlayer');
const players: { element: HTMLElement; player: Player }[] = [];
@register('media-player')
export class MediaPlayer extends LazyLoad {
	player: Player;
	playPromise: Promise<void>;
	loadPromise: Promise<void>;
	loadPromiseResolve: CallableFunction;
	isPlayerInitialized = false;
	isElementVisible = false;

	//WithInViewport Options
	get observerOptions(): IntersectionObserverInit {
		return {
			threshold: 0,
		};
	}

	//LazyLoad Options
	get options(): LazyLoadOptions {
		return {
			...super.options,
			callback_loaded: () => {
				this.loadPromiseResolve?.();
			},
		};
	}

	get mediaElement() {
		return this.$element as HTMLElement;
	}

	get isMediaLoaded() {
		if (!this.mediaElement) {
			return false;
		}

		const target =
			this.mediaElement.tagName === 'DIV'
				? this.mediaElement.querySelector<HTMLElement>('iframe')
				: this.mediaElement;

		if (!target) {
			return false;
		}

		return target.classList.contains('loaded') || target.dataset?.llStatus === 'loaded';
	}

	get jsonConfig(): PlayerOptions {
		const { mediaElement, isPlayerInitialized } = this;

		if (!mediaElement) {
			return {};
		}

		const config =
			mediaElement.getAttribute('data-plyr-config') ||
			mediaElement.getAttribute('data-player-config');

		if (!config) {
			return {};
		}

		if (!isPlayerInitialized) {
			mediaElement.setAttribute('data-player-config', config);
			mediaElement.removeAttribute('data-plyr-config');
		}

		try {
			return JSON.parse(config);
		} catch {
			logger.warn('Invalid JSON Config:', config);

			return {};
		}
	}

	get playerConfig(): PlayerOptions {
		const { $options, jsonConfig } = this;

		return {
			...MEDIA_PLAYER_DEFAULT_OPTIONS,
			...$options,
			...jsonConfig,
		};
	}

	get autoplayEnabled() {
		const { playerConfig, player } = this;

		return (
			(!player?.isYouTube && !player?.isVimeo && playerConfig.autoplay) ||
			(player?.isYouTube && playerConfig.youtube?.autoplay) ||
			(player?.isVimeo && playerConfig.vimeo?.autoplay)
		);
	}

	init() {
		super.init();

		this.isLoadingInitialized = this.mediaElement.dataset.src === undefined;

		this.createLoadPromise();
		this.createPlayer();
		this.bind();
	}

	createLoadPromise() {
		this.loadPromise = new Promise(resolve => {
			if (this.isLoadingInitialized) {
				this.$element.classList.add(this.options?.class_loaded ?? 'loaded');

				resolve();
			} else {
				this.loadPromiseResolve = resolve;

				this.load();
			}
		});
	}

	async createPlayer() {
		await this.loadPromise;

		const { playerConfig, mediaElement } = this;

		if (!mediaElement) {
			return;
		}

		this.player = new Plyr(mediaElement, playerConfig) as Player;

		players.push({
			element: mediaElement,
			player: this.player,
		});

		if (mediaElement?.tagName === 'AUDIO') {
			mediaElement.setAttribute('controls', '');
		}
	}

	play() {
		if (!this.isPlayerInitialized) {
			return;
		}

		this.playPromise = this.player?.play() ?? Promise.resolve();
	}

	async pause() {
		if (!this.isPlayerInitialized) {
			return;
		}

		await this.playPromise;

		this.player?.pause();
	}

	onIntersection(entry: IntersectionObserverEntry) {
		super.onIntersection(entry);

		if (entry.isIntersecting) {
			if (!this.autoplayEnabled) {
				return;
			}

			this.play();
		} else {
			this.pause();
		}

		this.isElementVisible = entry.isIntersecting;
	}

	onPlayerReady() {
		this.isPlayerInitialized = true;

		emitEvent(this.mediaElement, 'media-player:initialized');

		if (!this.autoplayEnabled || !this.isElementVisible) {
			return;
		}

		this.player.play();
		this.player.volume = 0;
	}

	onPlay() {
		const { mediaElement } = this;

		players
			.filter(({ element }) => !element.isSameNode(mediaElement))
			.forEach(({ player }) => {
				player.pause();
			});

		emitEvent(mediaElement, 'media-player:played');
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onPause() {
		emitEvent(this.mediaElement, 'media-player:paused');
	}

	bind() {
		this.$on('media-player:play', this.mediaElement, this.play);
		this.$on('media-player:pause', this.mediaElement, this.pause);
		this.$on('play', this.mediaElement, this.onPlay);
		this.$on('pause', this.mediaElement, this.onPause);
		this.$on('ready', this.mediaElement, this.onPlayerReady);
	}

	destroy() {
		players.splice(0, players.length);
		this.player?.destroy();
		super.destroy();
	}
}

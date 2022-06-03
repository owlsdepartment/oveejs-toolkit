import lottie, { AnimationConfigWithPath, AnimationItem } from 'lottie-web';
import { Component, dataParam, Logger, register } from 'ovee.js';

export type LottieRenderer = 'svg' | 'canvas' | 'html';

export interface LottiePlayerConfig {
	renderer: LottieRenderer;
}

const ALLOWED_RENDERERS = ['svg', 'canvas', 'html'];
const logger = new Logger('LottiePlayer');

export const LOTTIE_PLAYER_DEFAULT_CONFIG: LottiePlayerConfig = {
	renderer: 'svg',
};

@register('lottie-player')
export class LottiePlayer extends Component {
	@dataParam()
	path = '';

	@dataParam()
	renderer: LottieRenderer =
		(this.$options as LottiePlayerConfig).renderer ?? LOTTIE_PLAYER_DEFAULT_CONFIG.renderer;

	player?: AnimationItem;

	get autoplay() {
		return this.$element.hasAttribute('autoplay');
	}

	get loop() {
		return this.$element.hasAttribute('loop');
	}

	get animationConfig(): AnimationConfigWithPath {
		const { autoplay, loop } = this;

		return {
			loop,
			autoplay,
			container: this.$element,
			path: this.path,
		};
	}

	init() {
		this.createLottie();
	}

	destroy() {
		this.player?.destroy();
	}

	createLottie() {
		const { renderer } = this;

		if (!ALLOWED_RENDERERS.includes(renderer)) {
			const allowed = ALLOWED_RENDERERS.map(r => `'${r}'`).join(', ');

			logger.error(
				`Wrong data-renderer type. Received: '${renderer}', expected one of: ${allowed}`
			);
			return;
		}

		this.player = lottie.loadAnimation({
			...this.animationConfig,

			renderer: renderer as any,
		});

		this.$emit('lottiePlayer:created', this.$element);

		this.player.addEventListener('DOMLoaded', () => {
			this.$emit('lottiePlayer:loaded', this.$element);
		});
	}
}

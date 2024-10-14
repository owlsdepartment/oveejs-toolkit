import lottie, { AnimationConfigWithPath, AnimationItem, RendererType } from 'lottie-web';
import { computed, defineComponent, Logger, onUnmounted, shallowRef, useDataAttr } from 'ovee.js';

export type LottiePlayerConfig = AnimationConfigWithPath<RendererType>;

const ALLOWED_RENDERERS = ['svg', 'canvas', 'html'];
const logger = new Logger('LottiePlayer');

export const LottiePlayer = defineComponent<HTMLElement, LottiePlayerConfig>(
	(element, { options, emit }) => {
		const player = shallowRef<AnimationItem>();

		const path = useDataAttr('path');
		const renderer = useDataAttr('renderer');
		const autoplay = useDataAttr('autoplay');
		const loop = useDataAttr('loop');

		const animationConfig = computed<LottiePlayerConfig>(() => {
			return {
				...(options ?? {}),
				loop: !!(loop.value ?? options?.loop),
				autoplay: !!(autoplay.value ?? options?.autoplay),
				container: options?.container ?? element,
				path: path.value ?? options?.path,
				renderer: (renderer.value ?? options?.renderer ?? 'svg') as RendererType,
			};
		});

		createLottie();

		onUnmounted(destroy);

		function createLottie() {
			if (
				animationConfig.value.renderer &&
				!ALLOWED_RENDERERS.includes(animationConfig.value.renderer)
			) {
				const allowed = ALLOWED_RENDERERS.map(r => `'${r}'`).join(', ');

				logger.error(
					`Wrong data-renderer type. Received: '${renderer}', expected one of: ${allowed}`
				);
				return;
			}

			player.value = lottie.loadAnimation(animationConfig.value);

			emit('lottie-player:created', element);

			player.value.addEventListener('DOMLoaded', () => {
				emit('lottie-player:loaded', element);
			});
		}

		function destroy() {
			player.value?.destroy();
		}

		return {
			player,
			destroy,
		};
	}
);

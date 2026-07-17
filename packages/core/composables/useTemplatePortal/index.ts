import { effect, stop } from '@vue/reactivity';
import { queuePostFlushCb } from '@vue/runtime-core';
import {
	type Fiber,
	type TemplateFunction,
	injectComponentContext,
	Logger,
	onBeforeMount,
	onUnmounted,
	Renderer,
	Task,
} from 'ovee.js';

const logger = new Logger('useTemplatePortal');

export type UseTemplatePortalTarget = Node | (() => Node | null | undefined) | string;

export interface UseTemplatePortalOptions {
	target: UseTemplatePortalTarget;
	template: TemplateFunction;
	/**
	 * `sync` runs the JSX render flush in the same macrotask (needed e.g. when GSAP binds to nodes right after).
	 */
	flush?: 'post' | 'sync';
}

export interface UseTemplatePortalReturn {
	requestUpdate: () => Promise<void>;
	dispose: () => void;
}

function resolveTarget(target: UseTemplatePortalTarget): Node | null {
	if (typeof target === 'string') {
		const el = document.querySelector(target);
		if (!el) {
			logger.warn(`useTemplatePortal: selector matched no element: ${target}`);
		}
		return el;
	}
	if (typeof target === 'function') {
		return target() ?? null;
	}
	return target;
}

export function useTemplatePortal(options: UseTemplatePortalOptions): UseTemplatePortalReturn {
	const renderer = new Renderer();
	const flush = options.flush ?? 'post';
	let stopped = false;
	let renderTask: Task | null = null;
	let updateTask: Task | null = null;

	const runner = effect(
		() => {
			const target = resolveTarget(options.target);
			if (!target) {
				return;
			}
			const fiber = options.template();
			renderer.process(fiber as Fiber, target);
		},
		{
			scheduler() {
				queuePostFlushCb(update);
			},
		}
	);

	function update(force?: boolean) {
		if (stopped) {
			return;
		}
		if (runner.effect.dirty || force) {
			runner.effect.run();
			queueRender();
		}
	}

	function queueRender() {
		if (renderTask) {
			return;
		}
		renderTask = new Task();
		if (flush === 'sync') {
			render();
		} else {
			queuePostFlushCb(render);
		}
	}

	function render() {
		renderer.render();
		renderTask?.resolve();
		renderTask = null;
	}

	async function requestUpdate(): Promise<void> {
		if (updateTask) {
			return updateTask;
		}
		updateTask = new Task();
		update(true);
		if (renderTask) {
			renderTask.then(() => {
				updateTask?.resolve();
			});
		} else {
			updateTask.resolve();
		}
		await updateTask;
		updateTask = null;
	}

	function dispose() {
		if (stopped) {
			return;
		}
		stopped = true;
		stop(runner);
		const target = resolveTarget(options.target);
		if (target) {
			renderer.process(undefined, target);
			renderer.render();
		}
	}

	const instance = injectComponentContext(true);
	if (instance) {
		onBeforeMount(() => {
			update(true);
			if (renderTask) {
				instance.renderPromise = renderTask;
			}
		});
		onUnmounted(dispose);
	} else {
		update(true);
	}

	return {
		requestUpdate,
		dispose,
	};
}

import { defineComponent, Logger, onMounted, Ref, ref, useDataAttr } from 'ovee.js';

import { useTemplatePortal } from '../../../composables/useTemplatePortal';
import { classNames } from '../../../tools';

export interface WithBaseDialog {
	_dialogInstance?: BaseDialogReturn;
}

export interface BaseDialogElement extends WithBaseDialog, HTMLElement {}

export interface BaseDialogWrapperRenderProps {
	children: JSX.Element;
	close: () => void;
}

export type BaseDialogWrapperRender = (props: BaseDialogWrapperRenderProps) => JSX.Element;

export interface BaseDialogOptions {
	dialogRoot: string;
	dialogWrapper?: BaseDialogWrapperRender;
}

const logger = new Logger('BaseDialog');

const defaultOptions: BaseDialogOptions = {
	dialogRoot: '.dialog-root',
};

export interface BaseDialogReturn {
	isOpen: Ref<boolean>;
	open: () => void;
	close: () => void;
	dialogRoot: HTMLElement | null;
	dialogTarget: BaseDialogElement;
}

const SLOT_ATTR = 'data-base-dialog-content';

export const BaseDialog = defineComponent<HTMLElement, BaseDialogOptions, BaseDialogReturn>(
	(element, { emit }, options) => {
		const rootClassAttr = useDataAttr('dialog-class');
		const isOpen = ref(false);
		const dialogTarget = document.createElement('div') as BaseDialogElement;
		const userContentFragment = document.createDocumentFragment();
		const dialogRoot = document.querySelector<HTMLElement>(
			options?.dialogRoot || defaultOptions.dialogRoot
		);

		const api: BaseDialogReturn = {
			isOpen,
			open,
			close,
			dialogRoot,
			dialogTarget,
		};

		dialogTarget._dialogInstance = api;
		element.setAttribute('aria-hidden', 'true');
		element.style.display = 'none';

		if (!dialogRoot) {
			logger.warn(
				`Dialog root wasn't found. Element with selector '${
					options?.dialogRoot || defaultOptions.dialogRoot
				}' does not exist.`
			);
			return api;
		}

		while (element.firstChild) {
			userContentFragment.appendChild(element.firstChild);
		}

		dialogRoot.append(dialogTarget);

		useTemplatePortal({
			target: dialogTarget,
			flush: 'sync',
			template: () => {
				const openClass = isOpen.value ? 'base-dialog--is-open' : '';
				const rootClass = rootClassAttr.value ?? '';
				const rootClasses = classNames('base-dialog', openClass, rootClass);
				const customWrapper = options?.dialogWrapper;

				if (customWrapper) {
					return <div class={rootClasses}>{customWrapper({ children: createSlot(), close })}</div>;
				}

				return (
					<div class={rootClasses}>
						<div class="base-dialog__container">{createSlot()}</div>
						<button
							type="button"
							class="base-dialog__close"
							aria-label="Close dialog"
							onClick={close}
						>
							<span class="base-dialog__close-icon" />
						</button>
					</div>
				);
			},
		});

		onMounted(mountDialogContent);

		return api;

		function createSlot() {
			return <div class="base-dialog__content" data-base-dialog-content />;
		}

		function mountDialogContent() {
			const slot = dialogTarget.querySelector<HTMLElement>(`[${SLOT_ATTR}]`);
			if (!slot) {
				logger.warn('Dialog content slot is missing');
				return;
			}

			slot.replaceChildren();
			slot.appendChild(userContentFragment);
		}

		function open() {
			emit('dialog:before-open', null);
			isOpen.value = true;
			emit('dialog:open', null);
		}

		function close() {
			emit('dialog:before-close', null);
			isOpen.value = false;
			emit('dialog:close', null);
		}
	}
);

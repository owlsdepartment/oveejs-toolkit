import { TemplateResult } from 'lit-html';
import { Logger, reactive, TemplateComponent } from 'ovee.js';

export interface WithBaseDialog {
	_dialogInstance?: BaseDialog;
}

export interface BaseDialogConfig {
	dialogRoot: string;
}

const logger = new Logger('BaseDialog');
export const BASE_DIALOG_DEFAULT_CONFIG: BaseDialogConfig = {
	dialogRoot: '.dialog-root',
};

export class BaseDialog extends TemplateComponent {
	static config: BaseDialogConfig = BASE_DIALOG_DEFAULT_CONFIG;

	rootClass = '';
	dialogTarget: HTMLElement;
	dialogRoot = document.querySelector(BaseDialog.config.dialogRoot);

	@reactive()
	isOpen = false;

	protected get renderTarget() {
		return this.dialogTarget;
	}

	init() {
		const target = document.createElement('div');

		(target as WithBaseDialog)._dialogInstance = this;
		this.dialogTarget = target;

		if (!this.dialogRoot) {
			logger.warn(
				`Dialog root wasn't found. Element with selector '${BaseDialog.config.dialogRoot}' does not exist.`
			);

			return;
		}

		this.dialogRoot.append(target);
	}

	open() {
		this.$emit('dialog:before-open', null);
		this.isOpen = true;
		this.$emit('dialog:open', null);
	}

	close() {
		this.$emit('dialog:before-close', null);
		this.isOpen = false;
		this.$emit('dialog:close', null);
	}

	dialogWrapper(content: TemplateResult | string) {
		return this.html`
			<div class="base-dialog ${this.isOpen ? 'base-dialog--is-open' : ''} ${this.rootClass}">
				<div class="base-dialog__container">
					<div class="base-dialog__content">
						${content}
					</div>
				</div>

				<button type="button" class="base-dialog__close" @click=${this.close.bind(this)}>
					<span class="base-dialog__close-icon"></span>
				</button>
			</div>
		`;
	}
}

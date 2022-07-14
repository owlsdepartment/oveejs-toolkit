import Choices, { Options } from 'choices.js';
import { Component, register } from 'ovee.js';

@register('base-select')
export default class extends Component {
	choices: Choices;

	init() {
		this.choices = new Choices(this.$element, {
			...this.componentOptions,
			...this.choicesOptions,
		});
	}

	get componentOptions(): Partial<Options> {
		return this.$options ?? {};
	}

	get choicesOptions(): Partial<Options> {
		return {};
	}

	destroy() {
		this.choices.destroy();
	}
}

import Choices from 'choices.js';
import { Component, register } from 'ovee.js';

@register('base-select')
export default class extends Component {
	choices: Choices;

	init() {
		this.choices = new Choices(this.$element, {
			...this.choicesOptions,
		});
	}

	get choicesOptions() {
		return {};
	}

	destroy() {
		this.choices.destroy();
	}
}

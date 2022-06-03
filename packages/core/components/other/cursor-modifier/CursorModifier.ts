import { CustomCursor } from '@ovee.js/toolkit/modules';
import { Component, register } from 'ovee.js';

@register('cursor-modifier')
export class CursorModifier extends Component {
	CustomCursor: CustomCursor;

	init() {
		this.CustomCursor = this.$app.getModule(CustomCursor.getName()) as CustomCursor;

		this.CustomCursor.addModifier(this.$element);
	}

	destroy() {
		this.CustomCursor.removeModifier(this.$element);
	}
}

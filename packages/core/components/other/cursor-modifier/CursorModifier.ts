import { Component, register } from 'ovee.js';

import { CustomCursor } from '@core/modules';

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

import { CustomCursor } from '@ovee.js/toolkit/modules';
import { defineComponent, onUnmounted, useModule } from 'ovee.js';

export const CursorModifier = defineComponent(element => {
	const { addModifier, removeModifier } = useModule(CustomCursor);

	addModifier(element);

	onUnmounted(() => {
		removeModifier(element);
	});
});

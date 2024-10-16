# useViewportUnits

Provides access to the reactive viewport height (`vh`) and width (`vw`) units. These units are stored in `app.$vh` and `app.$vw`, respectively.

## Usage

```ts
import { useViewportUnits } from '@ovee.js/toolkit';

export const SomeComponent = defineComponent(() => {
    const { vh, vw } = useViewportUnits();

	watch(vh, (vh) => {
		console.log(`Current viewport height is ${vh * 100}px`);
	})
});
```
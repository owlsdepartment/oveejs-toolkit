# CustomCursor

## Registration and configuration

See [Modules registration](/docs/registration.md#modules)

Styles

```scss
@import '@ovee.js/toolkit/styles/custom-cursor';
```

## Usage example

`CustomCursor` module creates an HTML element and updates its position to reflect the position of an actual cursor.

You can overwrite default options when registering module.

### Module options

```ts
{
	hideDefault: false, 
	cursorLerp: true,
	cursorDuration: 0.4,
	shadow: true,
	shadowDuration: 1,
	ripple: false,
	rippleThreshold: 50,
	checkIfLink: undefined,
}
```

- `hideDefault` - when enabled, hides the default system cursor.
- `cursorLerp` - when enabled, the cursor will take a bit of time to travel to the actual mouse position, making the movement smoother.
- `cursorDuration` - cursor travel duration. Takes effect when `cursorLerp` is enabled. Recommended to not use large values with `hideDefault` enabled.
- `shadow` - enables additional shadow element that follows the cursor.
- `shadowDuration` - shadow travel duration.
- `ripple` - enables the ripple effect on click.
- `rippleThreshold` - by default, the ripple effect will not be triggered when dragging the cursor over a distance longer than or equal to this value. It is meant to prevent the effect on components as sliders or when selecting text.
- `checkIfLink: (target?: HTMLElement | null): boolean` - allows you to provide a custom function to determine if an element should be treated as a link. This function receives the target element as an argument and should return a boolean value.

## Styling

The cursor has a few build-in classes, which can be used for styling. Those classes are:
- `.is-visible` - toggled when the actual cursor is in the browser viewport
- `.is-pressed` - toggled on click
- `.is-over-link` - toggled when hovering over an `<a>` or `<button>` element
- `.is-left` - toggled when the actual cursor is positioned on the left half of the viewport or exacly in the middle
- `.is-right` - toggled when the actual cursor is positioned on the right half of the viewport

To extend the styling capabilities of the module, use it in conjunction with the `CursorModifier` component. It enables custom themes when hovering over chosen elements and adds support for cursor text content.

Shadow and ripple elements both use the same styling namespace as the main cursor element. They can be targeted using the `.cursor--shadow` and `.cursor--ripple` modifiers.

The `.cursor--ripple` element should have a animation assigned to a tag inside its structure. The end of this animation is used as a trigger to remove this element from the DOM.
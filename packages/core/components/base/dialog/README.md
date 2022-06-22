# BaseDialog

## Registration and configuration

See [Components registration](/docs/registration.md#components)

To add styles:
```scss
@import '@ovee.js/toolkit/styles/base-dialog.scss';
```

## Usage example

This component aims to simplify adding and managing dialogs. It adds hidden HTML to custom place in your app, called `DialogRoot`. Preferably, it should by somewhere in body, after your main content. By default, it searches for an element with class `.dialog-root`, but it can be changed via options.

Best way of using `BaseDialog`, is through extending by another component and then adding your custom template.

```ts
export class MyDialog extends BaseDialog {
	onClick() {
		this.close();
	}

	template() {
		return this.html`
			// your custom dialog template

			<button type="button" @click=${this.onClick}>
				Close
			</button>
		`;
	}
}
```

```html
<my-dialog />
```

`BaseDialog` comes with simple `dialogWrapper` that is a base for your awesome dialogs, that you can insert content into. It comes with fully binded close button.

```ts
export class MyDialog extends BaseDialog {
	template() {
		return this.dialogWrapper(
			this.html`
				// content of your dialog
			`
		);
	}
}
```

This component is super powerful when combined with `WithSlots` mixin

<!-- TODO: continued when mixin is added -->

We can also listen to events emitted via `base-dialog` component. Full list of events is [here](#events).

## API

### Methods

 - `open(): void` - opens dialog
 - `close(): void` - closes dialog
 - `dialogWrapper(content: TemplateResult | string): TemplateResult` - predefined wrapper on your dialog content
 - `dialogRoot: HTMLElement` - if you would like to override default root for all dialogs


### Events

 - `dialog:before-open` - emitted before the dialog opens
 - `dialog:open` - emitted after the dialog was opened
 - `dialog:before-close` - emitted before the dialog closes
 - `dialog:close` - emitted after the dialog was closed

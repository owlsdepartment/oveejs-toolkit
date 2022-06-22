# BaseAccordion

## Registration and configuration

See [Components installation](/docs/registration.md#components)

## Configuration

To configure the component, you can set the following options during it's registration:

|	Option			|	Type		|	Default			|	Description																		|
|	---				|	---			|	---				|	---																				|
|	firstActive		|	boolean		|	false			|	Initial state of the first accordion item										|
|	autoCollapse	|	boolean		|	false			|	Automatically collapse other accordions while opening							|
|	immediate		|	boolean		|	false			|	Immidiately show or hide accordion content (disable animation)					|
|	duration		|	number		|	0.4				|	Animation speed in seconds														|
|	ease			|	string		|	power2.inOut	|	[Animation GSAP easing](https://greensock.com/docs/v3/Eases)					|
|   openClass		| 	string		|	.is-open		|	CSS class set to the item in the opened state									|
|   collapsedClass	| 	string		|	.is-collapsed	|	CSS class set to the item in the closed state									|
|   display			| 	strimg		|	block			| 	The value of `display` property that should be set for opened item's content 	|

## Usage example

To use this component you need to add the following `data-` attributes to the component elements:

- `data-base-accordion-item` - accordion item
- `data-base-accordion-trigger` - accordion item trigger
- `data-base-accordion-content` - accordion item content

```html
<base-accordion>
	<div data-accordion-item>
		<div data-accordion-trigger>
			<h3>Accordion title</h3>
		</div>

		<div data-accordion-content>
			<p>Accordion content</p>
		</div>
	</div>
</base-accordion>
```

```ts
import '@ovee.js/toolkit/styles/base-accordion.scss';
import { BaseAccordion } from '@ovee.js/toolkit/components';

import { App } from 'ovee.js';

const root = document.body;
const app = new App();

app.registerComponent(BaseAccordion, {
	autoCollapse: true,
	firstActive: true,
});

app.run(root);
```

## Events

This component emits following events:

|	Event							 |	Description												|
|	---								 |	---														|
|	base-accordion:will-show		 |	Emitted before the opening animation starts				|
|	base-accordion:show				 |	Emitted when the opening animation has concluded		|
|	base-accordion:show-interrupted	 |	Emitted when the opening animation has been interrupted	|
|	base-accordion:will-hide		 |	Emitted before the closing animation starts				|
|	base-accordion:hide				 |	Emitted when the closing animation has concluded		|
|	base-accordion:hide-interrupted	 |	Emitted when the closing animation has been interrupted	|

You can access the accordion item which emitted this event by using `event.detail`

## Styling

This component comes with only a few basic lines of CSS, which should fix functionality and accessibility issues. It's recommended to import them by following the steps in the **Installation and configuration** section. 

By default, the component sets `.is-open` class for the item in opened and `.is-collapsed` in closed state. Typically that's all you need to style the state indicator (e.g. an arrow).

If you plan to extend the component and register with a different name, you can also use `@mixin base-accordion($openClass: '.is-open', $collapsedClass: '.is-collapsed')`. 

```scss
my-custom-accordion {
	@include base-accordion('.my-custom-accordion--is-open', '.my-custom-accordion--is-collapsed');
}
```

Also, if you customize open/closed classes with the component's options, the default styles will no longer work and all of the accordion's items will stay opened until the JS loads. TO solve this, you can either add custom styling to hide the item unil it gets the configured classes or you can set the following global Sass variables before including the component's styles:

```scss
$base_accordion_default_open_class: '.is-open';
$base_accordion_default_collapsed_class: '.is-collapsed';
```
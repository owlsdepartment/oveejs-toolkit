# BaseAccordion

## Requirements
- [GSAP 3](https://www.npmjs.com/package/gsap)

You can install GSAP using npm:
```bash
yarn add gsap
```

## Installation and configuration

See [Components instalation](/docs/components_instalation.md)

| Option          | Type              | Default     	| Description                        							|
| ---             | ---               | ---         	| ---                                							|
| firstActive     | boolean           | false       	| Initial state of the first accordion item 					|
| autoCollapse    | boolean           | false       	| Automatically collapse other accordions while opening 		|
| immediate       | boolean           | false 			| Immidiately show or hide accordion content (disable animation) |
| speed           | number            | 0.4	      		| Animation speed in seconds 									|
| ease            | string            | power2.inOut 	| [Animation GSAP easing](https://greensock.com/docs/v3/Eases) 	|

## Usage example

To use this component you need to add the following `data-` attributes to the component elements:
- `data-base-accordion-item` - accordion item
- `data-base-accordion-trigger` - accordion trigger
- `data-base-accordion-content` - accordion content

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

## Styling

This component comes with only a few basic lines of CSS, which fix some accessibility issues. You can import them by following the steps in the **Installation and configuration** section.


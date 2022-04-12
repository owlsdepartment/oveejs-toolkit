# VhFix

## Installation and configuration

See [Components installation](/docs/components_installation.md)

## Requirements

Don't forget to import scss function which calcs vh.

## Usage example

`VhFix` module adds `--vh` css variable, that reflects real vh on all devices, includes mobile

```css
.element {
	min-height: vh(100);
}
```
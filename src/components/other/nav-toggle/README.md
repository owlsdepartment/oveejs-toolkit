# NavToggle

## Installation and configuration

See [components installation](https://github.com/owlsdepartment/owlsdepartment-components/blob/master/docs/components_installation.md) or use this:

```ts
import { NavToggle } from '@owlsdepartment/components';

export default [
    // ... other components ...
    NavToggle
];
```

## Usage example

### Basic usage

`NavToggle` is a component mainly built to toggle menu/navigation but it can trigger any behaviour on any element of a website. It's based on adding global classes to `HTML document` describing statements of element you toggle.

Example:

```html
<button
    class="burger"
    data-nav-toggle="menu"
    data-nav=".menu"
    aria-controls="menu-menu"
    aria-expanded="false"
></button>
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data-nav-toggle` | `string` | `menu` | Specifie name (*navName*). It describes what element you toggle |
| `data-nav` | `string` | `undefined` | Specifie **selector** of the element which you want to toggle |
| `data-show-immediately` | `boolean` | `false` | Set to true to show element immediately |
| `data-hide-immediately` | `boolean` | `false` | Set to true to hide element immediately |

## Methods

Main methods used in this component are:

- `this.show();` - Shows element which we toggle and adds global classes to `HTML` tag.

- `this.hide();` - Hides element which we toggle and removes global classes from `HTML` tag.

## Events

Events which the component emits are:

- `'nav-toggle:visible'` on component element

- global `'nav-toggle:visible'` on window with component element as detail

- `'nav-toggle:hidden'` on component element

- global `'nav-toggle:hidden'` on window with component element as detail


## Styling

Component element doesn't get any styles by default. You decide what the element represents and how it looks.
It may be for example burger button which transform to cross when menu is open.

To make component work is declaring styles to statements of element which you toggle. 

**Required style: statements of toggled element**, example: `menu-visible`. If you don't use for example `data-hide-immediately` you don't need declare styles for it.

Example:
```scss
.menu {
    // ... other properties ...
    opacity: 0;
    visibility: hidden;
	transition-timing-function: ease-in-out;
	transition-duration: 600ms;
	transition-property: opacity, visibility;

    .menu-visible & {
        opacity: 1;
        visibility: visible;
    }

    .menu-hide-immediately & { transition-duration: 0ms; }
    .menu-show-immediately & { transition-duration: 0ms; }
}
```

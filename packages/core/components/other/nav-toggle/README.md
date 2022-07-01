# NavToggle

## Registration and configuration

See [Components registration](/docs/registration.md#components) or use this:

```ts
import { NavToggle } from '@ovee.js/toolkit';

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

<nav class="header__menu">
    <ul id="menu-menu" class="menu">
        <li class="menu-item">
            <a href=""></a>
        </li>
    </ul>
</nav>
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data-nav-toggle` | `string` | `menu` | Specify the name of an element you toggle. It's responsible for assigning a class to `HTML`, for example `"menu-visible"`, so the best practice is to use the name of an element which will show/hide |
| `data-nav` | `string` | `undefined` | Pass **selector** `(class/id/tag)` of the element which you want to toggle. In this example: `.menu` |
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

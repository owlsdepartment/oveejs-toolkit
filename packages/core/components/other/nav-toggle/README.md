# NavToggle

## Registration and configuration

See [Components registration](/docs/registration.md#components) or use this:

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
| `data-nav-toggle` | `string` | `menu` | Specify the prefix describing what is toggled. Prefix will be passed to `HTML` class `"${prefix}-visible"` for kind of scope. The best practice is to use the name of an element which will show/hide |
| `data-nav` | `string` | `undefined` | Pass **selector** `(class/id/tag)` of the element which you want to toggle. In this example: `.menu` |
| `data-show-immediately` | `boolean` | `false` | Set to `true` to show element immediately |
| `data-hide-immediately` | `boolean` | `false` | Set to `true` to hide element immediately |

## Returns

- `show(immediately: boolean = false)`: Shows the navigation. If immediately is `true`, the navigation is shown without animation.
- `hide(immediately: boolean = false)`: Hides the navigation. If immediately is `true`, the navigation is hidden without animation.
- `isOpen`: Reactive reference indicating whether the navigation is open.
- `animStarted`: Reactive reference indicating whether an animation has started.
- `navElement`: Computed reference to the navigation element.
- `navName`: Computed reference to the navigation name.
- `showImmediately`: Computed reference to the `showImmediately` data attribute.
- `hideImmediately`: Computed reference to the `hideImmediately` data attribute.

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

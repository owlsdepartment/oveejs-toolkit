# BaseCookies

## Installation and configuration

See [Components installation](/docs/components_installation.md#components-installation-and-configuration)

## Usage example

This component can set certain value in local storage to `'true'`. If the value is already set as `'true'`, than component will not show.

Storage key used for this can be passed via global `options` when initializing component or via `data-storage-key` attribute. By default, `storageKey` is `cookies_accepted`.

```html
<base-cookies class="cookies" role="dialog" tabindex="-1">
	<p class="cookies__desc">Cookies description</p>
	<button class="cookies__button" type="button">I agree</button>
</base-cookies>
```

With data attribute

```html
<base-cookies class="cookies" role="dialog" tabindex="-1" data-storage-key="other_cookies">
	<p class="cookies__desc">Cookies description</p>
	<button class="cookies__button" type="button">I agree</button>
</base-cookies>
```

## API

### Options

```ts
export interface BaseCookiesOptions {
	storageKey?: string; // by default: 'storageKey'
}
```

# SplitText

## Requirements
 - `gsap`
 - `ovee.js`

This component uses GSAP's [SplitText plugin](https://greensock.com/docs/v3/Plugins/SplitText) that requires GSAP Business License.

## Registration and configuration

See [Components instalation](/docs/registration.md)

## Usage example

### Basic usage

```html
<p data-split-text>
	Lorem Ipsum
	Dolor Sit Amet
</p>
```

`SplitText` split HTML text into characters, words and lines.

### Composable

```ts
import { SplitText } from '@ovee.js/toolkit-integrations/split-text'

export const MyComponent = defineComponent(() => {
	const { st } = useComponent(SplitText);
})
```

The `SplitText` composable returns an object containing the `SplitText` instance as a `shallowRef`. This means that the reference is reactive.

### Data Parameters

Available `data-split-text` values:
- `chars`
- `words`
- `lines`

The default split type is `lines`.

You can also combine those values by separating them with commas.

```html
<p data-split-text="words, chars, lines">
	Will split text by lines,
	words and chars.
</p>
```

### CSS Classes

You can specify `CSS classes` for characters, words and lines using the parameters below:
- `data-chars-class`
- `data-words-class`
- `data-lines-class`

```html
<p
	data-split-text="lines, words"
	data-lines-class="line__wrapper"
	data-words-class="word__wrapper"
>
	Every line and word
	will get the declared class.
</p>
```

### Options

The SplitText component accepts the following options:

`windowResize: boolean` - If `true`, the component will reinitialize the split text on window resize events.

Other config options can be found [here](https://gsap.com/docs/v3/Plugins/SplitText/#special-properties)

```ts
import { SplitText } from '@ovee.js/toolkit-integrations/split-text'

createApp()
    .component(SplitText, {
		type: 'lines',
		tag: 'span',
	})
```

### Note

When configuring the `SplitText`, data attributes on the HTML element take precedence over options passed during component registration. This means that if both a data attribute and an option are provided for the same configuration property, the value from the data attribute will be used.
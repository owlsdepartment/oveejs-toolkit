# SplitText

## Requirements
 - `gsap`
 - `ovee.js`

This component uses GSAP's [SplitText plugin](https://greensock.com/docs/v3/Plugins/SplitText) that requires GSAP Business License.

## Installation and configuration

```ts
import { SplitText } from '@owlsdepartment/components';

export default [
    // ... other components ...
    SplitText
];
```

## Usage example

### Basic usage

```html
<p data-split-text>
	Lorem Ipsum
	Dolor Sit Amet
</p>
```

`SplitText` split HTML text into characters, words and lines.

### Parameters

Available `data-split-text` values:
- chars
- words
- lines

The default split type is `lines`.

You can also combine those values by separating them with spaces and/or commas.

```html
<p data-split-text="lines chars">
	Will split text by lines
	and individual chars.
</p>
```
```html
<p data-split-text="words, chars, lines">
	Will split text by lines,
	words and chars.
</p>
```

### CSS Classes

You can specify `CSS classes` for characters, words and lines using the parameters below:
- data-chars-class
- data-words-class
- data-lines-class

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
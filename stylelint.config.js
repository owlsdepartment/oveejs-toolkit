module.exports = {
	extends: ['stylelint-config-standard-scss', 'stylelint-config-html', 'stylelint-config-recommended-vue/scss'],

	plugins: ['stylelint-order'],

	rules: {
		// Color
		'color-hex-case': 'lower',
		'color-hex-length': 'short',
		'color-no-invalid-hex': true,

		// Font family
		'font-family-no-duplicate-names': true,

		// Function
		'function-comma-space-after': 'always-single-line',
		'function-parentheses-space-inside': 'never-single-line',

		// String
		'string-quotes': 'single',

		// Declaration
		'declaration-bang-space-after': 'never',
		'declaration-bang-space-before': 'always',
		'declaration-block-semicolon-newline-after': 'always',
		'declaration-block-semicolon-space-before': 'never',
		'declaration-block-single-line-max-declarations': 1,
		'declaration-block-trailing-semicolon': 'always',
		'declaration-colon-space-after': 'always-single-line',
		'declaration-colon-space-before': 'never',

		// Block
		// 'block-no-empty': true,
		'block-closing-brace-empty-line-before': 'never',
		'block-closing-brace-newline-after': ['always', { ignoreAtRules: ['if', 'else'] }],
		'block-closing-brace-newline-before': 'always-multi-line',
		'block-closing-brace-space-before': 'always-single-line',
		'block-opening-brace-newline-after': 'always-multi-line',
		'block-opening-brace-space-after': 'always-single-line',
		'block-opening-brace-space-before': 'always',

		// Selector
		// "selector-max-compound-selectors": 3,
		// TODO: change to BEM RegEx
		'selector-class-pattern': null,
		'selector-list-comma-newline-after': 'always',
		'selector-no-qualifying-type': null,
		'selector-no-vendor-prefix': true,
		'selector-pseudo-element-colon-notation': 'double',
		'selector-pseudo-element-no-unknown': true,

		// Shorthadn prop
		'shorthand-property-no-redundant-values': true,

		// Media
		// "media-feature-name-no-vendor-prefix": true,
		'media-feature-parentheses-space-inside': 'never',

		// At-rule
		'at-rule-semicolon-newline-after': 'always',
		'at-rule-no-unknown': null,
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['blockless-after-same-name-blockless', 'first-nested'],
				ignore: ['after-comment'],
				ignoreAtRules: ['else'],
			},
		],
		'at-rule-no-vendor-prefix': true,

		// General / Sheet
		'no-extra-semicolons': true,
		indentation: 'tab',
		'no-missing-end-of-source-newline': true,

		// Length
		'length-zero-no-unit': true,
		'max-line-length': [120, { ignore: ['comments'] }],

		// Number
		'number-leading-zero': 'always',
		'number-no-trailing-zeros': null,

		// Value
		// "value-no-vendor-prefix": true,

		// SCSS
		'scss/at-import-no-partial-leading-underscore': true,
		'scss/at-import-partial-extension-blacklist': ['scss'],
		'scss/at-rule-no-unknown': true,
		'scss/dollar-variable-pattern': null,
		'scss/dollar-variable-colon-space-after': 'always',
		'scss/dollar-variable-colon-space-before': 'never',
		// TODO: enable
		'scss/no-global-function-names': null,

		'order/order': [
			[
				'custom-properties',
				'dollar-variables',
				{
					type: 'at-rule',
					name: 'extend',
				},
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: false,
				},
				'declarations',
				{
					type: 'at-rule',
					name: 'include',
					hasBlock: true,
				},
				'rules',
			],
		],
		'order/properties-alphabetical-order': null,
		'order/properties-order': [
			'content',
			'display',
			'align-content',
			'align-items',
			'align-self',
			'flex',
			'flex-flow',
			'flex-basis',
			'flex-direction',
			'flex-grow',
			'flex-shrink',
			'flex-wrap',
			'justify-content',
			'order',
			'grid',
			'grid-auto-columns',
			'grid-auto-rows',
			'grid-auto-flow',
			'grid-column',
			'grid-column-end',
			'grid-column-gap',
			'grid-column-start',
			'grid-row-end',
			'grid-row-gap',
			'grid-row-start',
			'grid-template',
			'grid-template-areas',
			'grid-template-columns',
			'grid-template-rows',
			'grid-area',
			'grid-gap',
			'grid-row',
			'align-items',
			'align-self',
			'align-content',
			'justify-content',
			'justify-items',
			'justify-self',
			'place-content',
			'place-items',
			'place-self',
			'float',
			'clear',
			'width',
			'min-width',
			'max-width',
			'height',
			'min-height',
			'max-height',
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
			'padding',
			'padding-top',
			'padding-right',
			'padding-bottom',
			'padding-left',
			'position',
			'top',
			'right',
			'bottom',
			'left',
			'z-index',
			'color',
			'font',
			'font-family',
			'font-size',
			'font-weight',
			'font-style',
			'font-variant',
			'font-size-adjust',
			'font-stretch',
			'font-effect',
			'font-emphasize',
			'font-emphasize-position',
			'font-emphasize-style',
			'font-smooth',
			'line-height',
			'text-shadow',
			'text-align',
			'text-align-last',
			'vertical-align',
			'white-space',
			'text-decoration',
			'text-emphasis',
			'text-emphasis-color',
			'text-emphasis-style',
			'text-emphasis-position',
			'text-indent',
			'text-justify',
			'letter-spacing',
			'word-spacing',
			'writing-mode',
			'text-outline',
			'text-transform',
			'text-wrap',
			'text-overflow',
			'text-overflow-ellipsis',
			'text-overflow-mode',
			'word-wrap',
			'word-break',
			'tab-size',
			'hyphens',
			'visibility',
			'overflow',
			'overflow-x',
			'overflow-y',
			'-ms-overflow-x',
			'-ms-overflow-y',
			'clip',
			'zoom',
			'-webkit-box-sizing',
			'-moz-box-sizing',
			'box-sizing',
			'table-layout',
			'empty-cells',
			'caption-side',
			'border-spacing',
			'border-collapse',
			'list-style',
			'list-style-position',
			'list-style-type',
			'list-style-image',
			'quotes',
			'counter-reset',
			'counter-increment',
			'resize',
			'cursor',
			'user-select',
			'nav-index',
			'nav-up',
			'nav-right',
			'nav-down',
			'nav-left',
			'transition',
			'transition-delay',
			'transition-timing-function',
			'transition-duration',
			'transition-property',
			'transform',
			'transform-origin',
			'animation',
			'animation-name',
			'animation-duration',
			'animation-play-state',
			'animation-timing-function',
			'animation-delay',
			'animation-iteration-count',
			'animation-direction',
			'pointer-events',
			'opacity',
			'filter:progid:DXImageTransform.Microsoft.Alpha(Opacity',
			"-ms-filter:\\'progid:DXImageTransform.Microsoft.Alpha",
			'-ms-interpolation-mode',
			'border',
			'border-width',
			'border-style',
			'border-color',
			'border-top',
			'border-top-width',
			'border-top-style',
			'border-top-color',
			'border-right',
			'border-right-width',
			'border-right-style',
			'border-right-color',
			'border-bottom',
			'border-bottom-width',
			'border-bottom-style',
			'border-bottom-color',
			'border-left',
			'border-left-width',
			'border-left-style',
			'border-left-color',
			'border-radius',
			'border-top-left-radius',
			'border-top-right-radius',
			'border-bottom-right-radius',
			'border-bottom-left-radius',
			'border-image',
			'border-image-source',
			'border-image-slice',
			'border-image-width',
			'border-image-outset',
			'border-image-repeat',
			'outline',
			'outline-width',
			'outline-style',
			'outline-color',
			'outline-offset',
			'background',
			'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader',
			'background-color',
			'background-image',
			'background-repeat',
			'background-repeat-x',
			'background-repeat-y',
			'background-attachment',
			'background-position',
			'background-position-x',
			'background-position-y',
			'background-clip',
			'background-origin',
			'background-size',
			'box-decoration-break',
			'box-shadow',
			'filter:progid:DXImageTransform.Microsoft.gradient',
			"-ms-filter:\\'progid:DXImageTransform.Microsoft.gradient",
			'...',
		],
	},
};

module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
	},

	plugins: ['@typescript-eslint', 'simple-import-sort', 'lit', 'html'],

	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:lit/recommended',
	],

	ignorePatterns: ['**/dist/**/*'],

	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

		'prettier/prettier': 'warn',

		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',

		'simple-import-sort/imports': [
			'warn',
			{
				groups: [
					// Side effect imports.
					['^\\u0000'],
					// Packages.
					// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
					['^@?\\w'],
					// Absolute imports and other imports such as Vue-style `@/foo`.
					// Anything not matched in another group.
					['^', '^@core', '^@integrations'],
					// Relative imports.
					// Anything that starts with a dot.
					['^\\.'],
				],
			},
		],
		'simple-import-sort/exports': 'warn',
	},
};

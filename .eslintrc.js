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

	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

		'prettier/prettier': 'warn',

		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',

		'simple-import-sort/imports': 'warn',
		'simple-import-sort/exports': 'warn',
	},
};

import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ['dist/**']
	},
	{ files: ['**/*.{ts}'] },
	{ languageOptions: { globals: globals.node } },
	...tseslint.configs.recommended,
	{
		rules: {
			'no-console': 'error'
		}
	}
]

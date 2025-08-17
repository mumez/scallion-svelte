import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2017
			}
		}
	},
	{
		files: ['**/*.cjs'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: {
				...globals.node
			}
		}
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020,
				project: './tsconfig.json'
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: {
			'@typescript-eslint': typescript
		},
		rules: {
			...typescript.configs.recommended.rules,
			'no-undef': 'off' // TypeScript handles this
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: typescriptParser,
				extraFileExtensions: ['.svelte'],
				project: './tsconfig.json'
			},
			globals: {
				...globals.browser
			}
		},
		plugins: {
			svelte,
			'@typescript-eslint': typescript
		},
		rules: {
			...svelte.configs.recommended.rules,
			'svelte/no-at-html-tags': 'warn',
			'no-undef': 'off', // TypeScript handles this
			'no-unused-vars': 'off', // TypeScript handles this
			'@typescript-eslint/no-unused-vars': 'warn'
		}
	},
	prettier,
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/', '**/*.d.ts']
	}
];

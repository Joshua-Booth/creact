import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import storybook from 'eslint-plugin-storybook'
import depend from 'eslint-plugin-depend'
import barrel from 'eslint-plugin-barrel-files'
import globals from 'globals'

export default [
  js.configs.recommended,
  eslintReact.configs['recommended-typescript'],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  ...storybook.configs['flat/recommended'],
  depend.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    // Conservative barrel file rules - prevent export * patterns while keeping FSD-compatible explicit re-exports
    plugins: {
      'barrel-files': barrel,
    },
    rules: {
      'barrel-files/avoid-re-export-all': 'error',
    },
  },
  {
    ignores: ['dist', 'coverage', 'storybook-static', '**/*.d.ts'],
  },
]

import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  js.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  typescriptEslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: {
        ...js.configs.recommended.languageOptions.globals,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'react/react-in-jsx-scope': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    ignorePatterns: ['dist', '.d.ts'],
  },
]

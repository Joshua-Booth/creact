import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import storybook from 'eslint-plugin-storybook'
import depend from 'eslint-plugin-depend'
import barrel from 'eslint-plugin-barrel-files'
import globals from 'globals'

export default [
  js.configs.recommended,
  react.configs.flat.recommended,
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
      react,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
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
    // Disable dependency suggestions for config files (migration of eslint plugins is out of scope)
    files: ['config/**/*.js', '*.config.js', '*.config.ts'],
    rules: {
      'depend/ban-dependencies': 'off',
    },
  },
  {
    ignores: ['dist', 'coverage', 'storybook-static', '**/*.d.ts'],
  },
]

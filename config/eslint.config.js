import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import barrel from "eslint-plugin-barrel-files";
import depend from "eslint-plugin-depend";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import eslintPluginZod from "eslint-plugin-zod";
import globals from "globals";

export default [
  js.configs.recommended,
  eslintReact.configs["strict-typescript"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  ...storybook.configs["flat/recommended"],
  depend.configs["flat/recommended"],
  eslintPluginZod.configs.recommended,
  jsdoc.configs["flat/recommended-typescript-flavor"],
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
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
      "react-hooks": reactHooks,
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
      "no-undef": "off",
      // JSDoc: TypeScript already provides types in function signatures
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-param-type": "off",
      // JSDoc: disabled globally
      "jsdoc/require-jsdoc": "off",
    },
  },
  {
    // Require JSDoc for public API hooks and utilities
    files: [
      "src/shared/lib/**/*.{ts,tsx}",
      "src/shared/api/**/*.{ts,tsx}",
      "src/shared/config/**/*.ts",
      "src/entities/*/api/**/*.{ts,tsx}",
    ],
    ignores: ["**/*.stories.*", "**/*.test.*"],
    rules: {
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
    },
  },
  {
    // Conservative barrel file rules - prevent export * patterns while keeping FSD-compatible explicit re-exports
    plugins: {
      "barrel-files": barrel,
    },
    rules: {
      "barrel-files/avoid-re-export-all": "error",
    },
  },
  {
    ignores: ["dist", "coverage", "storybook-static", "**/*.d.ts"],
  },
];

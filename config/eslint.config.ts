import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import barrel from "eslint-plugin-barrel-files";
import baselineJs from "eslint-plugin-baseline-js";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import checkFile from "eslint-plugin-check-file";
import depend from "eslint-plugin-depend";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import n from "eslint-plugin-n";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import storybook from "eslint-plugin-storybook";
import unicorn from "eslint-plugin-unicorn";
import eslintPluginZod from "eslint-plugin-zod";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // JavaScript recommended
  js.configs.recommended,

  // ESLint directive comments best practices
  comments.recommended,
  {
    rules: {
      "@eslint-community/eslint-comments/disable-enable-pair": [
        "error",
        { allowWholeFile: true },
      ],
      "@eslint-community/eslint-comments/require-description": "warn",
    },
  },

  // TypeScript strict type-checked (type-aware linting)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // React
  eslintReact.configs["strict-typescript"],
  reactHooks.configs.flat.recommended,
  reactYouMightNotNeedAnEffect.configs.recommended,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- incomplete types in jsx-a11y
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      // Disabled: Base UI's render prop pattern (`render={<h1 />}`) triggers false positives
      // because ESLint can't see that useRender injects children at runtime.
      // Runtime axe-core checks in Storybook (test: "error") catch real empty-heading violations.
      "jsx-a11y/heading-has-content": "off",
    },
  },

  // Promise handling
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- incomplete types in eslint-plugin-promise
  promise.configs["flat/recommended"],

  // Code quality / smells
  // @ts-expect-error -- configs is typed as possibly undefined
  sonarjs.configs.recommended,

  // Security
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- incomplete types
  security.configs.recommended,

  // Storybook
  ...storybook.configs["flat/recommended"],

  // Tailwind CSS
  {
    files: ["**/*.tsx"],
    plugins: { "better-tailwindcss": betterTailwindcss },
    rules: {
      ...betterTailwindcss.configs.recommended.rules,
      // Correctness: errors
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-deprecated-classes": "error",
      // Stylistic: warnings (all autofixable)
      "better-tailwindcss/no-unknown-classes": [
        "warn",
        { ignore: ["^cn-", "^toaster$"] },
      ],
      // Class ordering handled by prettier-plugin-tailwindcss
      "better-tailwindcss/enforce-consistent-class-order": "off",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/enforce-canonical-classes": "warn",
      "better-tailwindcss/enforce-shorthand-classes": "warn",
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app/styles/globals.css",
      },
    },
  },

  // Dependencies
  // @ts-expect-error -- configs is typed as possibly undefined
  depend.configs["flat/recommended"],

  // Zod
  eslintPluginZod.configs.recommended,

  // Baseline JS (browser compatibility)
  { plugins: { "baseline-js": baselineJs } },
  baselineJs.configs.recommended({ available: "widely", level: "warn" }),

  // Import/export sorting (named items only - statement order handled by Prettier)
  {
    plugins: { perfectionist },
    rules: {
      // Sort named exports alphabetically: export { a, b, c }
      "perfectionist/sort-named-exports": ["error", { type: "natural" }],
      // Sort named imports alphabetically: import { a, b, c } from "x"
      "perfectionist/sort-named-imports": ["error", { type: "natural" }],
    },
  },

  // JSDoc
  jsdoc.configs["flat/recommended-typescript-flavor"],

  // Base language options
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ["tsconfig.json", "config/tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname + "/..",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // TypeScript overrides
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "no-unused-vars": "off",
      "no-undef": "off",

      // Relax some strict rules that conflict with React patterns
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],

      // SonarJS tuning
      "sonarjs/cognitive-complexity": ["error", 20],
      "sonarjs/todo-tag": "off", // TODOs are acceptable during development
      "sonarjs/no-hardcoded-passwords": "off", // Too many false positives (i18n strings, test fixtures)
      "sonarjs/prefer-read-only-props": "off", // TypeScript already enforces immutability at compile time
      "sonarjs/deprecation": "off", // Already covered by @typescript-eslint/no-deprecated

      // Security - disable overly noisy rules
      "security/detect-object-injection": "off", // Too many false positives for legitimate array access

      // TypeScript tuning - relax rules that conflict with common patterns
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],

      // Strict boolean expressions - require explicit boolean checks
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true, // Allow `if (obj)` for nullable objects
          allowNullableBoolean: true, // Allow `if (bool)` for nullable booleans
          allowNullableString: true, // Allow `if (str)` for optional string props (common in React)
          allowNullableNumber: false,
          allowNullableEnum: false,
          allowAny: false,
        },
      ],

      // Naming conventions for consistent code style
      "@typescript-eslint/naming-convention": [
        "error",
        // Default: camelCase for everything
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // Variables: camelCase, UPPER_CASE for constants, PascalCase for React components
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        // Allow Node.js __dirname, __filename
        {
          selector: "variable",
          format: null,
          filter: { regex: "^__dirname|__filename$", match: true },
        },
        // Functions: camelCase or PascalCase (for React components)
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        // Parameters: camelCase, PascalCase for Storybook Story type
        {
          selector: "parameter",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        // Types, interfaces, enums: PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        // Enum members: UPPER_CASE or PascalCase
        {
          selector: "enumMember",
          format: ["UPPER_CASE", "PascalCase"],
        },
        // Object/type properties: allow any format (for API responses, JSON-LD, HTML attributes)
        {
          selector: ["objectLiteralProperty", "typeProperty"],
          format: null,
        },
        // Import names: any format (external libraries may use different conventions)
        {
          selector: "import",
          format: null,
        },
      ],

      // JSDoc: TypeScript already provides types in function signatures
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-param-type": "off",
      // JSDoc: disabled globally
      "jsdoc/require-jsdoc": "off",
    },
  },

  // React Compiler (preparing for adoption)
  {
    plugins: { "react-compiler": reactCompiler },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },

  // Unicorn (selective modern JS patterns)
  {
    plugins: { unicorn },
    rules: {
      "unicorn/better-regex": "error",
      "unicorn/catch-error-name": "error",
      "unicorn/consistent-function-scoping": "error",
      "unicorn/error-message": "error",
      "unicorn/no-array-for-each": "error",
      "unicorn/no-array-reduce": "error",
      "unicorn/no-useless-undefined": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-at": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-modern-math-apis": "error",
      "unicorn/prefer-negative-index": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-ternary": "error",
      "unicorn/throw-new-error": "error",
      // Additional strict rules
      "unicorn/no-typeof-undefined": "error",
      "unicorn/no-unnecessary-await": "error",
      "unicorn/prefer-date-now": "error",
      "unicorn/prefer-default-parameters": "error",
      "unicorn/prefer-logical-operator-over-ternary": "error",
      "unicorn/prefer-math-min-max": "error",
      "unicorn/prefer-native-coercion-functions": "error",
      "unicorn/prefer-regexp-test": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-structured-clone": "error",
      "unicorn/prefer-switch": "error",
      "unicorn/require-number-to-fixed-digits-argument": "error",
      // Code quality and consistency rules
      "unicorn/no-empty-file": "error",
      "unicorn/no-instanceof-array": "error",
      "unicorn/no-static-only-class": "error",
      "unicorn/no-lonely-if": "error",
      "unicorn/no-negated-condition": "error",
      "unicorn/no-nested-ternary": "error",
      "unicorn/consistent-destructuring": "error",
    },
  },

  // Barrel files (FSD architecture)
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- incomplete types
    plugins: { "barrel-files": barrel },
    rules: {
      "barrel-files/avoid-re-export-all": "error",
    },
  },

  // File and folder naming conventions (kebab-case enforcement)
  {
    plugins: { "check-file": checkFile },
    ignores: ["src/app/routes/**"],
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{ts,tsx}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        { "src/**/": "KEBAB_CASE" },
      ],
    },
  },

  // Require JSDoc for public API hooks and utilities
  {
    files: [
      "src/shared/lib/**/*.{ts,tsx}",
      "src/shared/api/**/*.{ts,tsx}",
      "src/shared/config/**/*.ts",
      "src/shared/model/**/*.{ts,tsx}",
      "src/entities/*/api/**/*.{ts,tsx}",
      "src/entities/*/model/**/*.{ts,tsx}",
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

  // Require JSDoc descriptions on UI component exports
  {
    files: ["src/shared/ui/**/*.{ts,tsx}"],
    ignores: ["**/*.stories.*", "**/*.test.*", "**/index.ts"],
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
      // TypeScript + Storybook handles params/returns — don't require them for UI
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-returns-description": "off",
    },
  },

  // Unit tests (Vitest)
  {
    files: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",
      "vitest/expect-expect": "error",
      "vitest/no-identical-title": "error",
      "vitest/require-top-level-describe": "error",
      "vitest/no-conditional-expect": "error",
      // Assertion style
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-have-length": "error",
      // Test organization
      "vitest/prefer-lowercase-title": [
        "error",
        { ignoreTopLevelDescribe: true },
      ],
      "vitest/no-duplicate-hooks": "error",
    },
  },

  // Server-side files (Node.js rules)
  {
    files: ["**/*.server.ts", "**/server/**/*.ts"],
    ...n.configs["flat/recommended"],
  },

  // Scripts — build tooling, not user-facing; fs paths are safe
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "security/detect-non-literal-fs-filename": "off",
    },
  },

  // Ignores
  {
    ignores: [
      "dist",
      "coverage",
      "storybook-static",
      "test-results",
      "playwright-report",
      "**/*.d.ts",
      "tests/e2e/**",
      // Generated files
      ".react-router/**",
      ".netlify/**",
      "public/mockServiceWorker.js",
      // CommonJS config files (not type-checked)
      "config/.dependency-cruiser.js",
      // Claude Code skills/plugins
      "**/skills/**",
    ],
  },
]);

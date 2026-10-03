// Oxlint must be configured from the repo root: override globs resolve
// relative to the config file and can't reach outside its directory.
//
// Not covered compared with the previous ESLint setup:
// - @typescript-eslint/naming-convention: no Oxlint or tsgolint equivalent.
// - Type-aware rules inside JS plugins: Oxlint gives JS plugins no type info,
//   so ~26 SonarJS rules load but never report. Most duplicate TypeScript
//   strict mode or the typescript/* rules below; no-ignored-return,
//   index-of-compare-to-positive-number, no-in-misuse and
//   no-incompatible-assertion-types have no replacement.
// - eslint-plugin-n: only node/no-exports-assign is native. tsc and knip
//   cover missing and extraneous imports.
// - unicorn/consistent-destructuring and unicorn/prefer-switch: not ported.
// - jsx-a11y allowExpressionValues is ignored, so expression tabIndex values
//   on non-interactive elements need a disable comment.
import eslintReact from "@eslint-react/eslint-plugin";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import jsdoc from "eslint-plugin-jsdoc";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import sonarjs from "eslint-plugin-sonarjs";
import storybook from "eslint-plugin-storybook";
import zod from "eslint-plugin-zod";
import { defineConfig } from "oxlint";

type Rules = NonNullable<Parameters<typeof defineConfig>[0]["rules"]>;

/**
 * Enable every listed rule at "error".
 * @param names - rule names
 * @returns rules config
 */
const errors = (names: string[]): Rules =>
  Object.fromEntries(names.map((name) => [name, "error"]));

/**
 * Re-key a preset's rules under a JS plugin alias (e.g. jsdoc → jsdoc-js).
 * @param rules - preset rules
 * @param from - original plugin prefix
 * @param to - alias prefix
 * @returns rules config
 */
const alias = (rules: object, from: string, to: string): Rules =>
  Object.fromEntries(
    Object.entries(rules).map(([name, value]) => [
      name.replace(`${from}/`, `${to}/`),
      value,
    ])
  );

const [, storybookStories, storybookMain] =
  storybook.configs["flat/recommended"];

// eslint-plugin-sonarjs types its configs loosely (optional, legacy shapes)
const sonarjsRecommended = sonarjs.configs?.recommended as { rules: Rules };

const requireJsdoc: Rules[string] = [
  "warn",
  {
    publicOnly: true,
    require: {
      FunctionDeclaration: true,
      ArrowFunctionExpression: true,
      FunctionExpression: true,
    },
  },
];

export default defineConfig({
  // Only the rules below run; don't let Oxlint's default categories add more.
  categories: { correctness: "off" },
  options: {
    typeAware: true,
    reportUnusedDisableDirectives: "error",
  },
  env: { builtin: true, browser: true, node: true, es2024: true },

  plugins: [
    "typescript",
    "react",
    "jsx-a11y",
    "promise",
    "unicorn",
    "vitest",
    "node",
  ],
  // ESLint plugins with no native Oxlint port run through the JS plugin layer.
  // Native plugin names are reserved, so eslint-plugin-jsdoc loads as jsdoc-js.
  jsPlugins: [
    "@eslint-community/eslint-plugin-eslint-comments",
    "@eslint-react/eslint-plugin",
    "eslint-plugin-react-you-might-not-need-an-effect",
    "eslint-plugin-sonarjs",
    "eslint-plugin-security",
    "eslint-plugin-zod",
    "eslint-plugin-depend",
    "eslint-plugin-perfectionist",
    "eslint-plugin-barrel-files",
    "eslint-plugin-check-file",
    { name: "jsdoc-js", specifier: "eslint-plugin-jsdoc" },
  ],

  settings: {
    ...eslintReact.configs["strict-typescript"].settings,
    // Plugin settings aren't supported inside overrides, so they live here.
    "better-tailwindcss": { entryPoint: "src/app/styles/globals.css" },
  },

  rules: {
    // JavaScript recommended (rules TypeScript already enforces are omitted)
    ...errors([
      "for-direction",
      "no-async-promise-executor",
      "no-case-declarations",
      "no-compare-neg-zero",
      "no-cond-assign",
      "no-constant-binary-expression",
      "no-constant-condition",
      "no-control-regex",
      "no-debugger",
      "no-delete-var",
      "no-dupe-else-if",
      "no-duplicate-case",
      "no-empty",
      "no-empty-character-class",
      "no-empty-pattern",
      "no-empty-static-block",
      "no-ex-assign",
      "no-extra-boolean-cast",
      "no-fallthrough",
      "no-global-assign",
      "no-invalid-regexp",
      "no-irregular-whitespace",
      "no-loss-of-precision",
      "no-misleading-character-class",
      "no-nonoctal-decimal-escape",
      "no-prototype-builtins",
      "no-regex-spaces",
      "no-self-assign",
      "no-shadow-restricted-names",
      "no-sparse-arrays",
      "no-unassigned-vars",
      "no-unexpected-multiline",
      "no-unsafe-finally",
      "no-unsafe-optional-chaining",
      "no-unused-labels",
      "no-unused-private-class-members",
      "no-useless-assignment",
      "no-useless-backreference",
      "no-useless-catch",
      "no-useless-escape",
      "preserve-caught-error",
      "require-yield",
      "use-isnan",
      "valid-typeof",
      // Extension rules from typescript-eslint's strict preset
      "no-array-constructor",
      "no-empty-function",
      "no-unused-expressions",
      "no-useless-constructor",
      // typescript-eslint's eslint-recommended additions
      "no-var",
      "prefer-const",
      "prefer-rest-params",
      "prefer-spread",
      // Native stand-ins for type-aware SonarJS rules (see note below)
      "array-callback-return",
    ]),
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

    // ESLint directive comments best practices
    ...errors([
      "@eslint-community/eslint-comments/no-aggregating-enable",
      "@eslint-community/eslint-comments/no-duplicate-disable",
      "@eslint-community/eslint-comments/no-unlimited-disable",
      "@eslint-community/eslint-comments/no-unused-enable",
    ]),
    "@eslint-community/eslint-comments/disable-enable-pair": [
      "error",
      { allowWholeFile: true },
    ],
    "@eslint-community/eslint-comments/require-description": "warn",

    // TypeScript strict + stylistic type-checked (type-aware rules via tsgolint)
    ...errors([
      "typescript/adjacent-overload-signatures",
      "typescript/array-type",
      "typescript/await-thenable",
      "typescript/ban-tslint-comment",
      "typescript/class-literal-property-style",
      "typescript/consistent-generic-constructors",
      "typescript/consistent-indexed-object-style",
      "typescript/consistent-type-assertions",
      "typescript/consistent-type-definitions",
      "typescript/consistent-type-exports",
      "typescript/consistent-type-imports",
      "typescript/dot-notation",
      "typescript/no-array-delete",
      "typescript/no-base-to-string",
      "typescript/no-confusing-non-null-assertion",
      "typescript/no-deprecated",
      "typescript/no-duplicate-enum-values",
      "typescript/no-duplicate-type-constituents",
      "typescript/no-dynamic-delete",
      "typescript/no-empty-object-type",
      "typescript/no-explicit-any",
      "typescript/no-extra-non-null-assertion",
      "typescript/no-extraneous-class",
      "typescript/no-floating-promises",
      "typescript/no-for-in-array",
      "typescript/no-implied-eval",
      "typescript/no-inferrable-types",
      "typescript/no-invalid-void-type",
      "typescript/no-meaningless-void-operator",
      "typescript/no-misused-new",
      "typescript/no-misused-promises",
      "typescript/no-misused-spread",
      "typescript/no-mixed-enums",
      "typescript/no-namespace",
      "typescript/no-non-null-asserted-nullish-coalescing",
      "typescript/no-non-null-asserted-optional-chain",
      "typescript/no-non-null-assertion",
      "typescript/no-redundant-type-constituents",
      "typescript/no-require-imports",
      "typescript/no-this-alias",
      "typescript/no-unnecessary-boolean-literal-compare",
      "typescript/no-unnecessary-condition",
      "typescript/no-unnecessary-template-expression",
      "typescript/no-unnecessary-type-arguments",
      "typescript/no-unnecessary-type-assertion",
      "typescript/no-unnecessary-type-constraint",
      "typescript/no-unnecessary-type-conversion",
      "typescript/no-unnecessary-type-parameters",
      "typescript/no-unsafe-argument",
      "typescript/no-unsafe-assignment",
      "typescript/no-unsafe-call",
      "typescript/no-unsafe-declaration-merging",
      "typescript/no-unsafe-enum-comparison",
      "typescript/no-unsafe-function-type",
      "typescript/no-unsafe-member-access",
      "typescript/no-unsafe-return",
      "typescript/no-unsafe-unary-minus",
      "typescript/no-useless-default-assignment",
      "typescript/no-wrapper-object-types",
      "typescript/non-nullable-type-assertion-style",
      "typescript/only-throw-error",
      "typescript/prefer-as-const",
      "typescript/prefer-find",
      "typescript/prefer-for-of",
      "typescript/prefer-function-type",
      "typescript/prefer-includes",
      "typescript/prefer-literal-enum-member",
      "typescript/prefer-namespace-keyword",
      "typescript/prefer-nullish-coalescing",
      "typescript/prefer-optional-chain",
      "typescript/prefer-promise-reject-errors",
      "typescript/prefer-reduce-type-parameter",
      "typescript/prefer-regexp-exec",
      "typescript/prefer-return-this-type",
      "typescript/prefer-string-starts-ends-with",
      "typescript/related-getter-setter-pairs",
      "typescript/require-await",
      "typescript/triple-slash-reference",
      "typescript/unbound-method",
      "typescript/unified-signatures",
      "typescript/use-unknown-in-catch-callback-variable",
      // Native stand-in for SonarJS no-alphabetical-sort
      "typescript/require-array-sort-compare",
    ]),
    "typescript/ban-ts-comment": ["error", { minimumDescriptionLength: 10 }],
    "typescript/no-confusing-void-expression": [
      "error",
      { ignoreArrowShorthand: true },
    ],
    "typescript/restrict-plus-operands": [
      "error",
      {
        allowAny: false,
        allowBoolean: false,
        allowNullish: false,
        allowNumberAndString: false,
        allowRegExp: false,
      },
    ],
    "typescript/restrict-template-expressions": [
      "error",
      { allowNumber: true },
    ],
    "typescript/return-await": ["error", "error-handling-correctness-only"],
    // Strict boolean expressions - require explicit boolean checks
    "typescript/strict-boolean-expressions": [
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

    // React
    ...eslintReact.configs["strict-typescript"].rules,
    ...errors([
      "react/error-boundaries",
      "react/globals",
      "react/immutability",
      "react/purity",
      "react/refs",
      "react/rules-of-hooks",
      "react/set-state-in-effect",
      "react/set-state-in-render",
      "react/static-components",
      "react/use-memo",
      "react/preserve-manual-memoization",
    ]),
    "react/exhaustive-deps": "warn",
    "react/incompatible-library": "warn",
    "react/unsupported-syntax": "warn",
    ...reactYouMightNotNeedAnEffect.configs.recommended.rules,

    // Accessibility (jsx-a11y recommended)
    ...errors([
      "jsx-a11y/alt-text",
      "jsx-a11y/anchor-has-content",
      "jsx-a11y/anchor-is-valid",
      "jsx-a11y/aria-activedescendant-has-tabindex",
      "jsx-a11y/aria-props",
      "jsx-a11y/aria-proptypes",
      "jsx-a11y/aria-role",
      "jsx-a11y/aria-unsupported-elements",
      "jsx-a11y/autocomplete-valid",
      "jsx-a11y/click-events-have-key-events",
      "jsx-a11y/html-has-lang",
      "jsx-a11y/iframe-has-title",
      "jsx-a11y/img-redundant-alt",
      "jsx-a11y/label-has-associated-control",
      "jsx-a11y/media-has-caption",
      "jsx-a11y/mouse-events-have-key-events",
      "jsx-a11y/no-access-key",
      "jsx-a11y/no-autofocus",
      "jsx-a11y/no-distracting-elements",
      "jsx-a11y/no-redundant-roles",
      "jsx-a11y/role-has-required-aria-props",
      "jsx-a11y/role-supports-aria-props",
      "jsx-a11y/scope",
      "jsx-a11y/tabindex-no-positive",
    ]),
    "jsx-a11y/interactive-supports-focus": [
      "error",
      {
        tabbable: [
          "button",
          "checkbox",
          "link",
          "searchbox",
          "spinbutton",
          "switch",
          "textbox",
        ],
      },
    ],
    "jsx-a11y/no-interactive-element-to-noninteractive-role": [
      "error",
      { tr: ["none", "presentation"], canvas: ["img"] },
    ],
    "jsx-a11y/no-noninteractive-element-interactions": [
      "error",
      {
        handlers: [
          "onClick",
          "onError",
          "onLoad",
          "onMouseDown",
          "onMouseUp",
          "onKeyPress",
          "onKeyDown",
          "onKeyUp",
        ],
        alert: ["onKeyUp", "onKeyDown", "onKeyPress"],
        body: ["onError", "onLoad"],
        dialog: ["onKeyUp", "onKeyDown", "onKeyPress"],
        iframe: ["onError", "onLoad"],
        img: ["onError", "onLoad"],
      },
    ],
    "jsx-a11y/no-noninteractive-element-to-interactive-role": [
      "error",
      {
        ul: [
          "listbox",
          "menu",
          "menubar",
          "radiogroup",
          "tablist",
          "tree",
          "treegrid",
        ],
        ol: [
          "listbox",
          "menu",
          "menubar",
          "radiogroup",
          "tablist",
          "tree",
          "treegrid",
        ],
        li: [
          "menuitem",
          "menuitemradio",
          "menuitemcheckbox",
          "option",
          "row",
          "tab",
          "treeitem",
        ],
        table: ["grid"],
        td: ["gridcell"],
        fieldset: ["radiogroup", "presentation"],
      },
    ],
    "jsx-a11y/no-noninteractive-tabindex": [
      "error",
      { tags: [], roles: ["tabpanel"], allowExpressionValues: true },
    ],
    "jsx-a11y/no-static-element-interactions": [
      "error",
      {
        allowExpressionValues: true,
        handlers: [
          "onClick",
          "onMouseDown",
          "onMouseUp",
          "onKeyPress",
          "onKeyDown",
          "onKeyUp",
        ],
      },
    ],

    // Promise handling
    ...errors([
      "promise/always-return",
      "promise/catch-or-return",
      "promise/no-new-statics",
      "promise/no-return-wrap",
      "promise/param-names",
    ]),
    "promise/no-callback-in-promise": "warn",
    "promise/no-nesting": "warn",
    "promise/no-promise-in-callback": "warn",
    "promise/no-return-in-finally": "warn",
    "promise/valid-params": "warn",

    // Code quality / smells
    ...sonarjsRecommended.rules,
    "sonarjs/cognitive-complexity": ["error", 20],
    "sonarjs/todo-tag": "off", // TODOs are acceptable during development
    "sonarjs/no-hardcoded-passwords": "off", // Too many false positives (i18n strings, test fixtures)
    "sonarjs/prefer-read-only-props": "off", // TypeScript already enforces immutability at compile time
    "sonarjs/deprecation": "off", // Already covered by typescript/no-deprecated

    // Security (eslint-plugin-security recommended; object-injection omitted —
    // too many false positives for legitimate array access)
    "security/detect-bidi-characters": "warn",
    "security/detect-buffer-noassert": "warn",
    "security/detect-child-process": "warn",
    "security/detect-disable-mustache-escape": "warn",
    "security/detect-eval-with-expression": "warn",
    "security/detect-new-buffer": "warn",
    "security/detect-no-csrf-before-method-override": "warn",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-non-literal-require": "warn",
    "security/detect-possible-timing-attacks": "warn",
    "security/detect-pseudoRandomBytes": "warn",
    "security/detect-unsafe-regex": "warn",

    // Dependencies, Zod
    "depend/ban-dependencies": "error",
    ...zod.configs.recommended.rules,

    // Import/export sorting (named items only - statement order handled by Oxfmt)
    "perfectionist/sort-named-exports": ["error", { type: "natural" }],
    "perfectionist/sort-named-imports": ["error", { type: "natural" }],

    // JSDoc: TypeScript already provides types in function signatures
    ...alias(
      jsdoc.configs["flat/recommended-typescript-flavor"].rules ?? {},
      "jsdoc",
      "jsdoc-js"
    ),
    "jsdoc-js/require-returns-type": "off",
    "jsdoc-js/require-param-type": "off",
    "jsdoc-js/require-jsdoc": "off",

    // Unicorn (selective modern JS patterns)
    ...errors([
      "unicorn/catch-error-name",
      "unicorn/consistent-function-scoping",
      "unicorn/error-message",
      "unicorn/no-array-for-each",
      "unicorn/no-array-reduce",
      "unicorn/prefer-array-find",
      "unicorn/prefer-array-flat-map",
      "unicorn/prefer-array-some",
      "unicorn/prefer-at",
      "unicorn/prefer-includes",
      "unicorn/prefer-modern-math-apis",
      "unicorn/prefer-negative-index",
      "unicorn/prefer-number-properties",
      "unicorn/prefer-optional-catch-binding",
      "unicorn/prefer-string-replace-all",
      "unicorn/prefer-ternary",
      "unicorn/throw-new-error",
      "unicorn/no-typeof-undefined",
      "unicorn/no-unnecessary-await",
      "unicorn/prefer-date-now",
      "unicorn/prefer-default-parameters",
      "unicorn/prefer-logical-operator-over-ternary",
      "unicorn/prefer-math-min-max",
      "unicorn/prefer-native-coercion-functions",
      "unicorn/prefer-regexp-test",
      "unicorn/prefer-set-has",
      "unicorn/prefer-spread",
      "unicorn/prefer-string-slice",
      "unicorn/prefer-structured-clone",
      "unicorn/require-number-to-fixed-digits-argument",
      "unicorn/no-empty-file",
      "unicorn/no-instanceof-builtins",
      "unicorn/no-static-only-class",
      "unicorn/no-lonely-if",
      "unicorn/no-negated-condition",
      "unicorn/no-nested-ternary",
      // Native stand-in for SonarJS no-misleading-array-reverse
      "unicorn/no-array-reverse",
    ]),
    "unicorn/no-useless-undefined": ["error", { checkArguments: false }],

    // Barrel files (FSD architecture)
    "barrel-files/avoid-re-export-all": "error",
  },

  overrides: [
    // Storybook
    {
      // Oxlint globs don't support the preset's extglob patterns
      files: ["**/*.stories.{ts,tsx}"],
      jsPlugins: ["eslint-plugin-storybook"],
      rules: {
        ...storybookStories.rules,
        // Render callbacks are intentionally lowercase per project convention
        // (must spread {...args}), so hooks are called inside `render`.
        "react/rules-of-hooks": "off",
        "@eslint-react/rules-of-hooks": "off",
      },
    },
    {
      files: [".storybook/main.ts"],
      jsPlugins: ["eslint-plugin-storybook"],
      rules: storybookMain.rules,
    },

    // Data-grid module: ported from diceui. Inline component factories,
    // ref-access patterns, and defensive checks are intentional.
    {
      files: ["src/shared/ui/data-grid/**", "src/shared/lib/data-grid/**"],
      rules: {
        "@eslint-react/static-components": "off",
        "@eslint-react/purity": "off",
        "@eslint-react/exhaustive-deps": "off",
        "react/purity": "off",
      },
    },

    // Tailwind CSS
    {
      files: ["**/*.tsx"],
      jsPlugins: ["eslint-plugin-better-tailwindcss"],
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
        // Class ordering handled by Oxfmt's sortTailwindcss
        "better-tailwindcss/enforce-consistent-class-order": "off",
        "better-tailwindcss/enforce-consistent-line-wrapping": "off",
        "better-tailwindcss/enforce-canonical-classes": "warn",
        "better-tailwindcss/enforce-shorthand-classes": "warn",
      },
    },

    // File and folder naming conventions (kebab-case enforcement)
    {
      files: ["**/*.{ts,tsx}"],
      excludeFiles: ["src/app/routes/**"],
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
      excludeFiles: ["**/*.stories.*", "**/*.test.*"],
      rules: { "jsdoc-js/require-jsdoc": requireJsdoc },
    },

    // Require JSDoc descriptions on UI component exports
    {
      files: ["src/shared/ui/**/*.{ts,tsx}"],
      excludeFiles: ["**/*.stories.*", "**/*.test.*", "**/index.ts"],
      rules: {
        "jsdoc-js/require-jsdoc": requireJsdoc,
        // TypeScript + Storybook handles params/returns — don't require them for UI
        "jsdoc-js/require-param": "off",
        "jsdoc-js/require-returns": "off",
        "jsdoc-js/require-param-description": "off",
        "jsdoc-js/require-returns-description": "off",
      },
    },

    // Unit tests (Vitest)
    {
      files: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
      rules: {
        ...errors([
          "vitest/expect-expect",
          "vitest/no-commented-out-tests",
          "vitest/no-conditional-expect",
          "vitest/no-disabled-tests",
          "vitest/no-duplicate-hooks",
          "vitest/no-focused-tests",
          "vitest/no-identical-title",
          "vitest/no-import-node-test",
          "vitest/no-interpolation-in-snapshots",
          "vitest/no-mocks-import",
          "vitest/no-standalone-expect",
          "vitest/no-unneeded-async-expect-function",
          "vitest/prefer-called-exactly-once-with",
          "vitest/prefer-to-be",
          "vitest/prefer-to-have-length",
          "vitest/require-local-test-context-for-concurrent-snapshots",
          "vitest/require-top-level-describe",
          "vitest/valid-describe-callback",
          "vitest/valid-expect",
          "vitest/valid-expect-in-promise",
          "vitest/valid-title",
        ]),
        "vitest/consistent-test-it": ["error", { fn: "it" }],
        "vitest/prefer-lowercase-title": [
          "error",
          { ignoreTopLevelDescribe: true },
        ],
      },
    },

    // Server-side files (Node.js rules)
    {
      files: ["**/*.server.ts", "**/server/**/*.ts"],
      rules: { "node/no-exports-assign": "error" },
    },

    // Scripts — build tooling, not user-facing; fs paths are safe
    {
      files: ["scripts/**/*.ts"],
      rules: { "security/detect-non-literal-fs-filename": "off" },
    },
  ],

  ignorePatterns: [
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
    // Claude Code skills/plugins and local tooling (gitignored)
    "**/skills/**",
    ".claude/**",
  ],
});

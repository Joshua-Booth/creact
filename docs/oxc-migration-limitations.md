# OXC Migration Limitations

Limitations of the ESLint + Prettier to Oxlint + Oxfmt migration.

## Oxfmt (Formatter)

### No classname line-wrapping

Oxfmt does not support wrapping long Tailwind CSS class strings across multiple lines. The old `prettier-plugin-classnames` plugin handled this in Prettier. Oxfmt doesn't support Prettier plugins — they're JavaScript-based and incompatible with oxfmt's Rust architecture.

The `better-tailwindcss/enforce-consistent-line-wrapping` linter rule can wrap classnames via `--fix-suggestions`, but oxfmt then collapses them back to single-line strings. The rule is set to `"warn"` to avoid a formatter/linter conflict cycle. This results in ~450 warnings in lint output.

**Workaround:** Disable the rule entirely or keep as warning.
**Tracking:** Request upstream support in oxfmt for classname wrapping.

### Formatting requires two passes for idempotency

Oxfmt occasionally needs two consecutive runs to reach a stable output, particularly when import sorting interacts with other formatting. Running `oxfmt` once may leave files that still differ on a second run.

**Workaround:** Run `mise run format` twice before checking. This is a known beta behavior.

### Ignore file must live at project root

Oxfmt's `--ignore-path` resolves patterns relative to the ignore file's location, not the working directory. Placing `.oxfmtignore` in `config/` caused patterns like `public/mockServiceWorker.js` to silently not match. The ignore file was moved to the project root.

### Import sorting: side-effect imports need explicit handling

Bare side-effect imports like `import "i18next"` don't match `value-external` and fall into the `unknown` group. They must be explicitly added to a custom group or grouped with `unknown` alongside externals. The `side_effect` and `side_effect_style` group types exist but aren't well-documented.

### Import ordering is close but not identical to Prettier

The old `@ianvs/prettier-plugin-sort-imports` config defined exact import statement ordering with regex patterns for each FSD layer. Oxfmt's `sortImports` uses a group-based system that achieves a similar result but with differences:

- **Types mixed with values:** The old config separated all type imports to the top. Oxfmt groups `type-external` and `value-external` together (e.g., `import type { X } from "ky"` sits next to `import { Y } from "ky"`). This was an intentional choice to keep related imports together.
- **FSD sub-layers not individually ordered:** The old config ordered `@/shared/api` before `@/shared/config` before `@/shared/lib`, etc. Oxfmt groups all `@/shared/*` imports together and sorts alphabetically within the group.
- **Custom groups require glob patterns:** Each internal path alias needs an explicit `elementNamePattern` entry. New aliases (e.g., a new FSD layer) must be manually added to both the custom group and the `groups` array.

Current group order:

1. Node builtins (`node:fs`, `node:path`)
2. React core (`react`, `react-dom`, `react-router`)
3. React ecosystem (`react-hook-form`, `react-i18next`, `i18next`)
4. External packages (types and values together, side-effect imports)
5. Internal FSD layers (`@/app` > `@/pages` > `@/widgets` > `@/features` > `@/entities` > `@/shared/*` > `@/storybook/*`)
6. Relative imports (types, then values)
7. CSS/style side-effect imports

## Oxlint (Linter)

### JS plugin overrides don't fully work

Oxlint's override mechanism (`overrides` with `files` and `rules`) does not reliably disable rules from JS plugins. For example, disabling `check-file/filename-naming-convention` for `src/app/routes/**` via an override had no effect. The workaround was to disable check-file globally and re-enable it in an override for specific directories.

Similarly, `security/detect-non-literal-fs-filename: "off"` for `scripts/**/*.ts` didn't work through the JS plugin layer.

### Plugin settings not supported in overrides

Oxlint does not support plugin-specific `settings` within overrides. The `better-tailwindcss` entry point setting (`entryPoint`) had to be moved to the top-level `settings` object. The migration tool warns about this.

### Some ESLint disable comments not recognized

Existing `eslint-disable` comments reference ESLint rule names (e.g., `@typescript-eslint/no-non-null-assertion`). The `@eslint-community/eslint-comments/disable-enable-pair` rule running as a JS plugin doesn't properly respect the `allowWholeFile: true` option, flagging whole-file disables as errors. The rule was disabled.

### Stricter detection than ESLint for some rules

Several rules produce warnings that ESLint did not:

| Rule | Count | Notes |
|------|-------|-------|
| `react-hooks-extra/no-direct-set-state-in-use-effect` | 3 | Existing eslint-disable comments use old rule names |
| `react-dom/no-dangerously-set-innerhtml` | 2 | Intentional usage in chart/json-ld components |
| `react-web-api/no-leaked-event-listener` | 2 | False positive in data-grid |
| `jsx-a11y/role-has-required-aria-props` | 2 | Shadcn combobox component |
| `jsx-a11y/role-supports-aria-props` | 1 | Shadcn select component |
| `jsx-a11y/no-redundant-roles` | 1 | Shadcn pagination component |

These are downgraded to warnings. The jsx-a11y differences are likely from running the plugin as a JS plugin rather than the native oxlint implementation.

### `--fix` vs `--fix-suggestions` for JS plugins

Native oxlint rules auto-fix with `--fix`, but JS plugin fixes require `--fix-suggestions`. The lint tasks use both flags. The `--fix-suggestions` flag applies fixes that "may alter behavior," which is a broader scope than ESLint's auto-fix.

### tsgolint (TypeScript 7) incompatibility with `baseUrl`

The `baseUrl` tsconfig option was removed in TypeScript 7, which tsgolint is based on. The project's tsconfig used `baseUrl: ".."` for path resolution. This was fixed by removing `baseUrl` and adjusting `paths` to use `../` relative paths, which works for both TypeScript 5.x and tsgolint.

### `@eslint-react` plugin version pinned to v2.x

The `@eslint-react` sub-packages (`eslint-plugin-react-x`, `eslint-plugin-react-dom`, etc.) are pinned to v2.13.0 because v3.0.0 renamed/removed several rules that the migration tool generated config for. Upgrading requires remapping rule names.

### Rules intentionally disabled or downgraded vs ESLint

These rules were active in the ESLint config but had to be disabled or downgraded in oxlint due to false positives, JS plugin incompatibilities, or stricter detection:

| Rule | ESLint | Oxlint | Reason |
|------|--------|--------|--------|
| `sonarjs/void-use` | error | off | `void` is a common React pattern for discarding promises. ESLint's sonarjs didn't flag these. |
| `jsdoc/require-param` | warn | off | Overfired through JS plugin layer — flagged ~291 functions that ESLint did not. |
| `jsdoc/require-returns` | warn | off | Same issue — ~357 false positives vs ESLint baseline. |
| `jsdoc/require-returns-description` | warn | off | Disabled alongside require-returns. |
| `jsdoc/require-param-description` | warn | off | Disabled alongside require-param. |
| `jsdoc/require-property-type` | warn | off | TypeScript provides types; disabled to match ESLint behavior. |
| `@eslint-community/eslint-comments/disable-enable-pair` | error (allowWholeFile) | off | `allowWholeFile` option not respected through JS plugin layer. |
| `security/detect-non-literal-fs-filename` | warn (off for scripts) | off | Override for scripts didn't work; disabled globally. |
| `security/detect-object-injection` | off | off | Already off in ESLint (too many false positives). |
| `react-x/no-unnecessary-use-memo` | warn | off | Oxlint detected 19 cases ESLint did not. |
| `react-x/no-unnecessary-use-callback` | warn | off | Oxlint detected 3 cases ESLint did not. |
| `jsx-a11y/no-redundant-roles` | error | warn | Shadcn component flagged by oxlint but not ESLint. |
| `jsx-a11y/role-has-required-aria-props` | error | warn | Shadcn combobox flagged by oxlint but not ESLint. |
| `jsx-a11y/role-supports-aria-props` | error | warn | Shadcn select flagged by oxlint but not ESLint. |
| `better-tailwindcss/enforce-consistent-line-wrapping` | N/A | warn | New rule; conflicts with oxfmt (see formatter section). |

### JS plugins alpha stability

Oxlint's JS plugin compatibility layer reached alpha on March 11, 2026. The 15 JS plugins used in this project run through this layer. While functional, edge cases in rule options, override handling, and settings may behave differently than in ESLint.

### Knip cannot trace oxlint JS plugin dependencies

Knip's oxlint plugin reads `.oxlintrc.json` but does not trace the `jsPlugins` array or override-level `jsPlugins` to detect which npm packages are in use. All 18 JS plugin packages and `oxlint-tsgolint` had to be manually added to `ignoreDependencies` in `knip.config.ts`. If a JS plugin is added or removed from the oxlint config, the knip config must be updated manually to match.

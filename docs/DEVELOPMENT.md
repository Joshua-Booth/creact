# Development

Every task is in `mise.toml`. `mise tasks ls` lists them with their aliases, like `mise run b` for build and `mise run t` for test.

## Generators

[Plop] scaffolds Feature-Sliced slices and UI components from `config/plop-templates`:

```sh
mise run generate       # Interactive prompt (alias: mise run g)
```

### Slice

Scaffold a feature, entity, widget or page with the segments you pick:

```sh
mise run g -- slice
```

It asks for the layer, a kebab-case name and the segments (ui, api, model, lib, config). It writes the slice's `index.ts`, a component with a story, and a placeholder for each segment. For layer `features`, name `auth` and segments `ui, api, model`:

```
src/features/auth/
  index.ts                    # Root barrel (always generated)
  ui/auth.tsx                 # Component
  ui/auth.stories.tsx         # CSF Factories story
  api/auth.ts                 # Segment placeholder
  model/auth.ts               # Segment placeholder
```

### UI component

Scaffold a UI component that isn't from shadcn:

```sh
mise run g -- ui
```

It writes `src/shared/ui/{name}/{name}.tsx`, `{name}.stories.tsx` and an `index.ts`.

## Tests

```sh
mise run test         # Unit and component tests with Vitest (alias: mise run t)
mise run test:all     # All tests in single-run mode (alias: mise run ta)
mise run test:ui      # Open the Vitest UI (alias: mise run tui)
mise run test:e2e     # End-to-end tests with Playwright (alias: mise run te)
mise run coverage     # Coverage report (alias: mise run tc)
mise run mutation     # Mutation testing with Stryker, report only (alias: mise run mt)
```

### API mocks

The E2E tests mock the API with `@msw/playwright`. The mocks live in `tests/e2e/mocks/`.

Define handlers in `tests/e2e/mocks/handlers.ts`:

```ts
import { http, HttpResponse } from "msw/http";

export const handlers = [
  http.post("**/auth/login/", () => {
    return HttpResponse.json({ key: "mock-token" }, { status: 200 });
  }),
];

export const errorResponses = {
  login: {
    invalidCredentials: () =>
      http.post("**/auth/login/", () => {
        return HttpResponse.json(
          { non_field_errors: ["Unable to log in with provided credentials."] },
          { status: 401 }
        );
      }),
  },
};
```

Use them in a test with the `network` fixture:

```ts
import { errorResponses } from "./mocks";
import { expect, test } from "./playwright.setup";

test("user can login", async ({ network: _network, page }) => {
  // Default handlers are applied automatically
  await page.goto("/login");
  // ...
});

test("shows error for invalid credentials", async ({ network, page }) => {
  // Override default handler for this test
  await network.use(errorResponses.login.invalidCredentials());
  await page.goto("/login");
  // ...
});
```

## Code quality

```sh
mise run fix          # Fix every auto-fixable issue (alias: mise run x)
mise run lint         # Oxlint (alias: mise run l)
mise run stylelint    # stylelint (alias: mise run sl)
mise run typecheck    # TypeScript (alias: mise run tt)
mise run format       # Oxfmt (alias: mise run f)
mise run knip         # Unused code, exports and dependencies (alias: mise run k)
mise run spell        # cspell (alias: mise run sp)
mise run steiger      # Feature-Sliced Design linter
mise run depcruise    # Import cycles (alias: mise run dc)
```

Oxlint runs type-aware rules through `oxlint-tsgolint`, and ESLint plugins with no native port (SonarJS, ESLint React, better-tailwindcss and others) through its alpha [JS plugin layer](https://oxc.rs/docs/guide/usage/linter/js-plugins). These rules couldn't come across from ESLint:

- `@typescript-eslint/naming-convention`
- the type-aware SonarJS rules, as Oxlint gives JS plugins no type info. Most repeat TypeScript's strict mode, but `no-ignored-return`, `index-of-compare-to-positive-number`, `no-in-misuse` and `no-incompatible-assertion-types` have no replacement.
- most of `eslint-plugin-n`, as tsc and knip cover missing and extra imports
- `unicorn/consistent-destructuring` and `unicorn/prefer-switch`

Note: Oxfmt has no equivalent of `prettier-plugin-classnames`, so long Tailwind class strings stay on one line. If you wrap a class string by hand, `mise run format` may need a second run before `format:check` passes.

## Other tasks

```sh
mise run clean           # Clean build artifacts
mise run build:analyze   # Analyse bundle size (alias: mise run ba)
mise run release         # Create a new release
mise run steiger:fix     # Steiger with auto-fix (alias: mise run sf)
mise run storybook:build # Build the Storybook static site (alias: mise run sbb)
mise run coverage:all    # All tests with coverage, merged (alias: mise run tca)
mise run coverage:e2e    # E2E tests with coverage (alias: mise run tec)
mise run coverage:merge  # Merge coverage reports (alias: mise run tcm)
mise run coverage:serve  # Serve the coverage report (alias: mise run tcs)
mise run test:e2e:ui     # E2E tests in UI mode (alias: mise run teu)
mise run test:storybook  # Storybook component tests (alias: mise run tsb)
mise run knip:fix        # Remove unused exports (alias: mise run kf)
mise run typegen         # Generate React Router route types
```

[plop]: https://plopjs.com/

# Registry

creact is also a [shadcn registry], so other projects can pull its components, theme and tooling config. Every file lands at the path it has in creact, such as `src/shared/ui/dialog/dialog.tsx`, whatever the project's `components.json` aliases say.

| Project | Run `shadcn add` in | Setup |
| --- | --- | --- |
| A creact app | the root | None. |
| A create-creact app on Tailwind | `apps/web` | Point `aliases.ui` inside `apps/web`, then wire the app. |
| Any other app on Tailwind CSS v4 | the root | The `@/*` path alias pointing at `./src/*`, then wire the app. |

## Add items to a creact app

```sh
pnpm dlx shadcn@latest add Joshua-Booth/creact/theme Joshua-Booth/creact/data-table
```

Don't add `i18n` to a creact app. It already has its strings, and shadcn would ask to overwrite them.

## Add items to a create-creact app

In `apps/web/components.json`, set `aliases.ui` to `@/components/ui`. With the default, which points at `packages/ui`, shadcn installs every item's packages into `packages/ui` and `apps/web` stops type-checking. shadcn's own components then go to `apps/web/src/components/ui`, unless you add them from `packages/ui`.

Then add items from `apps/web`:

```sh
cd apps/web
pnpm dlx shadcn@latest add Joshua-Booth/creact/theme Joshua-Booth/creact/i18n Joshua-Booth/creact/data-table
```

The theme lands in `packages/ui/src/styles/globals.css`, the stylesheet `apps/web` already imports. Then [wire the app](#wire-the-app).

## Add items to a new Vite app

```sh
pnpm dlx shadcn@latest init -t vite -n my-app -b base -p vega
cd my-app
pnpm dlx shadcn@latest add Joshua-Booth/creact/theme Joshua-Booth/creact/i18n Joshua-Booth/creact/data-table
```

`-b base -p vega` gives the `base-vega` style creact uses, on Base UI with Inter. `shadcn init -d` picks `base-nova` instead, which also imports Geist next to the theme's Inter. Then [wire the app](#wire-the-app).

## Wire the app

creact apps do this already. Elsewhere, `shadcn add` prints a note for each of these when an item needs it.

- **Labels.** Components translate their labels with react-i18next. Add the `i18n` item, then call `initI18n()` once before the first render, or labels show their keys, like `dataTable.view`:

  ```ts
  import { initI18n } from "@/shared/i18n";

  initI18n();
  ```

- **URL state.** `data-table` keeps its filters, sorting and page in the URL with nuqs, so the page goes blank outside a `NuqsAdapter`. Wrap the root in the adapter for your router:

  | Router | Import |
  | --- | --- |
  | React Router 8 | `nuqs/adapters/react-router/v8` |
  | None, a Vite single-page app | `nuqs/adapters/react` |
  | Next.js app router | `nuqs/adapters/next/app` |

- **Toasts.** Mount `Toaster` from `@/shared/ui/toast` once. It follows the `dark` class on `<html>`, which next-themes, the Vite template's theme provider and creact all set. A create-creact app already mounts a Sonner `Toaster` in `root.tsx`, so replace it rather than mount both.
- **Theme toggle.** `mode-toggle` reads and sets the theme with remix-themes. It throws outside remix-themes' `ThemeProvider` and saves the choice through a server action, as in `src/app/routes/action.set-theme.ts`. Outside creact, use the project's own toggle.

## The items

- one per component in `src/shared/ui`, with its unit tests, so items with tests add vitest to `devDependencies`. Stories and demos stay in creact, as they need its Storybook setup.
- the `src/shared/lib` slices those components import, such as `device` and `data-table-core`. shadcn adds these for you.
- `theme`, the colour tokens, radius, font and base styles from `src/app/styles/globals.css`.
- `i18n`, the strings and config from `src/shared/i18n`, with `initI18n()`. You add it yourself. It also holds creact's own page and form strings, which you can delete.
- `needs-i18next`, `needs-nuqs-adapter` and `needs-remix-themes`. They hold no files. An item that imports i18next, nuqs or remix-themes depends on one, so `shadcn add` installs the package and prints its note once.
- `storybook-setup`, `linting`, `commit-conventions` and `fsd-scaffolding`, creact's tooling config. These expect a creact app.

`registry.json` lists every item and what it depends on.

Note: shadcn rewrites barrel imports in the files it adds, so `@/shared/ui/button` becomes `@/shared/ui/button/button`. Both point at the same component, and Steiger only checks imports from layers above `shared`, so leave them.

Note: shadcn copies the files as they are in creact, without its usual transforms, so licence notices and `cn-*` marker classes stay. A project that lints them needs creact's allowances for `src/shared/ui`: no `jsdoc-js/require-param` or `jsdoc-js/require-returns`, and `better-tailwindcss/no-unknown-classes` ignoring `^cn-` and `^toaster$`.

Note: pnpm stops an install with `ERR_PNPM_IGNORED_BUILDS` when a new dependency has a build script you haven't allowed. `storybook-setup` hits this, as Storybook depends on esbuild. Add the package to `allowBuilds` in `pnpm-workspace.yaml`, then run `shadcn add` again:

```yaml
allowBuilds:
  esbuild: true
```

## Update the registry

`scripts/build-registry.ts` generates `registry.json` from `src/shared`, `globals.css` and the tooling config. Run it after changing any of them:

```sh
mise run registry:build
```

When shipped code starts importing a package that needs the app to set something up, add a row to `HOST_REQUIREMENTS` in the script. The generator then adds the `needs-*` item to every item that imports the package.

CI runs `mise run registry:check`. It fails if `registry.json` is out of date or the generator prints a warning. It also type-checks the shipped code without ts-reset, as projects that add the items don't load it.

## Try a branch before merging

Registry items point at each other on the default branch. To try a branch, build the registry for it, push, and add items at that ref:

```sh
node scripts/build-registry.ts --ref my-branch
git commit -am "chore(config): point the registry at my-branch" && git push
pnpm dlx shadcn@latest add Joshua-Booth/creact/data-table#my-branch
```

Run `mise run registry:build` and commit again before merging, as the CI check fails on a registry that points at a branch.

[shadcn registry]: https://ui.shadcn.com/docs/registry

# Registry

creact is also a [shadcn registry], so a project with the creact layout can pull components, the theme and tooling config back from it.

## Add items to a project

The project needs Tailwind CSS v4, the `@/*` path alias pointing at `src/*`, and these aliases in its `components.json`:

```json
"aliases": {
  "components": "@/shared/ui",
  "ui": "@/shared/ui",
  "lib": "@/shared/lib",
  "utils": "@/shared/lib/utils",
  "hooks": "@/shared/lib/hooks"
}
```

Then add items by name:

```sh
pnpm dlx shadcn@latest add Joshua-Booth/creact/theme Joshua-Booth/creact/data-table
```

The items are:

- one per component in `src/shared/ui`, with its unit tests, so items with tests add vitest to `devDependencies`. Stories and demos stay in creact, as they need its Storybook setup.
- the `src/shared/lib` slices those components import, such as `device` and `data-table-core`. shadcn adds these for you.
- `theme`, the colour tokens, radius, font and base styles from `src/app/styles/globals.css`.
- `storybook-setup`, `linting`, `commit-conventions` and `fsd-scaffolding`, creact's tooling config.

`registry.json` lists every item and what it depends on.

Note: shadcn rewrites barrel imports in the files it adds, so `@/shared/ui/button` becomes `@/shared/ui/button/button`. Both point at the same component, and Steiger only checks imports from layers above `shared`, so leave them.

Note: some components expect the creact app shell. Components such as `data-table`, `dialog` and `pagination` translate their labels with react-i18next, using the keys in `src/shared/i18n`. Without those translations loaded, the labels show their keys. `toast` and `mode-toggle` read the theme from `remix-themes`, so they throw outside its `ThemeProvider`. `data-table` keeps its state in the URL with nuqs, so the page goes blank outside a `NuqsAdapter`.

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

CI runs `mise run registry:check`. It fails if `registry.json` is out of date or the generator prints a warning. It also type-checks `src/shared` without ts-reset, as projects that add the items don't load it.

## Try a branch before merging

Registry items point at each other on the default branch. To try a branch, build the registry for it, push, and add items at that ref:

```sh
node scripts/build-registry.ts --ref my-branch
git commit -am "chore(config): point the registry at my-branch" && git push
pnpm dlx shadcn@latest add Joshua-Booth/creact/data-table#my-branch
```

Run `mise run registry:build` and commit again before merging, as the CI check fails on a registry that points at a branch.

[shadcn registry]: https://ui.shadcn.com/docs/registry

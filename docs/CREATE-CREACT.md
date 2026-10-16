# create-creact

`create-creact` sets up a new React monorepo the way creact is set up. It takes a blank monorepo from Better-T-Stack, then adds the creact layer on top, so the project builds, typechecks, lints, formats and tests from its root from the first commit, and is set up for coding agents on first open. It runs from a checkout and is not on npm.

## Run it

```sh
node packages/create-creact/src/main.ts ../my-app --stack next
node packages/create-creact/src/main.ts ../my-app --stack next --styling stylex
node packages/create-creact/src/main.ts ../my-app --stack react-router --monorepo turborepo
node packages/create-creact/src/main.ts ../my-app --stack react-router --no-install --no-git
node packages/create-creact/src/main.ts ../my-app --yes
```

The directory must sit outside this checkout and any other git repository, as the project gets its own. Inside one, the command exits 2 and writes nothing.

Every prompt has a flag, so an agent never waits on a question.

| Flag | Values | Default |
| --- | --- | --- |
| `<dir>` | a path outside any git repository that is missing, empty, or a project this command made | required |
| `--stack` | `react-router`, `next` | required, or `react-router` with `--yes` |
| `--styling` | `tailwind`, `stylex` | `tailwind` |
| `--monorepo` | `pnpm`, `turborepo`, `nx` | `pnpm` |
| `--shadcn`, `--storybook`, `--msw`, `--playwright`, `--i18n`, `--posthog`, `--sentry` | extras, not built yet | off |
| `--no-install` | skip `pnpm install`, the lint and format pass and the skills restore | installs |
| `--no-git` | skip `git init` | inits |
| `--yes`, `-y` | take the default for every choice not given | |

Exit codes: 0 done, 1 a command failed and is echoed, 2 bad usage or a flag that is not built yet.

Run the command again on the same directory to finish an interrupted run or take a newer layer. Layer files you edited stay as you left them and are listed as kept. The `package.json` and tsconfig files creact patches are merged again on every run, so the scripts and compiler options creact sets go back to creact's values.

Note: the directory's name becomes the package scope, as in `@my-app/ui`, so it needs lowercase letters, digits, `.`, `_` or `-`, starting with a letter or digit. Better-T-Stack accepts names npm can't scope, so the command checks and exits 2 before writing anything.
Note: only pnpm is supported. The hooks and scripts call `pnpm exec`.
Note: a fresh project has one test, `tokens.test.ts`, described under Styling paths. The scaffold test adds another to prove the alias and the include glob work.

## What it does

1. Runs `create-better-t-stack@3.46.1` into a staging directory next to the target, with every option passed as a flag. Better-T-Stack keeps a history of every project it makes under `HOME` (`XDG_DATA_HOME` on Linux), so both point at an empty directory and the history goes when the staging directory does.
2. Checks that Better-T-Stack wrote the stack's own config, such as `apps/web/next.config.ts`, and the five JSON files the layer patches: the root `package.json` and `tsconfig.json`, `packages/config/tsconfig.base.json`, and `apps/web/package.json` and `apps/web/tsconfig.json`. If one is missing, its output changed shape, and the command exits 1.
3. Removes the Better-T-Stack files and packages the layer replaces, then copies the layer in and patches the five JSON files.
4. Writes `.creact/state.json` with the project name, the choices and a hash of every file it copied, then moves the staging directory into place.
5. Runs `git init`, then `pnpm add --workspace-root` for the root tools and `pnpm add` in `apps/web` for the app's packages, such as `@stylexjs/stylex`. Then `pnpm run prepare` installs the hooks, and `pnpm run lint --fix` and `pnpm run format` bring Better-T-Stack's own files in line. The lint pass runs a second time when the first fails, as oxlint applies one fix per overlapping range in a pass and the shadcn components need two. Last, if a skill `skills-lock.json` lists is missing from `.agents/skills`, `skills@1.7.2` runs `experimental_install` through `pnpm dlx`, which restores them all there, where the `.claude/skills` links point. With every skill present, a rerun leaves them alone, so it needs no network for them and the restore never rewrites the project's lock. `npx skills update` takes newer versions. The project is complete without the skills, so a restore that fails, as with no git or no network, exits 0, reports the skills as not restored and prints the command that finishes them. A rerun does the same.

On a rerun, a copied file is rewritten only when it is missing or unchanged since the recorded hash. The JSON files are merged every time, as the merge is idempotent and `pnpm add` rewrites `package.json` anyway. Better-T-Stack never runs again. A rerun never removes anything, so a package or file you put back stays. A rerun on a project missing one of the files step 2 checks, as when `apps/web` was renamed, exits 2, names them and writes nothing.

## Where the layer lives

Everything that runs once per repository sits at the root:

- `oxlint.config.ts` and its styling slot `oxlint.styling.ts`, `.oxfmtrc.json`, `vitest.config.ts`, `commitlint.config.ts`, `.lintstagedrc.json` and the husky `commit-msg` and `pre-commit` hooks.
- Every tool as a root devDependency, including the styling's lint plugin.
- The `lint`, `format`, `format:check`, `typecheck`, `test` and `prepare` scripts.
- The agent setup: `AGENTS.md`, `CLAUDE.md` importing it, `skills-lock.json` and the `.claude/skills` links. The root `.gitignore` gets the block creact's own has, which keeps `.claude/settings.json`, `rules`, `skills` and `workflows` tracked under a global ignore of `.claude` and the restored `.agents/skills` out of git. The block goes back whole on a rerun when any of it is missing.

Everything that belongs to the app sits in `apps/web`: the tokens, the styling's bindings and build plugins, `@stylexjs/stylex`, and the `typegen` and `check-types` scripts.

The root scripts:

| Script | Runs |
| --- | --- |
| `lint` | `pnpm -r --if-present typegen && oxlint --max-warnings 0` |
| `typecheck` | `pnpm -r --if-present check-types && tsc` |
| `test` | `vitest run` |
| `format`, `format:check` | `oxfmt`, `oxfmt --check` |
| `prepare` | `husky \|\| true` |

oxlint runs once from the root. Its type-aware rules read each file's nearest tsconfig, so `apps/web`, `packages/ui` and the root config files each lint with their own compiler options. Vitest runs once from the root, with `include` over `{apps,packages}/*/src/**/*.test.{ts,tsx}`, and `resolve.tsconfigPaths` reads `@/*` from `apps/web/tsconfig.json`. `typecheck` runs each package's `check-types` through `pnpm -r`, then `tsc` at the root for creact's own config files.

Better-T-Stack's own root scripts, `dev`, `build`, `check-types`, `dev:web`, `env:generate` and `postinstall`, stay as it wrote them. With `--monorepo turborepo` or `nx`, those go through `turbo run` or `nx run-many`, and creact's scripts never do.

creact's strict compiler options go in `packages/config/tsconfig.base.json`, which `packages/ui` and the root extend, and in `apps/web/tsconfig.json`, which extends nothing. The root tsconfig gets `include: ["*.ts"]`, `noEmit` and `allowImportingTsExtensions`, so it covers creact's root config files and nothing else.

The layer files live in `packages/create-creact/layer/<overlay>/<scope>/`, at the path they take in the monorepo. The overlay is `base`, a styling or an extra, and the scope is `all` or a stack id, so a styling can carry files for one stack only. `OVERLAYS` in `src/layer.ts` lists each scope's JSON patches, packages per manifest, and what it removes from Better-T-Stack's output. `{{name}}` in a layer path, file or removed key becomes the project name, and `{{monorepo}}` becomes the monorepo tool's name.

## The agent setup

`AGENTS.md` is written for the generated monorepo, not copied from creact's. It is composed from sections: `base/all` holds how to run, lay out, test, lint and commit, `base/<stack>` adds the stack's section, and each styling adds a `## Styling` section. When two overlays carry the same Markdown file, `loadLayer` joins them in overlay order with a blank line between. Any other clash throws, as it did before. A future extra adds its own section the same way, so the Storybook rule in `.claude/rules` lands with the Storybook extra and not before. The block between `<!-- git-workflow:start -->` and `<!-- git-workflow:end -->` in creact's own `AGENTS.md` only holds in creact's repositories, and a plan test fails if it reaches any layer file.

The skills come from `CREACT_LOCK` in `src/layer.ts`, which holds the entries creact's own `skills-lock.json` has for them, and each overlay lists the ids it wants: the base takes the skills that apply to any React app, and Tailwind adds `shadcn`, as `packages/ui` is shadcn. The plan writes `skills-lock.json` from that list and a `.claude/skills/<id>` link to `../../.agents/skills/<id>` for each skill the project's lock still lists, as the restore fills `.agents/skills` and makes no links of its own. A plan test checks the table against creact's lock, so `skills update` in creact shows up as a failing test until the table follows. `AGENTS.md` is a layer file like any other, so a project that edits it keeps its version on a rerun. `skills-lock.json` is seeded once and then belongs to the skills CLI, which rewrites each `computedHash` by how it fetched the skill (a clone hashes the vercel-labs skills differently from the GitHub fetch), so the layer records no hash for it and a rerun writes it only when it is missing.

Next writes its own `apps/web/AGENTS.md`, and `next dev` writes it back when it is missing, so creact's `AGENTS.md` stays at the root and never merges with it. The layer adds `apps/web/CLAUDE.md` importing Next's file, so Claude Code reads it when it works in the app.

## Styling paths

`--styling` picks Tailwind, the default, or StyleX. Both read the same design tokens.

The tokens live in one file, `apps/web/src/styles/tokens.css`, as custom properties on `:root` with a dark block. It is the shape a Figma variables export to CSS produces, so you can replace the file with the export. Each styling binds the names in a file next to it and holds no values of its own.

- Tailwind binds them in `tokens.tailwind.css` with `@theme inline reference`, so `bg-page` or `p-gutter` reads `var(--color-page)` or `var(--spacing-gutter)`. `apps/web/src/index.css` imports `@<name>/ui/globals.css` first, then both token files.
- StyleX binds them in `tokens.stylex.ts` as `stylex.defineConsts` of `var(--name)` strings, so `colors.accent` compiles to `var(--color-accent)`. `apps/web/src/index.css` declares `@layer reset` first and imports `tokens.css`, so StyleX's own layers win over the reset.

`tokens.test.ts` fails when a binding names a token that `tokens.css` lacks, so a rename in Figma shows up as a failing test instead of a silent `var()` with no value. Adding a token needs a new line in the binding before a component can use it.

### Tailwind

Better-T-Stack's `packages/ui`, shadcn on Base UI, and its app components stay as it wrote them. `apps/web/src/index.css` is the only Better-T-Stack file the layer replaces.

The Tailwind lint plugin runs from the root with `settings["better-tailwindcss"] = { cwd: "apps/web", entryPoint: "src/index.css" }`. Without `cwd` it can't find `tailwindcss` from the root, warns, and turns every rule off.

After the two fix passes, Better-T-Stack's code still breaks some of creact's rules. Two named overrides in the Tailwind `oxlint.styling.ts` turn those rules off for those files only:

- `shadcnComponentsAsWritten`, over `packages/ui/src/components/**`, turns off four rules. `better-tailwindcss/no-unknown-classes` flags 13 marker classes that shadcn uses and Tailwind doesn't know: `cn-font-heading`, `cn-menu-target` and `cn-menu-translucent` twice each, five `cn-message-scroller` classes, `cn-rtl-flip` and `toaster`. `jsx-a11y/label-has-associated-control` flags the generic `Label` in `label.tsx`. `jsx-a11y/click-events-have-key-events` and `jsx-a11y/no-noninteractive-element-interactions` flag the click-to-focus wrapper in `input-group.tsx`.
- `betterTStackTemplateAsWritten`, over `apps/web/src/root.tsx` and `apps/web/src/routes/_index.tsx`, turns off `no-empty-pattern`, for `meta({}: Route.MetaArgs)`, and `typescript/strict-boolean-expressions`, for two conditions in the error boundary. Only React Router has these files. Next's own files pass as written.

That list is measured on fresh 3.46.1 output with the overrides off, after the two fix passes. The first pass exits 1 on both stacks, on overlapping `perfectionist/sort-named-exports` fixes in `packages/ui`, and the second exits 0.

Every other rule still runs on that code, `no-conflicting-classes` included. An ignore pattern would also hide the components you add with `shadcn add`. The base config turns off `check-file/filename-naming-convention` under `apps/*/src/routes/**` on both paths, as file-system routers dictate names such as `_index.tsx`.

### StyleX

Better-T-Stack has no flag to skip Tailwind or its UI package, so the StyleX path removes them from a fresh base:

- `packages/ui`, `apps/web/components.json` and `apps/web/src/components`.
- From `apps/web/package.json`, in either dependency map: `@<name>/ui`, `lucide-react`, `next-themes`, `sonner`, `tailwindcss`, `@tailwindcss/vite` and `@tailwindcss/postcss`.
- The `@<name>/ui/*` path from `apps/web/tsconfig.json`.

On each stack:

- React Router runs `@stylexjs/unplugin` in `apps/web/vite.config.ts`, next to Better-T-Stack's varlock plugin, with the `@/*` alias. The layer replaces `src/index.css`, `src/root.tsx` and `src/routes/_index.tsx`. `root.tsx` links `/virtual:stylex.css` in dev only, as the plugin adds that link through `index.html`, which React Router's server rendering never reads. creact's `root.tsx` and `_index.tsx` pass every rule with no override.
- Next runs `@stylexjs/babel-plugin` from `apps/web/babel.config.js` and `@stylexjs/postcss-plugin` from `apps/web/postcss.config.js`, which writes the rules where `index.css` has `@stylex;`. The layer removes `postcss.config.mjs`, as Turbopack runs an `.mjs` PostCSS config in its own runtime, where `import.meta.dirname` in the babel config it imports is undefined. It replaces `src/index.css`, `src/app/layout.tsx` and `src/app/page.tsx`. `next.config.ts` keeps `reactCompiler: true`. Next's babel loader puts `babel-plugin-react-compiler` ahead of a project's own babel plugins, so the React Compiler still runs and `babel.config.js` does not list it. The layout drops Better-T-Stack's Geist fonts, as `next/font` hands back class names and the StyleX path has no `className`.
- `oxlint.styling.ts` loads `@stylexjs/eslint-plugin` with seven of its rules as errors, as the Tailwind slot does with `eslint-plugin-better-tailwindcss`.

Note: on StyleX, the README Better-T-Stack writes still describes Tailwind and `packages/ui`, and the catalog in `pnpm-workspace.yaml` keeps entries for `tailwindcss`, `lucide-react`, `next-themes` and `sonner`. Nothing uses them, and removing them needs a YAML parser.

What works on one path only:

- The shadcn registry from JB-90 is Tailwind only, as its components are Tailwind classes. Better-T-Stack's `packages/ui` is now its home: the planned `--shadcn` extra adds creact's registry to `packages/ui/components.json`. `--help` marks the extra as Tailwind only, and the command refuses an extra like it on a StyleX project, new or recorded.
- `sortTailwindcss` in `.oxfmtrc.json` stays on both paths. It only sorts class strings, and a StyleX project has none.

Note: Vitest doesn't run the StyleX compiler, so a test that renders a StyleX component throws `Unexpected 'stylex.defineConsts' call at runtime`. `tokens.test.ts` reads the files as text for that reason.
Note: Storybook isn't in the CLI yet. When the Storybook extra lands, a StyleX project needs `@stylexjs/unplugin` in Storybook's Vite config with `useCSSLayers: { before: ["reset"] }`, the PostCSS plugin set to skip `*.stories.tsx`, and `babel.config.js` returning `{}` for the `@stylexjs/unplugin` caller.

## Better-T-Stack's other files

- varlock stays: `apps/web/.env.schema`, its Vite or Next plugin, and the `postinstall` that writes `apps/web/src/env.ts`. It passes every check, and the generated `env.ts` is gitignored, so oxlint and oxfmt skip it. Removing it would mean owning `next.config.ts` on both paths and `vite.config.ts` on Tailwind.
- `bunfig.toml`, at the root and in `apps/web`, goes on both paths. It only turns off Bun's env loading, and the project runs on pnpm and Node.
- `bts.jsonc`, `README.md`, `pnpm-workspace.yaml` and `packages/config/package.json` stay as Better-T-Stack wrote them. `bts.jsonc` records the version that made the project, and Better-T-Stack's `add` command needs it.

Note: Better-T-Stack's README still says Bun's env loading is turned off in `bunfig.toml`, which is gone. Bun never runs, so nothing changes.

## The Better-T-Stack pin

`BTS` in `src/stacks.ts` pins `create-better-t-stack@3.46.1`. The StyleX path replaces Better-T-Stack's files by name and the overrides list its lint findings, so a new release can change what the layer has to do. With a pin, the scaffold matrix tests what people get. Package versions inside the project still float on Better-T-Stack's caret ranges.

A Renovate custom manager in `renovate.json` reads the pin and opens a bump PR of its own, which runs the scaffold matrix, as the workflow triggers on `packages/create-creact/**`. Each plan test fixture records the version it came from, so the plan tests fail on that PR until the fixtures are captured again. Renovate leaves the PR for review:

```sh
node packages/create-creact/test/capture-fixtures.ts
```

It runs the pinned Better-T-Stack once per stack, with a project named `app`, and writes the version and the five JSON files to `test/fixtures/<stack>.json`.

## Test it

```sh
mise run test:cli                                  # offline tests, every PR
CREACT_SCAFFOLD=1 mise run test:scaffold           # every stack and styling on pnpm, needs the network
CREACT_SCAFFOLD=next mise run test:scaffold        # both stylings of one stack
CREACT_SCAFFOLD=next:stylex mise run test:scaffold
CREACT_SCAFFOLD=react-router:tailwind:turborepo mise run test:scaffold
CREACT_SCAFFOLD=next:stylex:nx mise run test:scaffold
```

`1`, a stack, or `<stack>:<styling>` picks cells on plain pnpm workspaces. `<stack>:<styling>:<monorepo>` picks that one cell.

The scaffold test creates each project with an empty `HOME` and checks Better-T-Stack wrote nothing there. It checks the prune left none of the removed files or packages, and that `turbo.json` or `nx.json` exists only for its tool. Then it commits through the real hooks, rejects a bad commit message, runs build, typecheck, lint, format:check and test from the root, and checks the tree is clean. It reruns the command and checks it writes nothing, commits a test under `apps/web/src` that imports through `@/*`, and checks that a changed layer reaches an unedited file and leaves an edited one alone. It also checks the built CSS carries the values from `tokens.css` and the styling's own output, and that root lint fails on a planted styling mistake. It checks `AGENTS.md` and `CLAUDE.md` are in place and that every skill `skills-lock.json` lists resolves through `.claude/skills` after the restore.

It runs in `.github/workflows/create-creact.yml`, one job per stack and styling on pnpm, on pull requests that touch `packages/create-creact/`, weekly, and on dispatch. The Turborepo and Nx cells run by hand when the pin or the root scripts change.

## Add a Better-T-Stack frontend

Better-T-Stack has more frontends, such as `tanstack-router`, `tanstack-start` and `astro`. Each puts its app in `apps/web/src`, so adding one is a small change. For `tanstack-router`:

```diff
 export const STACKS = {
   "react-router": { ... },
   next: { ... },
+  "tanstack-router": { signature: "apps/web/src/routes/__root.tsx" },
 } as const satisfies Record<string, Stack>;
```

Then:

- Add `OVERLAYS.base["tanstack-router"]` with the app's `typegen` script and the CLI behind it: `{ json: { "apps/web/package.json": { scripts: { typegen: "tsr generate" } } }, packages: { "apps/web/package.json": { devDependencies: ["@tanstack/router-cli"] } } }`. The plan test fails for a stack with no `typegen` script, as root lint would skip it.
- Add the StyleX files under `layer/stylex/tanstack-router/apps/web/`: `vite.config.ts`, `src/index.css`, `src/main.tsx`, `src/routes/__root.tsx` and `src/routes/index.tsx`. `main.tsx` is there because it imports `./components/loader`, which the StyleX prune removes. The prune already removes `@tailwindcss/vite` from either dependency map.
- The Tailwind path needs no files, as Better-T-Stack writes the same one-line `src/index.css`. If its `__root.tsx` breaks a rule, add it to `betterTStackTemplateAsWritten`.
- Run `node packages/create-creact/test/capture-fixtures.ts tanstack-router`, then add the stack's rows to `FILES` in the plan test and `CSS_OUTPUT` in the scaffold test (`apps/web/dist/assets`). Both are `Record<StackId, …>`, so the compiler points at them.
- Add `tanstack-router` to the stack list in the workflow matrix.

Note: `tsr generate` as the typegen is not yet proven.

## Packages or copied files

The plan was to ship the layer as packages so Renovate could update existing projects. It is copied files, for now. The evidence:

| Layer piece | Could a package carry it? |
| --- | --- |
| `.oxfmtrc.json` | Only as JavaScript. `.oxfmtrc.json` has no `extends`, but oxfmt 0.71 and 0.73 read `oxfmt.config.ts`, which can import a package's default export and spread it. |
| `.husky/*` | No. Git runs files in the repo. |
| `vitest.config.ts` | No. The project edits it. |
| oxlint rules | Only as JavaScript. Node 24 refuses to type-strip `.ts` files under `node_modules`. |
| tsconfig strictness, commitlint | Yes. Both resolve `extends` from `node_modules`. |
| Tool binaries and lint plugins | They stay project devDependencies either way, and Renovate bumps them per project. |

A JavaScript-only config package would carry four of the six pieces and leave two update paths, as the husky hooks and the vitest config have to be files in the project. One update path, rerunning the command, covers all six. Renovate keeps the job it already does, bumping each project's own dependency ranges, as the layer never pins a version.

The package route stays open. `pnpm add github:Joshua-Booth/creact#path:packages/<name>` installs a package from a subdirectory of this repo without a publish, checked against the vite monorepo. Better-T-Stack's `packages/config` is a natural home for one. The first real package is runtime code shared by Vitest, Storybook and Playwright, such as MSW handlers. Config stays copied.

## Decisions

- Better-T-Stack is the base. The spike chose the framework CLIs, and these runs of 3.46.1 overturn its reasons:
  - The refusal of `--yes` with stack flags doesn't matter. The full flag set, with no `--yes`, runs with no prompt and stdin closed in under a second.
  - `create-json` with `"addons": []` still records `turborepo` and writes `turbo.json`, so the flag call is the route to plain pnpm workspaces.
  - The monorepo is wanted. Its UI package passes every check with two named overrides, varlock passes as it is, and the StyleX path removes what it can't use.
  - React Router is not a minor behind in practice. Better-T-Stack writes `^8.3.1`, which resolves 8.4.0.
- Plain pnpm workspaces are the default, with Turborepo and Nx as `--monorepo` choices. They only change Better-T-Stack's root `dev`, `build`, `check-types` and `dev:web` scripts and add one config file. Vite+ is left out, as it rewrites the lint, format and hook scripts the layer owns.
- The layer runs from the root, and creact's own scripts never go through turbo or nx.
- The project name comes from the directory and is recorded in state, so a renamed directory keeps its package scope.
- State is schema 2, with the name and the monorepo tool. A schema 1 state comes from the single-package spike, and the command refuses it with a message saying so. Nothing was published, so there is nothing to migrate.
- The CLI lives in `packages/create-creact` with no dependencies and outside the pnpm workspace, so the lockfile, knip and the CI install do not change. It calls Better-T-Stack's CLI rather than its programmatic `create()`, which would be the first dependency. It joins the workspace when it gains a dependency or a publish build.
- Layer files are stored as `<path>.layer`, so the repo's own lint, format, typecheck and spell tools ignore them. The scaffold test is where they are checked, in a real project.
- Next's own `apps/web/AGENTS.md` is kept as written, with creact's at the root and `apps/web/CLAUDE.md` importing Next's, as under The agent setup.
- TypeScript stays at Better-T-Stack's `^6.0.3`. With the catalog at `^7.0.2`, build, typecheck, format:check and test pass on both stacks, but lint fails: oxlint can't load `oxlint.config.ts`, as `ts-api-utils@2.5.0`, which `@eslint-react/eslint-plugin@5.27.1` pulls in through `@typescript-eslint/typescript-estree`, reads a TypeScript enum TypeScript 7 removed. The layer can bump it once that plugin runs on TypeScript 7, which Renovate will show in creact first.

## Better-T-Stack 3.46.1, as of 16 October 2026

- It always writes a monorepo: `apps/web` for the frontend, `packages/ui` with shadcn on Base UI and Tailwind, `packages/config` with a base tsconfig, varlock, `bunfig.toml` and `bts.jsonc`. No flag skips `packages/ui`, Tailwind, varlock or `bunfig.toml`.
- It names the workspace packages `@<name>/ui` and `@<name>/config` and accepts names npm can't scope.
- `apps/web/tsconfig.json` doesn't extend the base tsconfig.
- It writes `packageManager` to the root `package.json` with the pnpm version that ran it.
- It writes React Router `^8.3.1`, which resolves 8.4.0.
- The Turborepo and Nx cells, run by hand: `react-router:tailwind:turborepo` passed all 10 checks in 80 seconds, and `next:stylex:nx` passed all 10 in 52 seconds.

Note: `create-creact` is free on npm. `creact` is taken.

## What to build next

- Vitest with the StyleX compiler, so a StyleX project can test its components. React Router can reuse the Vite plugin, and Next would need `@stylexjs/unplugin` for Vitest alone.
- The extras, one overlay directory each, with their own `AGENTS.md` section and skills. The Storybook extra carries creact's `.claude/rules/storybook-stories.md`, and the Playwright extra the `playwright-cli` skill. PostHog and Sentry may not need flags, as their own skills do the setup.
- More Better-T-Stack frontends, as under Add a Better-T-Stack frontend.
- Root creact consumes the layer, so the oxlint rules exist once instead of twice. The root config could also allow node:test's `describe` and `it` under `no-floating-promises`, and add a `packages/create-creact/**` override for `detect-non-literal-fs-filename`, which would remove the file-level disables in the CLI.
- Publishing. A `.ts` bin cannot run from `node_modules`, so `pnpm create creact` needs a `tsc` emit in `prepack`, or JavaScript source. The package version is `0.0.0` until then.
- A `creact update` entry point, which is the rerun path with a name, and a scheduled workflow that opens it as a PR in each project.
- Moving into an existing empty directory, such as `create-creact .`, is not atomic. A crash mid-move leaves a directory the rerun refuses.

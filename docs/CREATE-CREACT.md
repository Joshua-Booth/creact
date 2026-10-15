# create-creact

`create-creact` sets up a new React project the way creact is set up. It takes a blank project from the framework's own create CLI, then adds the creact layer on top, so the project builds, lints, formats and typechecks from the first commit, with vitest wired for the first test. This is the spike from JB-91. It runs from a checkout and is not on npm.

## Run it

```sh
node packages/create-creact/src/main.ts my-app --stack next
node packages/create-creact/src/main.ts my-app --stack react-router --no-install --no-git
node packages/create-creact/src/main.ts my-app --yes
```

Every prompt has a flag, so an agent never waits on a question.

| Flag | Values | Default |
| --- | --- | --- |
| `<dir>` | a path that is missing, empty, or a project this command made | required |
| `--stack` | `react-router`, `next` | required, or `react-router` with `--yes` |
| `--styling` | `tailwind`, `stylex` (not built, JB-89) | `tailwind` |
| `--storybook`, `--msw`, `--playwright`, `--i18n`, `--posthog`, `--sentry` | extras, not built yet | off |
| `--no-install` | skip `pnpm install` and the lint and format pass | installs |
| `--no-git` | skip `git init` | inits |
| `--yes`, `-y` | take the default for every choice not given | |

Exit codes: 0 done, 1 a command failed and is echoed, 2 bad usage or a flag that is not built yet.

Run the command again on the same directory to finish an interrupted run or take a newer layer. Files you edited stay as you left them and are listed as kept.

Note: only pnpm is supported. The hooks and scripts call `pnpm exec`.
Note: upstream is `@latest` through `pnpm dlx`, which can lag a new release. On the day of the spike it served create-next-app 16.4.0 with 16.4.1 tagged latest, and `--config.dlx-cache-max-age=0` did not change that.
Note: a fresh project has no test files, and `pnpm test` passes on `passWithNoTests`. The scaffold test adds one to prove the alias and the include glob work.

## What it does

1. Runs the framework's create CLI into a staging directory next to the target, with every option passed explicitly and `HOME` pointed at an empty directory, so saved preferences cannot change the output. In a clean `HOME`, `create-next-app --yes` adds ESLint, so the Next row passes `--no-linter` and `--no-react-compiler`, which the CLI reads from argv although its `--help` does not list them.
2. Copies the layer in and patches upstream's `package.json` and `tsconfig.json`. The layer is the oxlint config with a Tailwind slot, `.oxfmtrc.json`, a vitest config, husky `commit-msg` and `pre-commit` hooks, commitlint, lint-staged, the `lint`, `format`, `format:check`, `typecheck`, `test` and `prepare` scripts, strict tsconfig flags, and the dev dependencies by name.
3. Writes `.creact/state.json` with the choices and a hash of every file it copied, then moves the staging directory into place.
4. Runs `git init`, `pnpm add -D` for the tools, `pnpm run prepare` to install the hooks, then `pnpm run lint --fix` and `pnpm run format` so upstream's own files pass the checks.

On a rerun, a copied file is rewritten only when it is missing or unchanged since the recorded hash. `package.json` and `tsconfig.json` are merged every time, as the merge is idempotent and `pnpm add` rewrites `package.json` anyway.

## Test it

```sh
mise run test:cli                        # offline plan tests, every PR
CREACT_SCAFFOLD=1 mise run test:scaffold # scaffolds both stacks, needs the network
CREACT_SCAFFOLD=next mise run test:scaffold
```

The scaffold test creates each stack with saved create-next-app preferences planted under a seeded `HOME`, commits through the real hooks, rejects a bad commit message, runs build, typecheck, lint, format:check and test, checks the tree is clean, reruns the command and checks it writes nothing, commits a test that imports through the stack's own alias, and checks that a changed layer reaches an unedited file and leaves an edited one alone.

It runs in `.github/workflows/create-creact.yml` on pull requests that touch `packages/create-creact/`, weekly, and on dispatch.

## Packages or copied files

The plan was to ship the layer as packages so Renovate could update existing projects. The spike says copies, for now. The evidence:

| Layer piece | Could a package carry it? |
| --- | --- |
| `.oxfmtrc.json` | No. oxfmt 0.71 has no `extends`. |
| `.husky/*` | No. Git runs files in the repo. |
| `vitest.config.ts` | No. The project edits it. |
| oxlint rules | Only as JavaScript. Node 24 refuses to type-strip `.ts` files under `node_modules`. |
| tsconfig strictness, commitlint | Yes. Both resolve `extends` from `node_modules`. |
| Tool binaries and lint plugins | They stay project devDependencies either way, and Renovate bumps them per project. |

A JavaScript-only config package would carry three of the six pieces and leave two update paths. One update path, rerunning the command, covers all six. Renovate keeps the job it already does, bumping each project's own dependency ranges, as the layer never pins a version.

The package route stays open. `pnpm add github:Joshua-Booth/creact#path:packages/<name>` installs a package from a subdirectory of this repo without a publish, checked against the vite monorepo. The first real package is runtime code shared by Vitest, Storybook and Playwright, such as MSW handlers. Config stays copied.

## Decisions

- The framework CLIs are the base, not Better-T-Stack. Better-T-Stack writes a monorepo with its own UI package and env tool even with no backend, pinned React Router a minor behind, and cannot take `--yes` with stack flags. Undoing that costs more than one row per stack.
- The CLI lives in `packages/create-creact` with no dependencies and outside the pnpm workspace, so the lockfile, knip and the CI install do not change. It joins the workspace when it gains a dependency or a publish build.
- Layer files are stored as `<path>.layer`, so the repo's own lint, format, typecheck and spell tools ignore them. The scaffold test is where they are checked, in a real project.
- React Router keeps its `app/` directory. Moving it into `src/app` to match Next means rewriting upstream's config, and the layer does not need one source root.
- Two of upstream's React Router files, `app/root.tsx` and `app/routes/home.tsx`, get a named override that turns off `no-empty-pattern` and `strict-boolean-expressions`, as `--fix` cannot clear them. The alternative was patching upstream's code.
- Next's own `AGENTS.md` is kept as written.

## Upstream create CLIs, as of 15 October 2026

- create-react-router 8.4.0 takes its default template from the `remix-run/react-router-templates` repo. The older `remix-run/react-router/templates/basic` path no longer exists.
- create-next-app 16.4.x fills unprovided options from preferences saved on the machine under `--yes`, and in a clean `HOME` adds ESLint. It writes its own `AGENTS.md`, a `pnpm-workspace.yaml` and `src/app/`.
- create-better-t-stack cannot combine `--yes` with `--frontend`, `--backend`, `--addons` or `--examples`, and writes a monorepo even with no backend.

Note: `create-creact` is free on npm. `creact` is taken.

## What to build next

- The agent setup. When the CLI carries `AGENTS.md` and `.claude/`, strip the block between `<!-- git-workflow:start -->` and `<!-- git-workflow:end -->`, which only holds in this repo, and run the skills restore after copying so the `.claude/skills` symlinks resolve. Decide how creact's `AGENTS.md` sits next to Next's.
- `--styling stylex` (JB-89). A `layer/stylex/` directory with its own `oxlint.styling.ts`, and one status flip in `src/options.ts`.
- The extras, one overlay directory each. PostHog and Sentry may not need flags, as their own skills do the setup.
- Root creact consumes the layer, so the oxlint rules exist once instead of twice. The root config could also allow node:test's `describe` and `it` under `no-floating-promises`, and add a `packages/create-creact/**` override for `detect-non-literal-fs-filename`, which would remove the file-level disables in the CLI.
- Publishing. A `.ts` bin cannot run from `node_modules`, so `pnpm create creact` needs a `tsc` emit in `prepack`, or JavaScript source. The package version is `0.0.0` until then.
- A `creact update` entry point, which is the rerun path with a name, and a scheduled workflow that opens it as a PR in each project.
- Moving into an existing empty directory, such as `create-creact .`, is not atomic. A crash mid-move leaves a directory the rerun refuses.

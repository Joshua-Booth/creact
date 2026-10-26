# creact

A React Router v8 web app template with Vite, TypeScript, Tailwind CSS v4 and shadcn/ui, laid out with Feature-Sliced Design.

## Run things

- Run tasks with `mise run <task>` and other tools with `mise exec -- <command>`, so the pinned Node and pnpm versions are used. `mise tasks ls` lists every task.
- In a fresh clone, run `mise install`, then `pnpm install`. The install also sets up the git hooks.
- The Storybook and E2E tests need Chromium. Install it with `mise exec -- pnpm exec playwright install chromium`.
- `mise run dev` serves the app on port 8080 and points it at an API on port 8000. To run another worktree at the same time, set `port` and `api_port` under `[vars]` in that worktree's `mise.local.toml`.
- `mise run check` runs every CI check. It's slow, so while you work, run the task for what you changed.

## Code layout

- `src` follows Feature-Sliced Design. The layers, from top to bottom, are `app`, `pages`, `widgets`, `features`, `entities` and `shared`. Code imports only from layers below its own, and only through a slice's `index.ts`. `mise run steiger` checks this.
- Import from `src` with the `@/` alias, not a relative path that leaves the slice.
- shadcn/ui components live in `src/shared/ui`. Add one with the shadcn CLI or the shadcn MCP server in `.mcp.json` rather than writing it by hand.
- `mise run generate` scaffolds a slice or a UI component from `config/plop-templates`. Follow the same shape when you write one by hand.
- `mise run depcruise` checks for import cycles, and `mise run knip` finds unused files, exports and dependencies.

## Tests

- Unit tests are Vitest files named `*.test.ts` or `*.test.tsx` next to the code they test. Run them with `mise run test:unit`.
- Component tests are `.test()` blocks on Storybook stories, which Vitest runs in Chromium. Run them with `mise run test:storybook`. `.claude/rules/storybook-stories.md` has the rule for story `render` functions.
- E2E tests are Playwright specs in `tests/e2e`. They mock the API with MSW handlers from `tests/e2e/mocks`. Run them with `mise run test:e2e`.
- `mise run coverage` runs the unit and Storybook tests with coverage, as CI does.
- While `mise run storybook` runs, the Storybook MCP server in `.mcp.json` serves component docs and story previews, and runs story tests.

## Lint and format

- `mise run fix` runs every auto-fixer: Oxfmt, Oxlint, Stylelint, knip and steiger.
- `mise run typecheck`, `mise run lint:check`, `mise run format:check`, `mise run stylelint:check` and `mise run spell` check without changing files.
- The pre-commit hook runs lint-staged on staged files. The pre-push hook runs the format, lint, Stylelint, type, spelling, knip and steiger checks.
- When cspell flags a real word, add it to `config/cspell.json`.

## Agent skills and workflows

- `skills-lock.json` lists the third-party agent skills this repo uses. Restore them with `npx skills experimental_install`, which puts them in `.agents/skills`. The links in `.claude/skills` point there for Claude Code.
- `.claude/workflows/upgrade-deps.js` upgrades every dependency to its latest version and tries each major upgrade in its own worktree. Run it in Claude Code with `/upgrade-deps`.

## Commit scopes

- `config/commitlint.config.ts` sets which scopes each commit type may use. A change in `src` usually takes its layer as the scope, like `feat(features): add search filters`. Tooling changes use `chore(config)` or `build(config)`.
- Write ticket references as `JB-123`. A GitHub reference like `#123` fails commitlint.
- Check a message before you commit with `printf '%s\n' "$msg" | mise exec -- pnpm exec commitlint --config config/commitlint.config.ts`.

<!-- git-workflow:start -->

## Commits

- Commits use Conventional Commits with a lowercase imperative subject, checked by commitlint. Don't skip the hooks.
- Before the first commit in a fresh clone, install the hooks with `pnpm install`.
- Commits on a branch get a short body with context. PRs are squash-merged, so the default branch gets one subject-only commit.

## Merging

- Merge with a lone `gh pr merge <n> --squash --match-head-commit <sha>`, never chained with other commands. Never use `--admin` or `--auto`. In a cloud session, use the GitHub MCP merge tool with `merge_method` set to `squash` and `expectedHeadSha` set to the head commit.
- The git-workflow skill's merge check prints each PR's outcome and the steps it needs.
- `merge`, for a PR of only docs and notes, merges once CI is green.
- `verify`, for code, tests, config and everything else, merges once CI is green and an independent verifier that didn't write the code passes it.
- `ask`, for security, data, deploys, CI, agent policy and PRs from a fork or an unknown author, merges once CI is green, a verifier passes it and Joshua approves the guard hook's prompt.
- If you can't run the merge check, treat the PR as `ask`.

<!-- git-workflow:end -->

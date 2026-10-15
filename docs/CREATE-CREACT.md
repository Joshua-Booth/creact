# create-creact spike

Notes from the spike that turns creact into a setup command. The command takes a blank project from the framework's own create CLI and adds the creact layer on top, so a new project builds, lints and tests from the first commit.

This page is a work in progress. The design and the write-up land with the spike.

## Upstream create CLIs, as of 15 October 2026

Each CLI was run with its non-interactive flags into a temp directory. The notes record what they produce and where they bite.

### create-react-router 8.4.0

```sh
pnpm dlx create-react-router@latest my-app --yes --no-install --no-git-init --package-manager pnpm
```

- The default template comes from the `remix-run/react-router-templates` repo. The older `remix-run/react-router/templates/basic` path no longer exists, so do not pass it with `--template`.
- The template puts the source in `app/`, uses Tailwind through `@tailwindcss/vite`, and ships a `Dockerfile` and a React Router agent skill under `.agents/skills/`.
- A shell that is not a terminal gets the `--yes` behaviour anyway.

### create-next-app 16.4.1

```sh
pnpm dlx create-next-app@latest my-app --yes --ts --tailwind --app --src-dir --import-alias "@/*" --skip-install --disable-git --use-pnpm --no-agent-feedback
```

- `--yes` fills unprovided options from preferences saved on the machine, so pass every option.
- There is no `--no-eslint`. With neither `--eslint` nor `--biome`, no linter is added.
- The template writes its own `AGENTS.md`, a `pnpm-workspace.yaml` and `src/app/`.

### create-better-t-stack

```sh
pnpm dlx create-better-t-stack@latest create my-app --frontend react-router --backend none --database none --orm none --auth none --payments none --api none --runtime none --db-setup none --web-deploy none --server-deploy none --addons none --examples none --no-install --no-git --package-manager pnpm --directory-conflict error --disable-analytics
```

- `--yes` cannot be combined with `--frontend`, `--backend`, `--addons` or `--examples`, so a scripted run passes every flag and no `--yes`.
- Even with no backend the result is a monorepo: `apps/web`, `packages/ui` with its own shadcn components, `packages/config`, and env handling through `varlock`.
- Its React Router app pinned `react-router ^8.3.1` while the official template was on `^8.4.0`.

Note: `create-creact` is free on npm. `creact` is taken.

<div align="center" style="text-align:center">
  <img
    alt="creact Logo"
    src="./src/shared/assets/images/README.svg"
  />

  <h2 style="padding-top:0;margin-top:20px">creact</h2>
  <h4 style="padding-top:20px">A React app template, starter CLI and component registry, set up for coding agents.</h4>

  <br />

  <p>
    <img
      alt="GitHub release"
      src="https://img.shields.io/github/v/release/Joshua-Booth/creact?label=version&style=for-the-badge"
    />
  </p>

<sub>Developed by <a href="https://joshuabooth.nz">Joshua Booth</a></sub>

</div>

## About

creact is a starting point for React web apps. Testing, linting, Storybook and a coding agent setup are already done, so a new project starts from something that works.

There are three ways to use it:

- **Start a new project** with `create-creact`. It sets up a Better-T-Stack monorepo with React Router or Next, on Tailwind or StyleX, with creact's tooling. See [create-creact](./docs/CREATE-CREACT.md).
- **Clone the template** to get the whole app, with its layout, examples and components.
- **Add pieces to another project on Tailwind CSS v4** from the [registry](./docs/REGISTRY.md), like a component or the theme.

## What's inside

- React 19, React Router v8, Vite and TypeScript
- Tailwind CSS v4, [shadcn/ui] on Base UI, and Lucide icons
- Zustand for state, SWR and ky for data, and React Hook Form with Zod for forms
- Vitest, Playwright, MSW, Storybook and Stryker for testing
- Oxlint, Oxfmt, stylelint, knip, cspell and Steiger for code quality
- Husky, commitlint and semantic-release for commits and releases
- Sentry, PostHog and react-i18next, ready to configure
- [mise] for tool versions and tasks, and Renovate for dependency updates

The code follows [Feature-Sliced Design][fsd]. Remove anything you don't need.

The app renders on the server, using React Router's server-side rendering.

[shadcn/ui]: https://ui.shadcn.com/
[mise]: https://mise.jdx.dev/
[fsd]: https://feature-sliced.design/

## Quick start

You need Git and [mise]. mise installs the right Node and pnpm versions for you.

```sh
git clone https://github.com/Joshua-Booth/creact.git
cd creact
mise install
pnpm install
npx skills experimental_install
mise run dev
```

The app runs at `http://localhost:8080`. To change the ports or set environment variables, see [Configuration](./docs/CONFIGURATION.md).

## Coding agents

An agent can work in creact straight away.

- `AGENTS.md` has the repo's rules: commands, layout, tests and commits. `CLAUDE.md` imports it.
- `.claude/rules` holds the rule for Storybook stories, and `.claude/workflows` has an `upgrade-deps` workflow.
- `skills-lock.json` pins the shared agent skills. `npx skills experimental_install` puts them in `.agents/skills`, and `.claude/skills` links to them.
- `.mcp.json` connects the shadcn and Storybook MCP servers, so an agent can browse components and run stories.

Note: the Storybook MCP server only works while `mise run storybook` is running.

Note: the skill links need symlinks. On Windows, turn on `core.symlinks` in git before you clone.

## Tasks

Every task is in `mise.toml`, and most have a short alias.

| Task                 | Does                             |
| -------------------- | -------------------------------- |
| `mise run dev`       | Start the dev server             |
| `mise run build`     | Build for production             |
| `mise run test`      | Run the unit and component tests |
| `mise run test:e2e`  | Run the Playwright tests         |
| `mise run storybook` | Start Storybook                  |
| `mise run fix`       | Fix lint and formatting          |
| `mise run check`     | Run everything CI runs           |
| `mise run generate`  | Scaffold a slice or a component  |

Run `mise tasks ls` for the rest. [Development](./docs/DEVELOPMENT.md) covers the generators, API mocks and lint setup.

## Deployment

creact deploys to Netlify. Connect the repo, set the [production environment variables](./docs/CONFIGURATION.md#environment-variables), then deploy. [Deployment](./docs/DEPLOYMENT.md) has the details.

## License

[0BSD](./LICENSE). Copyright &copy; 2026 Joshua Booth.

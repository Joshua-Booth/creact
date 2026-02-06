<div align="center" style="text-align:center">
  <a href="https://creact.netlify.app/">
    <img
      alt="creact Logo"
      src="./src/assets/images/README.svg"
    />
  </a>

  <h2 style="padding-top:0;margin-top:20px">creact</h2>
  <h4 style="padding-top:20px">A React web app template with Vite, React Router v7, and TypeScript.</h4>

  <br />

[**Visit demo**](https://creact.netlify.app/) ·
[**Documentation**][wiki]

  <br />

  <p>
    <a href="https://app.netlify.com/sites/creact/deploys">
      <img
        alt="Netlify Build Status"
        src="https://img.shields.io/netlify/4b639571-edc3-4fd5-ab63-61f0959fd921?label=build&style=for-the-badge"
      />
    </a>
    <img 
      alt="GitHub package.json version" 
      src="https://img.shields.io/github/package-json/v/Joshua-Booth/creact?style=for-the-badge"
    />
    <img
      alt="Dependencies"
      src="https://img.shields.io/librariesio/github/Joshua-Booth/creact?style=for-the-badge"
    />
    <img 
      alt="GitHub last commit" 
      src="https://img.shields.io/github/last-commit/Joshua-Booth/creact?label=Last%20Update&style=for-the-badge"
    />
  </p>

  <br />

<sub>Developed by <a href="https://joshuabooth.nz">Joshua Booth</a></sub>

  <br />

  <hr />
  <p>
    <a href="#about">About</a> |
    <a href="#requirements">Features</a> |
    <a href="#requirements">Requirements</a> |
    <a href="#installation">Installation</a> |
    <a href="#installation">Setup</a> |
    <a href="#installation">Usage</a> |
    <a href="#deployment">Deployment</a> |
    <a href="#support">Support</a> |
    <a href="#license">License</a>
  </p>
  <hr />
</div>

## About

<p style="padding-bottom: 20px">
creact is a React project template for quickly setting up new web applications. Built with:

- **React 19** with concurrent features and automatic batching
- **React Router v7** for file-based routing and data loading
- **Vite** for fast development and optimized production builds
- **TypeScript** for type safety
- **Zustand** for lightweight state management
- **Tailwind CSS v4** for utility-first styling

The template is modular - remove or customize any parts that don't fit your needs.

**Rendering Mode:** This template uses Server-Side Rendering (SSR) with React Router v7. SSR is required for proper Tailwind CSS v4 critical CSS injection and hydration. If you need SPA-only mode, consider using Tailwind CSS v3 instead.

Take a look at the <a href="#features">features</a> to see what's included. If there's something you think should be added, feel free to create a [feature request](https://github.com/Joshua-Booth/creact/issues/new).

For more information about this project check out the [wiki].

</p>

[wiki]: https://github.com/Joshua-Booth/creact/wiki/Home/

## Features

- :scissors: **Customisable** - Only use the parts you need for your project
- :zap: **Build tooling** - Fast development with [Vite] and [React Router v7]
- :file_folder: **Data management** - State management with [Zustand], data fetching with [SWR], and API requests with [ky]
- :iphone: **Responsive design** - Utility-first styling with [Tailwind CSS v4]
- :arrow_right_hook: **Git hooks** - Automated code quality checks with [Husky]
- :bookmark: **Versioning** - Automated SemVer versioning, changelogs, and releases with [semantic-release]
- :arrows_counterclockwise: **Dependency updates** - Automated dependency updates with [Renovate]
- :shirt: **Linting** - [ESLint], [Prettier], [stylelint], [commitlint], [knip] for unused code detection, and [cspell] for spell checking
- :building_construction: **Architecture** - [Feature-Sliced Design][fsd] with [Steiger] for architecture linting and [Plop] for scaffolding
- :white_check_mark: **Testing** - Unit and integration tests with [Vitest], E2E tests with [Playwright], API mocking with [MSW]
- :chart_with_upwards_trend: **Coverage reports** - Test coverage tracking
- :wrench: **Task runner** - Development workflows with [mise]
- :package: **Third party integrations** - [Sentry] and [PostHog] ready to configure
- :art: **UI components** - [shadcn/ui] components, [Lucide React] icons, and [React Hook Form] for forms
- :books: **Component docs** - Interactive component library with [Storybook]
- :globe_with_meridians: **Internationalization** - Multi-language support with [react-i18next]
- :shield: **Validation** - Type-safe schema validation with [Zod]

[vite]: https://vite.dev/
[react router v7]: https://reactrouter.com/
[zustand]: https://github.com/pmndrs/zustand
[swr]: https://swr.vercel.app/
[ky]: https://github.com/sindresorhus/ky
[tailwind css v4]: https://tailwindcss.com/
[husky]: https://github.com/typicode/husky
[semantic-release]: https://github.com/semantic-release/semantic-release
[renovate]: https://github.com/renovatebot/renovate
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[stylelint]: https://stylelint.io/
[commitlint]: https://commitlint.js.org/#/
[knip]: https://knip.dev/
[cspell]: https://cspell.org/
[fsd]: https://feature-sliced.design/
[steiger]: https://github.com/feature-sliced/steiger
[plop]: https://plopjs.com/
[vitest]: https://vitest.dev/
[playwright]: https://playwright.dev/
[msw]: https://mswjs.io/
[mise]: https://mise.jdx.dev/
[sentry]: https://sentry.io/
[posthog]: https://posthog.com/
[lucide react]: https://lucide.dev/
[react hook form]: https://react-hook-form.com/
[shadcn/ui]: https://ui.shadcn.com/
[storybook]: https://storybook.js.org/
[react-i18next]: https://react.i18next.com/
[zod]: https://zod.dev/

## Requirements

This project requires the following:

- [Git](https://git-scm.com/downloads)
- [mise](https://mise.jdx.dev/) for task running and version management
- [Node.js 24.12.0+](https://nodejs.org/en/download/) (auto-installed by mise)
- [pnpm 10.26.0+](https://pnpm.io/installation) (auto-installed by mise)

### Installing mise

```sh

# Install mise
curl https://mise.run | sh

For more installation options, visit the [mise installation guide](https://mise.jdx.dev/getting-started.html#installing-mise-cli).
```

Once mise is installed, it will automatically install and use the correct Node.js and pnpm versions when you enter the project directory.

### Other useful global dependencies

- [git-cz](https://www.npmjs.com/package/git-cz) for conventional commits
- [prettier](https://www.npmjs.com/package/prettier) for code formatting

## Installation

```sh
# Clone the repository
git clone https://github.com/Joshua-Booth/creact.git

# Change into the 'creact' directory
cd creact

# Install all the project's dependencies
pnpm install
```

**Note:** If you're using mise, the correct Node.js and pnpm versions will be automatically installed and activated when you enter the project directory.

## Setup

Environment variables are managed through [mise] for development:

- **Development**: Variables are set automatically via `mise.toml`'s `[env]` section
- **Production**: Set variables in your deployment platform (Vercel, Netlify, etc.)

For local customization (e.g., custom ports for git worktrees), create a `mise.local.toml` file (gitignored) to override default values.

### Port Configuration

By default, the application uses:

- Frontend dev server: `http://localhost:8080`
- Backend API server: `http://localhost:8000`

These are configured via `mise.toml` vars and can be customized in `mise.local.toml`.

### Environment Variables

The following variables are available. In development, port-related variables are auto-derived from `mise.toml`. For production, set these in your deployment platform:

| Variable name       | Dev      | Prod     | Description                                           |
| ------------------- | -------- | -------- | ----------------------------------------------------- |
| `VITE_PORT`         | Auto     | N/A      | Frontend dev server port (default: `8080`)            |
| `VITE_API_PORT`     | Auto     | N/A      | Backend API server port (default: `8000`)             |
| `VITE_API_ROOT_URL` | Auto     | Required | API URL (e.g. `https://api.example.com/`)             |
| `VITE_PUBLIC_URL`   | Auto     | Required | App public URL (e.g. `https://example.com/public`)    |
| `VITE_SENTRY_DSN`   | Optional | Optional | [Sentry DSN] for error tracking                       |
| `SENTRY_ORG`        | N/A      | Optional | Sentry organization slug (for sourcemap uploads)      |
| `SENTRY_PROJECT`    | N/A      | Optional | Sentry project slug (for sourcemap uploads)           |
| `SENTRY_AUTH_TOKEN` | N/A      | Optional | [Sentry auth token] for sourcemap uploads             |
| `VITE_POSTHOG_KEY`  | Optional | Optional | [PostHog project API key] for analytics               |
| `VITE_POSTHOG_HOST` | Optional | Optional | PostHog API host (default: `https://app.posthog.com`) |

### Git Worktree Setup

To run multiple branches simultaneously on different ports, create a `mise.local.toml` file in each worktree. The URL variables are computed automatically from the port values:

```toml
# Branch 1 (main) - uses defaults from mise.toml (port 8080, api_port 8000)

# Branch 2 (feature-a) - mise.local.toml
[vars]
port = "8081"
api_port = "8001"

# Branch 3 (feature-b) - mise.local.toml
[vars]
port = "8082"
api_port = "8002"
```

This automatically sets `VITE_PORT`, `VITE_API_PORT`, `VITE_API_ROOT_URL`, and `VITE_PUBLIC_URL` based on the port values.

[sentry dsn]: https://docs.sentry.io/product/sentry-basics/dsn-explainer/
[sentry auth token]: https://docs.sentry.io/api/auth/#auth-tokens
[posthog project api key]: https://posthog.com/docs/getting-started/send-events#how-to-find-your-project-api-key

## Code Generation

The project uses [Plop] for scaffolding FSD slices and UI components. Run the interactive generator with:

```sh
mise run generate       # Interactive prompt (alias: mise run g)
```

### Generators

#### FSD Slice

Scaffold a new feature, entity, widget, or page with selectable segments:

```sh
mise run g -- slice
```

Prompts for layer, name (kebab-case), and segments (ui, api, model, lib, config). Generates the root barrel, UI component + story, and segment placeholder files.

Example output for `mise run g -- slice` with layer `features`, name `auth`, segments `ui, api, model`:

```
src/features/auth/
  index.ts                    # Root barrel (always generated)
  ui/auth.tsx                 # Component
  ui/auth.stories.tsx         # CSF Factories story
  api/auth.ts                 # Segment placeholder
  model/auth.ts               # Segment placeholder
```

#### Custom UI Component

Scaffold a custom (non-shadcn) UI component:

```sh
mise run g -- ui
```

Generates `src/shared/ui/{name}/{name}.tsx`, `{name}.stories.tsx`, and `index.ts` barrel.

#### shadcn Component

Add a shadcn/ui component with automatic restructuring to the nested directory format:

```sh
mise run g -- shadcn
```

Runs `shadcn add`, moves the flat output into a nested `{name}/` directory, and adds the barrel file and stories skeleton.

### Available shadcn Components

Check the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the full list of available components.

[plop]: https://plopjs.com/
[shadcn/ui]: https://ui.shadcn.com/

## AI Assistant Integration

This template includes configuration for the [shadcn MCP server](https://ui.shadcn.com/docs/cli#mcp-server), enabling AI assistants to browse and install shadcn/ui components.

### Supported AI Tools

The `.mcp.json` configuration works with:

- **Claude Code** - Anthropic's CLI tool
- **Cursor** - AI-first code editor
- **VS Code Copilot** - GitHub Copilot in VS Code

### Example Prompts

Once connected, you can use natural language to work with components:

- "Show me available shadcn form components"
- "Add a dialog component to my project"
- "What input components are available?"
- "Install the accordion and tabs components"

### Manual Setup (if needed)

If the MCP server isn't automatically detected, you can start it manually:

```sh
pnpm dlx shadcn@latest mcp
```

## Usage

The project uses [mise] for task management. All tasks are defined in `mise.toml` with descriptions and aliases for easy use.

### Development

```sh
mise run dev          # Start Vite dev server (alias: mise run d)
```

Visit the site at `http://localhost:8080` (or the port configured in `mise.local.toml`).

### Production

```sh
mise run build        # Build static files for production (alias: mise run b)
mise run preview      # Preview production build locally (alias: mise run p)
```

### Testing

```sh
mise run test         # Run unit/integration tests with Vitest (alias: mise run t)
mise run test_ui      # Open Vitest UI (alias: mise run tu)
mise run test_e2e     # Run end-to-end tests with Playwright (alias: mise run te)
mise run test_coverage # Generate test coverage report (alias: mise run tc)
```

### API Mocking

E2E tests use a reusable mock system built on Playwright's route interception and [MSW] patterns. Mocks are defined in `tests/e2e/mocks/`.

**Define handlers** in `tests/e2e/mocks/handlers.ts`:

```ts
export const handlers: MockHandler[] = [
  {
    pattern: "**/auth/login/",
    status: 200,
    body: { key: "mock-token" },
  },
];

export const errorResponses = {
  login: {
    invalidCredentials: (): MockHandler => ({
      pattern: "**/auth/login/",
      status: 401,
      body: {
        non_field_errors: ["Unable to log in with provided credentials."],
      },
    }),
  },
};
```

**Use in tests** with the `network` fixture:

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

### Code Quality

```sh
mise run lint         # Run ESLint (alias: mise run l)
mise run stylelint    # Run stylelint (alias: mise run sl)
mise run typecheck    # Run TypeScript type checking (alias: mise run tt)
mise run format       # Format code with Prettier (alias: mise run f)
mise run knip         # Find unused code, exports, and dependencies (alias: mise run k)
mise run spell        # Check spelling with cspell (alias: mise run sp)
mise run steiger      # Run FSD architecture linter
```

### Other Tasks

```sh
mise tasks ls            # List all available tasks
mise run generate        # Scaffold FSD slices and components (alias: mise run g)
mise run clean           # Clean build artifacts
mise run build_analyze   # Analyze bundle size (alias: mise run ba)
mise run semantic_release # Create a new release (alias: mise run release)
mise run steiger_fix     # Run Steiger with auto-fix (alias: mise run sf)
mise run storybook       # Start Storybook dev server (alias: mise run sb)
mise run storybook_build # Build Storybook static site (alias: mise run sbb)
mise run depcruise       # Check for circular dependencies (alias: mise run dc)
mise run test_e2e_ui     # Run E2E tests in UI mode (alias: mise run teu)
mise run test_storybook  # Run Storybook component tests (alias: mise run tsb)
mise run knip_fix        # Auto-remove unused exports (alias: mise run kf)
mise run typegen         # Generate React Router route types
```

For more details on available tasks, run `mise tasks ls` or check `mise.toml`. Most tasks have aliases (e.g., `mise run b` for build, `mise run t` for test).

## Deployment

This project is configured for easy deployment to Vercel and Netlify (both with free tiers).

**Quick Start:**

1. Push code to GitHub
2. Connect to Vercel or Netlify
3. Configure environment variables (see [Environment Variables](#environment-variables))
4. Deploy - done!

### Resources

- [Deployment Guide](./docs/DEPLOYMENT.md) - Detailed deployment instructions
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)

## Support

Do you need some help? Check the out articles in the [wiki].

Check the [issues](https://github.com/Joshua-Booth/creact/issues) page to see if there is an open issue with a potential workaround.

### Additional Support

Reach out to me for support through the following methods:

- Website: [joshuabooth.nz/contact](https://joshuabooth.nz)

## License

This project is the sole property of Joshua Booth.

Copyright &copy; 2025 Joshua Booth

Please see individual licenses contained in the project where third-party
code was used, as this code is owned by its respective authors.

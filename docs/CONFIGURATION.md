# Configuration

[mise] manages environment variables in development. `mise.toml` sets them in its `[env]` section. In production, set them in your deployment platform.

For local changes, like different ports for another worktree, create a `mise.local.toml`. It's gitignored, and its values override `mise.toml`.

## Ports

By default the app uses:

- the dev server on `http://localhost:8080`
- the API on `http://localhost:8000`

Both come from `mise.toml` vars, and `mise.local.toml` can change them.

## Environment variables

[t3-env] checks every variable with a Zod schema when the app starts (see `src/shared/config/env.ts`). A missing or invalid required variable stops the boot with a clear error. In development, the port variables come from `mise.toml`. In production, set these in your deployment platform:

| Variable name       | Dev      | Prod     | Description                                            |
| ------------------- | -------- | -------- | ------------------------------------------------------ |
| `SESSION_SECRET`    | Auto     | Required | Secret for signing session cookies (server-only)       |
| `SENTRY_DSN`        | Optional | Optional | [Sentry DSN] for server-side error tracking            |
| `VITE_PORT`         | Auto     | N/A      | Frontend dev server port (default: `8080`)             |
| `VITE_API_PORT`     | Auto     | N/A      | Backend API server port (default: `8000`)              |
| `VITE_API_ROOT_URL` | Auto     | Required | API URL (e.g. `https://api.example.com/`)              |
| `VITE_PUBLIC_URL`   | Auto     | Required | App public URL (e.g. `https://example.com/public`)     |
| `VITE_SENTRY_DSN`   | Optional | Optional | [Sentry DSN] for client-side error tracking            |
| `SENTRY_ORG`        | N/A      | Optional | Sentry organisation slug (for sourcemap uploads)       |
| `SENTRY_PROJECT`    | N/A      | Optional | Sentry project slug (for sourcemap uploads)            |
| `SENTRY_AUTH_TOKEN` | N/A      | Optional | [Sentry auth token] for sourcemap uploads              |
| `VITE_POSTHOG_KEY`  | Optional | Optional | [PostHog project API key] for analytics                |
| `VITE_POSTHOG_HOST` | Optional | Optional | PostHog API host (default: `https://us.i.posthog.com`) |

To skip the check, for example in Storybook or a test runner, set `SKIP_ENV_VALIDATION=1`.

## Worktrees

To run several branches at once, give each worktree its own ports in a `mise.local.toml`. The URL variables follow the ports.

```toml
# Branch 1 (main) uses the defaults from mise.toml (port 8080, api_port 8000)

# Branch 2 (feature-a), mise.local.toml
[vars]
port = "8081"
api_port = "8001"

# Branch 3 (feature-b), mise.local.toml
[vars]
port = "8082"
api_port = "8002"
```

That sets `VITE_PORT`, `VITE_API_PORT`, `VITE_API_ROOT_URL` and `VITE_PUBLIC_URL` from the ports.

[mise]: https://mise.jdx.dev/
[t3-env]: https://env.t3.gg/
[sentry dsn]: https://docs.sentry.io/product/sentry-basics/dsn-explainer/
[sentry auth token]: https://docs.sentry.io/api/auth/#auth-tokens
[posthog project api key]: https://posthog.com/docs/getting-started/send-events#how-to-find-your-project-api-key

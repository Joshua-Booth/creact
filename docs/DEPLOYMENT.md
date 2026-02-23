# Deployment

Deploy to Netlify following the [official React Router v7 docs](https://reactrouter.com/how-to/netlify).

See [`netlify.toml`](../netlify.toml) for build configuration.

## Environment Variables

Configure these in your deployment platform's environment settings:

| Variable              | Required | Description                            |
| --------------------- | -------- | -------------------------------------- |
| `VITE_PUBLIC_URL`     | Yes      | Public URL of the deployed app         |
| `VITE_API_ROOT_URL`   | Yes      | Backend API base URL                   |
| `VITE_SENTRY_DSN`     | No       | Sentry DSN for error tracking          |
| `VITE_POSTHOG_KEY`    | No       | PostHog project API key                |
| `VITE_POSTHOG_HOST`   | No       | PostHog instance URL (default: app.posthog.com) |

## Local Production Testing

Test production builds locally with Docker:

```bash
docker build -t creact-test \
  --build-arg VITE_PUBLIC_URL=http://localhost:8080 \
  --build-arg VITE_API_ROOT_URL=https://api.example.com \
  -f config/docker/Dockerfile.test .

docker run -p 8080:8080 creact-test
```

Visit `http://localhost:8080` to test.

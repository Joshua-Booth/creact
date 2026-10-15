# Deployment

creact deploys to Netlify, following the [React Router guide](https://reactrouter.com/how-to/netlify). [`netlify.toml`](../netlify.toml) has the build settings.

Set the production environment variables in Netlify. [Configuration](./CONFIGURATION.md#environment-variables) lists them, and the app won't start without the required ones.

## Test a production build locally

Build and run it with Docker:

```bash
docker build -t creact-test \
  --build-arg VITE_PUBLIC_URL=http://localhost:8080 \
  --build-arg VITE_API_ROOT_URL=https://api.example.com \
  -f config/docker/Dockerfile.test .

docker run -p 8080:8080 creact-test
```

Then open `http://localhost:8080`.

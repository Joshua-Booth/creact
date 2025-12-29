# Deployment Guide

Quick reference for deploying creact to Vercel or Netlify.

## Platform Choice

| Feature          | Vercel  | Netlify |
| ---------------- | ------- | ------- |
| Free Tier        | ✅ Yes  | ✅ Yes  |
| Auto HTTPS       | ✅ Yes  | ✅ Yes  |
| Global CDN       | ✅ Yes  | ✅ Yes  |
| Auto Deployments | ✅ Yes  | ✅ Yes  |
| Preview URLs     | ✅ Yes  | ✅ Yes  |
| Custom Domains   | ✅ Yes  | ✅ Yes  |
| Edge Functions   | ✅ Yes  | ✅ Yes  |
| Zero Config      | ✅ Best | ⚠️ Good |

**Recommendation:** Use Vercel for best React Router v7 support and zero configuration.

## Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `.env.production.example` reviewed
- [ ] Production API URL known
- [ ] Sentry/PostHog accounts (if using)

## Vercel Deployment (5 minutes)

### 1. Prepare

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login
```

### 2. Deploy to Preview

```bash
# From project root
vercel
```

This creates a preview URL (e.g., `https://your-app.vercel.app`).

### 3. Configure Environment Variables

Go to: https://vercel.com/your-username/your-app/settings/environment-variables

Add these (all as "Production"):

**Required:**

```
VITE_PUBLIC_URL=https://your-app.vercel.app
VITE_API_ROOT_URL=https://api.your-backend.com
```

**Optional (Sentry):**

```
VITE_SENTRY_DSN=https://sentry.io/...
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=sntrys_...
```

**Optional (PostHog):**

```
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://app.posthog.com
```

### 4. Deploy to Production

```bash
vercel --prod
```

Done! 🎉

## Netlify Deployment (5 minutes)

### 1. Prepare

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login
```

### 2. Deploy to Preview

```bash
# From project root
netlify init
```

Follow prompts:

- Create & deploy manually
- Build command: `pnpm build`
- Publish directory: `dist`

### 3. Configure Environment Variables

Go to: Netlify Dashboard → Your Site → Site Settings → Build & deploy → Environment

Add these (all for "Production" context):

**Required:**

```
VITE_PUBLIC_URL=https://your-app.netlify.app
VITE_API_ROOT_URL=https://api.your-backend.com
```

**Optional (Sentry):**

```
VITE_SENTRY_DSN=https://sentry.io/...
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=sntrys_...
```

**Optional (PostHog):**

```
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://app.posthog.com
```

### 4. Deploy to Production

```bash
netlify deploy --prod
```

Done! 🎉

## Testing Locally Before Deploy

```bash
# Build production version
pnpm build

# Preview locally
pnpm preview
```

Visit `http://localhost:8080` to test.

## With Docker (Optional)

For testing production-like environment locally:

```bash
# Build Docker image with production env vars
docker build -t creact-test \
  --build-arg VITE_PUBLIC_URL=https://your-app.vercel.app \
  --build-arg VITE_API_ROOT_URL=https://api.your-backend.com \
  -f Dockerfile.test .

# Run preview
docker run -p 8080:8080 creact-test
```

## Common Issues

### Environment Variables Not Working

**Problem:** App acts like variables are empty

**Solution:**

- Vercel: Make sure variables are set under "Environment Variables", not just during build
- Netlify: Set variables for "Production" context

### Build Fails

**Problem:** Build step fails in platform

**Solution:**

- Check build logs in platform dashboard
- Ensure `pnpm` is available (may need to change to `npm ci`)
- Verify all dependencies in `package.json`

### Blank Page After Deploy

**Problem:** Page loads but is blank

**Solution:**

- Check browser console for JavaScript errors
- Verify `VITE_PUBLIC_URL` is correct
- Check that `dist` directory was created
- Verify static files are being served

### API Requests Failing

**Problem:** API calls fail in production but work locally

**Solution:**

- Check `VITE_API_ROOT_URL` is set to production API
- Verify CORS is configured on backend
- Test API URL from browser
- Check network tab in browser dev tools

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [React Router Deployment](https://reactrouter.com/start/framework/deploying)
- [Vite Deployment](https://vite.dev/guide/deployment.html)

## Environment Variables Reference

See [`.env.production.example`](./.env.production.example) for complete documentation.

## File Structure

Deployment-related files:

```
creact/
├── .env.production.example    # Template for env vars
├── Dockerfile.test            # Local testing with Docker
├── .dockerignore            # Exclude files from Docker build
├── vercel.json              # Vercel configuration (auto-detected)
├── DEPLOYMENT.md            # This file
└── README.md                # Full documentation
```

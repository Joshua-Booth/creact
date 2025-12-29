# Dev Container Configuration

This directory contains the configuration for the VS Code Dev Container that provides a consistent, isolated development environment for the creact project.

## What's Included

- **Node.js 24.12.0** - The exact Node.js version specified in `mise.toml`
- **pnpm 10.26.0** - The package manager used by this project
- **mise** - Version manager for Node.js and other tools
- **Playwright browsers** - Chromium, Firefox, and WebKit for E2E testing
- **VS Code extensions** - All recommended extensions pre-installed
- **Port forwarding** - Automatic forwarding of port 8080 (Vite dev server)

## Quick Start

### Using VS Code (Recommended)

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this project in VS Code
3. Press `F1` and select "Dev Containers: Reopen in Container"
4. Wait for the container to build (first time may take several minutes)
5. Once built, dependencies will be installed automatically

### Using GitHub Codespaces

1. Push this project to GitHub
2. Click the "Code" button and select "Codespaces"
3. Create a new codespace
4. The container will be built automatically

### Using Docker CLI

```bash
docker build -t creact-devcontainer -f .devcontainer/Dockerfile .
docker run -it -p 8080:8080 -v $(pwd):/workspace creact-devcontainer
```

## Environment Configuration

The devcontainer uses the following default environment variables (defined in `devcontainer.json`):

- `NODE_ENV=development`
- `VITE_PORT=8080`
- `VITE_API_PORT=8000`
- `VITE_API_ROOT_URL=http://localhost:8000`
- `VITE_PUBLIC_URL=http://localhost:8080/public`

### Customizing Environment Variables

Create a `.devcontainer/devcontainer.env.local` file with your custom values:

```bash
cp .devcontainer/devcontainer.env .devcontainer/devcontainer.env.local
```

Then update `devcontainer.json` to load it:

```json
"remoteEnv": {
  "PATH": "${containerEnv:PATH}",
  "NODE_ENV": "${localEnv:NODE_ENV:development}",
  // ... other variables
}
```

## Development Workflow

Once inside the container, use mise tasks (defined in `.mise/tasks/`):

```bash
# Start development server
mise run dev

# Run tests
mise run test

# Run linter
mise run lint

# Build for production
mise run build
```

## Troubleshooting

### Container won't build

- Check Docker is running: `docker ps`
- Rebuild the container from VS Code: `F1` → "Dev Containers: Rebuild Container"

### Port 8080 already in use

- Change `VITE_PORT` in your environment variables
- Update the `forwardPorts` array in `devcontainer.json`

### Dependencies won't install

- Check network connectivity inside the container
- Try manually running `pnpm install` in the container terminal
- Clear pnpm cache: `pnpm store prune`

### Playwright browsers missing

- The browsers are installed during Docker build
- If missing, run: `npx playwright install --with-deps`

### mise not found

- The container should have mise installed via the Dockerfile
- Verify with: `mise --version`
- If not found, rebuild the container

## Performance Tips

1. **Volume mounting**: The container mounts `node_modules` for better performance
2. **pnpm store**: The pnpm store is mounted to avoid re-downloading dependencies
3. **File watching**: VS Code uses file watching for live reload - ensure file limits are adequate

## Updating the Container

To update the devcontainer after making changes:

1. Update `Dockerfile`, `devcontainer.json`, or `devcontainer.env`
2. Rebuild the container: `F1` → "Dev Containers: Rebuild Container"
3. Dependencies will be reinstalled automatically

## File Structure

```
.devcontainer/
├── devcontainer.json      # Main configuration file
├── Dockerfile             # Container image definition
├── devcontainer.env       # Default environment variables
├── devcontainer.env.local # Your custom environment (gitignored)
└── README.md              # This file
```

## Additional Resources

- [VS Code Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Features](https://containers.dev/features)
- [mise Documentation](https://mise.jdx.dev/)
- [pnpm Documentation](https://pnpm.io/)

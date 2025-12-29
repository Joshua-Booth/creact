FROM node:24.12.0-bookworm-slim

# Install common dependencies and tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    gnupg \
    lsb-release \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Install mise (asdf-like version manager)
RUN curl https://mise.run | sh

# Add mise to PATH for all users
ENV PATH="/root/.local/share/mise:${PATH}"
RUN echo 'export PATH="/root/.local/share/mise:${PATH}"' >> /etc/profile

# Install pnpm globally
RUN npm install -g pnpm@10.26.0

# Install Playwright browsers
RUN npx playwright install --with-deps chromium firefox webkit

# Create app directory
WORKDIR /workspace

# Set up non-root user for better security
RUN useradd -m -s /bin/bash vscode \
    && usermod -aG sudo vscode \
    && echo '%vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Copy mise config to enable automatic version management
COPY mise.toml /tmp/
RUN chown -R vscode:vscode /tmp/mise.toml /workspace

# Switch to vscode user
USER vscode

# Set up mise for vscode user
RUN echo 'eval "$(~/.local/share/mise/shims.sh)"' >> /home/vscode/.bashrc \
    && echo 'export PATH="/home/vscode/.local/share/mise:${PATH}"' >> /home/vscode/.bashrc

# Set working directory for the user
WORKDIR /workspace

# Expose the Vite dev server port
EXPOSE 8080

# Default command (will be overridden by devcontainer.json)
CMD ["/bin/bash"]

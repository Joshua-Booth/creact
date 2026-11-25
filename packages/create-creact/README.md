# create-creact

Starts a React monorepo set up the way [creact](https://github.com/Joshua-Booth/creact) is: lint, format, strict tsconfig, git hooks, tests and the agent setup, all passing from the first commit.

```sh
pnpm create creact my-app
```

It asks for nothing. Pick a stack with a flag, or pass `--yes` for React Router on Tailwind:

```sh
pnpm create creact my-app --stack next --styling stylex
pnpm create creact my-app --yes
```

In a terminal it shows each step as it runs. Piped, in CI or in an agent's shell, it prints one plain line per step, and `--json` prints one object. `--help` lists every flag.

It needs Node 24 and pnpm. The full guide is in [docs/CREATE-CREACT.md](https://github.com/Joshua-Booth/creact/blob/master/docs/CREATE-CREACT.md).

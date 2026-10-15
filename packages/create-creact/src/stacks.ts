import type { StylingId } from "./options.ts";

export interface Stack {
  /** The upstream create CLI, run with `pnpm dlx` at `latest`. Its bin has the same name. */
  readonly cli: string;
  /** Everything after the project name. Install and git stay off: creact runs both once, after the layer. */
  readonly flags: Readonly<Record<StylingId, readonly string[]>>;
  /** A file every base of this stack has. Its absence means upstream changed shape. */
  readonly signature: string;
  /** The directory upstream's `paths` alias points at. */
  readonly srcRoot: string;
  readonly globalCss: string;
  /** Writes route types. Type-aware lint and tsc need them first. */
  readonly typegen: string;
}

export const STACKS = {
  "react-router": {
    cli: "create-react-router",
    flags: {
      tailwind: [
        "--yes",
        "--no-install",
        "--no-git-init",
        "--package-manager",
        "pnpm",
        "--agent-skills",
        "--no-motion",
        "--no-color",
      ],
    },
    signature: "react-router.config.ts",
    srcRoot: "app",
    globalCss: "app/app.css",
    typegen: "react-router typegen",
  },
  next: {
    cli: "create-next-app",
    // --yes fills every option not given from preferences saved under HOME,
    // so each one is spelled out. --no-linter and --no-react-compiler are
    // missing from --help but read from argv.
    flags: {
      tailwind: [
        "--yes",
        "--ts",
        "--tailwind",
        "--no-linter",
        "--no-react-compiler",
        "--cache-components",
        "--app",
        "--src-dir",
        "--import-alias",
        "@/*",
        "--agents-md",
        "--skip-install",
        "--disable-git",
        "--use-pnpm",
        "--no-agent-feedback",
      ],
    },
    signature: "next.config.ts",
    srcRoot: "src",
    globalCss: "src/app/globals.css",
    typegen: "next typegen",
  },
} as const satisfies Record<string, Stack>;

export type StackId = keyof typeof STACKS;

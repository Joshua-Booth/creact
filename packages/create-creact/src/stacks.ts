import type { StylingId } from "./options.ts";

export interface Stack {
  readonly cli: string;
  readonly flags: Readonly<Record<StylingId, readonly string[]>>;
  readonly skipInstall: string;
  readonly skipGit: string;
  readonly signature: string;
  readonly srcRoot: string;
  readonly globalCss: string;
  readonly typegen: string;
}

export const STACKS = {
  "react-router": {
    cli: "create-react-router",
    flags: {
      tailwind: [
        "--yes",
        "--package-manager",
        "pnpm",
        "--agent-skills",
        "--no-motion",
        "--no-color",
      ],
    },
    skipInstall: "--no-install",
    skipGit: "--no-git-init",
    signature: "react-router.config.ts",
    srcRoot: "app",
    globalCss: "app/app.css",
    typegen: "react-router typegen",
  },
  next: {
    cli: "create-next-app",
    // --no-linter and --no-react-compiler are missing from --help but read
    // from argv.
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
        "--use-pnpm",
        "--no-agent-feedback",
      ],
    },
    skipInstall: "--skip-install",
    skipGit: "--disable-git",
    signature: "next.config.ts",
    srcRoot: "src",
    globalCss: "src/app/globals.css",
    typegen: "next typegen",
  },
} as const satisfies Record<string, Stack>;

export type StackId = keyof typeof STACKS;

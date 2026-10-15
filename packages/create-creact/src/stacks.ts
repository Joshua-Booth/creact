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

// create-react-router has no styling flag and always writes Tailwind, which
// the stylex overlay prunes.
const REACT_ROUTER_FLAGS = [
  "--yes",
  "--package-manager",
  "pnpm",
  "--agent-skills",
  "--no-motion",
  "--no-color",
];

// --no-linter and --no-react-compiler are missing from create-next-app's
// --help but read from argv.
function nextFlags(tailwind: "--tailwind" | "--no-tailwind"): string[] {
  return [
    "--yes",
    "--ts",
    tailwind,
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
  ];
}

export const STACKS = {
  "react-router": {
    cli: "create-react-router",
    flags: { tailwind: REACT_ROUTER_FLAGS, stylex: REACT_ROUTER_FLAGS },
    skipInstall: "--no-install",
    skipGit: "--no-git-init",
    signature: "react-router.config.ts",
    srcRoot: "app",
    globalCss: "app/app.css",
    typegen: "react-router typegen",
  },
  next: {
    cli: "create-next-app",
    flags: {
      tailwind: nextFlags("--tailwind"),
      stylex: nextFlags("--no-tailwind"),
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

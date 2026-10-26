import type { Built, Feature, ProjectName } from "./options.ts";

export const BTS = "create-better-t-stack@3.48.0";

export interface Stack {
  readonly signature: string;
}

export const STACKS = {
  "react-router": { signature: "apps/web/react-router.config.ts" },
  next: { signature: "apps/web/next.config.ts" },
} as const satisfies Record<string, Stack>;

export type StackId = keyof typeof STACKS;

export const MONOREPOS = {
  pnpm: { status: "built", summary: "pnpm workspaces", addon: "none" },
  turborepo: { status: "built", summary: "Turborepo", addon: "turborepo" },
  nx: { status: "built", summary: "Nx", addon: "nx" },
} as const satisfies Record<string, Feature & { readonly addon: string }>;

export type MonorepoId = Built<typeof MONOREPOS>;

const NONE = [
  "backend",
  "runtime",
  "database",
  "orm",
  "api",
  "auth",
  "payments",
  "examples",
  "db-setup",
  "web-deploy",
  "server-deploy",
];

export function btsArgs(
  name: ProjectName,
  stack: StackId,
  monorepo: MonorepoId
): readonly string[] {
  return [
    name,
    "--frontend",
    stack,
    "--addons",
    MONOREPOS[monorepo].addon,
    ...NONE.flatMap((option) => [`--${option}`, "none"]),
    "--no-install",
    "--no-git",
    "--package-manager",
    "pnpm",
    "--disable-analytics",
    "--no-render-title",
  ];
}

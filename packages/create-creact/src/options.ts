import path from "node:path";
import { parseArgs } from "node:util";

import { type StackId, STACKS } from "./stacks.ts";

interface Feature {
  readonly status: "built" | "planned";
  readonly summary: string;
  readonly note?: string;
}

type Built<R> = {
  [K in keyof R]: R[K] extends { readonly status: "built" } ? K : never;
}[keyof R] &
  string;

export const STYLINGS = {
  tailwind: { status: "built", summary: "Tailwind CSS" },
  stylex: { status: "built", summary: "StyleX" },
} as const satisfies Record<string, Feature>;

export const EXTRAS = {
  storybook: {
    status: "planned",
    summary: "Storybook, with stories run as tests",
  },
  msw: {
    status: "planned",
    summary: "MSW handlers shared by tests and Storybook",
  },
  playwright: { status: "planned", summary: "Playwright end-to-end tests" },
  i18n: { status: "planned", summary: "i18next with typed resources" },
  posthog: {
    status: "planned",
    summary: "PostHog, set up by its official skill",
  },
  sentry: {
    status: "planned",
    summary: "Sentry, set up by its official skill",
  },
} as const satisfies Record<string, Feature>;

export type StylingId = Built<typeof STYLINGS>;
export type ExtraId = Built<typeof EXTRAS>;

export interface Choices {
  readonly stack: StackId;
  readonly styling: StylingId;
  readonly extras: readonly ExtraId[];
}

export const DEFAULTS = {
  stack: "react-router",
  styling: "tailwind",
} as const satisfies Omit<Choices, "extras">;

export interface Request {
  readonly dir: string;
  readonly stack: StackId | undefined;
  readonly styling: StylingId | undefined;
  readonly extras: readonly ExtraId[];
  readonly yes: boolean;
  readonly install: boolean;
  readonly git: boolean;
}

export type Parsed =
  | { readonly kind: "run"; readonly request: Request }
  | { readonly kind: "help"; readonly text: string }
  | { readonly kind: "usage"; readonly message: string };

export class UsageError extends Error {
  override readonly name = "UsageError";
}

type ExtraName = keyof typeof EXTRAS;

const EXTRA_NAMES = Object.keys(EXTRAS) as ExtraName[];

const OPTIONS = {
  stack: { type: "string" },
  styling: { type: "string" },
  install: { type: "boolean", default: true },
  git: { type: "boolean", default: true },
  yes: { type: "boolean", short: "y", default: false },
  help: { type: "boolean", short: "h", default: false },
  ...(Object.fromEntries(
    EXTRA_NAMES.map((name) => [name, { type: "boolean", default: false }])
  ) as Record<ExtraName, { type: "boolean"; default: false }>),
} as const;

type Lookup<R> =
  | { readonly kind: "built"; readonly id: Built<R> }
  | { readonly kind: "planned"; readonly flag: string }
  | { readonly kind: "unknown" };

export function isBuilt<R extends Readonly<Record<string, Feature>>>(
  registry: R,
  key: string
): key is Built<R> {
  return Object.hasOwn(registry, key) && registry[key]?.status === "built";
}

function lookup<R extends Readonly<Record<string, Feature>>>(
  registry: R,
  key: string,
  flag: string
): Lookup<R> {
  if (isBuilt(registry, key)) return { kind: "built", id: key };
  const feature = Object.hasOwn(registry, key) ? registry[key] : undefined;
  if (feature === undefined) return { kind: "unknown" };
  return {
    kind: "planned",
    flag: feature.note === undefined ? flag : `${flag} (${feature.note})`,
  };
}

export function parseRequest(argv: readonly string[], cwd: string): Parsed {
  let parsed;
  try {
    parsed = parseArgs({
      args: [...argv],
      options: OPTIONS,
      strict: true,
      allowPositionals: true,
      allowNegative: true,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return usage(`${reason}. Run with --help to see the flags.`);
  }
  const { values, positionals } = parsed;
  if (values.help) return { kind: "help", text: helpText() };

  const [dir, ...rest] = positionals;
  if (dir === undefined || rest.length > 0) {
    return usage("give one project directory, as in: create-creact my-app");
  }

  if (values.stack !== undefined && !Object.hasOwn(STACKS, values.stack)) {
    return usage(`--stack must be one of ${Object.keys(STACKS).join(", ")}`);
  }
  const stack = values.stack as StackId | undefined;

  const planned: string[] = [];
  let styling: StylingId | undefined;
  if (values.styling !== undefined) {
    const found = lookup(
      STYLINGS,
      values.styling,
      `--styling ${values.styling}`
    );
    if (found.kind === "unknown") {
      return usage(
        `--styling must be one of ${Object.keys(STYLINGS).join(", ")}`
      );
    }
    if (found.kind === "planned") planned.push(found.flag);
    else styling = found.id;
  }

  const extras: ExtraId[] = [];
  for (const name of EXTRA_NAMES.filter((extra) => values[extra])) {
    const found = lookup(EXTRAS, name, `--${name}`);
    if (found.kind === "planned") planned.push(found.flag);
    if (found.kind === "built") extras.push(found.id);
  }

  if (planned.length > 0) {
    return usage(
      `not built yet: ${planned.join(", ")}. Rerun without these flags.`
    );
  }

  return {
    kind: "run",
    request: {
      dir: path.resolve(cwd, dir),
      stack,
      styling,
      extras,
      yes: values.yes,
      install: values.install,
      git: values.git,
    },
  };
}

export function resolveChoices(
  request: Request,
  recorded: Choices | undefined
): Choices {
  if (recorded !== undefined) {
    for (const key of ["stack", "styling"] as const) {
      const asked = request[key];
      if (asked !== undefined && asked !== recorded[key]) {
        throw new UsageError(
          `${request.dir} is recorded as ${key} ${recorded[key]}, so --${key} ${asked} can't apply`
        );
      }
    }
    return {
      ...recorded,
      extras: [...new Set([...recorded.extras, ...request.extras])],
    };
  }

  const stack = request.stack ?? (request.yes ? DEFAULTS.stack : undefined);
  if (stack === undefined) {
    throw new UsageError(
      `choose a stack with --stack ${Object.keys(STACKS).join("|")}, or pass --yes for ${DEFAULTS.stack}`
    );
  }
  return {
    stack,
    styling: request.styling ?? DEFAULTS.styling,
    extras: request.extras,
  };
}

function usage(message: string): Parsed {
  return { kind: "usage", message };
}

function choicesLine(registry: Readonly<Record<string, Feature>>): string {
  const ids = Object.entries(registry);
  const built = ids.filter(([, feature]) => feature.status === "built");
  const planned = ids.filter(([, feature]) => feature.status === "planned");
  const names = built.map(([id]) => id).join(", ");
  return planned.length === 0
    ? names
    : `${names}; planned: ${planned.map(([id]) => id).join(", ")}`;
}

function helpText(): string {
  const registry: Readonly<Record<string, Feature>> = EXTRAS;
  const extras = Object.entries(registry).map(
    ([id, extra]) =>
      `  --${id.padEnd(16)}${extra.status === "planned" ? "planned: " : ""}${extra.summary}`
  );
  return [
    "Usage: create-creact <dir> [flags]",
    "",
    "Creates a React project with the framework's own create CLI, then adds",
    "creact's lint, format, tsconfig, git hooks and test setup.",
    "",
    `  --stack <id>      ${Object.keys(STACKS).join(", ")} (--yes picks ${DEFAULTS.stack})`,
    `  --styling <id>    ${choicesLine(STYLINGS)} (default ${DEFAULTS.styling})`,
    ...extras,
    "  --no-install      skip pnpm install and the format and lint pass",
    "  --no-git          skip git init",
    "  -y, --yes         take the default for every choice not given",
    "  -h, --help        show this help",
    "",
    "The directory must sit outside any git repository, as the project gets",
    "its own.",
    "",
    "Run it again on the same directory to finish an interrupted run or take a",
    "newer layer. Layer files you edited are kept and reported. package.json",
    "and tsconfig.json are merged again, so the scripts and compiler options",
    "creact sets go back to creact's values.",
    "",
    "Exit codes: 0 done, 1 a command failed, 2 bad usage or a planned feature.",
    "",
  ].join("\n");
}

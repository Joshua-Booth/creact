import path from "node:path";
import { parseArgs } from "node:util";

import { type MonorepoId, MONOREPOS, type StackId, STACKS } from "./stacks.ts";

export interface Feature {
  readonly status: "built" | "planned";
  readonly summary: string;
  readonly note?: string;
  readonly onlyWith?: readonly (keyof typeof STYLINGS)[];
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
  shadcn: {
    status: "planned",
    summary: "shadcn/ui components from creact's registry",
    onlyWith: ["tailwind"],
  },
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
  readonly monorepo: MonorepoId;
  readonly extras: readonly ExtraId[];
}

export const DEFAULTS = {
  stack: "react-router",
  styling: "tailwind",
  monorepo: "pnpm",
} as const satisfies Omit<Choices, "extras">;

declare const projectNameBrand: unique symbol;
export type ProjectName = string & { readonly [projectNameBrand]: true };

export interface Request {
  readonly dir: string;
  readonly stack: StackId | undefined;
  readonly styling: StylingId | undefined;
  readonly monorepo: MonorepoId | undefined;
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
  monorepo: { type: "string" },
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

  const styling =
    values.styling === undefined
      ? undefined
      : lookup(STYLINGS, values.styling, `--styling ${values.styling}`);
  if (styling?.kind === "unknown") {
    return usage(
      `--styling must be one of ${Object.keys(STYLINGS).join(", ")}`
    );
  }
  const monorepo =
    values.monorepo === undefined
      ? undefined
      : lookup(MONOREPOS, values.monorepo, `--monorepo ${values.monorepo}`);
  if (monorepo?.kind === "unknown") {
    return usage(
      `--monorepo must be one of ${Object.keys(MONOREPOS).join(", ")}`
    );
  }

  const extras = EXTRA_NAMES.filter((extra) => values[extra]).map((name) =>
    lookup(EXTRAS, name, `--${name}`)
  );
  const planned = [styling, monorepo, ...extras].flatMap((found) =>
    found?.kind === "planned" ? [found.flag] : []
  );

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
      styling: styling?.kind === "built" ? styling.id : undefined,
      monorepo: monorepo?.kind === "built" ? monorepo.id : undefined,
      extras: extras.flatMap((found) =>
        found.kind === "built" ? [found.id] : []
      ),
      yes: values.yes,
      install: values.install,
      git: values.git,
    },
  };
}

export function resolveChoices(
  request: Request,
  recorded: Choices | undefined,
  registry: Readonly<Record<string, Feature>> = EXTRAS
): Choices {
  const choices = choose(request, recorded);
  const extras: readonly string[] = choices.extras;
  for (const extra of extras) {
    const onlyWith = registry[extra]?.onlyWith;
    if (onlyWith !== undefined && !onlyWith.includes(choices.styling)) {
      throw new UsageError(
        `--${extra} works with --styling ${onlyWith.join("|")}, and ${request.dir} is ${choices.styling}`
      );
    }
  }
  return choices;
}

function choose(request: Request, recorded: Choices | undefined): Choices {
  if (recorded !== undefined) {
    for (const key of ["stack", "styling", "monorepo"] as const) {
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
    monorepo: request.monorepo ?? DEFAULTS.monorepo,
    extras: request.extras,
  };
}

export function isProjectName(name: string): name is ProjectName {
  return /^[a-z0-9][a-z0-9._-]*$/.test(name);
}

export function projectName(dir: string): ProjectName {
  const name = path.basename(dir);
  if (!isProjectName(name)) {
    throw new UsageError(
      `${name} would become the package scope @${name}, so it needs lowercase letters, digits, ".", "_" or "-", starting with a letter or digit. Pick another directory name.`
    );
  }
  return name;
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
  const extras = Object.entries(registry).map(([id, extra]) => {
    const planned = extra.status === "planned" ? "planned: " : "";
    const only =
      extra.onlyWith === undefined
        ? ""
        : ` (${extra.onlyWith.join(", ")} only)`;
    return `  --${id.padEnd(16)}${planned}${extra.summary}${only}`;
  });
  return [
    "Usage: create-creact <dir> [flags]",
    "",
    "Creates a React monorepo with Better-T-Stack, then adds creact's lint,",
    "format, tsconfig, git hooks and test setup.",
    "",
    `  --stack <id>      ${Object.keys(STACKS).join(", ")} (--yes picks ${DEFAULTS.stack})`,
    `  --styling <id>    ${choicesLine(STYLINGS)} (default ${DEFAULTS.styling})`,
    `  --monorepo <id>   ${choicesLine(MONOREPOS)} (default ${DEFAULTS.monorepo})`,
    ...extras,
    "  --no-install      skip pnpm install and the format and lint pass",
    "  --no-git          skip git init",
    "  -y, --yes         take the default for every choice not given",
    "  -h, --help        show this help",
    "",
    "The directory must sit outside any git repository, as the project gets",
    "its own. Its name becomes the package scope, as in @my-app/ui, so it",
    'needs lowercase letters, digits, ".", "_" or "-".',
    "",
    "Run it again on the same directory to finish an interrupted run or take a",
    "newer layer. Layer files you edited are kept and reported. The",
    "package.json and tsconfig files creact patches are merged again, so the",
    "scripts and compiler options creact sets go back to creact's values.",
    "",
    "Exit codes: 0 done, 1 a command failed, 2 bad usage or a planned feature.",
    "",
  ].join("\n");
}

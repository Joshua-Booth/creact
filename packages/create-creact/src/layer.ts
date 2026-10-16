/* oxlint-disable security/detect-non-literal-fs-filename -- every path is under the project dir or the CLI's own layer dir */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
  lstat,
  mkdir,
  readdir,
  readFile,
  readlink,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  type Choices,
  type ExtraId,
  EXTRAS,
  isBuilt,
  isProjectName,
  type ProjectName,
  type StylingId,
  STYLINGS,
  UsageError,
} from "./options.ts";
import { type MonorepoId, MONOREPOS, type StackId, STACKS } from "./stacks.ts";

export type Json =
  | string
  | number
  | boolean
  | null
  | readonly Json[]
  | { readonly [key: string]: Json };
export type JsonObject = Readonly<Record<string, Json>>;

// oxlint-disable-next-line typescript/no-redundant-type-constituents -- ExtraId is never until the first extra is built
export type OverlayId = "base" | StylingId | ExtraId;

export type Scope = "all" | StackId;

export const JSON_FILES = [
  "package.json",
  "tsconfig.json",
  "packages/config/tsconfig.base.json",
  "apps/web/package.json",
  "apps/web/tsconfig.json",
] as const;

export type JsonFile = (typeof JSON_FILES)[number];

export type Manifest = Extract<
  JsonFile,
  "package.json" | `${string}/package.json`
>;

const MANIFESTS = JSON_FILES.filter((file): file is Manifest =>
  file.endsWith("package.json")
);

export interface Packages {
  readonly dependencies: readonly string[];
  readonly devDependencies: readonly string[];
}

export interface Addition extends Packages {
  readonly manifest: Manifest;
}

export interface Removal {
  readonly [key: string]: Removal | null;
}

interface Prune {
  readonly paths?: readonly string[];
  readonly json?: Readonly<Partial<Record<JsonFile, Removal>>>;
}

interface Part {
  readonly json?: Readonly<Partial<Record<JsonFile, JsonObject>>>;
  readonly packages?: Readonly<Partial<Record<Manifest, Partial<Packages>>>>;
  readonly skills?: readonly SkillId[];
  readonly prune?: Prune;
}

export interface Skill {
  readonly source: string;
  readonly skillPath: string;
  readonly computedHash: string;
}

export const CREACT_LOCK = {
  "agent-browser": {
    source: "vercel-labs/agent-browser",
    skillPath: "skills/agent-browser/SKILL.md",
    computedHash:
      "80161e6836b3b40f4e83730a290deb40ac14d877d38c97ad5f6d71be37ce74c3",
  },
  "find-skills": {
    source: "vercel-labs/skills",
    skillPath: "skills/find-skills/SKILL.md",
    computedHash:
      "b146008599c31057cef1c145774cea5d5afb30e8f43fa802e47a4b461419aaaf",
  },
  "grill-me": {
    source: "mattpocock/skills",
    skillPath: "skills/productivity/grill-me/SKILL.md",
    computedHash:
      "9cdbb4b8f7a3aeaef82e6230c9e823500d4a8a1214c726cf342cf9829d34fc7d",
  },
  shadcn: {
    source: "shadcn/ui",
    skillPath: "skills/shadcn/SKILL.md",
    computedHash:
      "b864a958765563321f485a96f4d59c0bb6539f4286ab6d8b8b66895b7ebd302d",
  },
  "systematic-debugging": {
    source: "obra/superpowers",
    skillPath: "skills/systematic-debugging/SKILL.md",
    computedHash:
      "276fb0aadb002ab930cc2a56de89e16995a2e3e70b33587652bf0a5fb123148d",
  },
  tdd: {
    source: "mattpocock/skills",
    skillPath: "skills/engineering/tdd/SKILL.md",
    computedHash:
      "daf55026f456af104a72fa43247f7bcec89e5127316dc5b1b8d675d6a9d8ce94",
  },
  "vercel-composition-patterns": {
    source: "vercel-labs/agent-skills",
    skillPath: "skills/composition-patterns/SKILL.md",
    computedHash:
      "575757e3e25761c8c562d6e395d29f0b76c98b1273c0bd72d88e6ab1bc9c7d42",
  },
  "vercel-react-best-practices": {
    source: "vercel-labs/agent-skills",
    skillPath: "skills/react-best-practices/SKILL.md",
    computedHash:
      "ca7b0c0c6e5f2750043f7f0cd72d16ac4e2abc48f9b5500d047a4b77a2506212",
  },
} as const satisfies Record<string, Skill>;

export type SkillId = keyof typeof CREACT_LOCK;

export const SKILLS_CLI = "skills@1.7.2";
export const SKILLS_LOCK = "skills-lock.json";
export const SKILLS_DIR = ".agents/skills";
export const CLAUDE_SKILLS = ".claude/skills";

export type Overlay = Readonly<Partial<Record<Scope, Part>>>;

function withoutDependencies(names: readonly string[]): Removal {
  const gone = Object.fromEntries(names.map((name) => [name, null]));
  return { dependencies: gone, devDependencies: gone };
}

const STRICT = {
  strict: true,
  noUncheckedIndexedAccess: true,
  noImplicitOverride: true,
  erasableSyntaxOnly: true,
  verbatimModuleSyntax: true,
  forceConsistentCasingInFileNames: true,
} as const satisfies JsonObject;

export const OVERLAYS: Readonly<Record<OverlayId, Overlay>> = {
  base: {
    all: {
      json: {
        "package.json": {
          type: "module",
          scripts: {
            lint: "pnpm -r --if-present typegen && oxlint --max-warnings 0",
            format: "oxfmt",
            "format:check": "oxfmt --check",
            typecheck: "pnpm -r --if-present check-types && tsc",
            test: "vitest run",
            prepare: "husky || true",
          },
        },
        "tsconfig.json": {
          include: ["*.ts"],
          compilerOptions: { noEmit: true, allowImportingTsExtensions: true },
        },
        "packages/config/tsconfig.base.json": { compilerOptions: STRICT },
        "apps/web/package.json": {
          type: "module",
          scripts: { "check-types": "pnpm run typegen && tsc --noEmit" },
        },
        "apps/web/tsconfig.json": { compilerOptions: STRICT },
      },
      packages: {
        "package.json": {
          devDependencies: [
            "@commitlint/cli",
            "@commitlint/config-conventional",
            "@commitlint/types",
            "@eslint-community/eslint-plugin-eslint-comments",
            "@eslint-react/eslint-plugin",
            "eslint-plugin-barrel-files",
            "eslint-plugin-check-file",
            "eslint-plugin-depend",
            "eslint-plugin-jsdoc",
            "eslint-plugin-perfectionist",
            "eslint-plugin-react-you-might-not-need-an-effect",
            "eslint-plugin-security",
            "eslint-plugin-sonarjs",
            "husky",
            "lint-staged",
            "oxfmt",
            "oxlint",
            "oxlint-tsgolint",
            "vitest",
          ],
        },
      },
      skills: [
        "agent-browser",
        "find-skills",
        "grill-me",
        "systematic-debugging",
        "tdd",
        "vercel-composition-patterns",
        "vercel-react-best-practices",
      ],
      prune: { paths: ["bunfig.toml", "apps/web/bunfig.toml"] },
    },
    "react-router": {
      json: {
        "apps/web/package.json": {
          scripts: { typegen: "react-router typegen" },
        },
      },
    },
    next: {
      json: {
        "apps/web/package.json": { scripts: { typegen: "next typegen" } },
      },
    },
  },
  tailwind: {
    all: {
      packages: {
        "package.json": {
          devDependencies: ["eslint-plugin-better-tailwindcss"],
        },
      },
      skills: ["shadcn"],
    },
  },
  stylex: {
    all: {
      packages: {
        "package.json": { devDependencies: ["@stylexjs/eslint-plugin"] },
        "apps/web/package.json": { dependencies: ["@stylexjs/stylex"] },
      },
      prune: {
        paths: [
          "packages/ui",
          "apps/web/components.json",
          "apps/web/src/components",
        ],
        json: {
          "apps/web/package.json": withoutDependencies([
            "@{{name}}/ui",
            "lucide-react",
            "next-themes",
            "sonner",
            "tailwindcss",
            "@tailwindcss/vite",
            "@tailwindcss/postcss",
          ]),
          "apps/web/tsconfig.json": {
            compilerOptions: { paths: { "@{{name}}/ui/*": null } },
          },
        },
      },
    },
    "react-router": {
      packages: {
        "apps/web/package.json": { devDependencies: ["@stylexjs/unplugin"] },
      },
    },
    next: {
      packages: {
        "apps/web/package.json": {
          devDependencies: [
            "@stylexjs/babel-plugin",
            "@stylexjs/postcss-plugin",
            "postcss",
          ],
        },
      },
      // Turbopack runs an .mjs PostCSS config in its own runtime, where
      // import.meta.dirname in the babel config it imports is undefined.
      prune: { paths: ["apps/web/postcss.config.mjs"] },
    },
  },
};

interface JsonRemoval {
  readonly file: JsonFile;
  readonly removal: Removal;
}

export type Op =
  | {
      readonly kind: "prune";
      readonly paths: readonly string[];
      readonly json: readonly JsonRemoval[];
    }
  | {
      readonly kind: "file";
      readonly path: string;
      readonly content: string;
      readonly seed?: true;
    }
  | {
      readonly kind: "link";
      readonly skill: SkillId;
      readonly path: string;
      readonly target: string;
    }
  | {
      readonly kind: "json";
      readonly path: JsonFile;
      readonly patch: JsonObject;
    }
  | ({ readonly kind: "deps" } & Addition);

export interface Project {
  readonly stack: StackId;
  readonly monorepo: MonorepoId;
  readonly name: ProjectName;
}

export interface State extends Choices {
  readonly schema: 2;
  readonly creact: string;
  readonly name: ProjectName;
  readonly hashes: Readonly<Record<string, string>>;
}

export type Prior =
  | { readonly kind: "upstream-only" }
  | {
      readonly kind: "recorded";
      readonly hashes: Readonly<Record<string, string>>;
    };

export const STATE_FILE = ".creact/state.json";

const DEPENDENCY_MAPS = ["dependencies", "devDependencies"] as const;

type Outcome = "written" | "unchanged" | "kept";

export interface ApplyReport {
  readonly files: Readonly<Record<string, Outcome>>;
  readonly hashes: Readonly<Record<string, string>>;
  readonly pruned: readonly string[];
  readonly missing: readonly Addition[];
}

function scopes(stack: StackId): readonly Scope[] {
  return ["all", stack];
}

export async function loadLayer(
  layerDir: string,
  ids: readonly OverlayId[],
  stack: StackId
): Promise<ReadonlyMap<string, string>> {
  const files = new Map<string, string>();
  const roots = ids.flatMap((id) =>
    scopes(stack).map((scope) => path.join(layerDir, id, scope))
  );
  for (const root of roots.filter((dir) => existsSync(dir))) {
    const entries = await readdir(root, {
      recursive: true,
      withFileTypes: true,
    });
    for (const entry of entries.filter((dirent) => dirent.isFile())) {
      const source = path.join(entry.parentPath, entry.name);
      const relative = path.relative(root, source).split(path.sep).join("/");
      if (!relative.endsWith(".layer")) {
        throw new Error(`${source} needs the .layer suffix`);
      }
      const file = relative.slice(0, -".layer".length);
      const content = await readFile(source, "utf8");
      const earlier = files.get(file);
      if (earlier === undefined) files.set(file, content);
      else if (file.endsWith(".md")) {
        files.set(file, `${earlier.trimEnd()}\n\n${content}`);
      } else throw new Error(`${source} is already in an earlier overlay`);
    }
  }
  return files;
}

export function plan(
  files: ReadonlyMap<string, string>,
  ids: readonly OverlayId[],
  project: Project
): readonly Op[] {
  const vars = {
    name: project.name,
    monorepo: MONOREPOS[project.monorepo].summary,
  };
  const parts = ids.flatMap((id) =>
    scopes(project.stack).flatMap((scope) => OVERLAYS[id][scope] ?? [])
  );

  const skills = [
    ...new Set(parts.flatMap((part) => part.skills ?? [])),
  ].toSorted();
  const lock = {
    version: 1,
    skills: Object.fromEntries(
      skills.map((id) => [
        id,
        {
          source: CREACT_LOCK[id].source,
          sourceType: "github",
          skillPath: CREACT_LOCK[id].skillPath,
          computedHash: CREACT_LOCK[id].computedHash,
        },
      ])
    ),
  };
  const seeds: readonly Extract<Op, { kind: "file" }>[] =
    skills.length > 0
      ? [
          {
            kind: "file",
            path: SKILLS_LOCK,
            content: `${JSON.stringify(lock, null, 2)}\n`,
            seed: true,
          },
        ]
      : [];
  const linkOps = skills.map((id) => ({
    kind: "link" as const,
    skill: id,
    path: `${CLAUDE_SKILLS}/${id}`,
    target: `../../${SKILLS_DIR}/${id}`,
  }));

  const paths = parts
    .flatMap((part) => part.prune?.paths ?? [])
    .map((entry) => render(entry, entry, vars));
  const removals = parts.flatMap((part) =>
    JSON_FILES.flatMap((file) => {
      const removal = part.prune?.json?.[file];
      return removal === undefined
        ? []
        : [{ file, removal: renderKeys(removal, vars) }];
    })
  );

  const fileOps = [
    ...[...files].map(([file, content]): Extract<Op, { kind: "file" }> => ({
      kind: "file",
      path: render(file, file, vars),
      content: render(file, content, vars),
    })),
    ...seeds,
  ].toSorted((a, b) => a.path.localeCompare(b.path));

  const jsonOps = JSON_FILES.flatMap((file) => {
    let patch: JsonObject = {};
    for (const part of parts) patch = merge(patch, part.json?.[file] ?? {});
    return Object.keys(patch).length > 0
      ? [{ kind: "json" as const, path: file, patch }]
      : [];
  });

  const depsOps = MANIFESTS.flatMap((manifest) => {
    const listed = (key: keyof Packages) =>
      parts.flatMap((part) => part.packages?.[manifest]?.[key] ?? []);
    const dependencies = listed("dependencies");
    const devDependencies = listed("devDependencies");
    return dependencies.length + devDependencies.length > 0
      ? [{ kind: "deps" as const, manifest, dependencies, devDependencies }]
      : [];
  });

  return [
    ...(paths.length + removals.length > 0
      ? [{ kind: "prune" as const, paths, json: removals }]
      : []),
    ...fileOps,
    ...linkOps,
    ...jsonOps,
    ...depsOps,
  ];
}

export function render(
  file: string,
  content: string,
  vars: Readonly<Record<string, string>>
): string {
  return content.replaceAll(/\{\{(\w+)\}\}/g, (_match, name: string) => {
    const value = vars[name];
    if (value === undefined) throw new Error(`${file}: unknown {{${name}}}`);
    return value;
  });
}

function renderKeys(
  removal: Removal,
  vars: Readonly<Record<string, string>>
): Removal {
  return Object.fromEntries(
    Object.entries(removal).map(([key, value]) => [
      render(key, key, vars),
      value === null ? null : renderKeys(value, vars),
    ])
  );
}

export function merge(doc: JsonObject, patch: JsonObject): JsonObject {
  const result: Record<string, Json> = { ...doc };
  for (const [key, value] of Object.entries(patch)) {
    const current = result[key];
    result[key] =
      isObject(current) && isObject(value) ? merge(current, value) : value;
  }
  return result;
}

function remove(
  doc: JsonObject,
  removal: Removal
): readonly [JsonObject, readonly string[]] {
  const removed: string[] = [];
  const kept = Object.entries(doc).flatMap(([key, value]): [string, Json][] => {
    const rule = removal[key];
    if (rule === null) {
      removed.push(key);
      return [];
    }
    if (rule === undefined || !isObject(value)) return [[key, value]];
    const [inner, gone] = remove(value, rule);
    removed.push(...gone);
    return [[key, inner]];
  });
  return [Object.fromEntries(kept), removed];
}

export async function apply(
  dir: string,
  ops: readonly Op[],
  prior: Prior
): Promise<ApplyReport> {
  const files: Record<string, Outcome> = {};
  const hashes: Record<string, string> = {};
  let pruned: readonly string[] = [];
  const missing: Addition[] = [];
  let locked: ReadonlySet<string> | undefined;

  for (const op of ops) {
    switch (op.kind) {
      case "prune": {
        if (prior.kind === "upstream-only") pruned = await applyPrune(dir, op);
        break;
      }
      case "file": {
        const result = op.seed
          ? await seedFile(dir, op.path, op.content)
          : await applyFile(dir, op.path, op.content, prior);
        files[op.path] = result.outcome;
        if (result.hash !== undefined) hashes[op.path] = result.hash;
        break;
      }
      case "link": {
        locked ??= await lockedSkills(dir);
        if (locked.has(op.skill)) {
          files[op.path] = await applyLink(dir, op.path, op.target, prior);
        }
        break;
      }
      case "json": {
        files[op.path] = await applyJson(path.join(dir, op.path), op.patch);
        break;
      }
      case "deps": {
        const pkg = await readJson(path.join(dir, op.manifest));
        const present = new Set(
          DEPENDENCY_MAPS.flatMap((key) => Object.keys(objectAt(pkg, key)))
        );
        const absent = (names: readonly string[]) =>
          names.filter((name) => !present.has(name));
        const addition = {
          manifest: op.manifest,
          dependencies: absent(op.dependencies),
          devDependencies: absent(op.devDependencies),
        };
        if (
          addition.dependencies.length + addition.devDependencies.length >
          0
        ) {
          missing.push(addition);
        }
        break;
      }
    }
  }
  return { files, hashes, pruned, missing };
}

async function applyPrune(
  dir: string,
  prune: Extract<Op, { kind: "prune" }>
): Promise<readonly string[]> {
  const paths = prune.paths.filter((entry) =>
    existsSync(path.join(dir, entry))
  );
  for (const entry of paths) {
    await rm(path.join(dir, entry), { recursive: true, force: true });
  }

  const keys = new Set<string>();
  for (const { file, removal } of prune.json) {
    const target = path.join(dir, file);
    const [doc, removed] = remove(await readJson(target), removal);
    if (removed.length > 0) {
      await writeAtomic(target, `${JSON.stringify(doc, null, 2)}\n`);
      for (const key of removed) keys.add(key);
    }
  }
  return [...paths, ...keys];
}

async function applyFile(
  dir: string,
  file: string,
  content: string,
  prior: Prior
): Promise<{ readonly outcome: Outcome; readonly hash: string | undefined }> {
  const target = path.join(dir, file);
  const current = await readText(target);
  const recorded = prior.kind === "recorded" ? prior.hashes[file] : undefined;
  if (current === content)
    return { outcome: "unchanged", hash: sha256(content) };
  if (
    current === undefined ||
    prior.kind === "upstream-only" ||
    sha256(current) === recorded
  ) {
    await writeAtomic(target, content);
    return { outcome: "written", hash: sha256(content) };
  }
  return { outcome: "kept", hash: recorded };
}

// The project's lock decides which links exist, so a skill it removed stays
// removed on a rerun.
export async function lockedSkills(dir: string): Promise<ReadonlySet<string>> {
  const lock = await readJson(path.join(dir, SKILLS_LOCK));
  return new Set(Object.keys(isObject(lock.skills) ? lock.skills : {}));
}

// Written once. After that the file belongs to the tool that maintains it,
// so no hash is recorded and a rerun leaves it as it finds it.
async function seedFile(
  dir: string,
  file: string,
  content: string
): Promise<{ readonly outcome: Outcome; readonly hash: undefined }> {
  const target = path.join(dir, file);
  if (existsSync(target)) return { outcome: "unchanged", hash: undefined };
  await writeAtomic(target, content);
  return { outcome: "written", hash: undefined };
}

async function applyLink(
  dir: string,
  file: string,
  target: string,
  prior: Prior
): Promise<Outcome> {
  const link = path.join(dir, file);
  const current = await lstat(link).catch(() => null);
  if (current?.isSymbolicLink() && (await readlink(link)) === target) {
    return "unchanged";
  }
  if (current !== null && prior.kind === "recorded") return "kept";
  await rm(link, { recursive: true, force: true });
  await mkdir(path.dirname(link), { recursive: true });
  await symlink(target, link);
  return "written";
}

async function applyJson(file: string, patch: JsonObject): Promise<Outcome> {
  const current = await readJson(file);
  const next = merge(current, patch);
  if (JSON.stringify(next) === JSON.stringify(current)) return "unchanged";
  await writeAtomic(file, `${JSON.stringify(next, null, 2)}\n`);
  return "written";
}
export async function readState(dir: string): Promise<State | undefined> {
  const file = path.join(dir, STATE_FILE);
  if (!existsSync(file)) return undefined;
  const raw = await readJson(file);
  const { schema, creact, name, stack, styling, monorepo, extras, hashes } =
    raw;
  if (schema === 1) {
    throw new UsageError(
      `${file} comes from the first create-creact, which made single-package projects. This one makes monorepos and can't update it.`
    );
  }
  const valid =
    schema === 2 &&
    typeof creact === "string" &&
    typeof name === "string" &&
    isProjectName(name) &&
    typeof stack === "string" &&
    Object.hasOwn(STACKS, stack) &&
    typeof styling === "string" &&
    isBuilt(STYLINGS, styling) &&
    typeof monorepo === "string" &&
    isBuilt(MONOREPOS, monorepo) &&
    Array.isArray(extras) &&
    extras.every((id) => typeof id === "string" && isBuilt(EXTRAS, id)) &&
    isObject(hashes) &&
    Object.values(hashes).every((hash) => typeof hash === "string");
  if (!valid) {
    throw new UsageError(`${file} isn't a create-creact state file`);
  }
  return raw as unknown as State;
}

export async function writeState(dir: string, state: State): Promise<void> {
  const file = path.join(dir, STATE_FILE);
  if (existsSync(file)) {
    const current = await readJson(file);
    if (JSON.stringify(current) === JSON.stringify(state)) return;
  }
  await writeAtomic(file, `${JSON.stringify(state, null, 2)}\n`);
}

export function isObject(value: Json | undefined): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function objectAt(doc: JsonObject, key: string): JsonObject {
  const value = doc[key];
  return isObject(value) ? value : {};
}

function sha256(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

async function readText(file: string): Promise<string | undefined> {
  return existsSync(file) ? readFile(file, "utf8") : undefined;
}

export async function readJson(file: string): Promise<JsonObject> {
  const parsed = JSON.parse(await readFile(file, "utf8")) as Json;
  if (!isObject(parsed)) throw new UsageError(`${file} isn't a JSON object`);
  return parsed;
}

async function writeAtomic(file: string, content: string): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.creact-tmp`;
  await writeFile(temp, content);
  await rename(temp, file);
}

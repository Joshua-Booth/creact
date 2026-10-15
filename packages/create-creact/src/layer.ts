/* oxlint-disable security/detect-non-literal-fs-filename -- every path is under the project dir or the CLI's own layer dir */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
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
import { MONOREPOS, type StackId, STACKS } from "./stacks.ts";

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

// null removes the key and an object descends into it, so a prune can never
// set a value.
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
  readonly prune?: Prune;
}

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
      prune: { paths: ["bunfig.toml", "apps/web/bunfig.toml"] },
    },
  },
  tailwind: {
    all: {
      packages: {
        "package.json": {
          devDependencies: ["eslint-plugin-better-tailwindcss"],
        },
      },
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
  | { readonly kind: "file"; readonly path: string; readonly content: string }
  | {
      readonly kind: "json";
      readonly path: JsonFile;
      readonly patch: JsonObject;
    }
  | ({ readonly kind: "deps" } & Addition);

export interface Project {
  readonly stack: StackId;
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
      files.set(
        relative.slice(0, -".layer".length),
        await readFile(source, "utf8")
      );
    }
  }
  return files;
}

export function plan(
  files: ReadonlyMap<string, string>,
  ids: readonly OverlayId[],
  project: Project
): readonly Op[] {
  const vars = { name: project.name };
  const parts = ids.flatMap((id) =>
    scopes(project.stack).flatMap((scope) => OVERLAYS[id][scope] ?? [])
  );

  const paths = parts
    .flatMap((part) => part.prune?.paths ?? [])
    .map((entry) => render("prune", entry, vars));
  const removals = parts.flatMap((part) =>
    JSON_FILES.flatMap((file) => {
      const removal = part.prune?.json?.[file];
      return removal === undefined
        ? []
        : [{ file, removal: renderKeys(removal, vars) }];
    })
  );

  const fileOps = [...files]
    .map(([file, content]) => ({
      kind: "file" as const,
      path: render(file, file, vars),
      content: render(file, content, vars),
    }))
    .toSorted((a, b) => a.path.localeCompare(b.path));

  const seed: Partial<Record<JsonFile, JsonObject>> = {
    "apps/web/package.json": {
      scripts: { typegen: STACKS[project.stack].typegen },
    },
  };
  const jsonOps = JSON_FILES.flatMap((file) => {
    let patch = seed[file] ?? {};
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
      render("prune", key, vars),
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

  for (const op of ops) {
    switch (op.kind) {
      case "prune": {
        if (prior.kind === "upstream-only") pruned = await applyPrune(dir, op);
        break;
      }
      case "file": {
        const result = await applyFile(dir, op.path, op.content, prior);
        files[op.path] = result.outcome;
        if (result.hash !== undefined) hashes[op.path] = result.hash;
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
  prune: {
    readonly paths: readonly string[];
    readonly json: readonly JsonRemoval[];
  }
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
    Object.hasOwn(MONOREPOS, monorepo) &&
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

async function readJson(file: string): Promise<JsonObject> {
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

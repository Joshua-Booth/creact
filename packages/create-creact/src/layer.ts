/* oxlint-disable security/detect-non-literal-fs-filename -- every path is under the project dir or the CLI's own layer dir */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  type Choices,
  type ExtraId,
  EXTRAS,
  isBuilt,
  type StylingId,
  STYLINGS,
  UsageError,
} from "./options.ts";
import { type Stack, STACKS } from "./stacks.ts";

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

interface Overlay {
  readonly packageJson?: JsonObject;
  readonly tsconfig?: JsonObject;
  readonly devDependencies: readonly string[];
}

export const OVERLAYS: Readonly<Record<OverlayId, Overlay>> = {
  base: {
    packageJson: {
      type: "module",
      scripts: {
        lint: "pnpm run typegen && oxlint --max-warnings 0",
        format: "oxfmt",
        "format:check": "oxfmt --check",
        typecheck: "pnpm run typegen && tsc",
        test: "vitest run",
        prepare: "husky || true",
      },
    },
    tsconfig: {
      compilerOptions: {
        strict: true,
        noUncheckedIndexedAccess: true,
        noImplicitOverride: true,
        erasableSyntaxOnly: true,
        verbatimModuleSyntax: true,
        forceConsistentCasingInFileNames: true,
        allowImportingTsExtensions: true,
      },
    },
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
  tailwind: { devDependencies: ["eslint-plugin-better-tailwindcss"] },
};

export type Op =
  | { readonly kind: "file"; readonly path: string; readonly content: string }
  | {
      readonly kind: "json";
      readonly path: "package.json" | "tsconfig.json";
      readonly patch: JsonObject;
    }
  | { readonly kind: "devDeps"; readonly names: readonly string[] };

export interface State extends Choices {
  readonly schema: 1;
  readonly creact: string;
  readonly hashes: Readonly<Record<string, string>>;
}

export type Prior =
  | { readonly kind: "upstream-only" }
  | {
      readonly kind: "recorded";
      readonly hashes: Readonly<Record<string, string>>;
    };

export const STATE_FILE = ".creact/state.json";

type Outcome = "written" | "unchanged" | "kept";

export interface ApplyReport {
  readonly files: Readonly<Record<string, Outcome>>;
  readonly hashes: Readonly<Record<string, string>>;
  readonly missingDevDeps: readonly string[];
}

export async function loadLayer(
  layerDir: string,
  ids: readonly OverlayId[]
): Promise<ReadonlyMap<string, string>> {
  const files = new Map<string, string>();
  for (const id of ids) {
    const root = path.join(layerDir, id);
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
  stack: Stack
): readonly Op[] {
  const vars = { srcRoot: stack.srcRoot, globalCss: stack.globalCss };
  let packageJson: JsonObject = { scripts: { typegen: stack.typegen } };
  let tsconfig: JsonObject = {};
  const devDependencies: string[] = [];
  for (const overlay of ids.map((id) => OVERLAYS[id])) {
    packageJson = merge(packageJson, overlay.packageJson ?? {});
    tsconfig = merge(tsconfig, overlay.tsconfig ?? {});
    devDependencies.push(...overlay.devDependencies);
  }
  const fileOps = [...files]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([file, content]): Op => ({
      kind: "file",
      path: file,
      content: render(file, content, vars),
    }));
  return [
    ...fileOps,
    { kind: "json", path: "package.json", patch: packageJson },
    { kind: "json", path: "tsconfig.json", patch: tsconfig },
    { kind: "devDeps", names: devDependencies },
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

export function merge(doc: JsonObject, patch: JsonObject): JsonObject {
  const result: Record<string, Json> = { ...doc };
  for (const [key, value] of Object.entries(patch)) {
    const current = result[key];
    result[key] =
      isObject(current) && isObject(value) ? merge(current, value) : value;
  }
  return result;
}

export async function apply(
  dir: string,
  ops: readonly Op[],
  prior: Prior
): Promise<ApplyReport> {
  const files: Record<string, Outcome> = {};
  const hashes: Record<string, string> = {};
  let missingDevDeps: readonly string[] = [];

  for (const op of ops) {
    switch (op.kind) {
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
      case "devDeps": {
        const pkg = await readJson(path.join(dir, "package.json"));
        const present = new Set([
          ...Object.keys(objectAt(pkg, "dependencies")),
          ...Object.keys(objectAt(pkg, "devDependencies")),
        ]);
        missingDevDeps = op.names.filter((name) => !present.has(name));
        break;
      }
    }
  }
  return { files, hashes, missingDevDeps };
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
  const { schema, creact, stack, styling, extras, hashes } = raw;
  const valid =
    schema === 1 &&
    typeof creact === "string" &&
    typeof stack === "string" &&
    Object.hasOwn(STACKS, stack) &&
    typeof styling === "string" &&
    isBuilt(STYLINGS, styling) &&
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

function isObject(value: Json | undefined): value is JsonObject {
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

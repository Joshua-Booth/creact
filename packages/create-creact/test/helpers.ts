/* oxlint-disable security/detect-non-literal-fs-filename -- every path is a temp dir a test made or the package's own fixtures */
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after } from "node:test";

import {
  JSON_FILES,
  type JsonFile,
  type JsonObject,
  loadLayer,
  merge,
  type Op,
  type OverlayId,
  plan,
  STATE_FILE,
} from "../src/layer.ts";
import { projectName, type StylingId } from "../src/options.ts";
import { type MonorepoId, type StackId, STACKS } from "../src/stacks.ts";

export const LAYER = path.join(import.meta.dirname, "../layer");

const NAME = projectName("/work/app");

const TEMP_DIRS: string[] = [];

after(() => {
  for (const dir of TEMP_DIRS) rmSync(dir, { recursive: true, force: true });
});

export function tempDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "creact-plan-"));
  TEMP_DIRS.push(dir);
  return dir;
}

type Fixture = Readonly<Record<JsonFile, JsonObject>> & {
  readonly bts: string;
};

export function fixture(stack: StackId): Fixture {
  return JSON.parse(
    readFileSync(
      path.join(import.meta.dirname, "fixtures", `${stack}.json`),
      "utf8"
    )
  ) as Fixture;
}

export async function ops(
  stack: StackId,
  styling: StylingId = "tailwind",
  monorepo: MonorepoId = "pnpm"
): Promise<readonly Op[]> {
  const ids: readonly OverlayId[] = ["base", styling];
  return plan(await loadLayer(LAYER, ids, stack), ids, {
    stack,
    monorepo,
    name: NAME,
  });
}

export function upstreamBase(
  stack: StackId,
  extra: Readonly<Partial<Record<JsonFile, JsonObject>>> = {},
  dir = tempDir()
): string {
  const files = fixture(stack);
  for (const file of JSON_FILES) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(
      path.join(dir, file),
      JSON.stringify(merge(files[file], extra[file] ?? {}))
    );
  }
  writeFileSync(path.join(dir, STACKS[stack].signature), "");
  return dir;
}

export function recordState(
  dir: string,
  stack: string,
  fields: JsonObject = {}
): void {
  mkdirSync(path.join(dir, ".creact"));
  writeFileSync(
    path.join(dir, STATE_FILE),
    JSON.stringify({
      schema: 2,
      creact: "0.0.0",
      name: "app",
      stack,
      styling: "tailwind",
      monorepo: "pnpm",
      extras: [],
      hashes: {},
      ...fields,
    })
  );
}

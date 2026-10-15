/* oxlint-disable security/detect-non-literal-fs-filename -- every path is under the directory the caller named */
import { existsSync } from "node:fs";
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

import {
  type Choices,
  type Request,
  resolveChoices,
  UsageError,
} from "./options.ts";
import { CommandFailed, run } from "./shell.ts";
import { STACKS } from "./stacks.ts";

export interface Report {
  readonly dir: string;
  readonly choices: Choices;
  readonly base: "created";
}

interface Target {
  readonly kind: "fresh";
  readonly exists: boolean;
}

export async function create(request: Request): Promise<Report> {
  const target = await inspect(request.dir);
  const choices = resolveChoices(request, undefined);

  const staging = path.join(
    path.dirname(request.dir),
    `.${path.basename(request.dir)}.creact-staging`
  );
  await rm(staging, { recursive: true, force: true });
  const base = await obtainBase(staging, choices, path.basename(request.dir));
  await place(base, request.dir, target.exists);
  await rm(staging, { recursive: true, force: true });

  return { dir: request.dir, choices, base: "created" };
}

async function inspect(dir: string): Promise<Target> {
  if (!existsSync(dir)) return { kind: "fresh", exists: false };
  if ((await readdir(dir)).length === 0) return { kind: "fresh", exists: true };
  throw new UsageError(
    `${dir} isn't empty and wasn't made by create-creact. Pick a new directory.`
  );
}

// create-next-app's --yes reads preferences saved under HOME (XDG_CONFIG_HOME
// on Linux), so the upstream CLI gets an empty one. pnpm keeps the real HOME
// and its store.
async function obtainBase(
  staging: string,
  choices: Choices,
  name: string
): Promise<string> {
  const stack = STACKS[choices.stack];
  const home = path.join(staging, ".home");
  await mkdir(home, { recursive: true });
  await run(
    "pnpm",
    [
      `--package=${stack.cli}@latest`,
      "dlx",
      "env",
      `HOME=${home}`,
      `XDG_CONFIG_HOME=${path.join(home, ".config")}`,
      stack.cli,
      name,
      ...stack.flags[choices.styling],
    ],
    staging
  );
  const base = path.join(staging, name);
  if (!existsSync(path.join(base, stack.signature))) {
    throw new CommandFailed(
      `${stack.cli} finished without writing ${stack.signature}, so its output changed shape`
    );
  }
  return base;
}

// A missing target takes one atomic rename. An existing empty one may be the
// caller's cwd, so it keeps its inode and receives the entries instead.
async function place(
  base: string,
  target: string,
  exists: boolean
): Promise<void> {
  if (!exists) {
    await rename(base, target);
    return;
  }
  for (const entry of await readdir(base)) {
    await rename(path.join(base, entry), path.join(target, entry));
  }
}

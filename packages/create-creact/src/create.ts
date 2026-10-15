/* oxlint-disable security/detect-non-literal-fs-filename -- every path is the directory the caller named, its sibling staging dir, or inside one of them */
import { existsSync } from "node:fs";
import { mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

import pkg from "../package.json" with { type: "json" };
import {
  apply,
  type ApplyReport,
  loadLayer,
  type Op,
  type OverlayId,
  plan,
  type Prior,
  readState,
  type State,
  STATE_FILE,
  writeState,
} from "./layer.ts";
import {
  type Choices,
  type Request,
  resolveChoices,
  UsageError,
} from "./options.ts";
import { CommandFailed, run, succeeds } from "./shell.ts";
import { STACKS } from "./stacks.ts";

export interface Report {
  readonly dir: string;
  readonly choices: Choices;
  readonly base: "created" | "kept";
  readonly layer: ApplyReport;
  readonly git: "initialised" | "existing" | "skipped";
  readonly install: "done" | "skipped";
}

type Target =
  | { readonly kind: "fresh"; readonly exists: boolean }
  | { readonly kind: "project"; readonly state: State };

export async function create(
  request: Request,
  layerDir: string
): Promise<Report> {
  const target = await inspect(request.dir);
  const prior = target.kind === "project" ? target.state : undefined;
  const choices = resolveChoices(request, prior);
  const ids: readonly OverlayId[] = [
    "base",
    choices.styling,
    ...choices.extras,
  ];
  const ops = plan(await loadLayer(layerDir, ids), ids, STACKS[choices.stack]);

  let layer: ApplyReport;
  if (target.kind === "fresh") {
    const staging = path.join(
      path.dirname(request.dir),
      `.${path.basename(request.dir)}.creact-staging`
    );
    await rm(staging, { recursive: true, force: true });
    const base = await obtainBase(staging, choices, path.basename(request.dir));
    layer = await applyLayer(base, ops, { kind: "upstream-only" }, choices);
    await place(base, request.dir, target.exists);
    await rm(staging, { recursive: true, force: true });
  } else {
    layer = await applyLayer(
      request.dir,
      ops,
      { kind: "recorded", hashes: target.state.hashes },
      choices
    );
  }

  const git = request.git ? await initGit(request.dir) : "skipped";
  if (request.install) {
    await install(request.dir, layer.missingDevDeps);
    await fixThenFormat(request.dir);
  }

  return {
    dir: request.dir,
    choices,
    base: target.kind === "fresh" ? "created" : "kept",
    layer,
    git,
    install: request.install ? "done" : "skipped",
  };
}

async function inspect(dir: string): Promise<Target> {
  if (!existsSync(dir)) return { kind: "fresh", exists: false };
  const state = await readState(dir);
  if (state !== undefined) return { kind: "project", state };
  if ((await readdir(dir)).length === 0) return { kind: "fresh", exists: true };
  throw new UsageError(
    `${dir} isn't empty and has no ${STATE_FILE}, so create-creact didn't make it. Pick a new directory.`
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
      stack.skipInstall,
      stack.skipGit,
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

async function applyLayer(
  dir: string,
  ops: readonly Op[],
  prior: Prior,
  choices: Choices
): Promise<ApplyReport> {
  const layer = await apply(dir, ops, prior);
  await writeState(dir, {
    schema: 1,
    creact: pkg.version,
    ...choices,
    hashes: layer.hashes,
  });
  return layer;
}

// An existing empty target may be the caller's cwd, so it keeps its inode
// and receives the entries instead.
async function place(
  base: string,
  target: string,
  exists: boolean
): Promise<void> {
  if (!exists) {
    await rename(base, target);
    return;
  }
  const stateDir = path.dirname(STATE_FILE);
  for (const entry of await readdir(base)) {
    if (entry !== stateDir) {
      await rename(path.join(base, entry), path.join(target, entry));
    }
  }
  await rename(path.join(base, stateDir), path.join(target, stateDir));
}

// Before install, because husky's prepare script needs .git to set the hooks.
async function initGit(dir: string): Promise<Report["git"]> {
  if (await succeeds("git", ["rev-parse", "--is-inside-work-tree"], dir)) {
    return "existing";
  }
  await run("git", ["init", "--quiet"], dir);
  return "initialised";
}

// pnpm add skips the project's own prepare script, which installs the git
// hooks.
async function install(dir: string, missing: readonly string[]): Promise<void> {
  await run(
    "pnpm",
    missing.length > 0 ? ["add", "--save-dev", ...missing] : ["install"],
    dir
  );
  await run("pnpm", ["run", "prepare"], dir);
}

async function fixThenFormat(dir: string): Promise<void> {
  await run("pnpm", ["run", "lint", "--fix"], dir);
  await run("pnpm", ["run", "format"], dir);
}

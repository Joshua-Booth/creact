/* oxlint-disable security/detect-non-literal-fs-filename -- every path is the directory the caller named, an ancestor of it, its sibling staging dir, or inside one of them */
import { existsSync } from "node:fs";
import { mkdir, readdir, realpath, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

import pkg from "../package.json" with { type: "json" };
import {
  type Addition,
  apply,
  type ApplyReport,
  JSON_FILES,
  loadLayer,
  lockedSkills,
  type Op,
  type OverlayId,
  plan,
  type Prior,
  readState,
  SKILLS_CLI,
  SKILLS_DIR,
  type State,
  STATE_FILE,
  writeState,
} from "./layer.ts";
import {
  type Choices,
  type ProjectName,
  projectName,
  type Request,
  resolveChoices,
  UsageError,
} from "./options.ts";
import { CommandFailed, run, succeeds } from "./shell.ts";
import { BTS, btsArgs, STACKS } from "./stacks.ts";

export type Skills =
  | "restored"
  | "present"
  | "skipped"
  | { readonly failed: string };

export interface Report {
  readonly dir: string;
  readonly choices: Choices;
  readonly base: "created" | "kept";
  readonly layer: ApplyReport;
  readonly git: "initialised" | "existing" | "skipped";
  readonly install: "done" | "skipped";
  readonly skills: Skills;
}

export const RESTORE = [
  "pnpm",
  `--package=${SKILLS_CLI}`,
  "dlx",
  "skills",
  "experimental_install",
] as const;

type Target =
  | { readonly kind: "fresh"; readonly exists: boolean }
  | { readonly kind: "project"; readonly state: State };

export async function create(
  request: Request,
  layerDir: string
): Promise<Report> {
  const target = await inspect(request.dir);
  const recorded = target.kind === "project" ? target.state : undefined;
  const choices = resolveChoices(request, recorded);
  const name = recorded?.name ?? projectName(request.dir);
  const ids: readonly OverlayId[] = [
    "base",
    choices.styling,
    ...choices.extras,
  ];
  const ops = plan(await loadLayer(layerDir, ids, choices.stack), ids, {
    stack: choices.stack,
    monorepo: choices.monorepo,
    name,
  });

  let layer: ApplyReport;
  if (target.kind === "fresh") {
    const staging = path.join(
      path.dirname(request.dir),
      `.${name}.creact-staging`
    );
    await rm(staging, { recursive: true, force: true });
    try {
      const base = await obtainBase(staging, choices, name);
      layer = await applyLayer(
        base,
        ops,
        { kind: "upstream-only" },
        { name, choices }
      );
      await place(base, request.dir, target.exists);
    } finally {
      await rm(staging, { recursive: true, force: true });
    }
  } else {
    layer = await applyLayer(
      request.dir,
      ops,
      { kind: "recorded", hashes: target.state.hashes },
      { name, choices }
    );
  }

  const git = request.git ? await initGit(request.dir) : "skipped";
  let skills: Skills = "skipped";
  if (request.install) {
    await install(request.dir, layer.missing);
    await fixThenFormat(request.dir);
    skills = await restoreSkills(request.dir);
  }

  return {
    dir: request.dir,
    choices,
    base: target.kind === "fresh" ? "created" : "kept",
    layer,
    git,
    install: request.install ? "done" : "skipped",
    skills,
  };
}

async function inspect(dir: string): Promise<Target> {
  const nearest = nearestExisting(dir);
  if (!(await stat(nearest)).isDirectory()) {
    throw new UsageError(
      nearest === dir
        ? `${dir} is a file. Give a directory for the project.`
        : `${dir} would sit under the file ${nearest}. Give a directory for the project.`
    );
  }
  const exists = nearest === dir;
  const repo = await outerRepo(dir, nearest);
  if (repo !== undefined) {
    throw new UsageError(
      `${dir} is inside the git repository at ${repo}, so the project would get no repository of its own. Pick a directory outside it.`
    );
  }
  if (!exists) return { kind: "fresh", exists: false };
  const state = await readState(dir);
  if (state !== undefined) return { kind: "project", state };
  if ((await readdir(dir)).length === 0) return { kind: "fresh", exists: true };
  throw new UsageError(
    `${dir} isn't empty and has no ${STATE_FILE}, so create-creact didn't make it. Pick a new directory.`
  );
}

function nearestExisting(dir: string): string {
  let nearest = dir;
  while (!existsSync(nearest)) nearest = path.dirname(nearest);
  return nearest;
}

// A walk for a .git entry, so --no-git needs no git on PATH. It starts from
// the real path, as a symlink into a repository would otherwise pass.
async function outerRepo(
  dir: string,
  nearest: string
): Promise<string | undefined> {
  const real = await realpath(nearest);
  for (
    let probe = nearest === dir ? path.dirname(real) : real;
    probe !== path.dirname(probe);
    probe = path.dirname(probe)
  ) {
    if (existsSync(path.join(probe, ".git"))) return probe;
  }
  return undefined;
}

// Better-T-Stack keeps a history of every project it makes in its data
// directory under HOME (XDG_DATA_HOME on Linux), so it gets an empty one.
// pnpm keeps the real HOME and its store.
export async function obtainBase(
  staging: string,
  choices: Choices,
  name: ProjectName
): Promise<string> {
  const home = path.join(staging, ".home");
  await mkdir(home, { recursive: true });
  await run(
    "pnpm",
    [
      `--package=${BTS}`,
      "dlx",
      "env",
      `HOME=${home}`,
      `XDG_DATA_HOME=${path.join(home, ".local", "share")}`,
      "create-better-t-stack",
      ...btsArgs(name, choices.stack, choices.monorepo),
    ],
    staging
  );
  return path.join(staging, name);
}

async function applyLayer(
  dir: string,
  ops: readonly Op[],
  prior: Prior,
  project: { readonly name: ProjectName; readonly choices: Choices }
): Promise<ApplyReport> {
  const missing = [STACKS[project.choices.stack].signature, ...JSON_FILES]
    .filter((file) => !existsSync(path.join(dir, file)))
    .join(", ");
  if (missing !== "") {
    throw prior.kind === "upstream-only"
      ? new CommandFailed(
          `${BTS} finished without writing ${missing}, so its output changed shape`
        )
      : new UsageError(
          `${dir} is missing ${missing}, which the layer builds on, so create-creact can't update it`
        );
  }
  const layer = await apply(dir, ops, prior);
  await writeState(dir, {
    schema: 2,
    creact: pkg.version,
    name: project.name,
    ...project.choices,
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
async function install(
  dir: string,
  missing: readonly Addition[]
): Promise<void> {
  for (const { manifest, dependencies, devDependencies } of missing) {
    const cwd = path.join(dir, path.dirname(manifest));
    const root = manifest === "package.json" ? ["--workspace-root"] : [];
    if (dependencies.length > 0) {
      await run("pnpm", ["add", ...root, ...dependencies], cwd);
    }
    if (devDependencies.length > 0) {
      await run(
        "pnpm",
        ["add", ...root, "--save-dev", ...devDependencies],
        cwd
      );
    }
  }
  if (missing.length === 0) await run("pnpm", ["install"], dir);
  await run("pnpm", ["run", "prepare"], dir);
}

// oxlint applies one fix per overlapping range in a pass, so the shadcn code
// Better-T-Stack writes needs a second pass before lint passes.
async function fixThenFormat(dir: string): Promise<void> {
  if (!(await succeeds("pnpm", ["run", "lint", "--fix"], dir))) {
    await run("pnpm", ["run", "lint", "--fix"], dir);
  }
  await run("pnpm", ["run", "format"], dir);
}

// Only when a locked skill is missing, so a rerun neither clones nor lets the
// restore rewrite the project's lock.
async function restoreSkills(dir: string): Promise<Skills> {
  const ids = await lockedSkills(dir);
  if ([...ids].every((id) => existsSync(path.join(dir, SKILLS_DIR, id)))) {
    return "present";
  }
  const [command, ...args] = RESTORE;
  try {
    await run(command, args, dir);
  } catch (error) {
    if (error instanceof CommandFailed) return { failed: error.message };
    throw error;
  }
  return "restored";
}

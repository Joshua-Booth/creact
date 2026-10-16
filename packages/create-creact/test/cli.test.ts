/* oxlint-disable typescript/no-floating-promises, security/detect-non-literal-fs-filename, sonarjs/no-os-command-from-path --
 * node:test's describe and it return promises the runner awaits, every
 * path is a temp dir the test made, and git comes from PATH here as it
 * does in the CLI. */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it, type TestContext } from "node:test";

import pkg from "../package.json" with { type: "json" };
import { STATE_FILE } from "../src/layer.ts";
import { withoutGitContext } from "../src/shell.ts";
import { recordState, tempDir, upstreamBase } from "./helpers.ts";

const MAIN = path.join(import.meta.dirname, "../src/main.ts");
const IDENTITY = [
  "-c",
  "user.name=create-creact test",
  "-c",
  "user.email=test@example.invalid",
];

function git(dir: string, args: readonly string[]) {
  return spawnSync("git", args, {
    cwd: dir,
    env: withoutGitContext(),
    encoding: "utf8",
  });
}

function gitInit(dir: string): void {
  git(dir, ["init", "--quiet"]);
}

function cli(argv: readonly string[]) {
  return spawnSync(process.execPath, [MAIN, ...argv], {
    env: withoutGitContext(),
    encoding: "utf8",
  });
}

describe("main", () => {
  it("exits 2 with every planned flag named on stderr", (t: TestContext) => {
    const result = cli(["app", "--storybook", "--playwright"]);
    t.assert.strictEqual(result.status, 2);
    t.assert.match(result.stderr, /--storybook.*--playwright/);
    t.assert.strictEqual(result.stdout, "");
  });

  it("exits 2 before touching disk when a new project has no --stack", (t: TestContext) => {
    const dir = path.join(tmpdir(), `creact-missing-${process.pid}`);
    const result = cli([dir]);
    t.assert.strictEqual(result.status, 2);
    t.assert.match(result.stderr, /^create-creact: [^\n]*--stack[^\n]*\n$/);
    t.assert.strictEqual(existsSync(dir), false);
  });

  it("exits 2 before touching disk when the directory name can't be a package scope", (t: TestContext) => {
    const dir = path.join(tempDir(), "My App");
    const result = cli([dir, "--stack", "next"]);
    t.assert.strictEqual(result.status, 2);
    t.assert.match(result.stderr, /^create-creact: My App would become /);
    t.assert.strictEqual(existsSync(dir), false);
    t.assert.deepStrictEqual(readdirSync(path.dirname(dir)), []);
  });

  it("ends the unknown-flag reason before pointing at --help", (t: TestContext) => {
    const result = cli(["app", "--bogus"]);
    t.assert.strictEqual(result.status, 2);
    t.assert.match(result.stderr, /'-- "--bogus"'?\. Run with --help/);
  });
});

describe("a rerun", () => {
  it("records the create-creact version that ran it", (t: TestContext) => {
    const dir = upstreamBase("next");
    recordState(dir, "next", { creact: "0.0.0-older" });
    const result = cli([dir, "--no-install", "--no-git"]);
    t.assert.strictEqual(result.status, 0, result.stderr);
    const state = JSON.parse(
      readFileSync(path.join(dir, STATE_FILE), "utf8")
    ) as { creact: unknown };
    t.assert.strictEqual(state.creact, pkg.version);
  });

  it("refuses a project whose apps/web moved, and writes nothing", (t: TestContext) => {
    const dir = upstreamBase("react-router");
    renameSync(path.join(dir, "apps/web"), path.join(dir, "apps/site"));
    recordState(dir, "react-router");
    const result = cli([dir, "--no-install", "--no-git"]);
    t.assert.strictEqual(result.status, 2, result.stderr);
    t.assert.match(
      result.stderr,
      /^create-creact: \S+ is missing apps\/web\/react-router\.config\.ts, apps\/web\/package\.json, apps\/web\/tsconfig\.json, /
    );
    t.assert.strictEqual(existsSync(path.join(dir, "apps/web")), false);
  });
});

describe("a GIT_DIR inherited from a git hook of another repository", () => {
  it("never reaches that repository, and the project still gets its own", (t: TestContext) => {
    const main = tempDir();
    gitInit(main);
    git(main, [
      ...IDENTITY,
      "commit",
      "--quiet",
      "--allow-empty",
      "--message",
      "init",
    ]);
    git(main, ["worktree", "add", "--quiet", "wt"]);
    const hookEnv = {
      ...process.env,
      GIT_DIR: path.join(main, ".git", "worktrees", "wt"),
      GIT_INDEX_FILE: path.join(main, ".git", "worktrees", "wt", "index"),
    };
    const dir = upstreamBase("next");
    recordState(dir, "next");

    const result = spawnSync(process.execPath, [MAIN, dir, "--no-install"], {
      env: hookEnv,
      encoding: "utf8",
    });
    t.assert.strictEqual(result.status, 0, result.stderr);
    t.assert.match(result.stdout, /git {6}initialised\n/);
    t.assert.ok(existsSync(path.join(dir, ".git")));
    t.assert.strictEqual(
      git(main, ["config", "core.bare"]).stdout.trim(),
      "false"
    );
    t.assert.strictEqual(git(main, ["config", "core.hooksPath"]).status, 1);
  });
});

describe("a directory inside another git work tree", () => {
  const FLAGS = ["--stack", "next", "--no-install", "--no-git"];
  const REFUSAL = /inside the git repository at /;

  it("is refused while missing, and nothing is written", (t: TestContext) => {
    const repo = tempDir();
    gitInit(repo);
    const dir = path.join(repo, "app");
    const result = cli([dir, ...FLAGS]);
    t.assert.strictEqual(result.status, 2, result.stderr);
    t.assert.match(result.stderr, REFUSAL);
    t.assert.deepStrictEqual(readdirSync(repo), [".git"]);
  });

  it("is refused while empty", (t: TestContext) => {
    const repo = tempDir();
    gitInit(repo);
    const dir = path.join(repo, "app");
    mkdirSync(dir);
    const result = cli([dir, ...FLAGS]);
    t.assert.strictEqual(result.status, 2, result.stderr);
    t.assert.match(result.stderr, REFUSAL);
    t.assert.deepStrictEqual(readdirSync(dir), []);
  });

  it("is refused on a rerun, and the project is left as it was", (t: TestContext) => {
    const repo = tempDir();
    gitInit(repo);
    const dir = path.join(repo, "app");
    mkdirSync(dir);
    upstreamBase("next", {}, dir);
    recordState(dir, "next");
    const before = readdirSync(dir).toSorted();
    const result = cli([dir, "--no-install", "--no-git"]);
    t.assert.strictEqual(result.status, 2, result.stderr);
    t.assert.match(result.stderr, REFUSAL);
    t.assert.deepStrictEqual(readdirSync(dir).toSorted(), before);
  });

  it("is a rerun like any other when the project is its own repository", (t: TestContext) => {
    const dir = upstreamBase("next");
    recordState(dir, "next");
    gitInit(dir);
    const result = cli([dir, "--no-install", "--no-git"]);
    t.assert.strictEqual(result.status, 0, result.stderr);
    t.assert.match(result.stdout, /base {5}kept\n/);
  });
});

/* oxlint-disable typescript/no-floating-promises, security/detect-non-literal-fs-filename, sonarjs/no-os-command-from-path --
 * node:test's describe and it return promises the runner awaits, every
 * path is a temp dir the test made, and git comes from PATH here as it
 * does in the CLI. */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it, type TestContext } from "node:test";

import pkg from "../package.json" with { type: "json" };
import {
  CLAUDE_SKILLS,
  SKILLS_CLI,
  SKILLS_DIR,
  SKILLS_LOCK,
  STATE_FILE,
} from "../src/layer.ts";
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

function cli(argv: readonly string[], env = withoutGitContext()) {
  return spawnSync(process.execPath, [MAIN, ...argv], {
    env,
    encoding: "utf8",
  });
}

function onlyOnPath(
  commands: Readonly<Record<string, string>> = {}
): NodeJS.ProcessEnv {
  const bin = tempDir();
  for (const [name, script] of Object.entries(commands)) {
    writeFileSync(path.join(bin, name), `#!/bin/sh\n${script}`, {
      mode: 0o755,
    });
  }
  return { ...withoutGitContext(), PATH: bin };
}

function pnpmFake(restore: string): NodeJS.ProcessEnv {
  return onlyOnPath({
    pnpm: [
      'case "$*" in',
      `  *experimental_install*) ${restore} ;;`,
      "esac",
      "",
    ].join("\n"),
  });
}

function locked(dir: string): string[] {
  const lock = JSON.parse(
    readFileSync(path.join(dir, SKILLS_LOCK), "utf8")
  ) as { skills: Record<string, unknown> };
  return Object.keys(lock.skills);
}

describe("main", () => {
  it("exits 2 with a message when the target is a file", (t: TestContext) => {
    const file = path.join(tempDir(), "app");
    writeFileSync(file, "");
    const result = cli([file, "--stack", "next"]);
    t.assert.strictEqual(result.status, 2);
    t.assert.strictEqual(
      result.stderr,
      `create-creact: ${file} is a file. Give a directory for the project.\n`
    );
  });

  it("exits 2 with a message when the target's parent is a file", (t: TestContext) => {
    const file = path.join(tempDir(), "somefile");
    writeFileSync(file, "");
    const dir = path.join(file, "app");
    const result = cli([dir, "--stack", "next"]);
    t.assert.strictEqual(result.status, 2, result.stderr);
    t.assert.strictEqual(
      result.stderr,
      `create-creact: ${dir} would sit under the file ${file}. Give a directory for the project.\n`
    );
  });

  it("says --no-install skips the skills restore too", (t: TestContext) => {
    const result = cli(["--help"]);
    t.assert.strictEqual(result.status, 0);
    t.assert.match(
      result.stdout,
      /--no-install {6}skip pnpm install, .*the skills restore\n/
    );
  });

  it("exits 1 and leaves nothing behind when Better-T-Stack's output changed shape", (t: TestContext) => {
    const parent = tempDir();
    const dir = path.join(parent, "app");
    const env = onlyOnPath({
      pnpm: [
        "PATH=/usr/bin:/bin",
        "mkdir -p app/apps/web app/packages/config",
        "touch app/apps/web/next.config.ts",
        'for f in package.json tsconfig.json packages/config/tsconfig.base.json apps/web/package.json; do echo "{}" > "app/$f"; done',
        "",
      ].join("\n"),
    });
    const result = cli(
      [dir, "--stack", "next", "--no-install", "--no-git"],
      env
    );
    t.assert.strictEqual(result.status, 1, result.stderr);
    t.assert.strictEqual(
      result.stderr,
      "create-creact: create-better-t-stack@3.46.1 finished without writing apps/web/tsconfig.json, so its output changed shape. Fix it and run the same command again.\n"
    );
    t.assert.deepStrictEqual(readdirSync(parent), []);
  });

  it("quotes the project path in the hint that ends the report, escaping a quote", (t: TestContext) => {
    const dir = path.join(tempDir(), "it's a space", "app");
    mkdirSync(dir, { recursive: true });
    upstreamBase("next", {}, dir);
    recordState(dir, "next");
    const result = cli([dir, "--no-install", "--no-git"]);
    t.assert.strictEqual(result.status, 0, result.stderr);
    t.assert.match(result.stdout, /skills {3}skipped\n/);
    const quoted = dir.replace("it's", String.raw`it'\''s`);
    t.assert.ok(
      result.stdout.endsWith(`next: cd '${quoted}' && pnpm dev\n`),
      result.stdout
    );
  });

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

describe("--no-git", () => {
  it("needs no git on PATH, while a run that inits does", (t: TestContext) => {
    const dir = upstreamBase("next");
    recordState(dir, "next");
    const env = onlyOnPath();
    const without = cli([dir, "--no-install", "--no-git"], env);
    t.assert.strictEqual(without.status, 0, without.stderr);
    t.assert.match(without.stdout, /git {6}skipped\n/);
    const inits = cli([dir, "--no-install"], env);
    t.assert.strictEqual(inits.status, 1);
    t.assert.match(inits.stderr, /^create-creact: git couldn't start: /);
  });
});

describe("the skills restore", () => {
  const RESTORE = `pnpm --package=${SKILLS_CLI} dlx skills experimental_install`;

  it("leaves the project complete and exits 0 when the restore can't find git", (t: TestContext) => {
    const dir = upstreamBase("next");
    recordState(dir, "next");
    const result = cli(
      [dir, "--no-git"],
      pnpmFake("exec git clone https://example.invalid/skills")
    );
    t.assert.strictEqual(result.status, 0, result.stderr);
    t.assert.ok(
      result.stdout.includes(
        `  skills   not restored, as ${RESTORE} exited with 127\n`
      ),
      result.stdout
    );
    t.assert.match(result.stdout, /^next: cd /m);
    for (const id of locked(dir)) {
      t.assert.ok(
        lstatSync(path.join(dir, CLAUDE_SKILLS, id)).isSymbolicLink(),
        id
      );
    }
  });

  it("prints the command that finishes it after a failed restore, and a rerun then finds the skills present", (t: TestContext) => {
    const dir = upstreamBase("next");
    recordState(dir, "next");
    const failed = cli([dir, "--no-git"], pnpmFake("exit 1"));
    t.assert.strictEqual(failed.status, 0, failed.stderr);
    t.assert.ok(
      failed.stdout.includes(
        `  skills   not restored, as ${RESTORE} exited with 1\n`
      ),
      failed.stdout
    );
    const command = /^ {11}finish with (.*)$/m.exec(failed.stdout)?.[1];
    t.assert.ok(command !== undefined, failed.stdout);

    const ids = locked(dir);
    const dirs = ids.map((id) => `${SKILLS_DIR}/${id}`).join(" ");
    const env = pnpmFake(`/bin/mkdir -p ${dirs}`);
    const finished = spawnSync("/bin/sh", ["-c", command], {
      env,
      encoding: "utf8",
    });
    t.assert.strictEqual(finished.status, 0, finished.stderr);
    for (const id of ids) {
      t.assert.ok(existsSync(path.join(dir, CLAUDE_SKILLS, id)), id);
    }

    const rerun = cli([dir, "--no-git"], env);
    t.assert.strictEqual(rerun.status, 0, rerun.stderr);
    t.assert.match(rerun.stdout, /skills {3}present in/);
  });
});

describe("the root .gitignore", () => {
  it("keeps the shared .claude files tracked under a global .claude ignore, and the restored skills out", (t: TestContext) => {
    const dir = upstreamBase("next");
    writeFileSync(path.join(dir, ".gitignore"), "node_modules\n");
    recordState(dir, "next");
    const first = cli([dir, "--no-install"]);
    t.assert.strictEqual(first.status, 0, first.stderr);
    mkdirSync(path.join(dir, SKILLS_DIR, "tdd"), { recursive: true });
    writeFileSync(path.join(dir, SKILLS_DIR, "tdd", "SKILL.md"), "");
    writeFileSync(path.join(dir, ".claude", "settings.local.json"), "{}");
    const excludes = path.join(tempDir(), "ignore");
    writeFileSync(excludes, ".claude\n.claude/*\n!.claude/settings.json\n");

    const staged = git(dir, [
      "-c",
      `core.excludesFile=${excludes}`,
      "add",
      "-A",
      "--dry-run",
    ]).stdout;
    for (const id of locked(dir)) {
      t.assert.ok(staged.includes(`add '${CLAUDE_SKILLS}/${id}'\n`), staged);
    }
    t.assert.ok(staged.includes("add '.gitignore'\n"), staged);
    t.assert.ok(!staged.includes(SKILLS_DIR), staged);
    t.assert.ok(!staged.includes("settings.local.json"), staged);

    const second = cli([dir, "--no-install", "--no-git"]);
    t.assert.strictEqual(second.status, 0, second.stderr);
    t.assert.match(second.stdout, /layer {4}0 written/);
    const ignore = readFileSync(path.join(dir, ".gitignore"), "utf8");
    t.assert.strictEqual(ignore.split("!/.claude/skills/").length, 2, ignore);
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

describe("the caller's own git settings", () => {
  it("reach the project's git init", (t: TestContext) => {
    const config = path.join(tempDir(), "gitconfig");
    writeFileSync(config, "[init]\n\tdefaultBranch = trunk\n");
    const dir = upstreamBase("next");
    recordState(dir, "next");

    const result = spawnSync(process.execPath, [MAIN, dir, "--no-install"], {
      env: { ...withoutGitContext(), GIT_CONFIG_GLOBAL: config },
      encoding: "utf8",
    });
    t.assert.strictEqual(result.status, 0, result.stderr);
    t.assert.strictEqual(
      git(dir, ["symbolic-ref", "HEAD"]).stdout.trim(),
      "refs/heads/trunk"
    );
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

  it("is refused through a symlink into the repository, missing or recorded", (t: TestContext) => {
    const repo = tempDir();
    gitInit(repo);
    const sub = path.join(repo, "sub");
    mkdirSync(sub);
    const link = path.join(tempDir(), "link");
    symlinkSync(sub, link);
    const missing = cli([path.join(link, "app"), ...FLAGS]);
    t.assert.strictEqual(missing.status, 2, missing.stderr);
    t.assert.match(missing.stderr, REFUSAL);
    t.assert.deepStrictEqual(readdirSync(sub), []);

    const app = path.join(sub, "app");
    mkdirSync(app);
    upstreamBase("next", {}, app);
    recordState(app, "next");
    const recorded = cli([path.join(link, "app"), "--no-install", "--no-git"]);
    t.assert.strictEqual(recorded.status, 2, recorded.stderr);
    t.assert.match(recorded.stderr, REFUSAL);
    t.assert.strictEqual(existsSync(path.join(app, ".git")), false);
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

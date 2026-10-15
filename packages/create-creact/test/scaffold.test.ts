/* oxlint-disable typescript/no-floating-promises, security/detect-non-literal-fs-filename --
 * node:test's describe and it return promises the runner awaits, and every
 * path is a temp dir the test made. */
import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it, type TestContext } from "node:test";

import { create } from "../src/create.ts";
import { type StackId, STACKS } from "../src/stacks.ts";

const MAIN = path.join(import.meta.dirname, "../src/main.ts");
const LAYER = path.join(import.meta.dirname, "../layer");
const IDENTITY = [
  "-c",
  "user.name=create-creact test",
  "-c",
  "user.email=test@example.invalid",
];
const CHECKS = ["build", "typecheck", "lint", "format:check", "test"];

// creact's mise.toml sets NODE_ENV=development, and next build can't
// prerender under it. A generated project starts from a clean NODE_ENV.
const PROJECT_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => name !== "NODE_ENV")
);

function sh(
  cwd: string,
  command: string,
  args: readonly string[],
  env: NodeJS.ProcessEnv = PROJECT_ENV
): SpawnSyncReturns<string> {
  return spawnSync(command, args, { cwd, env, encoding: "utf8" });
}

function porcelain(dir: string): string {
  return sh(dir, "git", ["status", "--porcelain"]).stdout;
}

// A HOME whose saved create-next-app preferences turn on ESLint and the React
// Compiler, in both places its config library looks. The store stays the
// real one so pnpm doesn't download everything again.
function seededEnv(parent: string): NodeJS.ProcessEnv {
  const home = path.join(parent, "home");
  const preferences = JSON.stringify({
    preferences: { linter: "eslint", eslint: true, reactCompiler: true },
  });
  for (const dir of [
    "Library/Preferences/create-next-app-nodejs",
    ".config/create-next-app-nodejs",
  ]) {
    mkdirSync(path.join(home, dir), { recursive: true });
    writeFileSync(path.join(home, dir, "config.json"), preferences);
  }
  const store = sh(parent, "pnpm", ["store", "path"]).stdout.trim();
  return {
    ...PROJECT_ENV,
    HOME: home,
    XDG_CONFIG_HOME: path.join(home, ".config"),
    pnpm_config_store_dir: path.dirname(store),
  };
}

for (const id of Object.keys(STACKS) as StackId[]) {
  const stack = STACKS[id];

  describe(
    `scaffold ${id}`,
    { skip: process.env.CREACT_SCAFFOLD !== "1" && "set CREACT_SCAFFOLD=1" },
    () => {
      let parent = "";
      let dir = "";
      let env: NodeJS.ProcessEnv = {};

      before(() => {
        parent = mkdtempSync(path.join(tmpdir(), "create-creact-"));
        dir = path.join(parent, "app");
        env = seededEnv(parent);
      });

      after(() => {
        rmSync(parent, { recursive: true, force: true });
      });

      it("creates the project without saved create-next-app preferences leaking in", (t: TestContext) => {
        const result = sh(
          parent,
          process.execPath,
          [MAIN, "app", "--stack", id],
          env
        );
        t.assert.strictEqual(result.status, 0, result.stderr);
        t.assert.match(result.stdout, / 0 unchanged, 0 kept\n/);
        t.assert.deepStrictEqual(
          readdirSync(parent).filter((entry) => entry.includes("staging")),
          []
        );

        const pkg = readFileSync(path.join(dir, "package.json"), "utf8");
        t.assert.doesNotMatch(pkg, /"eslint(-config-next)?":/);
        t.assert.deepStrictEqual(
          readdirSync(dir).filter((entry) => entry.includes("eslint")),
          []
        );
        const signature = readFileSync(path.join(dir, stack.signature), "utf8");
        t.assert.doesNotMatch(signature, /reactCompiler/);
      });

      it("installs the git hooks and commits through them", (t: TestContext) => {
        t.assert.strictEqual(
          sh(dir, "git", ["config", "core.hooksPath"]).stdout.trim(),
          ".husky/_"
        );
        sh(dir, "git", ["add", "--all"]);
        const result = sh(dir, "git", [
          ...IDENTITY,
          "commit",
          "--message",
          "chore: start from create-creact",
        ]);
        t.assert.strictEqual(result.status, 0, result.stderr);
      });

      it("rejects a commit message that isn't Conventional Commits", (t: TestContext) => {
        const head = sh(dir, "git", ["rev-parse", "HEAD"]).stdout;
        const result = sh(dir, "git", [
          ...IDENTITY,
          "commit",
          "--allow-empty",
          "--message",
          "bad",
        ]);
        t.assert.notStrictEqual(result.status, 0);
        t.assert.match(
          result.stdout + result.stderr,
          /subject may not be empty/
        );
        t.assert.strictEqual(
          sh(dir, "git", ["rev-parse", "HEAD"]).stdout,
          head
        );
      });

      it("builds, typechecks, lints, checks formatting and tests", (t: TestContext) => {
        for (const check of CHECKS) {
          const result = sh(dir, "pnpm", ["run", check]);
          t.assert.strictEqual(
            result.status,
            0,
            `${check}:\n${result.stdout}${result.stderr}`
          );
        }
      });

      it("leaves no tracked file changed and no new file after its own tools ran", (t: TestContext) => {
        t.assert.strictEqual(porcelain(dir), "");
      });

      it("writes nothing and keeps the tree clean when run again", (t: TestContext) => {
        const result = sh(parent, process.execPath, [MAIN, "app"], env);
        t.assert.strictEqual(result.status, 0, result.stderr);
        t.assert.match(result.stdout, / 0 written, \d+ unchanged, 0 kept/);
        t.assert.strictEqual(porcelain(dir), "");
      });

      it("formats a staged file on commit and resolves the stack's alias in a test", (t: TestContext) => {
        const tsconfig = JSON.parse(
          readFileSync(path.join(dir, "tsconfig.json"), "utf8")
        ) as { compilerOptions: { paths: Record<string, string[]> } };
        const [alias, targets] =
          Object.entries(tsconfig.compilerOptions.paths)[0] ?? [];
        t.assert.deepStrictEqual(targets, [`./${stack.srcRoot}/*`]);
        const prefix = alias?.replace("*", "") ?? "";

        const probe = path.join(dir, stack.srcRoot, "probe");
        mkdirSync(probe);
        writeFileSync(
          path.join(probe, "add.ts"),
          "export function add(a:number,b:number):number{return a+b}\n"
        );
        writeFileSync(
          path.join(probe, "add.test.ts"),
          [
            'import { describe, expect, it } from "vitest";',
            "",
            `import { add } from "${prefix}probe/add";`,
            "",
            'describe("add", () => {',
            '  it("adds two numbers", () => {',
            "    expect(add(1, 2)).toBe(3);",
            "  });",
            "});",
            "",
          ].join("\n")
        );
        sh(dir, "git", ["add", "--all"]);
        const commit = sh(dir, "git", [
          ...IDENTITY,
          "commit",
          "--message",
          "test: add an alias probe",
        ]);
        t.assert.strictEqual(commit.status, 0, commit.stdout + commit.stderr);
        const committed = sh(dir, "git", [
          "show",
          `HEAD:${stack.srcRoot}/probe/add.ts`,
        ]).stdout;
        t.assert.match(committed, /return a \+ b;/);

        const result = sh(dir, "pnpm", ["run", "test"]);
        t.assert.strictEqual(result.status, 0, result.stdout + result.stderr);
        t.assert.match(result.stdout, /1 passed/);
      });

      it("updates an unedited layer file and keeps an edited one", async (t: TestContext) => {
        const layer = path.join(parent, "layer");
        cpSync(LAYER, layer, { recursive: true });
        for (const file of ["vitest.config.ts", "commitlint.config.ts"]) {
          const source = path.join(layer, "base", `${file}.layer`);
          writeFileSync(
            source,
            `${readFileSync(source, "utf8")}// newer layer\n`
          );
        }
        const edited = path.join(dir, "commitlint.config.ts");
        writeFileSync(
          edited,
          `${readFileSync(edited, "utf8")}// project rule\n`
        );

        const report = await create(
          {
            dir,
            stack: undefined,
            styling: undefined,
            extras: [],
            yes: false,
            install: false,
            git: false,
          },
          layer
        );
        t.assert.strictEqual(report.layer.files["vitest.config.ts"], "written");
        t.assert.strictEqual(
          report.layer.files["commitlint.config.ts"],
          "kept"
        );
        t.assert.match(
          readFileSync(path.join(dir, "vitest.config.ts"), "utf8"),
          /\/\/ newer layer\n$/
        );
        t.assert.match(readFileSync(edited, "utf8"), /\/\/ project rule\n$/);
      });
    }
  );
}

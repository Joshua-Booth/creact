/* oxlint-disable typescript/no-floating-promises, security/detect-non-literal-fs-filename --
 * node:test's describe and it return promises the runner awaits, and every
 * path is a temp dir the test made or the package's own layer. */
import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import {
  cpSync,
  existsSync,
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
import {
  isObject,
  type JsonObject,
  loadLayer,
  type OverlayId,
  plan,
  type Removal,
} from "../src/layer.ts";
import {
  isBuilt,
  projectName,
  type StylingId,
  STYLINGS,
} from "../src/options.ts";
import { withoutGitContext } from "../src/shell.ts";
import {
  type MonorepoId,
  MONOREPOS,
  type StackId,
  STACKS,
} from "../src/stacks.ts";

const MAIN = path.join(import.meta.dirname, "../src/main.ts");
const LAYER = path.join(import.meta.dirname, "../layer");
const IDENTITY = [
  "-c",
  "user.name=create-creact test",
  "-c",
  "user.email=test@example.invalid",
];
const SRC = "apps/web/src";
const CHECKS = ["build", "typecheck", "lint", "format:check", "test"];
const STACK_IDS = Object.keys(STACKS) as StackId[];
const STYLING_IDS = Object.keys(STYLINGS).filter((id): id is StylingId =>
  isBuilt(STYLINGS, id)
);
const MONOREPO_IDS = Object.keys(MONOREPOS) as MonorepoId[];

const SCAFFOLD = new Set(process.env.CREACT_SCAFFOLD?.split(","));

function selected(
  stack: StackId,
  styling: StylingId,
  monorepo: MonorepoId
): boolean {
  const keys = monorepo === "pnpm" ? ["1", stack, `${stack}:${styling}`] : [];
  return [...keys, `${stack}:${styling}:${monorepo}`].some((key) =>
    SCAFFOLD.has(key)
  );
}

// creact's mise.toml sets NODE_ENV=development, and next build can't
// prerender under it. A generated project starts from a clean NODE_ENV.
// NO_COLOR keeps the tools' output plain where CI forces colour, so the
// assertions below read it as is.
const PROJECT_ENV = {
  ...Object.fromEntries(
    Object.entries(withoutGitContext()).filter(([name]) => name !== "NODE_ENV")
  ),
  NO_COLOR: "1",
};

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

function readJson(file: string): JsonObject {
  return JSON.parse(readFileSync(file, "utf8")) as JsonObject;
}

function leftOver(doc: JsonObject, removal: Removal): string[] {
  return Object.entries(removal).flatMap(([key, rule]) => {
    const value = doc[key];
    if (value === undefined) return [];
    if (rule === null) return [key];
    return isObject(value) ? leftOver(value, rule) : [];
  });
}

const CSS_OUTPUT: Readonly<Record<StackId, string>> = {
  "react-router": "apps/web/build/client/assets",
  next: "apps/web/.next/static",
};

function builtCss(dir: string): string {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => file.endsWith(".css"))
    .map((file) => readFileSync(path.join(dir, file), "utf8"))
    .join("\n");
}

interface Proof {
  readonly cssHas: readonly RegExp[];
  readonly cssLacks: readonly RegExp[];
  readonly component: string;
  readonly badComponent: string;
  readonly lintRule: string;
}

const PROOF = {
  tailwind: {
    cssHas: [],
    cssLacks: [/--color-page:\s*var\(--color-page\)/],
    component: [
      "export function Card({ children }: { children: React.ReactNode }) {",
      '  return <div className="p-gutter text-ink">{children}</div>;',
      "}",
      "",
    ].join("\n"),
    badComponent: [
      "export function Planted() {",
      '  return <p className="p-2 p-4" />;',
      "}",
      "",
    ].join("\n"),
    lintRule: "better-tailwindcss(no-conflicting-classes)",
  },
  stylex: {
    cssHas: [/@layer priority1/, /\{\s*color: ?var\(--color-accent\)/],
    cssLacks: [],
    component: [
      'import * as stylex from "@stylexjs/stylex";',
      "",
      'import { colors, spacing } from "@/styles/tokens.stylex";',
      "",
      "const styles = stylex.create({",
      "  card: { padding: spacing.gutter, color: colors.ink },",
      "});",
      "",
      "export function Card({ children }: { children: React.ReactNode }) {",
      "  return <div {...stylex.props(styles.card)}>{children}</div>;",
      "}",
      "",
    ].join("\n"),
    badComponent: [
      'import * as stylex from "@stylexjs/stylex";',
      "",
      'const styles = stylex.create({ bad: { margin: "1px 2px" } });',
      "",
      "export function Planted() {",
      "  return <p {...stylex.props(styles.bad)} />;",
      "}",
      "",
    ].join("\n"),
    lintRule: "@stylexjs(valid-shorthands)",
  },
} satisfies Record<StylingId, Proof>;

const CARD_TEST = [
  'import { renderToStaticMarkup } from "react-dom/server";',
  'import { describe, expect, it } from "vitest";',
  "",
  'import { Card } from "@/probe/card";',
  "",
  'describe("Card", () => {',
  '  it("renders with the class its styling gave it", () => {',
  "    expect(renderToStaticMarkup(<Card>hi</Card>)).toMatch(",
  '      /^<div class="[^"]+">hi<\\/div>$/',
  "    );",
  "  });",
  "});",
  "",
].join("\n");

const TOOL_CONFIG: Readonly<Record<MonorepoId, string | undefined>> = {
  pnpm: undefined,
  turborepo: "turbo.json",
  nx: "nx.json",
};

function withEmptyHome(parent: string): NodeJS.ProcessEnv {
  const home = path.join(parent, "home");
  mkdirSync(home);
  const store = sh(parent, "pnpm", ["store", "path"]).stdout.trim();
  return {
    ...PROJECT_ENV,
    HOME: home,
    XDG_DATA_HOME: path.join(home, ".local", "share"),
    pnpm_config_store_dir: path.dirname(store),
  };
}

for (const [id, styling, monorepo] of STACK_IDS.flatMap((stackId) =>
  STYLING_IDS.flatMap((stylingId) =>
    MONOREPO_IDS.map((tool) => [stackId, stylingId, tool] as const)
  )
)) {
  const proof = PROOF[styling];

  describe(
    `scaffold ${id} + ${styling} on ${monorepo}`,
    {
      skip:
        !selected(id, styling, monorepo) &&
        "set CREACT_SCAFFOLD=1, <stack>, <stack>:<styling> or <stack>:<styling>:<monorepo>",
    },
    () => {
      let parent = "";
      let dir = "";
      let env: NodeJS.ProcessEnv = {};

      before(() => {
        parent = mkdtempSync(path.join(tmpdir(), "create-creact-"));
        dir = path.join(parent, "app");
        env = withEmptyHome(parent);
      });

      after(() => {
        rmSync(parent, { recursive: true, force: true });
      });

      it("creates the project without Better-T-Stack writing to the caller's home", async (t: TestContext) => {
        const result = sh(
          parent,
          process.execPath,
          [
            MAIN,
            "app",
            "--stack",
            id,
            "--styling",
            styling,
            "--monorepo",
            monorepo,
          ],
          env
        );
        t.assert.strictEqual(result.status, 0, result.stderr);
        t.assert.match(result.stdout, / 0 unchanged, 0 kept\n/);
        t.assert.match(result.stdout, /skills {3}restored into/);
        t.assert.deepStrictEqual(
          readdirSync(parent).filter((entry) => entry.includes("staging")),
          []
        );
        t.assert.deepStrictEqual(
          readdirSync(path.join(parent, "home"), {
            recursive: true,
            encoding: "utf8",
          }).filter((entry) => path.basename(entry) === "better-t-stack"),
          []
        );

        const ids: readonly OverlayId[] = ["base", styling];
        const prune = plan(await loadLayer(LAYER, ids, id), ids, {
          stack: id,
          monorepo,
          name: projectName(dir),
        }).find((op) => op.kind === "prune");
        t.assert.ok(prune?.kind === "prune");
        t.assert.deepStrictEqual(
          prune.paths.filter((entry) => existsSync(path.join(dir, entry))),
          []
        );
        t.assert.deepStrictEqual(
          prune.json.flatMap(({ file, removal }) =>
            leftOver(readJson(path.join(dir, file)), removal)
          ),
          []
        );

        const config = TOOL_CONFIG[monorepo];
        t.assert.deepStrictEqual(
          Object.values(TOOL_CONFIG).filter(
            (file) => file !== undefined && existsSync(path.join(dir, file))
          ),
          config === undefined ? [] : [config]
        );
      });

      it("is set up for coding agents, with every locked skill restored where Claude Code looks", (t: TestContext) => {
        const lock = readJson(path.join(dir, "skills-lock.json")) as {
          skills: JsonObject;
        };
        const ids = Object.keys(lock.skills);
        t.assert.ok(ids.length > 0);
        t.assert.strictEqual(ids.includes("shadcn"), styling === "tailwind");
        for (const skill of ids) {
          t.assert.ok(
            existsSync(path.join(dir, ".claude/skills", skill, "SKILL.md")),
            skill
          );
        }
        t.assert.strictEqual(
          readFileSync(path.join(dir, "CLAUDE.md"), "utf8"),
          "@AGENTS.md\n"
        );
        t.assert.match(
          readFileSync(path.join(dir, "AGENTS.md"), "utf8"),
          /^# app\n/
        );
        t.assert.strictEqual(
          existsSync(path.join(dir, "apps/web/CLAUDE.md")),
          id === "next"
        );
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

      it("builds, typechecks, lints, checks formatting and tests from the root", (t: TestContext) => {
        for (const check of CHECKS) {
          const result = sh(dir, "pnpm", ["run", check]);
          t.assert.strictEqual(
            result.status,
            0,
            `${check}:\n${result.stdout}${result.stderr}`
          );
        }
      });

      it("builds CSS that carries the values from the project's tokens.css", (t: TestContext) => {
        const tokens = readFileSync(
          path.join(dir, SRC, "styles", "tokens.css"),
          "utf8"
        );
        const accent = tokens
          .split("--color-accent:")[1]
          ?.split(";")[0]
          ?.trim();
        const css = builtCss(path.join(dir, CSS_OUTPUT[id]));
        t.assert.ok(accent !== undefined && css.includes(accent), accent);
        for (const mark of proof.cssHas) t.assert.match(css, mark);
        for (const mark of proof.cssLacks) t.assert.doesNotMatch(css, mark);
      });

      it("leaves no tracked file changed and no new file after its own tools ran", (t: TestContext) => {
        t.assert.strictEqual(porcelain(dir), "");
      });

      it("writes nothing and keeps the tree clean when run again", (t: TestContext) => {
        const result = sh(parent, process.execPath, [MAIN, "app"], env);
        t.assert.strictEqual(result.status, 0, result.stderr);
        t.assert.match(result.stdout, / 0 written, \d+ unchanged, 0 kept/);
        t.assert.match(result.stdout, /skills {3}present in/);
        t.assert.strictEqual(porcelain(dir), "");
      });

      it("formats a staged file on commit, resolves the app's alias in a test and renders a styled component", (t: TestContext) => {
        const tsconfig = readJson(path.join(dir, "apps/web/tsconfig.json"));
        const { paths } = tsconfig.compilerOptions as {
          paths: Record<string, string[]>;
        };
        t.assert.deepStrictEqual(paths["@/*"], ["./src/*"]);

        const probe = path.join(dir, SRC, "probe");
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
            'import { add } from "@/probe/add";',
            "",
            'describe("add", () => {',
            '  it("adds two numbers", () => {',
            "    expect(add(1, 2)).toBe(3);",
            "  });",
            "});",
            "",
          ].join("\n")
        );
        writeFileSync(path.join(probe, "card.tsx"), proof.component);
        writeFileSync(path.join(probe, "card.test.tsx"), CARD_TEST);
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
          `HEAD:${SRC}/probe/add.ts`,
        ]).stdout;
        t.assert.match(committed, /return a \+ b;/);

        const result = sh(dir, "pnpm", ["run", "test"]);
        t.assert.strictEqual(result.status, 0, result.stdout + result.stderr);
        t.assert.match(result.stdout, /Tests {2}4 passed/);
        t.assert.doesNotMatch(result.stdout + result.stderr, /close timed out/);
      });

      it("updates an unedited layer file and keeps an edited one", async (t: TestContext) => {
        const layer = path.join(parent, "layer");
        cpSync(LAYER, layer, { recursive: true });
        for (const file of ["vitest.config.ts", "commitlint.config.ts"]) {
          const source = path.join(layer, "base", "all", `${file}.layer`);
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
            monorepo: undefined,
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

      it("fails lint from the root on a planted styling mistake and passes once it's gone", (t: TestContext) => {
        const planted = path.join(dir, SRC, "planted.tsx");
        writeFileSync(planted, proof.badComponent);
        const failed = sh(dir, "pnpm", ["run", "lint"]);
        rmSync(planted);
        t.assert.notStrictEqual(failed.status, 0);
        t.assert.ok(
          (failed.stdout + failed.stderr).includes(proof.lintRule),
          failed.stdout + failed.stderr
        );
        const passed = sh(dir, "pnpm", ["run", "lint"]);
        t.assert.strictEqual(passed.status, 0, passed.stdout + passed.stderr);
      });
    }
  );
}

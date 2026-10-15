/* oxlint-disable typescript/no-floating-promises, security/detect-non-literal-fs-filename, sonarjs/no-os-command-from-path --
 * node:test's describe and it return promises the runner awaits, every
 * path is a temp dir the test made or the package's own layer, and git
 * comes from PATH here as it does in the CLI. */
import { spawnSync } from "node:child_process";
import {
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
import { after, describe, it, type TestContext } from "node:test";

import {
  apply,
  JSON_FILES,
  type JsonFile,
  type JsonObject,
  loadLayer,
  type Manifest,
  merge,
  type Op,
  type OverlayId,
  OVERLAYS,
  plan,
  type Prior,
  readState,
  STATE_FILE,
} from "../src/layer.ts";
import {
  DEFAULTS,
  type Feature,
  isBuilt,
  type Parsed,
  parseRequest,
  projectName,
  type Request,
  resolveChoices,
  type StylingId,
  STYLINGS,
  UsageError,
} from "../src/options.ts";
import { withoutGitContext } from "../src/shell.ts";
import { btsArgs, type StackId, STACKS } from "../src/stacks.ts";

const CWD = "/work";
const IDENTITY = [
  "-c",
  "user.name=create-creact test",
  "-c",
  "user.email=test@example.invalid",
];
const MAIN = path.join(import.meta.dirname, "../src/main.ts");
const LAYER = path.join(import.meta.dirname, "../layer");
const STACK_IDS = Object.keys(STACKS) as StackId[];
const STYLING_IDS = Object.keys(STYLINGS).filter((id): id is StylingId =>
  isBuilt(STYLINGS, id)
);
const CELLS = STACK_IDS.flatMap((stack) =>
  STYLING_IDS.map((styling) => ({ stack, styling }))
);

const SHARED_FILES = [
  ".husky/commit-msg",
  ".husky/pre-commit",
  ".lintstagedrc.json",
  ".oxfmtrc.json",
  "commitlint.config.ts",
  "oxlint.config.ts",
  "oxlint.styling.ts",
  "vitest.config.ts",
  "apps/web/src/index.css",
  "apps/web/src/styles/tokens.css",
  "apps/web/src/styles/tokens.test.ts",
];

const TAILWIND_FILES = [
  ...SHARED_FILES,
  "apps/web/src/styles/tokens.tailwind.css",
];

const STYLEX_FILES = [...SHARED_FILES, "apps/web/src/styles/tokens.stylex.ts"];

const FILES: Readonly<
  Record<StackId, Readonly<Record<StylingId, readonly string[]>>>
> = {
  "react-router": {
    tailwind: TAILWIND_FILES,
    stylex: [
      ...STYLEX_FILES,
      "apps/web/vite.config.ts",
      "apps/web/src/root.tsx",
      "apps/web/src/routes/_index.tsx",
    ],
  },
  next: {
    tailwind: TAILWIND_FILES,
    stylex: [
      ...STYLEX_FILES,
      "apps/web/babel.config.js",
      "apps/web/postcss.config.js",
      "apps/web/src/app/layout.tsx",
      "apps/web/src/app/page.tsx",
    ],
  },
};

const NAME = projectName("/work/app");

function fixture(stack: StackId): Readonly<Record<JsonFile, JsonObject>> {
  return JSON.parse(
    readFileSync(
      path.join(import.meta.dirname, "fixtures", `${stack}.json`),
      "utf8"
    )
  ) as Record<JsonFile, JsonObject>;
}

async function ops(
  stack: StackId,
  styling: StylingId = "tailwind"
): Promise<readonly Op[]> {
  const ids: readonly OverlayId[] = ["base", styling];
  return plan(await loadLayer(LAYER, ids, stack), ids, { stack, name: NAME });
}

function fileOps(all: readonly Op[]) {
  return all.flatMap((op) => (op.kind === "file" ? [op] : []));
}

function pruneOp(all: readonly Op[]) {
  return all.find((op) => op.kind === "prune");
}

function packagesToAdd(all: readonly Op[]): string[] {
  return all.flatMap((op) =>
    op.kind === "deps" ? [...op.dependencies, ...op.devDependencies] : []
  );
}

function readJsonFile(dir: string, file: JsonFile): JsonObject {
  return JSON.parse(readFileSync(path.join(dir, file), "utf8")) as JsonObject;
}

function packageNames(pkg: JsonObject): string[] {
  return ["dependencies", "devDependencies"].flatMap((key) =>
    Object.keys(pkg[key] ?? {})
  );
}

function packagesUsed(file: string, content: string): string[] {
  const imports = [
    ...content.matchAll(/from "(?![.~]|@\/|node:)([^"]+)"/g),
  ].map((match) => match[1]);
  const jsPlugins = [...content.matchAll(/jsPlugins: \[([^\]]*)\]/g)].flatMap(
    (block) =>
      [...(block[1] ?? "").matchAll(/(?<!name: )"([\w@/.-]+)"/g)].map(
        (match) => match[1]
      )
  );
  const configPlugins = /^(babel|postcss)\.config\./.test(path.basename(file))
    ? [
        ...content.matchAll(/presets: \["([\w@/.-]+)"/g),
        ...content.matchAll(/\[\s*"([\w@/.-]+)",\s*\{/g),
        ...content.matchAll(/"([\w@/.-]+)": \{/g),
      ].map((match) => match[1])
    : [];
  return [...imports, ...jsPlugins, ...configPlugins].map((specifier = "") =>
    specifier
      .split("/")
      .slice(0, specifier.startsWith("@") ? 2 : 1)
      .join("/")
  );
}

function patch(all: readonly Op[], file: JsonFile): JsonObject {
  const op = all.find(
    (candidate) => candidate.kind === "json" && candidate.path === file
  );
  return op?.kind === "json" ? op.patch : {};
}

function upstreamBase(
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
  return dir;
}

const TEMP_DIRS: string[] = [];

after(() => {
  for (const dir of TEMP_DIRS) rmSync(dir, { recursive: true, force: true });
});

function tempDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "creact-plan-"));
  TEMP_DIRS.push(dir);
  return dir;
}

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

function recordState(dir: string, stack: string, schema = 2): void {
  mkdirSync(path.join(dir, ".creact"));
  writeFileSync(
    path.join(dir, STATE_FILE),
    JSON.stringify({
      schema,
      creact: "0.0.0",
      name: "app",
      stack,
      styling: "tailwind",
      monorepo: "pnpm",
      extras: [],
      hashes: {},
    })
  );
}

const UPSTREAM_ONLY: Prior = { kind: "upstream-only" };

function recorded(hashes: Readonly<Record<string, string>>): Prior {
  return { kind: "recorded", hashes };
}

function cli(argv: readonly string[]) {
  return spawnSync(process.execPath, [MAIN, ...argv], {
    env: withoutGitContext(),
    encoding: "utf8",
  });
}

function parse(argv: readonly string[]): Parsed {
  return parseRequest(argv, CWD);
}

function request(argv: readonly string[]): Request {
  const parsed = parse(argv);
  if (parsed.kind !== "run") throw new Error(JSON.stringify(parsed));
  return parsed.request;
}

function usage(argv: readonly string[]): string {
  const parsed = parse(argv);
  return parsed.kind === "usage" ? parsed.message : `not usage: ${parsed.kind}`;
}

describe("parseRequest", () => {
  it("names every planned flag in one message instead of failing on the first", (t: TestContext) => {
    const message = usage(["app", "--storybook", "--msw", "--sentry"]);
    t.assert.match(message, /^not built yet: /);
    for (const flag of ["--storybook", "--msw", "--sentry"]) {
      t.assert.ok(message.includes(flag), `${flag} missing from: ${message}`);
    }
  });

  it("takes --styling stylex", (t: TestContext) => {
    t.assert.strictEqual(
      request(["app", "--styling", "stylex"]).styling,
      "stylex"
    );
  });

  it("takes --monorepo nx and leaves it unset when not given", (t: TestContext) => {
    t.assert.strictEqual(request(["app", "--monorepo", "nx"]).monorepo, "nx");
    t.assert.strictEqual(request(["app"]).monorepo, undefined);
  });

  it("rejects a monorepo tool outside the table and lists the real ones", (t: TestContext) => {
    t.assert.strictEqual(
      usage(["app", "--monorepo", "vite-plus"]),
      "--monorepo must be one of pnpm, turborepo, nx"
    );
  });

  it("rejects a planned extra rather than silently skipping it", (t: TestContext) => {
    t.assert.match(usage(["app", "--stack", "next", "--i18n"]), /--i18n/);
  });

  it("rejects an unknown flag and points at --help", (t: TestContext) => {
    t.assert.match(usage(["app", "--vue"]), /--help/);
  });

  it("rejects a stack outside the table and lists the real ones", (t: TestContext) => {
    t.assert.match(usage(["app", "--stack", "vue"]), /react-router, next/);
  });

  it("needs exactly one project directory", (t: TestContext) => {
    t.assert.strictEqual(parse(["--stack", "next"]).kind, "usage");
    t.assert.strictEqual(
      parse(["one", "two", "--stack", "next"]).kind,
      "usage"
    );
  });

  it("resolves the directory against the caller's cwd", (t: TestContext) => {
    t.assert.strictEqual(request(["my-app"]).dir, path.resolve(CWD, "my-app"));
  });

  it("turns off install and git only when asked", (t: TestContext) => {
    t.assert.deepStrictEqual(
      [request(["app"]).install, request(["app"]).git],
      [true, true]
    );
    const off = request(["app", "--no-install", "--no-git"]);
    t.assert.deepStrictEqual([off.install, off.git], [false, false]);
  });

  it("lists every stack and every extra in the help text", (t: TestContext) => {
    const parsed = parse(["--help"]);
    const text = parsed.kind === "help" ? parsed.text : "";
    for (const word of [
      "react-router",
      "next",
      "stylex",
      "turborepo",
      "--storybook",
    ]) {
      t.assert.ok(text.includes(word), word);
    }
  });

  it("marks an extra that needs one styling in the help text", (t: TestContext) => {
    const parsed = parse(["--help"]);
    const text = parsed.kind === "help" ? parsed.text : "";
    t.assert.match(text, /--shadcn {10}.*\(tailwind only\)\n/);
    t.assert.doesNotMatch(text, /--storybook .*only\)/);
  });
});

describe("resolveChoices", () => {
  it("refuses to guess a stack on a new project without --yes", (t: TestContext) => {
    t.assert.throws(
      () => resolveChoices(request(["app"]), undefined),
      (error) =>
        error instanceof UsageError && error.message.includes("--stack")
    );
  });

  it("takes every default under --yes", (t: TestContext) => {
    t.assert.deepStrictEqual(
      resolveChoices(request(["app", "--yes"]), undefined),
      {
        stack: DEFAULTS.stack,
        styling: DEFAULTS.styling,
        monorepo: "pnpm",
        extras: [],
      }
    );
  });

  const RECORDED = {
    stack: "next",
    styling: "tailwind",
    monorepo: "turborepo",
    extras: [],
  } as const;

  it("takes the recorded choices on a rerun with no flags", (t: TestContext) => {
    t.assert.deepStrictEqual(
      resolveChoices(request(["app"]), RECORDED),
      RECORDED
    );
  });

  it("refuses a --stack or --monorepo that contradicts the recorded project", (t: TestContext) => {
    const dir = path.resolve(CWD, "app");
    t.assert.throws(
      () =>
        resolveChoices(request(["app", "--stack", "react-router"]), RECORDED),
      {
        name: "UsageError",
        message: `${dir} is recorded as stack next, so --stack react-router can't apply`,
      }
    );
    t.assert.throws(
      () => resolveChoices(request(["app", "--monorepo", "pnpm"]), RECORDED),
      {
        name: "UsageError",
        message: `${dir} is recorded as monorepo turborepo, so --monorepo pnpm can't apply`,
      }
    );
  });
});

describe("projectName", () => {
  it("takes a directory name npm can scope", (t: TestContext) => {
    t.assert.strictEqual(projectName("/work/my-app_2.web"), "my-app_2.web");
  });

  it("refuses a name npm can't scope", (t: TestContext) => {
    for (const name of ["My App", ".app", "-app", "app!"]) {
      t.assert.throws(
        () => projectName(path.join("/work", name)),
        (error) =>
          error instanceof UsageError &&
          error.message.startsWith(`${name} would become the package scope`)
      );
    }
  });
});

function addon(args: readonly string[]): string | undefined {
  return args[args.indexOf("--addons") + 1];
}

describe("btsArgs", () => {
  const app = projectName("/work/app");

  it("answers every Better-T-Stack prompt with a flag and never passes --yes", (t: TestContext) => {
    t.assert.deepStrictEqual(btsArgs(app, "react-router", "pnpm"), [
      "app",
      "--frontend",
      "react-router",
      "--addons",
      "none",
      "--backend",
      "none",
      "--runtime",
      "none",
      "--database",
      "none",
      "--orm",
      "none",
      "--api",
      "none",
      "--auth",
      "none",
      "--payments",
      "none",
      "--examples",
      "none",
      "--db-setup",
      "none",
      "--web-deploy",
      "none",
      "--server-deploy",
      "none",
      "--no-install",
      "--no-git",
      "--package-manager",
      "pnpm",
      "--disable-analytics",
      "--no-render-title",
    ]);
  });

  it("passes the monorepo tool as Better-T-Stack's addon", (t: TestContext) => {
    t.assert.strictEqual(addon(btsArgs(app, "next", "turborepo")), "turborepo");
    t.assert.strictEqual(addon(btsArgs(app, "next", "nx")), "nx");
    t.assert.strictEqual(
      btsArgs(app, "next", "turborepo").filter((arg) => arg === "--addons")
        .length,
      1
    );
  });
});

const TAILWIND_ONLY: Readonly<Record<string, Feature>> = {
  registry: { status: "built", summary: "a registry", onlyWith: ["tailwind"] },
};

function asking(argv: readonly string[]): Request {
  return { ...request(argv), extras: ["registry"] } as unknown as Request;
}

describe("an extra that needs one styling", () => {
  it("is refused on a new StyleX project", (t: TestContext) => {
    t.assert.throws(
      () =>
        resolveChoices(
          asking(["app", "--yes", "--styling", "stylex"]),
          undefined,
          TAILWIND_ONLY
        ),
      {
        name: "UsageError",
        message: `--registry works with --styling tailwind, and ${path.resolve(CWD, "app")} is stylex`,
      }
    );
  });

  it("is refused on a project recorded as StyleX", (t: TestContext) => {
    const recorded = {
      stack: "next",
      styling: "stylex",
      monorepo: "pnpm",
      extras: [],
    } as const;
    t.assert.throws(
      () => resolveChoices(asking(["app"]), recorded, TAILWIND_ONLY),
      UsageError
    );
  });

  it("is taken on its own styling", (t: TestContext) => {
    t.assert.deepStrictEqual(
      resolveChoices(asking(["app", "--yes"]), undefined, TAILWIND_ONLY).extras,
      ["registry"]
    );
  });
});

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

describe("plan", () => {
  it("fills every {{name}} in layer paths, contents and prune entries", async (t: TestContext) => {
    for (const { stack, styling } of CELLS) {
      const all = await ops(stack, styling);
      for (const op of fileOps(all)) {
        t.assert.doesNotMatch(op.path, /\{\{/);
        t.assert.doesNotMatch(op.content, /\{\{/, op.path);
      }
      t.assert.doesNotMatch(JSON.stringify(pruneOp(all)), /\{\{/);
    }
    const stylex = JSON.stringify(pruneOp(await ops("next", "stylex")));
    t.assert.match(stylex, /"@app\/ui":null/);
    t.assert.match(stylex, /"@app\/ui\/\*":null/);
  });

  it("plans exactly the files each stack and styling needs", async (t: TestContext) => {
    for (const { stack, styling } of CELLS) {
      t.assert.deepStrictEqual(
        fileOps(await ops(stack, styling))
          .map((op) => op.path)
          .toSorted(),
        FILES[stack][styling].toSorted(),
        `${stack} + ${styling}`
      );
    }
  });

  it("never prunes a path the layer writes", async (t: TestContext) => {
    for (const { stack, styling } of CELLS) {
      const all = await ops(stack, styling);
      const pruned = pruneOp(all)?.paths ?? [];
      const clashes = fileOps(all).filter((op) =>
        pruned.some(
          (entry) => op.path === entry || op.path.startsWith(`${entry}/`)
        )
      );
      t.assert.deepStrictEqual(clashes, [], `${stack} + ${styling}`);
    }
  });

  it("plans no Tailwind for a StyleX project", async (t: TestContext) => {
    for (const stack of STACK_IDS) {
      const all = await ops(stack, "stylex");
      for (const op of fileOps(all)) {
        t.assert.doesNotMatch(
          op.content,
          /@import "tailwindcss"|@tailwindcss\/|\/ui\/globals\.css|className=/,
          `${stack} ${op.path}`
        );
      }
      t.assert.deepStrictEqual(
        packagesToAdd(all).filter((name) => name.includes("tailwind")),
        []
      );

      const dir = upstreamBase(stack);
      await apply(dir, all, UPSTREAM_ONLY);
      const app = readJsonFile(dir, "apps/web/package.json");
      t.assert.deepStrictEqual(
        packageNames(app).filter(
          (name) => name.includes("tailwind") || name === "@app/ui"
        ),
        [],
        stack
      );
      const { paths } = readJsonFile(dir, "apps/web/tsconfig.json")
        .compilerOptions as { paths: JsonObject };
      t.assert.deepStrictEqual(paths, { "@/*": ["./src/*"] }, stack);
    }
  });

  it("points Tailwind lint at the app's own stylesheet", async (t: TestContext) => {
    for (const stack of STACK_IDS) {
      const all = await ops(stack);
      const styling = fileOps(all).find(
        (op) => op.path === "oxlint.styling.ts"
      );
      t.assert.match(
        styling?.content ?? "",
        /"better-tailwindcss": \{\s*cwd: "apps\/web",\s*entryPoint: "src\/index\.css",?\s*\}/
      );
      const css = fileOps(all).find(
        (op) => op.path === "apps/web/src/index.css"
      );
      t.assert.match(
        css?.content ?? "",
        /^@import "@app\/ui\/globals\.css";\n/
      );
    }
  });

  it("declares every package a planned file uses where that file resolves it", async (t: TestContext) => {
    for (const { stack, styling } of CELLS) {
      const dir = upstreamBase(stack);
      const all = await ops(stack, styling);
      const report = await apply(dir, all, UPSTREAM_ONLY);
      const declared = (manifest: Manifest) =>
        new Set([
          ...packageNames(readJsonFile(dir, manifest)),
          ...report.missing.flatMap((addition) =>
            addition.manifest === manifest
              ? [...addition.dependencies, ...addition.devDependencies]
              : []
          ),
        ]);
      const root = declared("package.json");
      const app = declared("apps/web/package.json");
      const used = fileOps(all).flatMap((op) =>
        packagesUsed(op.path, op.content).map((name) => ({
          name,
          inApp: op.path.startsWith("apps/web/"),
        }))
      );
      t.assert.ok(used.length > 10, `${stack} + ${styling}`);
      t.assert.deepStrictEqual(
        [
          ...new Set(
            used
              .filter(
                ({ name, inApp }) =>
                  !root.has(name) && !(inApp && app.has(name))
              )
              .map(({ name }) => name)
          ),
        ],
        [],
        `${stack} + ${styling}`
      );
    }
  });

  it("has an overlay entry for every layer directory and a lint slot for every built styling", (t: TestContext) => {
    t.assert.deepStrictEqual(
      readdirSync(LAYER).toSorted(),
      Object.keys(OVERLAYS).toSorted()
    );
    for (const id of STYLING_IDS) {
      t.assert.ok(
        existsSync(path.join(LAYER, id, "all", "oxlint.styling.ts.layer")),
        id
      );
    }
  });

  it("scopes every layer directory to all or one stack", (t: TestContext) => {
    const scopes = new Set(["all", ...STACK_IDS]);
    for (const id of readdirSync(LAYER)) {
      const stray = readdirSync(path.join(LAYER, id)).filter(
        (scope) => !scopes.has(scope)
      );
      t.assert.deepStrictEqual(stray, [], id);
    }
  });
});

describe("merge", () => {
  it("keeps Better-T-Stack's compiler options while adding creact's strictness", async (t: TestContext) => {
    for (const stack of STACK_IDS) {
      const all = await ops(stack);
      for (const file of [
        "apps/web/tsconfig.json",
        "packages/config/tsconfig.base.json",
      ] as const) {
        const options = merge(fixture(stack)[file], patch(all, file))
          .compilerOptions as JsonObject;
        t.assert.strictEqual(options.noUncheckedIndexedAccess, true);
        t.assert.strictEqual(options.erasableSyntaxOnly, true);
        t.assert.strictEqual(options.allowImportingTsExtensions, undefined);
      }
      const app = merge(
        fixture(stack)["apps/web/tsconfig.json"],
        patch(all, "apps/web/tsconfig.json")
      ).compilerOptions as JsonObject;
      t.assert.deepStrictEqual(app.paths, {
        "@/*": ["./src/*"],
        "@app/ui/*": ["../../packages/ui/src/*"],
      });
    }

    const next = merge(
      fixture("next")["apps/web/tsconfig.json"],
      patch(await ops("next"), "apps/web/tsconfig.json")
    );
    t.assert.deepStrictEqual((next.compilerOptions as JsonObject).plugins, [
      { name: "next" },
    ]);
    const rr = merge(
      fixture("react-router")["apps/web/tsconfig.json"],
      patch(await ops("react-router"), "apps/web/tsconfig.json")
    );
    t.assert.deepStrictEqual((rr.compilerOptions as JsonObject).rootDirs, [
      ".",
      "./.react-router/types",
    ]);
  });

  it("points the root tsconfig at creact's own config files", async (t: TestContext) => {
    const root = merge(
      fixture("next")["tsconfig.json"],
      patch(await ops("next"), "tsconfig.json")
    );
    t.assert.deepStrictEqual(root, {
      extends: "@app/config/tsconfig.base.json",
      include: ["*.ts"],
      compilerOptions: { noEmit: true, allowImportingTsExtensions: true },
    });
  });

  it("resets creact's scripts and leaves Better-T-Stack's other keys alone", async (t: TestContext) => {
    const all = await ops("react-router");
    const upstream = merge(fixture("react-router")["package.json"], {
      scripts: { lint: "eslint ." },
    });
    const merged = merge(upstream, patch(all, "package.json"));
    const scripts = merged.scripts as JsonObject;
    t.assert.strictEqual(
      scripts.lint,
      "pnpm -r --if-present typegen && oxlint --max-warnings 0"
    );
    t.assert.strictEqual(
      scripts.typecheck,
      "pnpm -r --if-present check-types && tsc"
    );
    t.assert.strictEqual(scripts.dev, "pnpm -r dev");
    t.assert.strictEqual(scripts["check-types"], "pnpm -r check-types");
    t.assert.strictEqual(
      scripts.postinstall,
      "varlock codegen --path ./apps/web/"
    );
    t.assert.deepStrictEqual(merged.devDependencies, upstream.devDependencies);

    const app = merge(
      fixture("react-router")["apps/web/package.json"],
      patch(all, "apps/web/package.json")
    );
    t.assert.deepStrictEqual(
      [app.type, (app.scripts as JsonObject).typegen],
      ["module", "react-router typegen"]
    );
    t.assert.strictEqual(
      (app.scripts as JsonObject).build,
      "react-router build"
    );
  });

  it("returns the same document when applied twice", async (t: TestContext) => {
    for (const stack of STACK_IDS) {
      const all = await ops(stack);
      for (const file of JSON_FILES) {
        const once = merge(fixture(stack)[file], patch(all, file));
        t.assert.deepStrictEqual(
          merge(once, patch(all, file)),
          once,
          `${stack} ${file}`
        );
      }
    }
  });
});

describe("apply", () => {
  it("adds only packages missing from both dependency maps of their own manifest", async (t: TestContext) => {
    const dir = upstreamBase("next", {
      "package.json": {
        dependencies: { husky: "^1.0.0" },
        devDependencies: { vitest: "^99.0.0" },
      },
      "apps/web/package.json": { devDependencies: { postcss: "^8.0.0" } },
    });
    const report = await apply(dir, await ops("next", "stylex"), UPSTREAM_ONLY);
    const [root, app] = report.missing;
    t.assert.strictEqual(root?.manifest, "package.json");
    t.assert.strictEqual(root.devDependencies.includes("husky"), false);
    t.assert.strictEqual(root.devDependencies.includes("vitest"), false);
    t.assert.ok(root.devDependencies.includes("oxlint"));
    t.assert.ok(root.devDependencies.includes("@stylexjs/eslint-plugin"));
    t.assert.deepStrictEqual(app, {
      manifest: "apps/web/package.json",
      dependencies: ["@stylexjs/stylex"],
      devDependencies: ["@stylexjs/babel-plugin", "@stylexjs/postcss-plugin"],
    });
    t.assert.strictEqual(report.missing.length, 2);
    const pkg = readJsonFile(dir, "package.json");
    t.assert.strictEqual((pkg.devDependencies as JsonObject).vitest, "^99.0.0");
  });

  it("writes nothing on a second run", async (t: TestContext) => {
    for (const { stack, styling } of CELLS) {
      const dir = upstreamBase(stack);
      const all = await ops(stack, styling);
      const first = await apply(dir, all, UPSTREAM_ONLY);
      const second = await apply(dir, all, recorded(first.hashes));
      t.assert.deepStrictEqual(
        Object.entries(second.files).filter(
          ([, outcome]) => outcome !== "unchanged"
        ),
        [],
        `${stack} + ${styling}`
      );
    }
  });

  it("updates a file the project left alone and keeps one it edited when the layer changes", async (t: TestContext) => {
    const dir = upstreamBase("next");
    const first = await apply(dir, await ops("next"), UPSTREAM_ONLY);
    writeFileSync(
      path.join(dir, "commitlint.config.ts"),
      "export default {};\n"
    );

    const newer = (await ops("next")).map((op): Op =>
      op.kind === "file" ? { ...op, content: `${op.content}// newer\n` } : op
    );
    const second = await apply(dir, newer, recorded(first.hashes));
    t.assert.strictEqual(second.files["vitest.config.ts"], "written");
    t.assert.strictEqual(second.files["commitlint.config.ts"], "kept");
    t.assert.strictEqual(
      readFileSync(path.join(dir, "commitlint.config.ts"), "utf8"),
      "export default {};\n"
    );
    t.assert.strictEqual(
      second.hashes["commitlint.config.ts"],
      first.hashes["commitlint.config.ts"]
    );
  });

  it("overwrites upstream's file at a layer path in a fresh base but keeps an unrecorded one on a rerun", async (t: TestContext) => {
    const fresh = upstreamBase("next");
    writeFileSync(path.join(fresh, ".oxfmtrc.json"), "{}\n");
    const created = await apply(fresh, await ops("next"), UPSTREAM_ONLY);
    t.assert.strictEqual(created.files[".oxfmtrc.json"], "written");

    const rerun = upstreamBase("next");
    writeFileSync(path.join(rerun, ".oxfmtrc.json"), "{}\n");
    const converged = await apply(rerun, await ops("next"), recorded({}));
    t.assert.strictEqual(converged.files[".oxfmtrc.json"], "kept");
  });
});

const UPSTREAM_UI = [
  "bunfig.toml",
  "apps/web/bunfig.toml",
  "packages/ui/src/components/button.tsx",
  "apps/web/components.json",
  "apps/web/src/components/header.tsx",
];

function plant(dir: string, files: readonly string[]): void {
  for (const file of files) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), "upstream\n");
  }
}

describe("the prune on Better-T-Stack's base", () => {
  it("removes the shadcn package, its components and Tailwind from a fresh StyleX base and reports them", async (t: TestContext) => {
    const dir = upstreamBase("next");
    plant(dir, [...UPSTREAM_UI, "apps/web/postcss.config.mjs"]);
    const report = await apply(dir, await ops("next", "stylex"), UPSTREAM_ONLY);
    t.assert.deepStrictEqual(report.pruned.toSorted(), [
      "@app/ui",
      "@app/ui/*",
      "@tailwindcss/postcss",
      "apps/web/bunfig.toml",
      "apps/web/components.json",
      "apps/web/postcss.config.mjs",
      "apps/web/src/components",
      "bunfig.toml",
      "lucide-react",
      "next-themes",
      "packages/ui",
      "sonner",
      "tailwindcss",
    ]);
    t.assert.deepStrictEqual(
      [...UPSTREAM_UI, "packages/ui", "apps/web/postcss.config.mjs"].filter(
        (file) => existsSync(path.join(dir, file))
      ),
      []
    );
    t.assert.ok(
      packageNames(readJsonFile(dir, "apps/web/package.json")).includes("next")
    );
  });

  it("keeps the Tailwind and shadcn package the owner put back on a rerun", async (t: TestContext) => {
    const dir = upstreamBase("react-router");
    const all = await ops("react-router", "stylex");
    const first = await apply(dir, all, UPSTREAM_ONLY);
    const manifest = path.join(dir, "apps/web/package.json");
    writeFileSync(
      manifest,
      JSON.stringify(
        merge(readJsonFile(dir, "apps/web/package.json"), {
          devDependencies: { tailwindcss: "^4" },
        })
      )
    );
    plant(dir, UPSTREAM_UI);
    const second = await apply(dir, all, recorded(first.hashes));
    t.assert.deepStrictEqual(second.pruned, []);
    t.assert.ok(
      packageNames(readJsonFile(dir, "apps/web/package.json")).includes(
        "tailwindcss"
      )
    );
    t.assert.ok(UPSTREAM_UI.every((file) => existsSync(path.join(dir, file))));
  });

  it("removes only the Bun settings from a fresh Tailwind base", async (t: TestContext) => {
    const dir = upstreamBase("react-router");
    plant(dir, UPSTREAM_UI);
    const report = await apply(dir, await ops("react-router"), UPSTREAM_ONLY);
    t.assert.deepStrictEqual(report.pruned, [
      "bunfig.toml",
      "apps/web/bunfig.toml",
    ]);
    t.assert.ok(
      existsSync(path.join(dir, "packages/ui/src/components/button.tsx"))
    );
    t.assert.ok(
      packageNames(readJsonFile(dir, "apps/web/package.json")).includes(
        "@app/ui"
      )
    );
  });
});

describe("a Turborepo base", () => {
  it("keeps Better-T-Stack's turbo scripts and runs creact's own tasks without turbo", async (t: TestContext) => {
    const dir = upstreamBase("react-router", {
      "package.json": {
        scripts: {
          dev: "turbo run dev",
          build: "turbo run build",
          "check-types": "turbo run check-types",
          "dev:web": "turbo run dev -F web --",
        },
      },
    });
    await apply(dir, await ops("react-router"), UPSTREAM_ONLY);
    const scripts = readJsonFile(dir, "package.json").scripts as JsonObject;
    t.assert.strictEqual(scripts["check-types"], "turbo run check-types");
    t.assert.strictEqual(scripts.build, "turbo run build");
    for (const task of [
      "lint",
      "format",
      "format:check",
      "typecheck",
      "test",
      "prepare",
    ]) {
      const script = scripts[task];
      t.assert.ok(
        typeof script === "string" && !/\b(turbo|nx)\b/.test(script),
        task
      );
    }
  });
});

describe("readState", () => {
  it("refuses a state file naming a stack outside the table", async (t: TestContext) => {
    const dir = tempDir();
    recordState(dir, "vue");
    await t.assert.rejects(readState(dir), UsageError);
  });

  it("refuses a state file from the single-package spike and says why", async (t: TestContext) => {
    const dir = tempDir();
    recordState(dir, "next", 1);
    await t.assert.rejects(readState(dir), {
      name: "UsageError",
      message: /made single-package projects/,
    });
  });

  it("reads the project name and monorepo tool back", async (t: TestContext) => {
    const dir = tempDir();
    recordState(dir, "next");
    const state = await readState(dir);
    t.assert.deepStrictEqual([state?.name, state?.monorepo], ["app", "pnpm"]);
  });
});

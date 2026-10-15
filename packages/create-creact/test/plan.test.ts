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
  type JsonObject,
  loadLayer,
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
  isBuilt,
  type Parsed,
  parseRequest,
  type Request,
  resolveChoices,
  type StylingId,
  STYLINGS,
  UsageError,
} from "../src/options.ts";
import { type StackId, STACKS } from "../src/stacks.ts";

const CWD = "/work";
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
];

const FILES: Readonly<
  Record<StackId, Readonly<Record<StylingId, readonly string[]>>>
> = {
  "react-router": {
    tailwind: [
      ...SHARED_FILES,
      "app/app.css",
      "app/styles/tokens.css",
      "app/styles/tokens.tailwind.css",
      "app/styles/tokens.test.ts",
    ],
    stylex: [
      ...SHARED_FILES,
      "app/app.css",
      "app/root.tsx",
      "app/styles/tokens.css",
      "app/styles/tokens.stylex.ts",
      "app/styles/tokens.test.ts",
      "app/welcome/welcome.tsx",
      "vite.config.ts",
    ],
  },
  next: {
    tailwind: [
      ...SHARED_FILES,
      "src/app/globals.css",
      "src/styles/tokens.css",
      "src/styles/tokens.tailwind.css",
      "src/styles/tokens.test.ts",
    ],
    stylex: [
      ...SHARED_FILES,
      "babel.config.js",
      "postcss.config.js",
      "src/app/globals.css",
      "src/app/page.tsx",
      "src/styles/tokens.css",
      "src/styles/tokens.stylex.ts",
      "src/styles/tokens.test.ts",
    ],
  },
};

function fixture(stack: StackId): {
  readonly "package.json": JsonObject;
  readonly "tsconfig.json": JsonObject;
} {
  return JSON.parse(
    readFileSync(
      path.join(import.meta.dirname, "fixtures", `${stack}.json`),
      "utf8"
    )
  ) as { "package.json": JsonObject; "tsconfig.json": JsonObject };
}

async function ops(
  stack: StackId,
  styling: StylingId = "tailwind"
): Promise<readonly Op[]> {
  const ids: readonly OverlayId[] = ["base", styling];
  return plan(await loadLayer(LAYER, ids, stack), ids, stack);
}

function fileOps(all: readonly Op[]) {
  return all.flatMap((op) => (op.kind === "file" ? [op] : []));
}

function packagesToAdd(all: readonly Op[], runtimeOnly = false): string[] {
  return all.flatMap((op) =>
    op.kind === "deps"
      ? [...op.dependencies, ...(runtimeOnly ? [] : op.devDependencies)]
      : []
  );
}

function readPackage(dir: string): JsonObject {
  return JSON.parse(
    readFileSync(path.join(dir, "package.json"), "utf8")
  ) as JsonObject;
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
  const configPlugins = /^(babel|postcss)\.config\./.test(file)
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

function patch(all: readonly Op[], file: string): JsonObject {
  const op = all.find(
    (candidate) => candidate.kind === "json" && candidate.path === file
  );
  return op?.kind === "json" ? op.patch : {};
}

function upstreamBase(
  stack: StackId,
  extra: JsonObject = {},
  dir = tempDir()
): string {
  const files = fixture(stack);
  writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify(merge(files["package.json"], extra))
  );
  writeFileSync(
    path.join(dir, "tsconfig.json"),
    JSON.stringify(files["tsconfig.json"])
  );
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

function gitInit(dir: string): void {
  spawnSync("git", ["init", "--quiet"], { cwd: dir });
}

function recordState(dir: string, stack: string): void {
  mkdirSync(path.join(dir, ".creact"));
  writeFileSync(
    path.join(dir, STATE_FILE),
    JSON.stringify({
      schema: 1,
      creact: "0.0.0",
      stack,
      styling: "tailwind",
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
  return spawnSync(process.execPath, [MAIN, ...argv], { encoding: "utf8" });
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
    for (const word of ["react-router", "next", "stylex", "--storybook"]) {
      t.assert.ok(text.includes(word), word);
    }
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
        extras: [],
      }
    );
  });

  it("takes the recorded choices on a rerun with no flags", (t: TestContext) => {
    const recorded = {
      stack: "next",
      styling: "tailwind",
      extras: [],
    } as const;
    t.assert.deepStrictEqual(
      resolveChoices(request(["app"]), recorded),
      recorded
    );
  });

  it("refuses a --stack that contradicts the recorded project", (t: TestContext) => {
    const recorded = {
      stack: "next",
      styling: "tailwind",
      extras: [],
    } as const;
    t.assert.throws(
      () =>
        resolveChoices(request(["app", "--stack", "react-router"]), recorded),
      UsageError
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

  it("ends the unknown-flag reason before pointing at --help", (t: TestContext) => {
    const result = cli(["app", "--bogus"]);
    t.assert.strictEqual(result.status, 2);
    t.assert.match(result.stderr, /'-- "--bogus"'?\. Run with --help/);
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
  it("fills every {{name}} in layer paths and contents from the stack row", async (t: TestContext) => {
    for (const { stack, styling } of CELLS) {
      for (const op of fileOps(await ops(stack, styling))) {
        t.assert.doesNotMatch(op.path, /\{\{/);
        t.assert.doesNotMatch(op.content, /\{\{/, op.path);
      }
    }
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

  it("plans no Tailwind for a StyleX project", async (t: TestContext) => {
    for (const stack of STACK_IDS) {
      const all = await ops(stack, "stylex");
      for (const op of fileOps(all)) {
        t.assert.doesNotMatch(
          op.content,
          /@import "tailwindcss"|@tailwindcss\/|className=/,
          `${stack} ${op.path}`
        );
      }
      t.assert.deepStrictEqual(
        packagesToAdd(all).filter((name) => name.includes("tailwind")),
        []
      );
    }
  });

  it("points Tailwind lint at the stack's own global stylesheet", async (t: TestContext) => {
    for (const stack of STACK_IDS) {
      const styling = (await ops(stack)).find(
        (op) => op.kind === "file" && op.path === "oxlint.styling.ts"
      );
      t.assert.ok(
        styling?.kind === "file" &&
          styling.content.includes(`entryPoint: "${STACKS[stack].globalCss}"`),
        stack
      );
    }
  });

  it("declares every package a planned file uses, and StyleX as a runtime dependency", async (t: TestContext) => {
    for (const { stack, styling } of CELLS) {
      const all = await ops(stack, styling);
      const pruned = new Set(
        all.flatMap((op) => (op.kind === "prune" ? op.dependencies : []))
      );
      const declared = new Set([
        ...packagesToAdd(all),
        ...packageNames(fixture(stack)["package.json"]).filter(
          (name) => !pruned.has(name)
        ),
      ]);
      const used = fileOps(all).flatMap((op) =>
        packagesUsed(op.path, op.content)
      );
      t.assert.ok(used.length > 10, used.join(", "));
      t.assert.deepStrictEqual(
        [...new Set(used)].filter((name) => !declared.has(name)),
        [],
        `${stack} + ${styling}`
      );
      if (styling === "stylex") {
        t.assert.ok(packagesToAdd(all, true).includes("@stylexjs/stylex"));
      }
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
  it("keeps upstream's stack options while adding creact's strictness", async (t: TestContext) => {
    const next = merge(
      fixture("next")["tsconfig.json"],
      patch(await ops("next"), "tsconfig.json")
    );
    const options = next.compilerOptions as JsonObject;
    t.assert.deepStrictEqual(options.plugins, [{ name: "next" }]);
    t.assert.deepStrictEqual(options.paths, { "@/*": ["./src/*"] });
    t.assert.strictEqual(options.noUncheckedIndexedAccess, true);

    const rr = merge(
      fixture("react-router")["tsconfig.json"],
      patch(await ops("react-router"), "tsconfig.json")
    );
    t.assert.deepStrictEqual((rr.compilerOptions as JsonObject).rootDirs, [
      ".",
      "./.react-router/types",
    ]);
  });

  it("resets creact's scripts and leaves upstream's other keys alone", async (t: TestContext) => {
    const upstream = merge(fixture("react-router")["package.json"], {
      scripts: { lint: "eslint ." },
    });
    const merged = merge(
      upstream,
      patch(await ops("react-router"), "package.json")
    );
    const scripts = merged.scripts as JsonObject;
    t.assert.strictEqual(
      scripts.lint,
      "pnpm run typegen && oxlint --max-warnings 0"
    );
    t.assert.strictEqual(scripts.typegen, "react-router typegen");
    t.assert.strictEqual(scripts.dev, "react-router dev");
    t.assert.deepStrictEqual(merged.dependencies, upstream.dependencies);
    t.assert.deepStrictEqual(merged.devDependencies, upstream.devDependencies);
  });

  it("returns the same document when applied twice", async (t: TestContext) => {
    for (const stack of STACK_IDS) {
      const all = await ops(stack);
      for (const file of ["package.json", "tsconfig.json"] as const) {
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
  it("adds only dev dependencies missing from both dependency maps", async (t: TestContext) => {
    const dir = upstreamBase("react-router", {
      dependencies: { husky: "^1.0.0" },
      devDependencies: { vitest: "^99.0.0" },
    });
    const report = await apply(dir, await ops("react-router"), UPSTREAM_ONLY);
    const missing = report.missing.devDependencies;
    t.assert.strictEqual(missing.includes("husky"), false);
    t.assert.strictEqual(missing.includes("vitest"), false);
    t.assert.strictEqual(missing.includes("oxlint"), true);
    const pkg = JSON.parse(
      readFileSync(path.join(dir, "package.json"), "utf8")
    ) as JsonObject;
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

const LOGOS = ["app/welcome/logo-dark.svg", "app/welcome/logo-light.svg"];

function plant(dir: string, files: readonly string[]): void {
  for (const file of files) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    writeFileSync(path.join(dir, file), "upstream\n");
  }
}

describe("the stylex plan on upstream's base", () => {
  it("removes React Router's Tailwind and logos from a fresh base and reports them", async (t: TestContext) => {
    const dir = upstreamBase("react-router");
    plant(dir, LOGOS);
    const all = await ops("react-router", "stylex");
    const report = await apply(dir, all, UPSTREAM_ONLY);
    t.assert.deepStrictEqual(report.pruned, [
      "tailwindcss",
      "@tailwindcss/vite",
      ...LOGOS,
    ]);
    t.assert.deepStrictEqual(
      LOGOS.filter((logo) => existsSync(path.join(dir, logo))),
      []
    );
    const names = packageNames(readPackage(dir));
    t.assert.deepStrictEqual(
      names.filter((name) => name.includes("tailwind")),
      []
    );
    t.assert.ok(names.includes("react-router"));
  });

  it("keeps the Tailwind the owner put back on a rerun", async (t: TestContext) => {
    const dir = upstreamBase("react-router");
    const all = await ops("react-router", "stylex");
    const first = await apply(dir, all, UPSTREAM_ONLY);
    writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify(
        merge(readPackage(dir), { devDependencies: { tailwindcss: "^4" } })
      )
    );
    plant(dir, LOGOS);
    const second = await apply(dir, all, recorded(first.hashes));
    t.assert.deepStrictEqual(second.pruned, []);
    t.assert.ok(packageNames(readPackage(dir)).includes("tailwindcss"));
    t.assert.ok(LOGOS.every((logo) => existsSync(path.join(dir, logo))));
  });

  it("removes Next's page.module.css from a fresh base only", async (t: TestContext) => {
    const all = await ops("next", "stylex");
    const fresh = upstreamBase("next");
    plant(fresh, ["src/app/page.module.css"]);
    const created = await apply(fresh, all, UPSTREAM_ONLY);
    t.assert.deepStrictEqual(created.pruned, ["src/app/page.module.css"]);
    t.assert.strictEqual(
      existsSync(path.join(fresh, "src/app/page.module.css")),
      false
    );

    const rerun = upstreamBase("next");
    plant(rerun, ["src/app/page.module.css"]);
    const converged = await apply(rerun, all, recorded({}));
    t.assert.deepStrictEqual(converged.pruned, []);
    t.assert.ok(existsSync(path.join(rerun, "src/app/page.module.css")));
  });
});

describe("readState", () => {
  it("refuses a state file naming a stack outside the table", async (t: TestContext) => {
    const dir = tempDir();
    recordState(dir, "vue");
    await t.assert.rejects(readState(dir), UsageError);
  });
});

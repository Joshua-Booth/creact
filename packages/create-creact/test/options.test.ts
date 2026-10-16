/* oxlint-disable typescript/no-floating-promises -- node:test's describe and it return promises the runner awaits */
import path from "node:path";
import { describe, it, type TestContext } from "node:test";

import {
  DEFAULTS,
  type Feature,
  type Parsed,
  parseRequest,
  projectName,
  type Request,
  resolveChoices,
  UsageError,
} from "../src/options.ts";
import { btsArgs } from "../src/stacks.ts";

const CWD = "/work";

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

  it("takes only the recorded choices on a rerun with no flags", (t: TestContext) => {
    const state = {
      ...RECORDED,
      schema: 2,
      creact: "0.0.0",
      name: "app",
      hashes: {},
    };
    t.assert.deepStrictEqual(resolveChoices(request(["app"]), state), RECORDED);
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

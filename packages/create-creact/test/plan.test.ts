/* oxlint-disable typescript/no-floating-promises, sonarjs/assertions-in-tests --
 * node:test's describe and it return promises the runner awaits, and sonarjs
 * misses node:assert calls whenever oxlint lints more than this one file. */
import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";

import {
  DEFAULTS,
  type Parsed,
  parseRequest,
  type Request,
  resolveChoices,
  UsageError,
} from "../src/options.ts";

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
  it("names every planned flag in one message instead of failing on the first", () => {
    const message = usage([
      "app",
      "--styling",
      "stylex",
      "--storybook",
      "--msw",
      "--sentry",
    ]);
    assert.match(message, /^not built yet: /);
    for (const flag of [
      "--styling stylex",
      "--storybook",
      "--msw",
      "--sentry",
    ]) {
      assert.ok(message.includes(flag), `${flag} missing from: ${message}`);
    }
    assert.ok(message.includes("JB-89"), message);
  });

  it("rejects a planned extra rather than silently skipping it", () => {
    assert.match(usage(["app", "--stack", "next", "--i18n"]), /--i18n/);
  });

  it("rejects an unknown flag and points at --help", () => {
    assert.match(usage(["app", "--vue"]), /--help/);
  });

  it("rejects a stack outside the table and lists the real ones", () => {
    assert.match(usage(["app", "--stack", "vue"]), /react-router, next/);
  });

  it("needs exactly one project directory", () => {
    assert.equal(parse(["--stack", "next"]).kind, "usage");
    assert.equal(parse(["one", "two", "--stack", "next"]).kind, "usage");
  });

  it("resolves the directory against the caller's cwd", () => {
    assert.equal(request(["my-app"]).dir, path.resolve(CWD, "my-app"));
  });

  it("turns off install and git only when asked", () => {
    assert.deepEqual(
      [request(["app"]).install, request(["app"]).git],
      [true, true]
    );
    const off = request(["app", "--no-install", "--no-git"]);
    assert.deepEqual([off.install, off.git], [false, false]);
  });

  it("lists every stack and every extra in the help text", () => {
    const parsed = parse(["--help"]);
    const text = parsed.kind === "help" ? parsed.text : "";
    for (const word of ["react-router", "next", "stylex", "--storybook"]) {
      assert.ok(text.includes(word), word);
    }
  });
});

describe("resolveChoices", () => {
  it("refuses to guess a stack on a new project without --yes", () => {
    assert.throws(
      () => resolveChoices(request(["app"]), undefined),
      (error) =>
        error instanceof UsageError && error.message.includes("--stack")
    );
  });

  it("takes every default under --yes", () => {
    assert.deepEqual(resolveChoices(request(["app", "--yes"]), undefined), {
      stack: DEFAULTS.stack,
      styling: DEFAULTS.styling,
      extras: [],
    });
  });

  it("takes the recorded choices on a rerun with no flags", () => {
    const recorded = {
      stack: "next",
      styling: "tailwind",
      extras: [],
    } as const;
    assert.deepEqual(resolveChoices(request(["app"]), recorded), recorded);
  });

  it("refuses a --stack that contradicts the recorded project", () => {
    const recorded = {
      stack: "next",
      styling: "tailwind",
      extras: [],
    } as const;
    assert.throws(
      () =>
        resolveChoices(request(["app", "--stack", "react-router"]), recorded),
      UsageError
    );
  });
});

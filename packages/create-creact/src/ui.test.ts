/* oxlint-disable typescript/no-floating-promises -- node:test's describe and it return promises the runner awaits */
import { describe, it, type TestContext } from "node:test";

import { pickMode, seconds, shown, stackLine } from "./ui.ts";

describe("pickMode", () => {
  it("draws in a terminal and prints plain lines anywhere else", (t: TestContext) => {
    const tty = { isTTY: true };

    t.assert.strictEqual(pickMode(false, tty, {}), "rich");

    t.assert.strictEqual(pickMode(false, {}, {}), "plain");

    t.assert.strictEqual(pickMode(false, tty, { CI: "true" }), "plain");

    t.assert.strictEqual(pickMode(false, tty, { CI: "false" }), "rich");

    t.assert.strictEqual(pickMode(false, tty, { TERM: "dumb" }), "plain");

    t.assert.strictEqual(pickMode(true, tty, {}), "json");
  });
});

describe("seconds", () => {
  it("keeps a tenth under ten seconds and drops it above", (t: TestContext) => {
    t.assert.deepStrictEqual(
      [1140, 9960, 34_200, 65_000].map((ms) => seconds(ms)),
      ["1.1s", "10s", "34s", "1m 05s"]
    );
  });
});

describe("shown", () => {
  it("gives the path as typed under cwd, and the full path elsewhere", (t: TestContext) => {
    t.assert.strictEqual(shown("/work/my-app", "/work"), "my-app");

    t.assert.strictEqual(shown("/srv/my-app", "/work"), "/srv/my-app");

    t.assert.strictEqual(shown("/work", "/work"), "/work");
  });
});

describe("stackLine", () => {
  it("names the choices the way their projects do, and Vite+ only when chosen", (t: TestContext) => {
    const choices = {
      stack: "react-router",
      styling: "tailwind",
      monorepo: "pnpm",
      toolchain: "standalone",
      extras: [],
    } as const;

    t.assert.strictEqual(
      stackLine(choices),
      "React Router · Tailwind CSS · pnpm workspaces"
    );

    t.assert.strictEqual(
      stackLine({ ...choices, stack: "next", toolchain: "vite-plus" }),
      "Next.js · Tailwind CSS · pnpm workspaces · Vite+"
    );
  });
});

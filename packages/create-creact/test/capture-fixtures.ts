/* oxlint-disable security/detect-non-literal-fs-filename -- every path is a temp dir this script made or the fixtures dir */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { obtainBase } from "../src/create.ts";
import { JSON_FILES } from "../src/layer.ts";
import { DEFAULTS, projectName } from "../src/options.ts";
import { BTS, type StackId, STACKS } from "../src/stacks.ts";

const asked = process.argv.slice(2);
const stacks = (asked.length > 0 ? asked : Object.keys(STACKS)).filter(
  (id): id is StackId => {
    if (!Object.hasOwn(STACKS, id)) throw new Error(`${id} isn't in STACKS`);
    return true;
  }
);

for (const stack of stacks) {
  const staging = mkdtempSync(path.join(tmpdir(), "creact-fixture-"));
  try {
    const base = await obtainBase(
      staging,
      { ...DEFAULTS, stack, extras: [] },
      projectName("app")
    );
    const fixture = {
      bts: BTS,
      ...Object.fromEntries(
        JSON_FILES.map((file) => [
          file,
          JSON.parse(readFileSync(path.join(base, file), "utf8")) as unknown,
        ])
      ),
    };
    writeFileSync(
      path.join(import.meta.dirname, "fixtures", `${stack}.json`),
      `${JSON.stringify(fixture, null, 2)}\n`
    );
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

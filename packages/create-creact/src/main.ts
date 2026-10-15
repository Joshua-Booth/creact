#!/usr/bin/env node
import { fileURLToPath } from "node:url";

import { create, type Report } from "./create.ts";
import { parseRequest, UsageError } from "./options.ts";
import { CommandFailed } from "./shell.ts";
import { STACKS } from "./stacks.ts";

const EXIT = { commandFailed: 1, usage: 2 } as const;
const LAYER_DIR = fileURLToPath(new URL("../layer", import.meta.url));

const parsed = parseRequest(process.argv.slice(2), process.cwd());

switch (parsed.kind) {
  case "help": {
    process.stdout.write(parsed.text);
    break;
  }
  case "usage": {
    fail(EXIT.usage, parsed.message);
    break;
  }
  case "run": {
    try {
      process.stdout.write(format(await create(parsed.request, LAYER_DIR)));
    } catch (error) {
      if (error instanceof UsageError) fail(EXIT.usage, error.message);
      else if (error instanceof CommandFailed) {
        fail(
          EXIT.commandFailed,
          `${error.message}. Fix it and run the same command again.`
        );
      } else throw error;
    }
    break;
  }
}

function fail(code: number, message: string): void {
  process.stderr.write(`create-creact: ${message}\n`);
  process.exitCode = code;
}

function format(report: Report): string {
  const { stack, styling } = report.choices;
  const outcomes = Object.entries(report.layer.files);
  const named = (outcome: string) =>
    outcomes.filter(([, value]) => value === outcome).map(([file]) => file);
  const kept = named("kept");
  const base =
    report.base === "created"
      ? `created with ${STACKS[stack].cli}@latest`
      : "kept";
  const install =
    report.install === "done"
      ? "done, then lint --fix and format"
      : `skipped, ${report.layer.missingDevDeps.length} dev dependencies to add. Run again without --no-install to finish.`;
  return [
    `create-creact: ${stack} + ${styling} in ${report.dir}`,
    `  base     ${base}`,
    `  layer    ${named("written").length} written, ${named("unchanged").length} unchanged, ${kept.length} kept`,
    ...kept.map(
      (file) => `           kept ${file}: edited since create-creact wrote it`
    ),
    `  git      ${report.git}`,
    `  install  ${install}`,
    `next: cd ${report.dir} && pnpm dev`,
    "",
  ].join("\n");
}

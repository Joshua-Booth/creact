#!/usr/bin/env node
import { fileURLToPath } from "node:url";

import { create, type Report, RESTORE, type Skills } from "./create.ts";
import { parseRequest, UsageError } from "./options.ts";
import { CommandFailed } from "./shell.ts";
import { BTS } from "./stacks.ts";

const EXIT = { commandFailed: 1, usage: 2 } as const;
const LAYER_DIR = fileURLToPath(new URL("../layer", import.meta.url));
const SKILLS_LINE: Readonly<Record<Extract<Skills, string>, string>> = {
  restored: "restored into .agents/skills",
  present: "present in .agents/skills",
  skipped: "skipped",
};

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
  const { stack, styling, monorepo } = report.choices;
  const outcomes = Object.entries(report.layer.files);
  const named = (outcome: string) =>
    outcomes.filter(([, value]) => value === outcome).map(([file]) => file);
  const kept = named("kept");
  const { pruned, missing } = report.layer;
  const without = pruned.length > 0 ? `, without ${pruned.join(", ")}` : "";
  const base =
    report.base === "created" ? `created with ${BTS}${without}` : "kept";
  const toAdd = missing.flatMap((addition) => [
    ...addition.dependencies,
    ...addition.devDependencies,
  ]).length;
  const install =
    report.install === "done"
      ? "done, then lint --fix and format"
      : `skipped, ${toAdd} packages to add. Run again without --no-install to finish.`;
  return [
    `create-creact: ${stack} + ${styling} on ${monorepo} in ${report.dir}`,
    `  base     ${base}`,
    `  layer    ${named("written").length} written, ${named("unchanged").length} unchanged, ${kept.length} kept`,
    ...kept.map((file) => `           kept ${file}, which the project changed`),
    `  git      ${report.git}`,
    `  install  ${install}`,
    ...skillsLines(report),
    `next: cd ${shellQuoted(report.dir)} && pnpm dev`,
    "",
  ].join("\n");
}

function skillsLines(report: Report): string[] {
  if (typeof report.skills === "string") {
    return [`  skills   ${SKILLS_LINE[report.skills]}`];
  }
  return [
    `  skills   not restored, as ${report.skills.failed}`,
    `           finish with cd ${shellQuoted(report.dir)} && ${RESTORE.join(" ")}`,
  ];
}

function shellQuoted(value: string): string {
  const closed = value.replaceAll("'", String.raw`'\''`);
  return `'${closed}'`;
}

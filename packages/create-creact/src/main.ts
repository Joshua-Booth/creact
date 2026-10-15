#!/usr/bin/env node
import { create, type Report } from "./create.ts";
import { parseRequest, UsageError } from "./options.ts";
import { CommandFailed } from "./shell.ts";

const EXIT = { commandFailed: 1, usage: 2 } as const;

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
      process.stdout.write(format(await create(parsed.request)));
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
  return [
    `create-creact: ${stack} + ${styling} in ${report.dir}`,
    `  base     ${report.base}`,
    "",
  ].join("\n");
}

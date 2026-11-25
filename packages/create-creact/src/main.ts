#!/usr/bin/env node
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { create } from "./create.ts";
import { parseRequest, UsageError } from "./options.ts";
import { CommandFailed, Log } from "./shell.ts";
import { pickMode, renderer } from "./ui.ts";

const EXIT = { commandFailed: 1, usage: 2 } as const;
const LAYER_DIR = fileURLToPath(new URL("../layer", import.meta.url));

const argv = process.argv.slice(2);
const cwd = process.cwd();
// Read before parsing, so a usage error still answers in JSON.
const wantsJson = argv.includes("--json");
const parsed = parseRequest(argv, cwd);

switch (parsed.kind) {
  case "help": {
    process.stdout.write(parsed.text);
    break;
  }
  case "usage": {
    usage(parsed.message);
    break;
  }
  case "run": {
    const { request } = parsed;
    const log = new Log(logFile(request.dir));
    const ui = renderer(
      pickMode(wantsJson, process.stdout, process.env),
      log,
      cwd
    );
    try {
      ui.succeeded(await create(request, LAYER_DIR, { progress: ui, log }));
    } catch (error) {
      if (error instanceof UsageError) {
        ui.failed(error, "usage");
        process.exitCode = EXIT.usage;
      } else if (error instanceof CommandFailed) {
        ui.failed(error, "command");
        process.exitCode = EXIT.commandFailed;
      } else throw error;
    }
    break;
  }
}

function usage(message: string): void {
  if (wantsJson) {
    process.stdout.write(
      `${JSON.stringify({ ok: false, kind: "usage", message }, null, 2)}\n`
    );
  } else {
    process.stderr.write(`create-creact: ${message}\n`);
  }
  process.exitCode = EXIT.usage;
}

// One file per project name, in the OS temp dir, so a rerun replaces it and
// a failure before the project exists still has somewhere to write.
function logFile(dir: string): string {
  const name = path.basename(dir).replaceAll(/[^\w.-]/g, "_");
  return path.join(tmpdir(), `create-creact-${name}.log`);
}

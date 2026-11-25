import {
  type ChildProcess,
  spawn,
  type StdioOptions,
} from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";
import { stripVTControlCharacters } from "node:util";

export class CommandFailed extends Error {
  override readonly name = "CommandFailed";
  readonly tail: readonly string[];

  constructor(message: string, tail: readonly string[] = []) {
    super(message);
    this.tail = tail;
  }
}

const TAIL_LINES = 12;

// Where the commands' own output goes, so the terminal shows only
// create-creact's steps. A failure shows the last lines of the command that
// failed, and the file keeps the rest.
// The file starts empty on a run's first command, so it holds one run. A
// file it can't write, as one another user left in a shared temp dir, turns
// the log off rather than failing the run.
export class Log {
  readonly file: string;
  #written = false;
  #broken = false;

  constructor(file: string) {
    this.file = file;
  }

  get written(): boolean {
    return this.#written;
  }

  write(text: string): void {
    if (this.#broken) return;
    try {
      /* oxlint-disable security/detect-non-literal-fs-filename -- a file in the OS temp dir, named by main */
      if (this.#written) appendFileSync(this.file, text);
      else writeFileSync(this.file, text);
      /* oxlint-enable security/detect-non-literal-fs-filename -- the write ends here */
      this.#written = true;
    } catch {
      this.#broken = true;
      this.#written = false;
    }
  }
}

const NO_PROMPTS_OUTPUT_TO_STDERR: StdioOptions = ["ignore", 2, 2];

// Git exports GIT_DIR, GIT_INDEX_FILE and friends to its hooks. A child that
// inherits them acts on the caller's repository instead of the project's,
// and `git init` under a linked worktree's GIT_DIR rewrites that repository's
// shared config as bare. The list is what `git rev-parse --local-env-vars`
// prints, so the caller's own git settings still reach the child.
const REPOSITORY_ENV = new Set([
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_CONFIG",
  "GIT_CONFIG_PARAMETERS",
  "GIT_CONFIG_COUNT",
  "GIT_OBJECT_DIRECTORY",
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_IMPLICIT_WORK_TREE",
  "GIT_GRAFT_FILE",
  "GIT_INDEX_FILE",
  "GIT_NO_REPLACE_OBJECTS",
  "GIT_REPLACE_REF_BASE",
  "GIT_PREFIX",
  "GIT_SHALLOW_FILE",
  "GIT_COMMON_DIR",
]);

export function withoutGitContext(): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(process.env).filter(([name]) => !REPOSITORY_ENV.has(name))
  );
}

export async function run(
  command: string,
  args: readonly string[],
  cwd: string,
  log?: Log
): Promise<void> {
  const line = [command, ...args].join(" ");
  if (log === undefined) {
    const code = await exitCode(
      command,
      args,
      cwd,
      NO_PROMPTS_OUTPUT_TO_STDERR
    );
    if (code !== 0) {
      throw new CommandFailed(`${line} exited with ${code ?? "a signal"}`);
    }
    return;
  }
  log.write(`\n$ ${line}\n  in ${cwd}\n\n`);
  const child = spawn(command, args, {
    cwd,
    env: withoutGitContext(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  const keep = (chunk: Buffer): void => {
    const text = chunk.toString();
    log.write(text);
    output = (output + text).slice(-16_384);
  };
  child.stdout.on("data", keep);
  child.stderr.on("data", keep);
  const code = await closed(child, command);
  if (code !== 0) {
    throw new CommandFailed(
      `${line} exited with ${code ?? "a signal"}`,
      tailOf(output)
    );
  }
}

function tailOf(output: string): readonly string[] {
  return stripVTControlCharacters(output)
    .split(/\r?\n|\r/)
    .map((text) => text.trimEnd())
    .filter((text) => text.trim() !== "")
    .slice(-TAIL_LINES);
}

export async function succeeds(
  command: string,
  args: readonly string[],
  cwd: string
): Promise<boolean> {
  try {
    return (await exitCode(command, args, cwd, "ignore")) === 0;
  } catch (error) {
    if (error instanceof CommandFailed) return false;
    throw error;
  }
}

async function exitCode(
  command: string,
  args: readonly string[],
  cwd: string,
  stdio: StdioOptions
): Promise<number | null> {
  return closed(
    spawn(command, args, { cwd, env: withoutGitContext(), stdio }),
    command
  );
}

async function closed(
  child: ChildProcess,
  command: string
): Promise<number | null> {
  return new Promise((resolve, reject) => {
    child.on("error", (error) => {
      reject(new CommandFailed(`${command} couldn't start: ${error.message}`));
    });
    child.on("close", resolve);
  });
}

import {
  type ChildProcess,
  spawn,
  type StdioOptions,
} from "node:child_process";

export class CommandFailed extends Error {
  override readonly name = "CommandFailed";
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
  cwd: string
): Promise<void> {
  const code = await exitCode(command, args, cwd, NO_PROMPTS_OUTPUT_TO_STDERR);
  if (code !== 0) {
    throw new CommandFailed(
      `${[command, ...args].join(" ")} exited with ${code ?? "a signal"}`
    );
  }
}

export async function succeeds(
  command: string,
  args: readonly string[],
  cwd: string
): Promise<boolean> {
  return (await exitCode(command, args, cwd, "ignore")) === 0;
}

export async function output(
  command: string,
  args: readonly string[],
  cwd: string
): Promise<string | undefined> {
  const child = spawn(command, args, {
    cwd,
    env: withoutGitContext(),
    stdio: ["ignore", "pipe", "ignore"],
  });
  let stdout = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    stdout += chunk;
  });
  return (await closed(child, command)) === 0 ? stdout.trim() : undefined;
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

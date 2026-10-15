import { spawn, type StdioOptions } from "node:child_process";

export class CommandFailed extends Error {
  override readonly name = "CommandFailed";
}

const NO_PROMPTS_OUTPUT_TO_STDERR: StdioOptions = ["ignore", 2, 2];

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

async function exitCode(
  command: string,
  args: readonly string[],
  cwd: string,
  stdio: StdioOptions
): Promise<number | null> {
  const child = spawn(command, args, { cwd, stdio });
  return new Promise((resolve, reject) => {
    child.on("error", (error) => {
      reject(new CommandFailed(`${command} couldn't start: ${error.message}`));
    });
    child.on("close", resolve);
  });
}

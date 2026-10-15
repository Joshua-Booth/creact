import { spawn } from "node:child_process";

/** An upstream CLI, pnpm, git or a project tool exited non-zero. Exits 1. */
export class CommandFailed extends Error {
  override readonly name = "CommandFailed";
}

// stdin is closed so no upstream prompt can wait on an agent, and child
// output goes to stderr so stdout carries only the final report.
export async function run(
  command: string,
  args: readonly string[],
  cwd: string
): Promise<void> {
  const code = await exitCode(command, args, cwd, ["ignore", 2, 2]);
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
  stdio: "ignore" | ["ignore", 2, 2]
): Promise<number | null> {
  const child = spawn(command, args, { cwd, stdio });
  return new Promise((resolve, reject) => {
    child.on("error", (error) => {
      reject(new CommandFailed(`${command} couldn't start: ${error.message}`));
    });
    child.on("close", resolve);
  });
}

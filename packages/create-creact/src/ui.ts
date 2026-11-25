import path from "node:path";
import { styleText } from "node:util";

import pkg from "../package.json" with { type: "json" };
import {
  type Progress,
  type Report,
  RESTORE,
  type StepId,
  STEPS,
} from "./create.ts";
import { type Choices, STYLINGS } from "./options.ts";
import { CommandFailed, type Log } from "./shell.ts";
import { BTS, MONOREPOS, STACKS } from "./stacks.ts";

// rich: a terminal, with a spinner, marks and colour.
// plain: piped, CI or an agent's shell, one stable line per finished step.
// json: one object on stdout when the run ends, and nothing else.
export type Mode = "rich" | "plain" | "json";

export interface Renderer extends Progress {
  succeeded(report: Report): void;
  failed(error: CommandFailed | Error, kind: "command" | "usage"): void;
}

type Mark = "done" | "same" | "warn";

interface Line {
  readonly mark: Mark;
  readonly detail: string;
  readonly more?: readonly string[];
}

const LABEL_WIDTH = 9;
const PLAIN_LABEL_WIDTH = 10;
const DETAIL_WIDTH = 30;
const RUNNING: Readonly<Record<StepId, string>> = {
  monorepo: "running Better-T-Stack",
  tooling: "adding creact's setup",
  git: "git init",
  install: "pnpm install, lint, format",
  skills: "restoring agent skills",
};
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const RETRY = "Fix it and run the same command again.";

type Format = Parameters<typeof styleText>[0];

function color(
  format: Format,
  text: string,
  stream: NodeJS.WriteStream = process.stdout
): string {
  return styleText(format, text, { stream });
}

function errColor(format: Format, text: string): string {
  return color(format, text, process.stderr);
}

function out(text: string): void {
  process.stdout.write(text);
}

function outLine(text: string): void {
  process.stdout.write(`${text}\n`);
}

function writeJson(value: unknown): void {
  outLine(JSON.stringify(value, null, 2));
}

function clear(): void {
  out("\r\u001B[2K");
}

function showCursor(): void {
  out("\u001B[?25h");
}

function heard(): void {
  // JSON says nothing until the run ends.
}

export function pickMode(
  json: boolean,
  stream: { readonly isTTY?: boolean },
  env: NodeJS.ProcessEnv
): Mode {
  if (json) return "json";
  const ci = env.CI !== undefined && env.CI !== "" && env.CI !== "false";
  return stream.isTTY === true && !ci && env.TERM !== "dumb" ? "rich" : "plain";
}

export function renderer(mode: Mode, log: Log, cwd: string): Renderer {
  switch (mode) {
    case "rich": {
      return rich(log, cwd);
    }
    case "plain": {
      return plain(log);
    }
    case "json": {
      return json(log);
    }
  }
}

export function seconds(ms: number): string {
  if (ms < 9950) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const whole = Math.round(ms / 1000);
  return `${Math.floor(whole / 60)}m ${String(whole % 60).padStart(2, "0")}s`;
}

function shellQuoted(value: string): string {
  const closed = value.replaceAll("'", String.raw`'\''`);
  return `'${closed}'`;
}

function quotedIfNeeded(value: string): string {
  return /^[\w@%+=:,./-]+$/.test(value) ? value : shellQuoted(value);
}

// The path as the caller would type it: relative when it sits under cwd.
export function shown(dir: string, cwd: string): string {
  const relative = path.relative(cwd, dir);
  return relative === "" ||
    relative.startsWith("..") ||
    path.isAbsolute(relative)
    ? dir
    : relative;
}

export function stackLine(choices: Choices): string {
  return [
    STACKS[choices.stack].label,
    STYLINGS[choices.styling].summary,
    MONOREPOS[choices.monorepo].summary,
    ...(choices.toolchain === "vite-plus" ? ["Vite+"] : []),
  ].join(" · ");
}

function packagesToAdd(report: Partial<Report>): number {
  return (report.layer?.missing ?? []).flatMap((addition) => [
    ...addition.dependencies,
    ...addition.devDependencies,
  ]).length;
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function finishCommand(dir: string): string {
  return `cd ${shellQuoted(dir)} && ${RESTORE.join(" ")}`;
}

// What each finished step says to a person.
function richLine(step: StepId, report: Partial<Report>): Line {
  switch (step) {
    case "monorepo": {
      return report.base === "created"
        ? { mark: "done", detail: "from Better-T-Stack" }
        : { mark: "same", detail: "kept from the first run" };
    }
    case "tooling": {
      const files = report.layer?.files ?? {};
      const outcomes = Object.values(files);
      const written = outcomes.filter((outcome) => outcome === "written");
      const kept = Object.entries(files)
        .filter(([, outcome]) => outcome === "kept")
        .map(([file]) => `kept ${file}, which you edited`);
      if (report.base === "created") {
        return { mark: "done", detail: "lint, format, hooks and tests" };
      }
      return written.length > 0
        ? {
            mark: "done",
            detail: `${plural(written.length, "file")} updated`,
            more: kept,
          }
        : { mark: "same", detail: "up to date", more: kept };
    }
    case "git": {
      switch (report.git) {
        case "initialised": {
          return { mark: "done", detail: "new repository" };
        }
        case "existing": {
          return { mark: "same", detail: "already a repository" };
        }
        default: {
          return { mark: "same", detail: "skipped" };
        }
      }
    }
    case "install": {
      const count = packagesToAdd(report);
      if (report.install === "skipped") {
        return count === 0
          ? { mark: "same", detail: "skipped" }
          : {
              mark: "same",
              detail: `skipped, ${plural(count, "package")} to add`,
              more: ["run again without --no-install to finish"],
            };
      }
      return {
        mark: "done",
        detail:
          count === 0
            ? "linted and formatted"
            : `${plural(count, "package")}, linted, formatted`,
      };
    }
    case "skills": {
      const { skills, skillCount = 0 } = report;
      if (typeof skills === "object") {
        return {
          mark: "warn",
          detail: "not restored",
          more: [
            `${skills.failed}.`,
            `Finish with: ${finishCommand(report.dir ?? "")}`,
          ],
        };
      }
      switch (skills) {
        case "restored": {
          return {
            mark: "done",
            detail: `${plural(skillCount, "skill")} for coding agents`,
          };
        }
        case "present": {
          return { mark: "same", detail: "already there" };
        }
        default: {
          return { mark: "same", detail: "skipped" };
        }
      }
    }
  }
}

// What each finished step says to a script or an agent. These words are
// stable, so a caller can match on them.
function plainLine(step: StepId, report: Partial<Report>): Line {
  switch (step) {
    case "monorepo": {
      return report.base === "created"
        ? { mark: "done", detail: `created with ${BTS}` }
        : { mark: "same", detail: "kept" };
    }
    case "tooling": {
      const entries = Object.entries(report.layer?.files ?? {});
      const named = (outcome: string) =>
        entries.filter(([, value]) => value === outcome).map(([file]) => file);
      const kept = named("kept");
      const pruned = report.layer?.pruned ?? [];
      const removed = pruned.length > 0 ? `, removed ${pruned.join(", ")}` : "";
      return {
        mark: "done",
        detail: `${named("written").length} written, ${named("unchanged").length} unchanged, ${kept.length} kept${removed}`,
        more: kept.map((file) => `kept ${file}, which the project changed`),
      };
    }
    case "git": {
      return {
        mark: report.git === "initialised" ? "done" : "same",
        detail: report.git ?? "skipped",
      };
    }
    case "install": {
      const count = packagesToAdd(report);
      return report.install === "done"
        ? {
            mark: "done",
            detail: `done, ${plural(count, "package")} added, then lint --fix and format`,
          }
        : {
            mark: "same",
            detail: `skipped, ${plural(count, "package")} to add. Run again without --no-install to finish.`,
          };
    }
    case "skills": {
      const { skills } = report;
      if (typeof skills === "object") {
        return {
          mark: "warn",
          detail: `not restored, as ${skills.failed}`,
          more: [`finish with ${finishCommand(report.dir ?? "")}`],
        };
      }
      const words = {
        restored: "restored into .agents/skills",
        present: "present in .agents/skills",
        skipped: "skipped",
      } as const;
      return {
        mark: skills === "restored" ? "done" : "same",
        detail: words[skills ?? "skipped"],
      };
    }
  }
}

const PLAIN_MARK: Readonly<Record<Mark, string>> = {
  done: "done",
  same: "skip",
  warn: "warn",
};

function plain(log: Log): Renderer {
  let current: StepId | undefined;
  return {
    begin(dir, choices) {
      const ids = [
        choices.stack,
        choices.styling,
        choices.monorepo,
        choices.toolchain,
        ...choices.extras,
      ];
      outLine(`create-creact ${pkg.version}: ${dir} (${ids.join(", ")})`);
    },
    start(step) {
      current = step;
    },
    finish(step, partial) {
      current = undefined;
      const line = plainLine(step, partial);
      const ms = partial.ms?.[step] ?? 0;
      const time = ms >= 500 ? `  ${seconds(ms)}` : "";
      outLine(
        `${PLAIN_MARK[line.mark]} ${step.padEnd(PLAIN_LABEL_WIDTH)}${line.detail}${time}`
      );
      for (const more of line.more ?? []) {
        outLine(`${" ".repeat(PLAIN_LABEL_WIDTH + 5)}${more}`);
      }
    },
    succeeded(final) {
      if (typeof final.skills === "object") outLine(`log: ${log.file}`);
      outLine(`next: cd ${shellQuoted(final.dir)} && pnpm dev`);
    },
    failed(error, kind) {
      if (current !== undefined) {
        outLine(`fail ${current.padEnd(PLAIN_LABEL_WIDTH)}${error.message}`);
      }
      process.stderr.write(errorBlock(error, kind, log, (text) => text));
    },
  };
}

function errorBlock(
  error: Error,
  kind: "command" | "usage",
  log: Log,
  dim: (text: string) => string
): string {
  if (kind === "usage") return `create-creact: ${error.message}\n`;
  const tail = error instanceof CommandFailed ? error.tail : [];
  return [
    `create-creact: ${error.message}. ${RETRY}`,
    ...tail.map((text) => dim(`  ${text}`)),
    ...(log.written ? [`log: ${log.file}`] : []),
    "",
  ].join("\n");
}

function rich(log: Log, cwd: string): Renderer {
  const marks: Readonly<Record<Mark | "fail", string>> = {
    done: color("green", "✓"),
    same: color("dim", "·"),
    warn: color("yellow", "!"),
    fail: color("red", "✗"),
  };
  let started = 0;
  let current: StepId | undefined;
  let stepStarted = 0;
  let timer: NodeJS.Timeout | undefined;
  let frame = 0;
  let dir = "";

  const row = (mark: string, step: StepId, detail: string, ms?: number) => {
    const time = ms !== undefined && ms >= 500 ? color("dim", seconds(ms)) : "";
    const padded = time === "" ? detail : detail.padEnd(DETAIL_WIDTH);
    return `  ${mark} ${step.padEnd(LABEL_WIDTH)} ${color("dim", padded)}  ${time}`.trimEnd();
  };
  const stop = () => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
    showCursor();
  };
  const draw = () => {
    if (current === undefined) return;
    frame = (frame + 1) % SPINNER.length;
    const spin = color("cyan", SPINNER[frame] ?? "");
    clear();
    out(row(spin, current, RUNNING[current], performance.now() - stepStarted));
  };

  return {
    begin(target, choices) {
      dir = target;
      started = performance.now();
      out("\u001B[?25l");
      process.once("exit", showCursor);
      process.once("SIGINT", () => {
        showCursor();
        process.exit(130);
      });
      const badge = color(["inverse", "bold"], " creact ");
      out(
        `\n ${badge} ${color("bold", path.basename(target))}  ${color("dim", stackLine(choices))}\n\n`
      );
    },
    start(step) {
      current = step;
      stepStarted = performance.now();
      draw();
      timer = setInterval(draw, 80);
      timer.unref();
    },
    finish(step, partial) {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
      current = undefined;
      const line = richLine(step, partial);
      clear();
      out(`${row(marks[line.mark], step, line.detail, partial.ms?.[step])}\n`);
      for (const more of line.more ?? []) {
        out(`${" ".repeat(LABEL_WIDTH + 5)}${color("dim", more)}\n`);
      }
    },
    succeeded(report) {
      stop();
      const elapsed = seconds(performance.now() - started);
      if (report.install === "skipped") {
        out(`\n  Done in ${elapsed}, without installing.\n`);
      } else {
        const next = [`cd ${quotedIfNeeded(shown(dir, cwd))}`, "pnpm dev"];
        out(`\n  Ready in ${elapsed}. Next:\n\n`);
        for (const command of next) out(`    ${color("cyan", command)}\n`);
      }
      if (typeof report.skills === "object") {
        const where = `Full output: ${log.file}`;
        out(`\n  ${color("dim", where)}\n`);
      }
      out("\n");
    },
    failed(error, kind) {
      stop();
      if (current === undefined) {
        process.stderr.write(errorBlock(error, kind, log, (text) => text));
        return;
      }
      clear();
      const tail = error instanceof CommandFailed ? error.tail : [];
      process.stderr.write(
        [
          `  ${marks.fail} ${current.padEnd(LABEL_WIDTH)} ${errColor("red", error.message)}`,
          ...(tail.length > 0 ? [""] : []),
          ...tail.map((text) => errColor("dim", `    ${text.trim()}`)),
          "",
          ...(log.written
            ? [`  Full output: ${errColor("cyan", log.file)}`]
            : []),
          kind === "usage"
            ? "  Nothing else changed."
            : "  Fix it, then run the same command to pick up where it stopped.",
          "",
          "",
        ].join("\n")
      );
    },
  };
}

function stepsJson(report: Partial<Report>): Record<string, unknown> {
  const ms = report.ms ?? {};
  const steps: Record<string, unknown> = {};
  for (const step of STEPS) {
    if (ms[step] === undefined) continue;
    steps[step] = { ...stepJson(step, report), ms: ms[step] };
  }
  return steps;
}

function stepJson(
  step: StepId,
  report: Partial<Report>
): Record<string, unknown> {
  switch (step) {
    case "monorepo": {
      return report.base === "created"
        ? { status: "created", from: BTS }
        : { status: "kept" };
    }
    case "tooling": {
      const entries = Object.entries(report.layer?.files ?? {});
      const count = (outcome: string) =>
        entries.filter(([, value]) => value === outcome).length;
      return {
        status: "done",
        removed: report.layer?.pruned ?? [],
        written: count("written"),
        unchanged: count("unchanged"),
        kept: entries
          .filter(([, value]) => value === "kept")
          .map(([file]) => file),
      };
    }
    case "git": {
      return { status: report.git };
    }
    case "install": {
      const count = packagesToAdd(report);
      return report.install === "done"
        ? { status: "done", added: count }
        : { status: "skipped", toAdd: count };
    }
    case "skills": {
      const { skills, skillCount } = report;
      return typeof skills === "object"
        ? {
            status: "failed",
            reason: skills.failed,
            finish: finishCommand(report.dir ?? ""),
          }
        : { status: skills, count: skillCount };
    }
  }
}

function json(log: Log): Renderer {
  let current: StepId | undefined;
  let report: Partial<Report> = {};
  return {
    begin: heard,
    start(step) {
      current = step;
    },
    finish(_step, partial) {
      current = undefined;
      report = partial;
    },
    succeeded(final) {
      writeJson({
        ok: true,
        version: pkg.version,
        dir: final.dir,
        choices: final.choices,
        steps: stepsJson(final),
        next: [`cd ${shellQuoted(final.dir)}`, "pnpm dev"],
        log: log.written ? log.file : null,
      });
    },
    failed(error, kind) {
      writeJson({
        ok: false,
        kind,
        message: error.message,
        ...(kind === "command"
          ? {
              step: current ?? null,
              tail: error instanceof CommandFailed ? error.tail : [],
              hint: RETRY,
            }
          : {}),
        ...(report.dir === undefined
          ? {}
          : { dir: report.dir, steps: stepsJson(report) }),
        log: log.written ? log.file : null,
      });
    },
  };
}

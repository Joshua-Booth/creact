import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { CoverageReport } from "monocart-coverage-reports";

const rootDir = path.resolve(import.meta.dirname, "..");

interface IstanbulEntry {
  path: string;
  [key: string]: unknown;
}

type IstanbulCoverage = Record<string, IstanbulEntry>;

function isSourceFile(filePath: string): boolean {
  return (
    filePath.includes("src/") &&
    !filePath.includes(".stories.") &&
    !filePath.includes(".test.") &&
    !filePath.endsWith(".d.ts")
  );
}

function normalizePath(filePath: string): string {
  const srcIndex = filePath.indexOf("src/");
  return srcIndex === -1 ? filePath : filePath.slice(Math.max(0, srcIndex));
}

function filterAndNormalize(data: IstanbulCoverage): IstanbulCoverage {
  const result: IstanbulCoverage = {};
  for (const [key, entry] of Object.entries(data)) {
    if (!isSourceFile(key)) continue;
    const normalizedPath = normalizePath(key);
    result[normalizedPath] = { ...entry, path: normalizedPath };
  }
  return result;
}

function collectCoverageFiles(): string[] {
  const files: string[] = [];

  // Unit tests (vitest --project unit)
  const unitFile = path.join(rootDir, "coverage/unit/coverage-final.json");
  if (existsSync(unitFile)) files.push(unitFile);

  // Vitest workspace (local: vitest run --coverage runs both projects)
  const vitestFile = path.join(rootDir, "coverage/vitest/coverage-final.json");
  if (existsSync(vitestFile)) files.push(vitestFile);

  // Storybook component tests (vitest --project storybook)
  const storybookFile = path.join(
    rootDir,
    "coverage/storybook/coverage-final.json"
  );
  if (existsSync(storybookFile)) files.push(storybookFile);

  // E2E tests (one file per test via playwright fixture)
  const e2eDir = path.join(rootDir, "coverage/e2e");
  if (existsSync(e2eDir)) {
    for (const name of readdirSync(e2eDir)) {
      if (name.endsWith(".json")) {
        files.push(path.join(e2eDir, name));
      }
    }
  }

  return files;
}

async function main(): Promise<void> {
  const coverageFiles = collectCoverageFiles();

  if (coverageFiles.length === 0) {
    console.log("No coverage files found.");
    process.exit(0);
  }

  const report = new CoverageReport({
    name: "Merged Coverage Report",
    outputDir: path.join(rootDir, "coverage/merged"),
    reports: [
      "text-summary",
      ["json", { file: "coverage-final.json" }],
      "lcov",
      ["html", { subdir: "html" }],
    ],
  });

  for (const file of coverageFiles) {
    const raw = JSON.parse(readFileSync(file, "utf-8")) as IstanbulCoverage;
    const filtered = filterAndNormalize(raw);
    await report.add(filtered);
  }

  await report.generate();

  // Write serve.json to disable cleanUrls, which breaks relative links
  // in Istanbul's HTML report by stripping trailing slashes from directory URLs
  const htmlDir = path.join(rootDir, "coverage/merged/html");
  if (existsSync(htmlDir)) {
    writeFileSync(
      path.join(htmlDir, "serve.json"),
      JSON.stringify({ trailingSlash: true }, null, 2)
    );
  }
}

main().catch((error: unknown) => {
  console.error("Failed to merge coverage:", error);
  process.exit(1);
});

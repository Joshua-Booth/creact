import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { CoverageReport } from "monocart-coverage-reports";

const rootDir = path.resolve(import.meta.dirname, "..");

// --- Istanbul coverage types ---

interface IstanbulLocation {
  start: { line: number; column: number };
  end: { line: number | null; column: number | null };
}

interface IstanbulEntry {
  path: string;
  statementMap: Record<string, IstanbulLocation>;
  s: Record<string, number>;
  fnMap: Record<
    string,
    {
      name: string;
      decl: IstanbulLocation;
      loc: IstanbulLocation;
      line: number;
    }
  >;
  f: Record<string, number>;
  branchMap: Record<
    string,
    {
      type: string;
      loc: IstanbulLocation;
      locations: IstanbulLocation[];
      line: number;
    }
  >;
  b: Record<string, number[]>;
}

// --- Location helpers ---

function locKey(loc: { start: { line: number; column: number } }): string {
  return `${String(loc.start.line)}:${String(loc.start.column)}`;
}

/**
 * Check whether a point falls strictly inside a location range (exclusive of
 * the range's own start). Used to detect coarse-grained overlay entries
 * (e.g. E2E function-body statements) that encompass finer-grained base
 * entries (e.g. Vitest return-statement entries).
 * @param range - Location range to check against
 * @param point - Source position to test
 * @param point.line - Line number
 * @param point.column - Column number
 * @returns True if the point is strictly inside the range
 */
function containsPoint(
  range: IstanbulLocation,
  point: { line: number; column: number }
): boolean {
  const { start, end } = range;
  // Same start → not "inside", handled by exact locKey match
  if (point.line === start.line && point.column === start.column) return false;
  if (end.line == null) return false;
  // Before range start
  if (point.line < start.line) return false;
  if (point.line === start.line && point.column < start.column) return false;
  // After range end (null end.column = end of line)
  if (point.line > end.line) return false;
  if (
    point.line === end.line &&
    end.column != null &&
    point.column > end.column
  )
    return false;
  return true;
}

// --- Istanbul ignore range helpers ---

interface IgnoreRange {
  startLine: number;
  endLine: number;
}

const IGNORE_START_RE = /(?:\/\*|\/\/)\s*istanbul ignore start\b/;
const IGNORE_END_RE = /(?:\/\*|\/\/)\s*istanbul ignore end\b/;
const IGNORE_NEXT_RE = /(?:\/\*|\/\/)\s*istanbul ignore next\b/;

function parseIstanbulIgnoreRanges(source: string): IgnoreRange[] {
  const lines = source.split("\n");
  const ranges: IgnoreRange[] = [];
  let ignoreStartLine: number | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (IGNORE_START_RE.test(line)) {
      ignoreStartLine = lineNum;
    }
    if (IGNORE_END_RE.test(line) && ignoreStartLine != null) {
      ranges.push({ startLine: ignoreStartLine, endLine: lineNum });
      ignoreStartLine = null;
    }
    if (IGNORE_NEXT_RE.test(line)) {
      ranges.push({ startLine: lineNum, endLine: lineNum + 1 });
    }
  }

  if (ignoreStartLine != null) {
    ranges.push({ startLine: ignoreStartLine, endLine: lines.length });
  }

  return ranges;
}

// --- Merge helpers ---

function buildLocIndex(
  map: Record<string, { loc: IstanbulLocation } | IstanbulLocation>
): Map<string, string> {
  const index = new Map<string, string>();
  for (const [id, entry] of Object.entries(map)) {
    const loc = "loc" in entry ? entry.loc : entry;
    index.set(locKey(loc), id);
  }
  return index;
}

function mergeStatements(
  result: IstanbulEntry,
  overlay: IstanbulEntry,
  stmtByLoc: Map<string, string>
): void {
  let nextId = Math.max(0, ...Object.keys(result.statementMap).map(Number)) + 1;
  for (const [id, loc] of Object.entries(overlay.statementMap)) {
    const existingId = stmtByLoc.get(locKey(loc));
    if (existingId != null) {
      result.s[existingId] += overlay.s[id];
      continue;
    }
    // Skip coarse-grained overlay statements that encompass existing finer ones
    const subsumed = [...stmtByLoc.values()].some((baseId) =>
      containsPoint(loc, result.statementMap[baseId].start)
    );
    if (subsumed) continue;

    const newId = String(nextId++);
    result.statementMap[newId] = loc;
    result.s[newId] = overlay.s[id];
    stmtByLoc.set(locKey(loc), newId);
  }
}

function mergeFunctions(
  result: IstanbulEntry,
  overlay: IstanbulEntry,
  fnByLoc: Map<string, string>
): void {
  let nextId = Math.max(0, ...Object.keys(result.fnMap).map(Number)) + 1;
  for (const [id, fn] of Object.entries(overlay.fnMap)) {
    const existingId = fnByLoc.get(locKey(fn.loc));
    if (existingId == null) {
      const newId = String(nextId++);
      result.fnMap[newId] = fn;
      result.f[newId] = overlay.f[id];
      fnByLoc.set(locKey(fn.loc), newId);
    } else {
      result.f[existingId] += overlay.f[id];
    }
  }
}

function addBranchCounts(base: number[], overlay: number[]): void {
  for (let i = 0; i < Math.max(base.length, overlay.length); i++) {
    base[i] = (base[i] ?? 0) + (overlay[i] ?? 0);
  }
}

function findMatchingBranch(
  branchByLoc: Map<string, string>,
  result: IstanbulEntry,
  overlayLoc: IstanbulLocation
): string | undefined {
  // Exact start location match
  const exactId = branchByLoc.get(locKey(overlayLoc));
  if (exactId != null) return exactId;

  // Fallback: base branch whose range contains the overlay start
  for (const [, baseId] of branchByLoc) {
    if (containsPoint(result.branchMap[baseId].loc, overlayLoc.start)) {
      return baseId;
    }
  }
  return undefined;
}

function mergeBranches(
  result: IstanbulEntry,
  overlay: IstanbulEntry,
  branchByLoc: Map<string, string>
): void {
  let nextId = Math.max(0, ...Object.keys(result.branchMap).map(Number)) + 1;
  for (const [id, br] of Object.entries(overlay.branchMap)) {
    const matchedId = findMatchingBranch(branchByLoc, result, br.loc);

    if (matchedId != null) {
      addBranchCounts(result.b[matchedId], overlay.b[id]);
      continue;
    }

    // Skip if overlay branch's range contains an existing base branch start
    const subsumed = [...branchByLoc.values()].some((baseId) =>
      containsPoint(br.loc, result.branchMap[baseId].loc.start)
    );
    if (subsumed) continue;

    const newId = String(nextId++);
    result.branchMap[newId] = br;
    result.b[newId] = [...overlay.b[id]];
    branchByLoc.set(locKey(br.loc), newId);
  }
}

/**
 * Merge two Istanbul entries for the same file by matching statements,
 * functions, and branches by their source location. MCR concatenates
 * entries from separate `report.add()` calls rather than merging by ID,
 * so we do it ourselves to avoid duplicate counters.
 * @param base - Primary coverage entry (kept as foundation)
 * @param overlay - Secondary coverage entry to merge in
 * @returns New entry with combined coverage counts
 */
function mergeEntries(
  base: IstanbulEntry,
  overlay: IstanbulEntry
): IstanbulEntry {
  const result = structuredClone(base);

  const stmtByLoc = buildLocIndex(result.statementMap);
  const fnByLoc = buildLocIndex(result.fnMap);
  const branchByLoc = buildLocIndex(result.branchMap);

  mergeStatements(result, overlay, stmtByLoc);
  mergeFunctions(result, overlay, fnByLoc);
  mergeBranches(result, overlay, branchByLoc);

  return result;
}

/**
 * Strip V8 module-cache phantom branches. The browser V8 engine creates a
 * `binary-expr` branch on every `import * as X from "..."` line (checking
 * module-cache status). One path is always 0 and cannot be covered. These
 * branches appear at column 23 (the module specifier position) and are not
 * suppressed by v8 ignore comments in browser-mode coverage.
 * @param combined - Merged coverage map to mutate
 */
function stripPhantomImportBranches(
  combined: Record<string, IstanbulEntry>
): void {
  for (const entry of Object.values(combined)) {
    const idsToRemove: string[] = [];
    for (const [id, br] of Object.entries(entry.branchMap)) {
      if (
        br.type === "binary-expr" &&
        br.loc.start.column === 23 &&
        entry.b[id].includes(0)
      ) {
        idsToRemove.push(id);
      }
    }
    for (const id of idsToRemove) {
      entry.branchMap = Object.fromEntries(
        Object.entries(entry.branchMap).filter(([k]) => k !== id)
      );
      entry.b = Object.fromEntries(
        Object.entries(entry.b).filter(([k]) => k !== id)
      );
    }
  }
}

function isLineIgnored(ranges: IgnoreRange[], line: number): boolean {
  return ranges.some((r) => line >= r.startLine && line <= r.endLine);
}

/**
 * Strip coverage entries that fall within `istanbul ignore start/end` or
 * `istanbul ignore next` blocks in source files. Monocart's V8-to-Istanbul
 * conversion does not recognise istanbul ignore comments, so E2E data can
 * reintroduce entries for regions the Istanbul instrumenter would skip.
 * @param combined - Merged coverage map to mutate
 */
function stripIstanbulIgnoredEntries(
  combined: Record<string, IstanbulEntry>
): void {
  for (const entry of Object.values(combined)) {
    let source: string;
    try {
      source = readFileSync(entry.path, "utf-8");
    } catch {
      continue;
    }

    const ranges = parseIstanbulIgnoreRanges(source);
    if (ranges.length === 0) continue;

    const stmtIds = new Set(
      Object.entries(entry.statementMap)
        .filter(([, loc]) => isLineIgnored(ranges, loc.start.line))
        .map(([id]) => id)
    );
    entry.statementMap = Object.fromEntries(
      Object.entries(entry.statementMap).filter(([k]) => !stmtIds.has(k))
    );
    entry.s = Object.fromEntries(
      Object.entries(entry.s).filter(([k]) => !stmtIds.has(k))
    );

    const fnIds = new Set(
      Object.entries(entry.fnMap)
        .filter(([, fn]) => isLineIgnored(ranges, fn.loc.start.line))
        .map(([id]) => id)
    );
    entry.fnMap = Object.fromEntries(
      Object.entries(entry.fnMap).filter(([k]) => !fnIds.has(k))
    );
    entry.f = Object.fromEntries(
      Object.entries(entry.f).filter(([k]) => !fnIds.has(k))
    );

    const brIds = new Set(
      Object.entries(entry.branchMap)
        .filter(([, br]) => isLineIgnored(ranges, br.loc.start.line))
        .map(([id]) => id)
    );
    entry.branchMap = Object.fromEntries(
      Object.entries(entry.branchMap).filter(([k]) => !brIds.has(k))
    );
    entry.b = Object.fromEntries(
      Object.entries(entry.b).filter(([k]) => !brIds.has(k))
    );
  }
}

// --- Coverage filters ---

/** Patterns excluded from coverage metrics (aligned with vitest.config.ts) */
// eslint-disable-next-line security/detect-non-literal-regexp -- Pattern list is static, not user-supplied
const EXCLUDED = new RegExp(
  [
    "\\.stories\\.",
    "\\.test\\.",
    "\\.d\\.ts$",
    "src/app/entry\\.server\\.tsx$",
    "src/app/sessions\\.server\\.ts$",
    "src/app/entry\\.client\\.tsx$",
    "src/app/providers/",
    "src/app/middleware/",
    "src/app/routes/",
    "src/shared/i18n/locales/",
    "src/shared/lib/analytics/",
    "src/shared/lib/feature-flags/",
    "src/shared/ui/direction/",
    "/index\\.ts$",
    "/types\\.ts$",
    "src/app/routes\\.ts$",
    "src/shared/assets/",
  ].join("|")
);

function isSourceFile(filePath: string): boolean {
  return (
    filePath.includes("src/") &&
    !filePath.includes("node_modules") &&
    !EXCLUDED.test(filePath)
  );
}

const coverageFilterOptions = {
  sourceFilter: (sourcePath: string) => isSourceFile(sourcePath),
  entryFilter: (entry: { url: string }) => entry.url.includes("/assets/"),
};

// --- File collection ---

function collectIstanbulFiles(): string[] {
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

  return files;
}

// --- Main ---

async function convertE2eToIstanbul(e2eRawDir: string): Promise<string> {
  const outputDir = path.join(rootDir, "coverage/e2e-istanbul");
  const outputFile = path.join(outputDir, "coverage-final.json");

  const e2eReport = new CoverageReport({
    name: "E2E V8 to Istanbul",
    outputDir,
    reports: [["json", { file: "coverage-final.json" }]],
    cleanCache: true,
    ...coverageFilterOptions,
    inputDir: e2eRawDir,
  });
  await e2eReport.generate();

  return outputFile;
}

function loadAndMergeIstanbulFiles(
  files: string[]
): Record<string, IstanbulEntry> {
  const combined: Record<string, IstanbulEntry> = {};

  for (const file of files) {
    const raw = JSON.parse(readFileSync(file, "utf-8")) as Record<
      string,
      IstanbulEntry
    >;

    for (const [filePath, data] of Object.entries(raw)) {
      const absPath = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(rootDir, filePath);
      const entry = { ...data, path: absPath };

      combined[absPath] =
        absPath in combined ? mergeEntries(combined[absPath], entry) : entry;
    }
  }

  return combined;
}

async function main(): Promise<void> {
  const istanbulFiles = collectIstanbulFiles();
  const e2eRawDir = path.join(rootDir, "coverage/e2e/coverage/raw");
  const hasE2E = existsSync(e2eRawDir);

  if (istanbulFiles.length === 0 && !hasE2E) {
    console.log("No coverage files found.");
    process.exit(0);
  }

  // Phase 1: Convert E2E V8 raw data to Istanbul JSON
  const allIstanbulFiles = [...istanbulFiles];
  if (hasE2E) {
    const e2eIstanbulFile = await convertE2eToIstanbul(e2eRawDir);
    if (existsSync(e2eIstanbulFile)) allIstanbulFiles.push(e2eIstanbulFile);
  }

  if (allIstanbulFiles.length === 0) {
    console.log("No coverage data to merge.");
    process.exit(0);
  }

  // Phase 2: Merge all Istanbul coverage with location-based deduplication
  const combined = loadAndMergeIstanbulFiles(allIstanbulFiles);

  // Phase 2.5: Strip entries within istanbul ignore blocks
  stripIstanbulIgnoredEntries(combined);

  // Phase 3: Strip V8 phantom branches on module imports
  stripPhantomImportBranches(combined);

  // Phase 4: Generate merged report
  const report = new CoverageReport({
    name: "Merged Coverage Report",
    outputDir: path.join(rootDir, "coverage/merged"),
    reports: [
      "text-summary",
      ["json", { file: "coverage-final.json" }],
      "lcov",
      ["html", { subdir: "html" }],
    ],
    cleanCache: true,
    ...coverageFilterOptions,
  });

  await report.add(combined);
  await report.generate();

  // Write serve.json to disable cleanUrls, which breaks relative links
  // in the HTML report by stripping trailing slashes from directory URLs
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

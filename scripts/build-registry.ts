/**
 * Generates registry.json from the FSD tree so creact works as a shadcn
 * GitHub registry (`shadcn add Joshua-Booth/creact/<item>`).
 *
 * - Each `src/shared/ui/<name>` directory becomes a `registry:ui` item; a
 *   matching `src/shared/lib/<name>` directory is folded into the same item
 *   so consumers get the component and its lib in one add.
 * - Remaining `src/shared/lib` slices become standalone `registry:lib` items.
 * - Hand-curated infra items (theme, storybook-setup, linting, and friends)
 *   distribute creact's tooling beyond components.
 * - npm dependencies and registryDependencies are derived from imports, with
 *   versions taken from package.json.
 *
 * Usage: node scripts/build-registry.ts [--check] [--local]
 *   --check  exit 1 if registry.json is out of date (CI guard)
 *   --local  emit relative ./<item>.json registry deps for local testing
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const UI_DIR = path.join(ROOT, "src/shared/ui");
const LIB_DIR = path.join(ROOT, "src/shared/lib");
const API_DIR = path.join(ROOT, "src/shared/api");
const OUT_FILE = path.join(ROOT, "registry.json");
const GITHUB_PREFIX = "Joshua-Booth/creact";

const CHECK = process.argv.includes("--check");
const LOCAL = process.argv.includes("--local");

/**
 * Source directories that ship with the creact base rather than as registry
 * items. Imports into these are ignored: every creact-derived consumer
 * already has them. `src/storybook` is where the `@/storybook` alias lands
 * when resolved naively; the real files live in `.storybook`.
 */
const BASE_INFRA_DIRS = [
  "src/app",
  "src/entities",
  "src/features",
  "src/pages",
  "src/widgets",
  "src/shared/config",
  "src/shared/i18n",
  "src/storybook",
].map((dir) => path.join(ROOT, dir));

interface RegistryFile {
  path: string;
  type: string;
  target: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: Record<string, Record<string, string>>;
  docs?: string;
}

/** How imports are classified for the item being built. */
interface ImportContext {
  /** Resolved paths inside these directories are internal to the item. */
  ownDirs: string[];
  /**
   * Components treat storybook packages as ambient (consumers without
   * Storybook exclude stories instead); infra items depend on them.
   */
  storybookIsDependency: boolean;
}

interface ImportTargets {
  npm: Set<string>;
  items: Set<string>;
}

const packageJson = JSON.parse(
  readFileSync(path.join(ROOT, "package.json"), "utf8")
) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};
const packageVersions: Record<string, string | undefined> = {
  ...packageJson.devDependencies,
  ...packageJson.dependencies,
};

const warnings: string[] = [];

const byName = (a: string, b: string) => a.localeCompare(b);

function listFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((entry) => statSync(path.join(dir, entry)).isFile())
    .sort(byName);
}

function listDirs(dir: string): string[] {
  return readdirSync(dir)
    .filter((entry) => statSync(path.join(dir, entry)).isDirectory())
    .sort(byName);
}

function titleCase(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function packageRoot(specifier: string): string {
  const parts = specifier.split("/");
  if (specifier.startsWith("@")) return parts.slice(0, 2).join("/");
  return parts[0];
}

function registryRef(name: string): string {
  return LOCAL ? `./${name}.json` : `${GITHUB_PREFIX}/${name}`;
}

// Strips comment lines so example imports in comments are not picked up.
function stripComments(source: string): string {
  const codeLines: string[] = [];
  let inBlockComment = false;
  for (const line of source.split("\n")) {
    const trimmed = line.trimStart();
    if (inBlockComment) {
      if (trimmed.includes("*/")) inBlockComment = false;
    } else if (trimmed.startsWith("/*") && !trimmed.includes("*/")) {
      inBlockComment = true;
    } else if (!trimmed.startsWith("//") && !trimmed.startsWith("*")) {
      codeLines.push(line);
    }
  }
  return codeLines.join("\n");
}

function parseImports(source: string): string[] {
  const pattern = /(?:import|export)[\s\S]*?from\s+["']([^"']+)["']/g;
  return [...stripComments(source).matchAll(pattern)].map((match) => match[1]);
}

// The first sentence of a file's leading JSDoc, if it has one.
function extractDescription(source: string): string | undefined {
  const start = source.indexOf("/**");
  if (start === -1) return undefined;
  const end = source.indexOf("*/", start);
  const block = source.slice(start + 3, end === -1 ? source.length : end);
  for (const rawLine of block.split("\n")) {
    const line = rawLine.replace(/^[\s*]+/, "").trim();
    if (line.length > 0) return line;
  }
  return undefined;
}

// Parses a `selector { --name: value; ... }` block into a variable map.
function parseCssVars(css: string, selector: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return vars;
  const end = css.indexOf("}", start);
  for (const declaration of css.slice(start, end).split(";")) {
    const line = declaration.trim();
    const colon = line.indexOf(":");
    if (!line.startsWith("--") || colon === -1) continue;
    vars[line.slice(2, colon).trim()] = line.slice(colon + 1).trim();
  }
  return vars;
}

const uiNames = new Set(listDirs(UI_DIR));
const libDirNames = new Set(listDirs(LIB_DIR));
const mergedLibNames = new Set(
  [...libDirNames].filter((name) => uiNames.has(name))
);

/**
 * Maps an absolute source path to the registry item that owns it.
 * @param absolute - Absolute path of the imported module
 * @returns Owning item name, or undefined for paths outside ui/lib/api
 */
function itemForPath(absolute: string): string | undefined {
  const relativeToUi = path.relative(UI_DIR, absolute);
  if (!relativeToUi.startsWith("..")) return relativeToUi.split(path.sep)[0];
  if (!path.relative(API_DIR, absolute).startsWith("..")) return "api";
  const relativeToLib = path.relative(LIB_DIR, absolute);
  if (relativeToLib.startsWith("..")) return undefined;
  const head = relativeToLib.split(path.sep)[0];
  return head.replace(/^utils(\.test)?\.ts$/, "utils");
}

/**
 * Records the npm package or registry item an import specifier depends on,
 * per the item's context. Imports of the creact base and of the item's own
 * files are ignored; anything internal that maps to no item is reported.
 * @param specifier - Raw import specifier as written in the source file
 * @param fileDir - Absolute directory of the importing file
 * @param context - Ownership and storybook classification for the item
 * @param targets - Accumulator the resolved dependency is added to
 */
function resolveImport(
  specifier: string,
  fileDir: string,
  context: ImportContext,
  targets: ImportTargets
): void {
  if (specifier.startsWith("node:")) return;
  const isInternal = specifier.startsWith("@/") || specifier.startsWith(".");
  if (!isInternal) {
    const root = packageRoot(specifier);
    const ambient = context.storybookIsDependency
      ? ["react", "react-dom"]
      : ["react", "react-dom", "storybook"];
    if (!ambient.includes(root)) targets.npm.add(root);
    return;
  }
  const absolute = specifier.startsWith("@/")
    ? path.join(ROOT, "src", specifier.slice(2))
    : path.resolve(fileDir, specifier);
  const within = (dir: string) =>
    absolute === dir || absolute.startsWith(dir + path.sep);
  if (context.ownDirs.some(within)) return;
  if (BASE_INFRA_DIRS.some(within)) return;
  const item = itemForPath(absolute);
  if (item === undefined) {
    warnings.push(
      `${path.relative(ROOT, fileDir)}: unmapped internal import "${specifier}"`
    );
    return;
  }
  targets.items.add(item);
}

// Collects the imports of every .ts/.tsx/.mdx file into npm and item deps.
function collectImports(
  filePaths: string[],
  context: ImportContext
): ImportTargets {
  const targets: ImportTargets = { npm: new Set(), items: new Set() };
  for (const filePath of filePaths) {
    if (!/\.(tsx?|mdx)$/.test(filePath)) continue;
    for (const specifier of parseImports(readFileSync(filePath, "utf8"))) {
      resolveImport(specifier, path.dirname(filePath), context, targets);
    }
  }
  return targets;
}

/**
 * Converts collected imports into the item's dependency fields, versioned
 * from package.json and split by where each package is declared there.
 * @param itemName - Item name, used to attribute warnings
 * @param targets - Collected npm packages and registry item names
 * @returns Dependency fields, each present only when non-empty
 */
function dependencyFields(
  itemName: string,
  targets: ImportTargets
): Pick<
  RegistryItem,
  "dependencies" | "devDependencies" | "registryDependencies"
> {
  const withVersion = (pkg: string) => {
    const version = packageVersions[pkg];
    if (version === undefined) {
      warnings.push(`${itemName}: npm dependency "${pkg}" not in package.json`);
      return pkg;
    }
    return `${pkg}@${version}`;
  };
  const npm = [...targets.npm].sort(byName);
  const dependencies = npm
    .filter((pkg) => pkg in packageJson.dependencies)
    .map(withVersion);
  const devDependencies = npm
    .filter((pkg) => !(pkg in packageJson.dependencies))
    .map(withVersion);
  const registryDependencies = [...targets.items].sort(byName).map(registryRef);
  return {
    ...(dependencies.length > 0 && { dependencies }),
    ...(devDependencies.length > 0 && { devDependencies }),
    ...(registryDependencies.length > 0 && { registryDependencies }),
  };
}

interface ComponentSource {
  dir: string;
  targetPrefix: string;
  fileType: string;
}

/**
 * Builds one component item from its ui directory and optional lib pair.
 * @param name - Item name, matching its source directory
 * @param type - Registry item type, e.g. registry:ui
 * @param sources - Source directories with their target prefix and file type
 * @returns The assembled registry item
 */
function buildComponentItem(
  name: string,
  type: string,
  sources: ComponentSource[]
): RegistryItem {
  const files: RegistryFile[] = sources.flatMap(
    ({ dir, targetPrefix, fileType }) =>
      listFiles(dir).map((file) => ({
        path: path.relative(ROOT, path.join(dir, file)),
        type: fileType,
        target: `${targetPrefix}/${file}`,
      }))
  );
  const context: ImportContext = {
    ownDirs: sources.map((source) => source.dir),
    storybookIsDependency: false,
  };
  const targets = collectImports(
    files.map((file) => path.join(ROOT, file.path)),
    context
  );
  const mainFiles = new Set([`${name}.tsx`, `${name}.ts`, "index.ts"]);
  const description = sources
    .flatMap(({ dir }) =>
      listFiles(dir)
        .filter((file) => mainFiles.has(file))
        .map((file) => path.join(dir, file))
    )
    .map((filePath) => extractDescription(readFileSync(filePath, "utf8")))
    .find((text) => text !== undefined);
  const hasStories = files.some((file) => file.path.includes(".stories."));
  return {
    name,
    type,
    title: titleCase(name),
    description: description ?? `${titleCase(name)} for creact projects.`,
    ...dependencyFields(name, targets),
    files,
    ...(hasStories && {
      docs: `Stories require the creact Storybook setup (add ${registryRef("storybook-setup")}). Without it, exclude **/*.stories.tsx from typechecking.`,
    }),
  };
}

interface InfraSpec {
  name: string;
  type: string;
  title: string;
  description: string;
  /** Repo-relative files or directories to include; targets mirror paths. */
  paths: string[];
  /** Packages referenced by name strings rather than imports. */
  extraPackages?: string[];
  /** Post-install note printed by the CLI. */
  docs?: string;
}

/**
 * Builds one hand-curated infra item from explicit files and directories.
 * @param spec - Item metadata plus the source paths to include
 * @returns The assembled registry item
 */
function buildInfraItem(spec: InfraSpec): RegistryItem {
  const filePaths = spec.paths.flatMap((relative) => {
    const absolute = path.join(ROOT, relative);
    return statSync(absolute).isDirectory()
      ? listFiles(absolute).map((file) => path.join(absolute, file))
      : [absolute];
  });
  const context: ImportContext = {
    ownDirs: spec.paths.map((relative) => {
      const absolute = path.join(ROOT, relative);
      return statSync(absolute).isDirectory()
        ? absolute
        : path.dirname(absolute);
    }),
    storybookIsDependency: true,
  };
  const targets = collectImports(filePaths, context);
  for (const pkg of spec.extraPackages ?? []) targets.npm.add(pkg);
  return {
    name: spec.name,
    type: spec.type,
    title: spec.title,
    description: spec.description,
    ...dependencyFields(spec.name, targets),
    files: filePaths.map((filePath) => ({
      path: path.relative(ROOT, filePath),
      type: "registry:file",
      target: `~/${path.relative(ROOT, filePath)}`,
    })),
    ...(spec.docs !== undefined && { docs: spec.docs }),
  };
}

function buildComponentItems(): RegistryItem[] {
  const items: RegistryItem[] = [];
  for (const name of [...uiNames].sort(byName)) {
    const sources: ComponentSource[] = [
      {
        dir: path.join(UI_DIR, name),
        targetPrefix: `@ui/${name}`,
        fileType: "registry:ui",
      },
    ];
    if (mergedLibNames.has(name)) {
      sources.push({
        dir: path.join(LIB_DIR, name),
        targetPrefix: `@lib/${name}`,
        fileType: "registry:lib",
      });
    }
    items.push(buildComponentItem(name, "registry:ui", sources));
  }
  for (const name of [...libDirNames].sort(byName)) {
    if (mergedLibNames.has(name)) continue;
    const dir = path.join(LIB_DIR, name);
    if (listFiles(dir).length === 0) continue;
    items.push(
      buildComponentItem(name, "registry:lib", [
        { dir, targetPrefix: `@lib/${name}`, fileType: "registry:lib" },
      ])
    );
  }
  // The API client is its own FSD segment, outside ui/ and lib/.
  items.push(
    buildComponentItem("api", "registry:lib", [
      {
        dir: API_DIR,
        targetPrefix: "~/src/shared/api",
        fileType: "registry:lib",
      },
    ])
  );
  return items;
}

function buildThemeItem(): RegistryItem {
  const globalsCss = readFileSync(
    path.join(ROOT, "src/app/styles/globals.css"),
    "utf8"
  );
  return {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description:
      "creact design tokens: neutral oklch palette, chart and sidebar colors, radius, light and dark modes.",
    dependencies: [
      `@fontsource-variable/inter@${packageVersions["@fontsource-variable/inter"] ?? "latest"}`,
      `tw-animate-css@${packageVersions["tw-animate-css"] ?? "latest"}`,
    ],
    cssVars: {
      theme: { "font-sans": "'Inter Variable', sans-serif" },
      light: parseCssVars(globalsCss, ":root"),
      dark: parseCssVars(globalsCss, ".dark"),
    },
    docs: 'Import the font and animations in your global stylesheet: @import "@fontsource-variable/inter"; @import "tw-animate-css";',
  };
}

function buildInfraItems(): RegistryItem[] {
  return [
    buildThemeItem(),
    buildInfraItem({
      name: "storybook-setup",
      type: "registry:item",
      title: "Storybook Setup",
      description:
        "creact Storybook 10 infrastructure: preview with i18n and theme decorators, browser-mode vitest wiring, and MSW addon setup. Required for the stories shipped with UI items.",
      paths: [".storybook", "config/vite-aliases.ts"],
      docs: "Expects the creact layout (src/app/styles/globals.css, @/* path alias). Run storybook with: storybook dev --config-dir .storybook",
    }),
    buildInfraItem({
      name: "linting",
      type: "registry:item",
      title: "Linting",
      description:
        "creact Oxlint and Oxfmt config: type-aware TypeScript, React, a11y, sonarjs, unicorn, JSDoc and Tailwind class checks, plus import sorting.",
      paths: ["oxlint.config.ts", ".oxfmtrc.json"],
      extraPackages: ["oxfmt", "oxlint-tsgolint"],
      docs: "Run with: oxlint --max-warnings 0 && oxfmt --check",
    }),
    buildInfraItem({
      name: "commit-conventions",
      type: "registry:item",
      title: "Commit Conventions",
      description:
        "creact commitlint config: FSD-aware scopes, imperative mood, and atomic-commit rules.",
      paths: ["config/commitlint.config.ts", "config/commitlint-ci.config.ts"],
      extraPackages: [
        "@commitlint/cli",
        "@commitlint/config-conventional",
        "commitlint-plugin-selective-scope",
        "commitlint-plugin-function-rules",
      ],
      docs: "Wire into husky: commitlint --config config/commitlint.config.ts --edit $1",
    }),
    buildInfraItem({
      name: "fsd-scaffolding",
      type: "registry:item",
      title: "FSD Scaffolding",
      description:
        "Plop generators for Feature-Sliced Design: scaffold slices and UI components with stories in the creact layout.",
      paths: ["config/plopfile.ts", "config/plop-templates"],
      docs: "Run with: plop --plopfile config/plopfile.ts --dest .",
    }),
  ];
}

function verifyRegistryRefs(items: RegistryItem[]): void {
  const itemNames = new Set(items.map((item) => item.name));
  for (const item of items) {
    for (const ref of item.registryDependencies ?? []) {
      const target = ref
        .split("/")
        .pop()
        ?.replace(/\.json$/, "");
      if (target !== undefined && !itemNames.has(target)) {
        warnings.push(`${item.name}: registry dependency "${ref}" has no item`);
      }
    }
  }
}

function main(): void {
  const items = [...buildComponentItems(), ...buildInfraItems()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  verifyRegistryRefs(items);

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "creact",
    homepage: "https://github.com/Joshua-Booth/creact",
    items,
  };
  const output = `${JSON.stringify(registry, null, 2)}\n`;

  for (const warning of warnings) console.warn(`WARN ${warning}`);

  if (!CHECK) {
    writeFileSync(OUT_FILE, output);
    console.log(`Wrote registry.json (${items.length} items).`);
    return;
  }
  if (readFileSync(OUT_FILE, "utf8") === output) {
    console.log(`registry.json is up to date (${items.length} items).`);
  } else {
    console.error(
      "registry.json is out of date. Run `mise run registry:build`."
    );
    process.exit(1);
  }
}

main();

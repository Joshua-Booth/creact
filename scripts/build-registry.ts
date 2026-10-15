/**
 * Generates registry.json from the FSD tree so creact works as a shadcn
 * GitHub registry (`shadcn add Joshua-Booth/creact/<item>`).
 *
 * - Each `src/shared/ui/<name>` directory becomes a `registry:ui` item,
 *   without its stories, MDX docs and demos.
 * - A `src/shared/lib/<name>` slice becomes a `registry:lib` item when a
 *   shipped item imports it, directly or through another lib item.
 * - Hand-curated infra items (theme, storybook-setup, linting, and friends)
 *   distribute creact's tooling beyond components.
 * - npm dependencies and registryDependencies are derived from imports, with
 *   versions taken from package.json.
 *
 * Usage: node scripts/build-registry.ts [--check] [--ref <ref>]
 *   --check      exit 1 if registry.json is out of date (CI guard)
 *   --ref <ref>  pin registry dependencies to a git ref, e.g. a branch
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const ROOT = path.resolve(import.meta.dirname, "..");
const UI_DIR = path.join(ROOT, "src/shared/ui");
const LIB_DIR = path.join(ROOT, "src/shared/lib");
const GLOBALS_CSS = path.join(ROOT, "src/app/styles/globals.css");
const OUT_FILE = path.join(ROOT, "registry.json");
const GITHUB_PREFIX = "Joshua-Booth/creact";

const { values: args } = parseArgs({
  options: {
    check: { type: "boolean", default: false },
    ref: { type: "string" },
  },
});

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
  "src/shared/api",
  "src/shared/config",
  "src/shared/i18n",
  "src/storybook",
].map((dir) => path.join(ROOT, dir));

type SliceType = "registry:ui" | "registry:lib";

const SLICES: Record<SliceType, { dir: string; alias: string }> = {
  "registry:ui": { dir: UI_DIR, alias: "@ui" },
  "registry:lib": { dir: LIB_DIR, alias: "@lib" },
};

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
  /** Item names while building; GitHub addresses in the output. */
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: Record<string, Record<string, string>>;
  css?: Record<string, object>;
  docs?: string;
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

const isShipped = (file: string) =>
  !/\.stories\.tsx$|\.mdx$/.test(file) &&
  !file.split(path.sep).includes("demo");

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
  const ref = args.ref === undefined ? "" : `#${args.ref}`;
  return `${GITHUB_PREFIX}/${name}${ref}`;
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

interface DocSymbol {
  keyword: "function" | "const" | "class";
  name: string;
}

interface DocComment {
  /** First paragraph of the JSDoc, joined into one line. */
  text: string;
  /** The declaration the JSDoc is attached to, if any. */
  symbol?: DocSymbol;
}

function docComments(source: string): DocComment[] {
  return [...source.matchAll(/\/\*\*([\s\S]*?)\*\//g)].map((match) => {
    const paragraph: string[] = [];
    for (const rawLine of match[1].split("\n")) {
      const line = rawLine.replace(/^\s*\*?\s?/, "").trim();
      if (line.startsWith("@") || (line === "" && paragraph.length > 0)) break;
      if (line !== "") paragraph.push(line);
    }
    const declaration = /^(?:export\s)?(function|const|class)\s(\w+)/.exec(
      source.slice(match.index + match[0].length).trimStart()
    );
    return {
      text: paragraph.join(" "),
      ...(declaration !== null && {
        symbol: {
          keyword: declaration[1] as DocSymbol["keyword"],
          name: declaration[2],
        },
      }),
    };
  });
}

/**
 * Picks an item's description from the JSDoc in its source files, main file
 * first: the doc of the symbol named after the item (`InputOTP`), else of
 * the first PascalCase function or const, else of the item's hook
 * (`useDevice`), else the main file's first JSDoc.
 * @param name - Item name
 * @param dir - Item source directory
 * @param files - Shipped files, relative to dir
 * @returns The description, or undefined when no JSDoc qualifies
 */
function describe(
  name: string,
  dir: string,
  files: string[]
): string | undefined {
  const mainFiles = [`${name}.tsx`, `${name}.ts`, "index.ts"];
  const rank = (file: string) => {
    const index = mainFiles.indexOf(file);
    return index === -1 ? mainFiles.length : index;
  };
  const commentsByFile = files
    .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))
    .sort((a, b) => rank(a) - rank(b))
    .map((file) => ({
      isMain: mainFiles.includes(file),
      comments: docComments(readFileSync(path.join(dir, file), "utf8")).filter(
        (comment) => comment.text !== ""
      ),
    }));
  const comments = commentsByFile.flatMap((file) => file.comments);
  const find = (matches: (symbol: DocSymbol) => boolean) =>
    comments.find(({ symbol }) => symbol !== undefined && matches(symbol));
  // A -core lib slice is named after the ui item it backs: useDataTable.
  const symbolName = name.replace(/-core$/, "").replaceAll("-", "");
  return (
    find((symbol) => symbol.name.toLowerCase() === symbolName) ??
    find(
      (symbol) =>
        symbol.keyword !== "class" && /^[A-Z][a-z]\w*$/.test(symbol.name)
    ) ??
    find((symbol) => symbol.name.toLowerCase() === `use${symbolName}`) ??
    commentsByFile.find((file) => file.isMain)?.comments[0]
  )?.text;
}

/**
 * Maps an absolute source path to the registry item that owns it.
 * @param absolute - Absolute path of the imported module
 * @returns Owning item name, or undefined for paths outside ui and lib slices
 */
function itemForPath(absolute: string): string | undefined {
  for (const { dir } of Object.values(SLICES)) {
    const relative = path.relative(dir, absolute);
    if (relative.startsWith("..")) continue;
    const head = relative.split(path.sep)[0];
    const stats = statSync(path.join(dir, head), { throwIfNoEntry: false });
    return stats?.isDirectory() === true ? head : undefined;
  }
  return undefined;
}

/**
 * Records the npm package or registry item an import specifier depends on.
 * Imports of the creact base and of the item's own files are ignored;
 * anything internal that maps to no item is reported.
 * @param specifier - Raw import specifier as written in the source file
 * @param fileDir - Absolute directory of the importing file
 * @param ownDirs - Directories whose files belong to the item itself
 * @param targets - Accumulator the resolved dependency is added to
 */
function resolveImport(
  specifier: string,
  fileDir: string,
  ownDirs: string[],
  targets: ImportTargets
): void {
  if (specifier.startsWith("node:")) return;
  const isInternal = specifier.startsWith("@/") || specifier.startsWith(".");
  if (!isInternal) {
    const root = packageRoot(specifier);
    if (root !== "react" && root !== "react-dom") targets.npm.add(root);
    return;
  }
  const absolute = specifier.startsWith("@/")
    ? path.join(ROOT, "src", specifier.slice(2))
    : path.resolve(fileDir, specifier);
  const within = (dir: string) =>
    absolute === dir || absolute.startsWith(dir + path.sep);
  if (ownDirs.some(within)) return;
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

// Collects the imports of every .ts/.tsx file into npm and item deps.
function collectImports(filePaths: string[], ownDirs: string[]): ImportTargets {
  const targets: ImportTargets = { npm: new Set(), items: new Set() };
  for (const filePath of filePaths) {
    if (!/\.tsx?$/.test(filePath)) continue;
    for (const specifier of parseImports(readFileSync(filePath, "utf8"))) {
      resolveImport(specifier, path.dirname(filePath), ownDirs, targets);
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
  const registryDependencies = [...targets.items].sort(byName);
  return {
    ...(dependencies.length > 0 && { dependencies }),
    ...(devDependencies.length > 0 && { devDependencies }),
    ...(registryDependencies.length > 0 && { registryDependencies }),
  };
}

/**
 * Builds the item for one `src/shared/ui` or `src/shared/lib` slice.
 * @param type - Which slice segment the item comes from
 * @param name - Slice directory name, used as the item name
 * @returns The assembled registry item
 */
function buildSliceItem(type: SliceType, name: string): RegistryItem {
  const { dir: segmentDir, alias } = SLICES[type];
  const dir = path.join(segmentDir, name);
  const shipped = listFiles(dir).filter(isShipped);
  const targets = collectImports(
    shipped.map((file) => path.join(dir, file)),
    [dir]
  );
  const description = describe(name, dir, shipped);
  if (description === undefined) {
    warnings.push(`${name}: no JSDoc to describe the item`);
  }
  return {
    name,
    type,
    title: titleCase(name),
    description: description ?? `${titleCase(name)} for creact projects.`,
    ...dependencyFields(name, targets),
    files: shipped.map((file) => ({
      path: path.relative(ROOT, path.join(dir, file)),
      type,
      target: `${alias}/${name}/${file}`,
    })),
  };
}

function buildComponentItems(): RegistryItem[] {
  return listDirs(UI_DIR)
    .filter((name) =>
      listFiles(path.join(UI_DIR, name)).some(
        (file) => isShipped(file) && file !== "index.ts"
      )
    )
    .map((name) => buildSliceItem("registry:ui", name));
}

/**
 * Builds the lib items the given items import, closed over the imports of
 * the lib items themselves.
 * @param consumers - Items whose registry dependencies seed the closure
 * @returns One item per reachable lib slice
 */
function buildLibItems(consumers: RegistryItem[]): RegistryItem[] {
  const libNames = new Set(listDirs(LIB_DIR));
  const built = new Map<string, RegistryItem>();
  const pending = consumers.flatMap((item) => item.registryDependencies ?? []);
  for (const name of pending) {
    if (!libNames.has(name) || built.has(name)) continue;
    const item = buildSliceItem("registry:lib", name);
    built.set(name, item);
    pending.push(...(item.registryDependencies ?? []));
  }
  return [...built.values()];
}

function assertNoSliceNameCollisions(): void {
  const uiNames = new Set(listDirs(UI_DIR));
  for (const name of listDirs(LIB_DIR)) {
    if (uiNames.has(name)) {
      throw new Error(
        `src/shared/lib/${name} shares its name with src/shared/ui/${name}. shadcn resolves @/shared/lib/${name} to ui/${name}/${name}.tsx once both are installed, so rename the lib slice.`
      );
    }
  }
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
  const ownDirs = spec.paths.map((relative) => {
    const absolute = path.join(ROOT, relative);
    return statSync(absolute).isDirectory() ? absolute : path.dirname(absolute);
  });
  const targets = collectImports(filePaths, ownDirs);
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

function cssBlock(css: string, prelude: string): string {
  const start = css.indexOf(`${prelude} {`);
  if (start === -1) throw new Error(`globals.css has no "${prelude}" block`);
  const open = start + prelude.length + 1;
  let depth = 0;
  for (let index = open; index < css.length; index++) {
    if (css[index] === "{") depth++;
    if (css[index] === "}" && --depth === 0) {
      return css.slice(open + 1, index);
    }
  }
  throw new Error(`globals.css has no balanced "${prelude}" block`);
}

function cssDeclarations(block: string): string[] {
  return block
    .split(";")
    .map((declaration) => declaration.trim())
    .filter((declaration) => declaration !== "");
}

function cssVars(block: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const declaration of cssDeclarations(block)) {
    if (!declaration.startsWith("--")) continue;
    const colon = declaration.indexOf(":");
    vars[declaration.slice(2, colon).trim()] = declaration
      .slice(colon + 1)
      .trim();
  }
  return vars;
}

function buildThemeItem(): RegistryItem {
  const globalsCss = readFileSync(GLOBALS_CSS, "utf8");
  const packageImports = [...globalsCss.matchAll(/^@import "([^"]+)";/gm)]
    .map(([, specifier]) => specifier)
    .filter((specifier) => specifier !== "tailwindcss")
    .filter((specifier) => !specifier.startsWith("."));
  // shadcn writes the `--color-X: var(--X)` mappings itself from cssVars.
  const theme = Object.fromEntries(
    Object.entries(cssVars(cssBlock(globalsCss, "@theme inline"))).filter(
      ([name, value]) =>
        !(name.startsWith("color-") && value === `var(--${name.slice(6)})`)
    )
  );
  const baseRules = Object.fromEntries(
    cssBlock(globalsCss, "@layer base")
      .split("}")
      .filter((rule) => rule.includes("{"))
      .map((rule) => {
        const [selector, body] = rule.split("{");
        return [
          selector.trim(),
          Object.fromEntries(
            cssDeclarations(body).map((declaration) => [declaration, {}])
          ),
        ];
      })
  );
  return {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description:
      "creact theme: neutral oklch colors for light and dark mode, chart and sidebar colors, the radius scale, the Inter font, animation utilities and base styles.",
    ...dependencyFields("theme", {
      npm: new Set(packageImports.map(packageRoot)),
      items: new Set(),
    }),
    cssVars: {
      theme,
      light: cssVars(cssBlock(globalsCss, ":root")),
      dark: cssVars(cssBlock(globalsCss, ".dark")),
    },
    css: {
      ...Object.fromEntries(
        packageImports.map((specifier) => [`@import "${specifier}"`, {}])
      ),
      "@layer base": baseRules,
    },
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
        "creact Storybook 10 infrastructure: preview with i18n and theme decorators, browser-mode vitest wiring, and MSW addon setup.",
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

function verifyRegistryDependencies(items: RegistryItem[]): void {
  const itemNames = new Set(items.map((item) => item.name));
  for (const item of items) {
    for (const dependency of item.registryDependencies ?? []) {
      if (!itemNames.has(dependency)) {
        warnings.push(
          `${item.name}: registry dependency "${dependency}" has no item`
        );
      }
    }
  }
}

function main(): void {
  assertNoSliceNameCollisions();
  const shipped = [...buildComponentItems(), ...buildInfraItems()];
  const items = [...shipped, ...buildLibItems(shipped)].sort((a, b) =>
    byName(a.name, b.name)
  );
  verifyRegistryDependencies(items);

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "creact",
    homepage: "https://github.com/Joshua-Booth/creact",
    items: items.map((item) =>
      item.registryDependencies === undefined
        ? item
        : {
            ...item,
            registryDependencies: item.registryDependencies.map(registryRef),
          }
    ),
  };
  const output = `${JSON.stringify(registry, null, 2)}\n`;

  for (const warning of warnings) console.warn(`WARN ${warning}`);

  if (!args.check) {
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

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { NodePlopAPI } from "plop";

const FSD_LAYERS = ["features", "entities", "widgets", "pages"] as const;
const FSD_SEGMENTS = ["ui", "api", "model", "lib", "config"] as const;
// eslint-disable-next-line security/detect-unsafe-regex -- bounded input from CLI prompt
const KEBAB_CASE = /^[a-z][\da-z]*(-[\da-z]+)*$/;

// shadcn components to remove after install (replaced by custom implementations)
const SHADCN_EXCLUDE = new Set(["sonner", "direction"]);
// shadcn utility components that don't need stories
const SHADCN_NO_STORIES = new Set<string>([]);

interface ShadcnConfig {
  aliases: {
    components: string;
    utils: string;
    ui: string;
    lib: string;
    hooks: string;
  };
  tsx: boolean;
}

function readShadcnConfig(): ShadcnConfig {
  const raw = readFileSync(resolve("components.json"), "utf-8");
  return JSON.parse(raw) as ShadcnConfig;
}

function resolveAlias(alias: string): string {
  return alias.replace(/^@\//, "src/");
}

export default function plopfile(plop: NodePlopAPI): void {
  const shadcnConfig = readShadcnConfig();
  const uiPath = resolveAlias(shadcnConfig.aliases.ui);
  const ext = shadcnConfig.tsx ? "tsx" : "ts";
  plop.setWelcomeMessage("What would you like to generate?");

  // --- Helpers ---

  plop.setHelper("eq", function (this: unknown, a, b, options) {
    return a === b
      ? (options as Handlebars.HelperOptions).fn(this)
      : (options as Handlebars.HelperOptions).inverse(this);
  });

  // --- Generators ---

  plop.setGenerator("slice", {
    description: "FSD slice (feature, entity, widget, or page)",
    prompts: [
      {
        type: "list",
        name: "layer",
        message: "Which layer?",
        choices: [...FSD_LAYERS],
      },
      {
        type: "input",
        name: "name",
        message: "Slice name (kebab-case):",
        validate: (value: string) =>
          KEBAB_CASE.test(value) || "Must be kebab-case (e.g. my-feature)",
      },
      {
        type: "checkbox",
        name: "segments",
        message: "Which segments?",
        choices: [...FSD_SEGMENTS],
        default: ["ui"],
      },
    ],
    actions: (data) => {
      const actions: Parameters<NodePlopAPI["setGenerator"]>[1]["actions"] = [];
      if (!data) return actions;

      const { layer, name, segments } = data as {
        layer: string;
        name: string;
        segments: string[];
      };

      const base = `src/${layer}/${name}`;

      // Root barrel is always generated
      actions.push({
        type: "add",
        path: `${base}/index.ts`,
        templateFile: "plop-templates/slice/index.ts.hbs",
        data: { layer, name, segments },
      });

      if (segments.includes("ui")) {
        actions.push(
          {
            type: "add",
            path: `${base}/ui/${name}${layer === "pages" ? "-page" : ""}.tsx`,
            templateFile: "plop-templates/slice/ui-component.tsx.hbs",
            data: { layer, name },
          },
          {
            type: "add",
            path: `${base}/ui/${name}${layer === "pages" ? "-page" : ""}.stories.tsx`,
            templateFile: "plop-templates/slice/ui-stories.tsx.hbs",
            data: { layer, name },
          }
        );
      }

      for (const segment of segments) {
        if (segment === "ui") continue;
        actions.push({
          type: "add",
          path: `${base}/${segment}/${name}.ts`,
          templateFile: "plop-templates/slice/segment-file.ts.hbs",
          data: { segment },
        });

        if (segment === "lib") {
          actions.push({
            type: "add",
            path: `${base}/lib/${name}.test.ts`,
            templateFile: "plop-templates/slice/lib-test.ts.hbs",
            data: { name },
          });
        }
      }

      return actions;
    },
  });

  plop.setGenerator("ui", {
    description: `Custom UI component (${uiPath}/)`,
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (kebab-case):",
        validate: (value: string) =>
          KEBAB_CASE.test(value) || "Must be kebab-case (e.g. my-component)",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${uiPath}/{{name}}/{{name}}.${ext}`,
        templateFile: "plop-templates/ui-component/component.tsx.hbs",
        data: { utilsAlias: shadcnConfig.aliases.utils },
      },
      {
        type: "add",
        path: `${uiPath}/{{name}}/{{name}}.stories.${ext}`,
        templateFile: "plop-templates/ui-component/stories.tsx.hbs",
      },
      {
        type: "add",
        path: `${uiPath}/{{name}}/index.ts`,
        templateFile: "plop-templates/ui-component/index.ts.hbs",
      },
    ],
  });

  plop.setGenerator("shadcn", {
    description: "Add shadcn component with restructuring",
    prompts: [
      {
        type: "input",
        name: "name",
        message: 'shadcn component name (kebab-case, or "all"):',
        validate: (value: string) =>
          value === "all" ||
          KEBAB_CASE.test(value) ||
          'Must be kebab-case (e.g. accordion) or "all"',
      },
    ],
    actions: (data) => {
      if (!data) return [];

      const { name } = data as { name: string };
      const isAll = name === "all";

      return [
        // Step 1: Run shadcn CLI
        async () => {
          const { execSync } = await import("node:child_process");
          const cmd = isAll
            ? "pnpm exec shadcn add --all --overwrite"
            : `pnpm exec shadcn add ${name} --overwrite`;
          try {
            execSync(cmd, { stdio: "inherit" });
          } catch {
            throw new Error(`Failed: ${cmd}`);
          }
          return `shadcn add ${isAll ? "--all" : name} completed`;
        },
        // Step 2: Restructure flat files to nested directories + clean up
        async (answers) => {
          const fs = await import("node:fs/promises");
          const path = await import("node:path");

          const uiDirAbs = path.resolve(uiPath);
          const suffix = `.${ext}`;
          const entries = await fs.readdir(uiDirAbs, { withFileTypes: true });
          const dirs = new Set(
            entries.filter((e) => e.isDirectory()).map((e) => e.name)
          );

          const moved: string[] = [];
          const updated: string[] = [];
          const excluded: string[] = [];

          for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith(suffix)) continue;
            const baseName = entry.name.slice(0, -suffix.length);
            const flatPath = path.join(uiDirAbs, entry.name);

            if (SHADCN_EXCLUDE.has(baseName)) {
              // Excluded: component replaced by custom implementation
              await fs.rm(flatPath);
              excluded.push(baseName);
            } else if (dirs.has(baseName)) {
              // Existing: overwrite nested file with upstream version
              const nestedFile = path.join(uiDirAbs, baseName, entry.name);
              await fs.rename(flatPath, nestedFile);
              updated.push(baseName);
            } else {
              // New component: move into nested directory
              const nestedDirPath = path.join(uiDirAbs, baseName);
              await fs.mkdir(nestedDirPath, { recursive: true });
              await fs.rename(flatPath, path.join(nestedDirPath, entry.name));
              moved.push(baseName);
            }
          }

          // Remove known shadcn hooks that the project replaces with its own
          const shadcnHooksToRemove = ["use-mobile.ts"];
          const cleaned: string[] = [];
          const hooksDir = path.resolve(
            resolveAlias(shadcnConfig.aliases.hooks)
          );
          for (const hookFile of shadcnHooksToRemove) {
            const hookPath = path.join(hooksDir, hookFile);
            try {
              await fs.access(hookPath);
              await fs.rm(hookPath);
              cleaned.push(hookFile);
            } catch {
              // Doesn't exist, nothing to clean
            }
          }

          // Track moved components for Step 3
          answers._movedComponents = moved;

          const parts: string[] = [];
          if (moved.length > 0) parts.push(`new: ${moved.join(", ")}`);
          if (updated.length > 0) parts.push(`updated: ${updated.length}`);
          if (excluded.length > 0)
            parts.push(`excluded: ${excluded.join(", ")}`);
          if (cleaned.length > 0) parts.push(`cleaned: ${cleaned.join(", ")}`);
          const summary = parts.join("; ");
          return summary.length > 0 ? summary : "No flat files to process";
        },
        // Step 3: Add barrel + stories for newly moved components only
        async (answers, config, plop) => {
          const fs = await import("node:fs/promises");
          const path = await import("node:path");

          const movedComponents = (answers._movedComponents ?? []) as string[];
          if (movedComponents.length === 0)
            return "No new components to scaffold";

          const uiDirAbs = path.resolve(uiPath);
          const created: string[] = [];

          for (const compName of movedComponents) {
            const dir = path.join(uiDirAbs, compName);

            // Add barrel if missing
            const barrelPath = path.join(dir, "index.ts");
            try {
              await fs.access(barrelPath);
            } catch {
              const content = plop.renderString(
                'export { {{pascalCase name}} } from "./{{name}}";\n',
                { name: compName }
              );
              await fs.writeFile(barrelPath, content);
              created.push(`${compName}/index.ts`);
            }

            // Add stories unless component is in the no-stories list
            if (SHADCN_NO_STORIES.has(compName)) continue;
            const storiesPath = path.join(dir, `${compName}.stories.${ext}`);
            try {
              await fs.access(storiesPath);
            } catch {
              const content = plop.renderString(
                [
                  'import preview from "@/storybook/preview";',
                  'import { expect } from "storybook/test";',
                  "",
                  'import { {{pascalCase name}} } from "./{{name}}";',
                  "",
                  "const meta = preview.meta({",
                  '  title: "ui/{{pascalCase name}}",',
                  "  component: {{pascalCase name}},",
                  "});",
                  "",
                  "// --- Stories ---",
                  "",
                  "export const Default = meta.story();",
                  "",
                  "// --- Tests ---",
                  "",
                  'Default.test("should render successfully", async ({ canvas }) => {',
                  '  const element = await canvas.findByRole("generic");',
                  "  await expect(element).toBeInTheDocument();",
                  "});",
                  "",
                ].join("\n"),
                { name: compName }
              );
              await fs.writeFile(storiesPath, content);
              created.push(`${compName}/${compName}.stories.${ext}`);
            }
          }

          return created.length > 0
            ? `Created: ${created.join(", ")}`
            : "All barrels and stories already exist";
        },
        // Step 4: Format and lint changed components
        async () => {
          const { execSync } = await import("node:child_process");
          const fs = await import("node:fs/promises");
          const path = await import("node:path");

          // Collect all component .tsx files in nested dirs
          const uiDirAbs = path.resolve(uiPath);
          const entries = await fs.readdir(uiDirAbs, { withFileTypes: true });
          const targets: string[] = [];

          for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            const compFile = path.join(
              uiPath,
              entry.name,
              `${entry.name}.${ext}`
            );
            try {
              await fs.access(path.resolve(compFile));
              targets.push(compFile);
            } catch {
              // No matching component file
            }
          }

          if (targets.length === 0) return "No files to format";

          const fileList = targets.join(" ");
          execSync(`mise run format_files -- ${fileList}`, {
            stdio: "inherit",
          });
          try {
            execSync(`mise run lint_files -- ${fileList}`, {
              stdio: "inherit",
            });
          } catch {
            // Lint errors are expected for upstream shadcn code
          }
          return `Formatted and linted ${targets.length} components`;
        },
      ];
    },
  });
}

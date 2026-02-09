import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { NodePlopAPI } from "plop";

const FSD_LAYERS = ["features", "entities", "widgets", "pages"] as const;
const FSD_SEGMENTS = ["ui", "api", "model", "lib", "config"] as const;
// eslint-disable-next-line security/detect-unsafe-regex -- bounded input from CLI prompt
const KEBAB_CASE = /^[a-z][\da-z]*(-[\da-z]+)*$/;

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
}

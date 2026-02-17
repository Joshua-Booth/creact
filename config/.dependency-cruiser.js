/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependencies can lead to hard-to-debug issues and should be avoided.",
      from: {
        pathNot: ["shared/lib/data-table/(parsers|types)\\.ts$"],
      },
      to: {
        circular: true,
      },
    },
    {
      name: "no-circular-at-runtime",
      severity: "warn",
      comment:
        "Allow type-only circular dependencies but warn about runtime circular dependencies.",
      from: {},
      to: {
        circular: true,
        viaOnly: {
          dependencyTypesNot: ["type-only"],
        },
      },
    },
    {
      name: "no-orphans",
      severity: "info",
      comment:
        "Orphan modules (modules that are not imported by any other module) may indicate dead code.",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|cts|mts|json)$", // dot files
          "\\.d\\.ts$", // TypeScript declaration files
          "(^|/)tsconfig\\.json$", // TypeScript config files
          "(^|/)vite\\.config\\.(js|ts|mjs)$", // Vite config
          "^src/app/", // App layer entry points (FSD)
          "^src/pages/", // Pages layer (FSD - routing determines entry)
          "\\.(test|spec|stories)\\.(ts|tsx)$", // Test and story files
          "vitest\\.setup\\.ts$", // Test setup files
          "shared/lib/analytics/index\\.ts$", // Analytics hook (future use)
          "shared/assets/index\\.ts$", // FSD placeholder (intentionally empty)
        ],
      },
      to: {},
    },
    {
      name: "no-deprecated-core",
      severity: "warn",
      comment:
        "A core module used here is deprecated. Find an alternative or disable this rule.",
      from: {},
      to: {
        dependencyTypes: ["core"],
        path: [
          "^punycode$",
          "^domain$",
          "^constants$",
          "^sys$",
          "^_linklist$",
          "^_stream_wrap$",
        ],
      },
    },
    {
      name: "not-to-deprecated",
      severity: "warn",
      comment:
        "This module uses a deprecated dependency. Find an alternative or upgrade.",
      from: {},
      to: {
        dependencyTypes: ["deprecated"],
      },
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "Dependencies not listed in package.json can lead to issues. This might indicate a typo or a missing dependency.",
      from: {},
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
    },
    {
      name: "not-to-unresolvable",
      severity: "error",
      comment:
        "Dependency can't be resolved. Either it doesn't exist or it can't be found.",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: "no-duplicate-dep-types",
      severity: "warn",
      comment:
        "A dependency appears in multiple sections of package.json (e.g., both dependencies and devDependencies).",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: [
        "node_modules",
        "dist",
        "build",
        "coverage",
        "storybook-static",
        "\\.d\\.ts$",
      ],
    },
    includeOnly: {
      path: "^src",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      mainFields: ["module", "main", "types", "typings"],
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/(@[^/]+/[^/]+|[^/]+)",
        theme: {
          graph: {
            splines: "ortho",
          },
          modules: [
            {
              criteria: { source: "^src/app" },
              attributes: { fillcolor: "#ffcccc" },
            },
            {
              criteria: { source: "^src/pages" },
              attributes: { fillcolor: "#ffffcc" },
            },
            {
              criteria: { source: "^src/widgets" },
              attributes: { fillcolor: "#ccffcc" },
            },
            {
              criteria: { source: "^src/features" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: { source: "^src/entities" },
              attributes: { fillcolor: "#ffccff" },
            },
            {
              criteria: { source: "^src/shared" },
              attributes: { fillcolor: "#ccffff" },
            },
          ],
          dependencies: [
            {
              criteria: { resolved: "^src/app" },
              attributes: { color: "#cc0000" },
            },
            {
              criteria: { resolved: "^src/pages" },
              attributes: { color: "#cccc00" },
            },
            {
              criteria: { resolved: "^src/widgets" },
              attributes: { color: "#00cc00" },
            },
            {
              criteria: { resolved: "^src/features" },
              attributes: { color: "#0000cc" },
            },
            {
              criteria: { resolved: "^src/entities" },
              attributes: { color: "#cc00cc" },
            },
            {
              criteria: { resolved: "^src/shared" },
              attributes: { color: "#00cccc" },
            },
          ],
        },
      },
    },
  },
};

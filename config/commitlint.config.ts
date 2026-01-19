/**
 * Advanced Commitlint Configuration
 *
 * Enforces Conventional Commits with FSD-aware scopes and strict subject quality.
 *
 * Scopes:
 *   FSD Layers: app, pages, features, entities, widgets, shared
 *   Technical:  ui, config, tests, deps, types, styles, release
 *
 * Usage: echo "feat(features): add search" | pnpm commitlint
 */
import type { UserConfig } from "@commitlint/types";

// Parsed commit structure from commitlint
interface Commit {
  type: string | null;
  scope: string | null;
  subject: string | null;
  header: string | null;
  body: string | null;
  footer: string | null;
}

type RuleResult = [boolean] | [boolean, string];

const FSD_SCOPES = [
  "app",
  "pages",
  "features",
  "entities",
  "widgets",
  "shared",
] as const;

const TECH_SCOPES = [
  "ui",
  "config",
  "tests",
  "deps",
  "types",
  "styles",
] as const;

const ALL_SCOPES = [...FSD_SCOPES, ...TECH_SCOPES, "release"] as const;

// Severity levels
const ERROR = 2;
const WARNING = 1;
const OFF = 0;

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  plugins: [
    "commitlint-plugin-selective-scope",
    "commitlint-plugin-function-rules",
  ],

  rules: {
    // =========================================================================
    // Type Rules
    // =========================================================================

    /**
     * Allowed commit types:
     * - feat:     New feature
     * - fix:      Bug fix
     * - docs:     Documentation only
     * - style:    Formatting, whitespace (NOT CSS/visual styling)
     * - refactor: Code restructuring without behavior change
     * - perf:     Performance improvement
     * - test:     Test additions or changes
     * - build:    Build system, external dependencies
     * - ci:       CI/CD configuration
     * - chore:    Maintenance tasks
     * - revert:   Revert previous commit
     * - ops:      Operational/infrastructure changes
     */
    "type-enum": [
      ERROR,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "ops",
      ],
    ],
    "type-case": [ERROR, "always", "lower-case"],
    "type-empty": [ERROR, "never"],

    // =========================================================================
    // Scope Rules
    // =========================================================================

    "scope-case": [ERROR, "always", "kebab-case"],
    "scope-empty": [OFF], // Allow empty scopes

    /**
     * Selective scope validation per commit type
     * - Feature work uses FSD layer scopes
     * - Technical changes use technical scopes
     * - Types not listed here can use any scope (docs, revert)
     */
    "selective-scope": [
      ERROR,
      "always",
      {
        // Feature development - FSD layers + ui/types
        feat: [...FSD_SCOPES, "ui", "types"],
        fix: [...FSD_SCOPES, "ui", "types"],
        refactor: [...FSD_SCOPES, "ui", "types"],
        perf: [...FSD_SCOPES, "ui", "types"],

        // Style changes - all scopes
        style: [...ALL_SCOPES],

        // Tests - testing scope + FSD layers
        test: ["tests", ...FSD_SCOPES],

        // Build/CI - technical scopes only
        build: ["config", "deps"],
        ci: ["config"],

        // Maintenance
        chore: ["deps", "config", "release"],
        ops: ["config", "deps"],

        // docs and revert intentionally omitted - they can use any scope
      },
    ],

    // =========================================================================
    // Subject Rules
    // =========================================================================

    "subject-empty": [ERROR, "never"],
    "subject-case": [
      ERROR,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-full-stop": [ERROR, "never", "."],

    // =========================================================================
    // Header Rules
    // =========================================================================

    "header-max-length": [ERROR, "always", 72],
    "header-trim": [ERROR, "always"],

    // =========================================================================
    // Body Rules
    // =========================================================================

    "body-max-line-length": [ERROR, "always", 72],
    "body-leading-blank": [ERROR, "always"],

    // =========================================================================
    // Footer Rules
    // =========================================================================

    "footer-max-line-length": [ERROR, "always", 72],
    "footer-leading-blank": [ERROR, "always"],

    // =========================================================================
    // Function Rules (Advanced Validation)
    // =========================================================================

    /**
     * Imperative mood enforcement
     * Blocks non-imperative patterns: third person (adds), past tense (added), continuous (adding)
     */
    "function-rules/subject-case": [
      ERROR,
      "always",
      ({ subject }: Commit): RuleResult => {
        if (!subject) return [true];
        const firstWord = subject.split(" ")[0].toLowerCase();

        // Only match non-imperative forms (NOT the base imperative form)
        const nonImperative =
          /^(adds|added|adding|fixes|fixed|fixing|updates|updated|updating|removes|removed|removing|changes|changed|changing|creates|created|creating|implements|implemented|implementing|moves|moved|moving|renames|renamed|renaming|deletes|deleted|deleting|improves|improved|improving|refactors|refactored|refactoring)$/;

        if (nonImperative.test(firstWord)) {
          const verbMap: Record<string, string> = {
            adds: "add",
            added: "add",
            adding: "add",
            fixes: "fix",
            fixed: "fix",
            fixing: "fix",
            updates: "update",
            updated: "update",
            updating: "update",
            removes: "remove",
            removed: "remove",
            removing: "remove",
            changes: "change",
            changed: "change",
            changing: "change",
            creates: "create",
            created: "create",
            creating: "create",
            implements: "implement",
            implemented: "implement",
            implementing: "implement",
            moves: "move",
            moved: "move",
            moving: "move",
            renames: "rename",
            renamed: "rename",
            renaming: "rename",
            deletes: "delete",
            deleted: "delete",
            deleting: "delete",
            improves: "improve",
            improved: "improve",
            improving: "improve",
            refactors: "refactor",
            refactored: "refactor",
            refactoring: "refactor",
          };
          const imperative = verbMap[firstWord] ?? firstWord;
          return [
            false,
            `Use imperative mood: "${firstWord}" -> use "${imperative}" (e.g., "add feature" not "added feature")`,
          ];
        }
        return [true];
      },
    ],

    /**
     * No weak verbs that don't describe the actual change
     */
    "function-rules/subject-empty": [
      ERROR,
      "always",
      ({ subject }: Commit): RuleResult => {
        if (!subject) return [true];
        const weakVerbs = [
          "make",
          "do",
          "perform",
          "execute",
          "handle",
          "process",
        ];
        const firstWord = subject.split(" ")[0].toLowerCase();

        if (weakVerbs.includes(firstWord)) {
          return [
            false,
            `Avoid weak verb "${firstWord}" - use a more specific action verb (e.g., "add", "fix", "refactor", "extract")`,
          ];
        }
        return [true];
      },
    ],

    /**
     * No vague words that don't convey meaning
     */
    "function-rules/subject-min-length": [
      ERROR,
      "always",
      ({ subject }: Commit): RuleResult => {
        if (!subject) return [true];

        const vagueWords = /\b(stuff|things?|various|misc|lots|code|wip)\b/i;
        if (vagueWords.test(subject)) {
          return [
            false,
            "Avoid vague words (stuff, things, various, misc, code, wip) - be specific about what changed",
          ];
        }
        return [true];
      },
    ],

    /**
     * No past tense (-ed endings)
     */
    "function-rules/subject-max-length": [
      ERROR,
      "always",
      ({ subject }: Commit): RuleResult => {
        if (!subject) return [true];
        const firstWord = subject.split(" ")[0];

        // Skip short words and known exceptions
        const exceptions = [
          "red",
          "bed",
          "led",
          "fed",
          "shed",
          "sped",
          "bred",
          "bled",
          "need",
          "seed",
          "feed",
          "speed",
          "embed",
        ];
        if (
          firstWord.length <= 3 ||
          exceptions.includes(firstWord.toLowerCase())
        ) {
          return [true];
        }

        if (
          /ed$/i.test(firstWord) &&
          !/^(need|seed|feed|speed)$/i.test(firstWord)
        ) {
          const imperative = firstWord.replace(/ed$/i, "");
          return [
            false,
            `Use present tense: "${firstWord}" appears to be past tense - use "${imperative}"`,
          ];
        }
        return [true];
      },
    ],

    /**
     * JB-XXX ticket format validation (when present)
     * Allows but doesn't require ticket references
     */
    "function-rules/header-case": [
      ERROR,
      "always",
      ({ header, body, footer }: Commit): RuleResult => {
        const fullMessage = `${header ?? ""} ${body ?? ""} ${footer ?? ""}`;

        // Only validate if JB- pattern is present
        if (!/JB-/i.test(fullMessage)) {
          return [true]; // No ticket reference, that's OK
        }

        // Validate format: JB-<digits>
        if (!/JB-\d+/.test(fullMessage)) {
          return [
            false,
            "Invalid ticket format - use JB-XXX where XXX is a number (e.g., JB-123)",
          ];
        }
        return [true];
      },
    ],

    /**
     * Block placeholder ticket references
     */
    "function-rules/header-full-stop": [
      ERROR,
      "always",
      ({ header, body, footer }: Commit): RuleResult => {
        const fullMessage = `${header ?? ""} ${body ?? ""} ${footer ?? ""}`;

        // Placeholder patterns: JB-0, JB-00, JB-000, JB-XXX, JB-xxx
        const placeholders = /JB-(0+|XXX|xxx)/i;
        if (placeholders.test(fullMessage)) {
          return [
            false,
            "Placeholder ticket references (JB-0, JB-XXX) are not allowed - use a real ticket number or omit entirely",
          ];
        }
        return [true];
      },
    ],

    /**
     * Atomic commit warning - detect "and" suggesting multiple changes
     * Level 1 = warning only, doesn't block commit
     */
    "function-rules/scope-enum": [
      WARNING,
      "always",
      ({ subject }: Commit): RuleResult => {
        if (!subject) return [true];

        // Match " and " but not in compound nouns like "drag-and-drop"
        if (/\s+and\s+/i.test(subject) && !/-and-/i.test(subject)) {
          return [
            false,
            'Consider splitting into atomic commits - subject contains "and" (suggests multiple changes)',
          ];
        }
        return [true];
      },
    ],

    /**
     * No GitHub issue references - use Linear tickets instead
     */
    "function-rules/scope-case": [
      ERROR,
      "always",
      ({ header, body, footer }: Commit): RuleResult => {
        const fullMessage = `${header ?? ""} ${body ?? ""} ${footer ?? ""}`;

        // Match #123 but not in URLs or code references
        const githubIssue = /(?<![/\w])#\d+(?!\d)/;
        if (githubIssue.test(fullMessage)) {
          return [
            false,
            "GitHub issue references (#123) are not allowed - use JB-XXX Linear ticket references instead",
          ];
        }
        return [true];
      },
    ],

    /**
     * Breaking changes require detailed body explanation
     */
    "function-rules/body-case": [
      ERROR,
      "always",
      ({ header, body, footer }: Commit): RuleResult => {
        const isBreaking =
          (header && header.includes("!")) ||
          (footer && /BREAKING[\s-]?CHANGE/i.test(footer));

        if (isBreaking) {
          if (!body || body.trim().length < 20) {
            return [
              false,
              "Breaking changes require a detailed body explanation (minimum 20 characters describing the breaking change and migration path)",
            ];
          }
        }
        return [true];
      },
    ],
  },
};

export default config;

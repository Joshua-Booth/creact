/**
 * CI Commitlint Configuration — PR Title Validation
 *
 * Extends the main commitlint config but disables body/footer rules
 * that don't apply to single-line PR titles.
 *
 * Usage: echo "feat(app): add feature" | pnpm commitlint --config "./config/commitlint-ci.config.ts"
 */
import type { UserConfig } from "@commitlint/types";

import baseConfig from "./commitlint.config";

const OFF = 0;

const config: UserConfig = {
  ...baseConfig,

  rules: {
    ...baseConfig.rules,

    // Disable body rules — PR titles are single-line
    "body-max-line-length": [OFF],
    "body-leading-blank": [OFF],

    // Disable footer rules — not applicable to PR titles
    "footer-max-line-length": [OFF],
    "footer-leading-blank": [OFF],

    // Disable breaking change body requirement — PR titles can use !
    // without a body; the PR description serves as the explanation
    "function-rules/body-case": [OFF],

    // Disable JB-XXX ticket format check — only relevant for body/footer
    "function-rules/header-case": [OFF],
    "function-rules/header-full-stop": [OFF],
  },
};

export default config;

const { concurrent } = require("nps-utils");

const nps = "npm start";

module.exports = {
  prettier: {
    description: "Runs prettier.",
    script: `prettier --ignore-path ./config/.prettierignore "**/*.+(js|json|scss|html|md)" --config ./config/.prettierrc`,
  },
  stylelint: {
    description: "Lint the sass (.scss) styles.",
    script: `stylelint "**/*.scss" --ignore-path .gitignore --config ./config/.stylelintrc.json`,
  },
  eslint: {
    description: "Lint the JavaScript (.js) files.",
    script: `eslint "**/*.js" --ignore-path .gitignore --config ./config/.eslintrc.json`,
  },
  format: {
    default: {
      description: "Formats the code.",
      script: `${nps} -- -p=format prettier stylelint eslint`,
    },
    check: {
      description: "Checks if the code needs formatting.",
      script: `${nps} "prettier --check" stylelint eslint`,
    },
    prettier: `${nps} "prettier --write"`,
    stylelint: `${nps} "stylelint --fix"`,
    eslint: `${nps} "eslint --fix"`,
  },
  validate: {
    description: "Ensure code is formatted, passes tests and builds.",
    script: concurrent.nps(
      "format.check",
      "test.coverage",
      "start",
      "cy.run.it",
      "cy.run.e2e",
      "build"
    ),
  },
  lintstaged: {
    script: "npx lint-staged --config ./config/.lintstagedrc",
  },
};

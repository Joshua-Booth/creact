const path = require("path");

module.exports = {
  ...require("./jest-common"),

  // Name
  displayName: "lint:prettier",

  rootDir: path.join(__dirname, ".."),
  runner: "jest-runner-prettier",
  moduleFileExtensions: [
    "js",
    "jsx",
    "scss",
    "html",
    "json",
    "md",
    "markdown",
    "mdx",
    "yaml",
    "yml",
  ],
  testMatch: [
    "<rootDir>/src/**/*.js",
    "<rootDir>/src/**/*.jsx",
    "<rootDir>/src/**/*.scss",
    "<rootDir>/src/**/*.html",
    "<rootDir>/src/**/*.json",
    "<rootDir>/src/**/*.md",
    "<rootDir>/src/**/*.markdown",
    "<rootDir>/src/**/*.mdx",
    "<rootDir>/src/**/*.yaml",
    "<rootDir>/src/**/*.yml",
  ],
};

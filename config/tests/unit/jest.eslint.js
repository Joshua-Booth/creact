const path = require("path");

module.exports = {
  ...require("./jest-common"),

  // Name
  displayName: "lint:js",

  rootDir: path.join(__dirname, ".."),
  runner: "jest-runner-eslint",
  testMatch: ["<rootDir>/**/*.js"],
  testPathIgnorePatterns: ["<rootDir>/cypress"],
};

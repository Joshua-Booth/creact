const path = require("path");

module.exports = {
  ...require("./jest-common"),
  coverageDirectory: path.join(__dirname, "../../../coverage/unit"),
  collectCoverageFrom: ["**/src/**/*.js"],
  coverageThreshold: {
    global: {
      statements: 10,
      branches: 10,
      functions: 10,
      lines: 10,
    },
  },
  roots: ["./"],
  verbose: true,
  projects: ["**/jest.unit.js", "**/jest.eslint.js", "**/jest.prettier.js"],
};

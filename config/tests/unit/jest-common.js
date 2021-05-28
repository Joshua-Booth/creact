const path = require("path");

module.exports = {
  rootDir: path.join(__dirname, "../../../"),
  setupFiles: [path.join(__dirname, "../", "setup.js")],
  moduleDirectories: [
    "node_modules",
    path.join(__dirname, "../../../src"),
    __dirname,
    path.join(__dirname, "../"),
    path.join(__dirname, "../../"),
  ],
  watchPlugins: [
    "jest-watch-select-projects",
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
    [
      "jest-watch-suspend",
      {
        // override key press
        key: "s",
        // override prompt
        prompt: "suspend watch mode",
        // starts in suspend mode
        "suspend-on-start": true,
      },
    ],
  ],
};

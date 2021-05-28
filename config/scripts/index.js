// Combine and re-export all scripts

module.exports = {
  scripts: {
    ...require("./dev"),
    ...require("./prod"),
    ...require("./test"),
    ...require("./docs"),
    ...require("./lint"),
    ...require("./git-hooks"),
  },
};

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);
  require("cypress-terminal-report/src/installLogsPrinter")(on);
  on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));
  return config;
};

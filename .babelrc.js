const isTestMode = String(process.env.NODE_ENV) === "test";
const shouldCollectCoverage = Boolean(process.env.COVERAGE);

module.exports = {
  presets: [
    "@babel/preset-react",
    ["@babel/preset-env", { modules: isTestMode ? "commonjs" : false }],
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    ["transform-react-remove-prop-types", { mode: "remove" }],
    "@babel/plugin-transform-runtime",
  ],
};

if (shouldCollectCoverage) {
  module.exports.plugins.push([
    "istanbul",
    {
      exclude: ["tests", "src/**/*.test.js"],
    },
    "code-coverage",
  ]);
}

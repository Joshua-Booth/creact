module.exports = {
  ...require("./jest-common"),
  // Name
  displayName: "test:unit",

  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "src/index.js",
    "src/serviceWorker.js",
    "src/utils/dev/react-devtools-hook.js",
  ],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "jest-axe/extend-expect",
  ],
  moduleNameMapper: {
    "\\.module\\.css$": "identity-obj-proxy",
    "\\.(css|sass|scss)$": require.resolve("./file-mock.js"),
    "\\.svg": require.resolve("./svg-mock.js"),
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      require.resolve("./file-mock.js"),
  },
  testMatch: ["**/*.test.js"],
};

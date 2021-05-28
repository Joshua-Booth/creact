const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./common.js");

const APP_DIR = path.resolve(__dirname, "../..", "./src");
const BUILD_DIR = path.resolve(__dirname, "../..", "./build");

const configDirs = {
  BUILD_DIR,
  APP_DIR,
};

module.exports = (env) => {
  if (env.prod || env.dev) {
    const ENV = env.prod ? "prod" : "dev";
    const envConfig = require(`./${ENV}.js`)(configDirs);

    return merge(commonConfig, envConfig);
  }
  console.log(
    "Wrong webpack build parameter. Possible choices: 'dev' or 'prod'."
  );
};

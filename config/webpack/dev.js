const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = function (configDirs) {
  const devConfig = Object.assign({}, require("./common")(configDirs));

  devConfig.output.filename = "[name].js";

  devConfig.mode = "development";
  devConfig.devtool = "eval-source-map";

  // Dev Server
  devConfig.devServer = {
    compress: true,
    contentBase: configDirs.BUILD_DIR,
    historyApiFallback: true,
    hot: true,
  };

  // Plugins
  devConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EvalSourceMapDevToolPlugin({}),
    new Dotenv({
      path: "./config/env/.dev",
    })
  );

  console.log("\x1b[36m%s\x1b[0m", "\nBuilding for development...\n");

  return devConfig;
};

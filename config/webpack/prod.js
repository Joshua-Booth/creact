// Environment Variables
const Dotenv = require("dotenv-webpack");

// Optimisation
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FontPreloadPlugin = require("webpack-font-preload-plugin");

module.exports = function (configDirs) {
  const prodConfig = Object.assign({}, require("./common")(configDirs));

  prodConfig.mode = "production";

  prodConfig.output.filename = "[name].[contenthash:8].js";

  // Performance
  prodConfig.performance = {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  };

  // Optimization
  prodConfig.optimization = {
    removeAvailableModules: true,
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
        },
        styles: {
          name: "styles",
          test: /[\\/]src[\\/]styles[\\/]/,
          chunks: "all",
          minSize: 0,
          priority: -20,
        },
        components: {
          name: "components",
          test: /[\\/]src[\\/]components[\\/]/,
          chunks: "all",
          minSize: 0,
          priority: -30,
        },
      },
    },
    minimizer: [`...`, new CssMinimizerPlugin()],
    runtimeChunk: "single",
  };

  // Plugins
  prodConfig.plugins.push(
    new FontPreloadPlugin({ extensions: ["woff2"] }),
    new Dotenv({
      path: "./config/env/.prod",
      systemvars: true,
    })
  );

  console.log("\x1b[33m%s\x1b[0m", "\nBuilding for production ...\n");

  return prodConfig;
};

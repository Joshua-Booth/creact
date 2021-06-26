const glob = require("glob");

// CSS
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

// HTML
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

// Optimisation
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

// Other
const WorkboxPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const PROD = process.env.NODE_ENV === "production";

/**
 * Return a list of blobs that match allowed CSS classes for PurgeCSS
 *
 * @returns {object} A object of safe CSS classes to allow
 */
function collectSafelist() {
  return {
    standard: [/^ais-/, /^notif/, /^react-autosuggest/],
  };
}

/**
 * The common build config for development and production builds.
 *
 * @param {object} configDirs Directories for the app and build
 * @returns {object} The build config
 */
function buildConfig(configDirs) {
  const config = {
    entry: configDirs.APP_DIR + "/index.js",
    output: {
      path: configDirs.BUILD_DIR,
      publicPath: "/",
    },
    devServer: {
      historyApiFallback: true,
      compress: true,
    },
    resolve: {
      modules: [configDirs.APP_DIR, "node_modules"],
      fallback: { path: require.resolve("path-browserify") },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: { config: "./config/postcss.config.js" },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            PROD ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: !PROD,
                import: false,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: { config: "./config/postcss.config.js" },
              },
            },
            "resolve-url-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "style-resources-loader",
              options: {
                patterns: [
                  configDirs.APP_DIR + "/styles/utils/_variables.scss",
                  configDirs.APP_DIR + "/styles/utils/_mixins.scss",
                ],
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 20000,
              },
            },
            "image-webpack-loader",
          ],
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          include: configDirs.APP_DIR + "/styles",
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10000,
                mimetype: "application/font-woff",
                name: "[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          include: configDirs.APP_DIR,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: PROD ? "[name].[contenthash:8].css" : "styles.css",
      }),
      new PurgecssPlugin({
        paths: glob.sync(`${configDirs.APP_DIR}/**`, {
          nodir: true,
        }),
        safelist: collectSafelist,
      }),
      new WorkboxPlugin.GenerateSW({
        swDest: "./sw.js",
        clientsClaim: true,
        skipWaiting: true,
        offlineGoogleAnalytics: true,
        maximumFileSizeToCacheInBytes: PROD ? 10000000 : 100000000,
        navigateFallback: "./index.html",
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        exclude: [/_redirects/, /_headers/, /sw.js/],
      }),
      new HtmlWebpackPlugin({
        template: configDirs.APP_DIR + "/index.html",
        inject: true,
        filename: "index.html",
        scriptLoading: "defer",
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
        PUBLIC_URL: "public",
      }),
      new CompressionPlugin({
        algorithm: "gzip",
        threshold: 4096,
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/assets/favicons", to: "public/icons" },
          { from: "src/manifest.json", to: "public" },
          { from: "public", to: "." },
        ],
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
          parallel: true,
        }),
      ],
    },
  };

  if (process.env.ANALYSE) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
}

module.exports = buildConfig;

const { crossEnv } = require("nps-utils");

require("dotenv").config({ path: "./config/env/.dev" });

const nps = "npm start";
const ENV = "NODE_ENV=development";
const APP_PORT = `localhost:${process.env.APP_PORT}`;

module.exports = {
  // Development server environment setup
  dev: {
    default: {
      description: "Start up front and backend development env servers.",
      script: crossEnv(
        `${ENV} concurrently '${nps} dev.server' '${nps} dev.client'`
      ),
    },
    server: {
      description: "Run the development server for an Express API backend.",
      script: "cd ../api && npm start",
    },
    client: {
      description: "Run the development server for the frontend.",
      script: `webpack serve --env=dev --port=${APP_PORT} --config config/webpack/webpack.config.js`,
    },
  },
};

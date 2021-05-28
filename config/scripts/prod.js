const { crossEnv } = require("nps-utils");

require("dotenv").config({ path: "./config/env/.prod" });

const nps = "npm start";
const APP_PORT = process.env.APP_PORT;

module.exports = {
  clean: {
    description: "Remove the build folder.",
    script: "rimraf ./build",
  },
  prebuild: `${nps} clean`,
  build: {
    default: {
      description: "Build the app for production.",
      script: `${nps} prebuild build.create`,
    },
    create: {
      description: "Create the app for production.",
      script: crossEnv(
        "NODE_ENV=production webpack --env prod --config config/webpack/webpack.config.js"
      ),
    },
    analyse: {
      description:
        "Analyse the production build, dependencies and their sizes.",
      script: crossEnv(
        `ANALYSE=true ${nps} prebuild 'build.create --progress --profile'`
      ),
    },
    coverage: {
      description: "Build the app for production with coverage.",
      script: crossEnv(`COVERAGE=true ${nps} build`),
    },
  },
  serve: {
    description: "Serve static build files.",
    script: "serve -s build --no-clipboard",
  },

  // Production server environment setup
  prod: {
    default: {
      description: "Start up front and backend production env servers.",
      script: `concurrently "${nps} prod.server" "${nps} prod.client"`,
    },
    server: {
      description: "Run the backend server as if it were in production.",
      script: "cd ../api && npm start",
    },
    client: {
      description: "Run the client server as if it were in production.",
      script: crossEnv(
        `NODE_ENV=production && ${nps} "serve --no-clipboard --single --listen ${APP_PORT}"`
      ),
    },
  },
};

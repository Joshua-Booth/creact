const { series, crossEnv } = require("nps-utils");

require("dotenv").config({ path: "./config/env/.test" });

const nps = "npm start";
const ENV = "NODE_ENV=test";
const API_URL = `localhost:${process.env.API_PORT}`;

const CYPRESS_ENV = [
  { value: `CYPRESS_URL=${process.env.CYPRESS_BASE_URL}` },
  { value: `CYPRESS_USER_EMAIL=${process.env.CYPRESS_USER_EMAIL}` },
  { value: `CYPRESS_USER_PASSWORD=${process.env.CYPRESS_USER_PASSWORD}` },
]
  .map(function (elem) {
    return elem.value;
  })
  .join(" ");

/**
 * Return the right script if the CI environment variable is set.
 *
 * @param {string} script The CI script
 * @param {string} alternateScript The non-CI script
 * @returns {string} The script based on the CI mode
 */
function isCI(script, alternateScript) {
  return process.env.CI ? script : alternateScript;
}

module.exports = {
  test: {
    // Unit tests
    default: {
      description: "Run unit tests.",
      script: isCI(`${nps} test.coverage`, `${nps} test.watch`),
    },
    coverage: {
      description: "Collect unit test coverage.",
      script: crossEnv(`${ENV} COVERAGE=true ${nps} 'jest --coverage'`),
    },
    watch: {
      description: "Run unit tests in watch mode.",
      script: crossEnv(`${ENV} ${nps} 'jest --watch'`),
    },
    debug: {
      description: "Run unit tests in debug mode.",
      script: crossEnv(
        `${ENV} node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand --watch`
      ),
    },

    // Integration tests
    it: {
      default: {
        description: "Run integration tests.",
        script: isCI(`${nps} test.it.run`, `${nps} test.it.dev`),
      },
      run: {
        description: "CI mode for integration tests.",
        script: `start-server-and-test "${nps} pretest.it.run prod" http-get://${API_URL} "${nps} cy.run.it"`,
      },
      dev: {
        description: "Development mode for integration tests.",
        script: `start-server-and-test "${nps} dev" http-get://${API_URL} "${nps} cy.open.it"`,
      },
    },

    // End to end tests
    e2e: {
      default: {
        description: "Run end to end tests.",
        script: isCI(`${nps} test.e2e.run`, `${nps} test.e2e.dev`),
      },
      run: {
        description: "CI mode for end to end tests.",
        script: `start-server-and-test "${nps} pretest.e2e.run prod" http-get://${API_URL} "${nps} cy.run.e2e"`,
      },
      dev: {
        description: "Development mode for end to end tests.",
        script: `start-server-and-test "${nps} dev" http-get://${API_URL} "${nps} cy.open.e2e"`,
      },
    },
    changed: {
      description: "Test only changed files to be committed.",
      script: crossEnv(
        `${ENV} CI=true ${nps} "jest --onlyChanged --passWithNoTests"`
      ),
    },
  },

  // Code coverage
  precoverage: {
    default: `${nps} coverage.clean`,
    createReport: series(`${nps} coverage.copy coverage.merge`),
  },
  coverage: {
    default: {
      description: "Collect code coverage and produce a coverage report.",
      script: series(`${nps} precoverage coverage.test coverage.createReport`),
    },
    test: {
      default: {
        description: "Run tests for the coverage report.",
        script: series(`${nps} -- -p=coverage.test unit it e2e`),
      },
      unit: `${nps} test.coverage`,
      it: `npx nyc --nycrc-path ./config/tests/it/.nycrc ${nps} test.it.run`,
      e2e: `npx nyc --nycrc-path ./config/tests/e2e/.nycrc ${nps} test.e2e.run`,
    },
    clean: {
      description: "Remove any coverage output files.",
      script: "rimraf .nyc_output && rimraf coverage",
    },
    copy: {
      description: "Copy individual coverage reports to a single folder.",
      script:
        "cpy coverage/end-to-end/coverage-final.json coverage/merged --rename=e2e-coverage.json && cpy coverage/integration/coverage-final.json coverage/merged --rename=it-coverage.json && cpy coverage/unit/coverage-final.json coverage/merged --rename=unit-coverage.json",
    },
    merge: {
      description: "Merge all coverage into a single file.",
      script:
        "npx nyc merge coverage/merged coverage/merged/merged-coverage.json",
    },
    createReport: {
      description: "Create a final combined coverage report.",
      script: `${nps} precoverage.createReport && npx nyc report -t coverage/merged --report-dir coverage/merged --reporter=lcov --reporter=text --reporter=text-summary`,
    },
  },

  // Cypress
  cy: {
    run: {
      it: crossEnv(
        `${CYPRESS_ENV} cypress run --config-file ./config/tests/it/cypress.json`
      ), // add --record after projectId is setup
      e2e: crossEnv(
        `${CYPRESS_ENV} cypress run --config-file ./config/tests/e2e/cypress.json`
      ), // add --record after projectId is setup
    },
    open: {
      it: crossEnv(
        `${CYPRESS_ENV} cypress open --config-file ./config/tests/it/cypress.json`
      ),
      e2e: crossEnv(
        `${CYPRESS_ENV} cypress open --config-file ./config/tests/e2e/cypress.json`
      ),
    },
  },

  // Jest
  jest: {
    script: "jest --config ./config/tests/unit/jest.config.js --rootDir=.",
  },

  pretest: {
    e2e: {
      run: `${nps} build.coverage`,
    },
    it: {
      run: `${nps} build.coverage`,
    },
  },
};

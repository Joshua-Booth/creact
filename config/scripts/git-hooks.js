const nps = "npm start";

module.exports = {
  precommit: {
    description: "Run linting, testing and build before commit.",
    script: `${nps} lintstaged format test.changed build`,
  },
  prepush: {
    description: "Test before pushing.",
    script: `${nps} coverage`,
  },
};

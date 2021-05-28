import { compose } from "redux";
import mockConsole from "jest-mock-console";

// Credit: https://stackoverflow.com/a/48042799/11324006
describe("environmental variables", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("uses logging middleware in development", () => {
    mockConsole("info");
    process.env.NODE_ENV = "development";

    require("store").default;

    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(null);
  });

  test("uses Redux Dev Tools extension in development", () => {
    mockConsole("info");
    process.env.NODE_ENV = "development";
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = compose;

    require("store").default;

    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(
      "Using Redux Dev Tools Extension"
    );
  });
});

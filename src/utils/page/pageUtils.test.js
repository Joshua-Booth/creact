import React from "react";
import Faker from "faker";

// Constants
import { APP_TITLE } from "constants/app";

// Test Utilities
import { render, randomNumber } from "tests/utils";

// Utilities
import { setPageTitle } from ".";

describe("Page Utilities", () => {
  test("should update document title to contain specific title", () => {
    const title = Faker.lorem.words(randomNumber(1, 4));
    render(<div></div>);

    setPageTitle(title);

    expect(document.title).toEqual(`${title} | ${APP_TITLE}`);
  });

  test("should update document title to have default title", () => {
    render(<div></div>);

    setPageTitle();

    expect(document.title).toEqual(APP_TITLE);
  });
});

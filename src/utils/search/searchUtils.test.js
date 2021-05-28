// Test Utilities
import { queryBuilder, randomNumber } from "tests/utils";

// Utilities
import { createURL, searchStateToUrl } from ".";

describe("Search Utilities", () => {
  describe("createURL", () => {
    test("should create URL from state", () => {
      const url = createURL(queryBuilder());

      expect(url).toEqual(expect.stringContaining("/search"));
    });

    test("should create URL with non default page", () => {
      const pageNumber = Math.round(randomNumber(2, 10));
      const url = createURL({ ...queryBuilder(), page: pageNumber });

      expect(pageNumber).not.toEqual(1);
      expect(url).toEqual(expect.stringContaining("/search"));
      expect(url).toEqual(expect.stringContaining(`&page=${pageNumber}`));
    });

    test("should return empty URL", () => {
      const url = createURL({ page: 1 });

      expect(url).toEqual(expect.stringMatching(""));
    });

    test("should create URL from query null state", () => {
      const url = createURL({ query: null });

      expect(url).toEqual(expect.stringMatching("/search"));
    });
  });

  describe("searchStateToUrl", () => {
    test("should create a url from searchState", () => {
      let url = searchStateToUrl(queryBuilder());
      expect(url).toEqual(expect.stringContaining("/search"));

      url = searchStateToUrl();
      expect(url).toEqual(expect.stringMatching(""));
    });
  });
});

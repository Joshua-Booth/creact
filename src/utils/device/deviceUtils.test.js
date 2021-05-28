// Constants
import { MAX_MOBILE_SIZE, MAX_TABLET_LARGE_SIZE } from "constants/screenSize";

// Utilities
import { isMobile, isDesktop, isTabletOnly } from ".";

describe("Device Utilities", () => {
  describe("screen size", () => {
    describe("is mobile", () => {
      const cases = [
        [300, true],
        [1000, false],
        [MAX_TABLET_LARGE_SIZE - 1, true],
        [MAX_TABLET_LARGE_SIZE, true],
        [MAX_TABLET_LARGE_SIZE + 1, false],
      ];

      test.each(cases)(
        "w/ screen width of %p the mobile size status should be %p",
        (size, expected) => {
          const result = isMobile(size);
          expect(result).toEqual(expected);
        }
      );
    });

    describe("is desktop", () => {
      const cases = [
        [300, false],
        [1000, true],
        [MAX_TABLET_LARGE_SIZE, false],
        [MAX_TABLET_LARGE_SIZE + 1, true],
      ];

      test.each(cases)(
        "w/ screen width of %p the desktop size status should be %p",
        (size, expected) => {
          const result = isDesktop(size);
          expect(result).toEqual(expected);
        }
      );
    });

    describe("is tablet only", () => {
      const cases = [
        [300, false],
        [1000, false],
        [MAX_MOBILE_SIZE, false],
        [MAX_MOBILE_SIZE + 1, true],
        [MAX_TABLET_LARGE_SIZE - 1, true],
        [MAX_TABLET_LARGE_SIZE, true],
        [MAX_TABLET_LARGE_SIZE + 1, false],
      ];

      test.each(cases)(
        "w/ screen width of %p the tablet only size status should be %p",
        (size, expected) => {
          const result = isTabletOnly(size);
          expect(result).toEqual(expected);
        }
      );
    });
  });
});

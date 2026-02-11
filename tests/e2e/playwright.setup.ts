import type { NetworkFixture } from "@msw/playwright";

import { createNetworkFixture } from "@msw/playwright";
import { expect, test as testBase } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";

import { handlers } from "./mocks";

interface TestFixtures {
  network: NetworkFixture;
  autoCodeCoverage: void;
}

export const test = testBase.extend<TestFixtures>({
  network: createNetworkFixture({
    initialHandlers: handlers,
  }),
  autoCodeCoverage: [
    async ({ page }, use, testInfo) => {
      const enabled = !!process.env.COVERAGE;
      if (enabled) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false });
      }
      await use();
      if (enabled) {
        const jsCoverage = await page.coverage.stopJSCoverage();
        await addCoverageReport(jsCoverage, testInfo);
      }
    },
    { auto: true },
  ],
});

/** Timeout for the hydration check (controls becoming enabled). */
export const HYDRATION_TIMEOUT = 10_000;

export { expect };

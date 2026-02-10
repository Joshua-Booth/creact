import type { NetworkFixture } from "@msw/playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { createNetworkFixture } from "@msw/playwright";
import { expect, test as testBase } from "@playwright/test";

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
      await use();
      if (enabled) {
        try {
          const coverage = await page.evaluate(
            () =>
              (
                globalThis as unknown as {
                  __coverage__?: Record<string, unknown>;
                }
              ).__coverage__
          );
          if (coverage) {
            const outputDir = path.resolve("coverage/e2e");
            mkdirSync(outputDir, { recursive: true });
            const filename = `coverage-${testInfo.testId}.json`;
            writeFileSync(
              path.join(outputDir, filename),
              JSON.stringify(coverage)
            );
          }
        } catch {
          // Coverage collection can fail when the page navigated away
          // (e.g. login/signup redirecting to /dashboard), destroying
          // the execution context. This is expected and non-fatal.
        }
      }
    },
    { auto: true },
  ],
});

/** Timeout for the hydration check (controls becoming enabled). */
export const HYDRATION_TIMEOUT = 10_000;

export { expect };

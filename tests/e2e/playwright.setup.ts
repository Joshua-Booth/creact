import type { NetworkFixture } from "@msw/playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { createNetworkFixture } from "@msw/playwright";
import { expect, Page, test as testBase } from "@playwright/test";

import { handlers } from "./mocks";

interface TestFixtures {
  network: NetworkFixture;
  autoCodeCoverage: void;
}

async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(
    () => document.getElementById("app")?.hasAttribute("data-hydrated"),
    { timeout: 20000 }
  );
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
      }
    },
    { auto: true },
  ],
});

export { expect, waitForHydration };

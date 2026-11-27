import type { NetworkFixture } from "@msw/playwright";
import type { Page } from "@playwright/test";

import { defineNetworkFixture } from "@msw/playwright";
import { expect, test as testBase } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";

import { handlers } from "./mocks";

interface TestFixtures {
  network: NetworkFixture;
  autoCodeCoverage: void;
}

export const test = testBase.extend<TestFixtures>({
  network: [
    async ({ context }, use) => {
      const network = defineNetworkFixture({
        context,
        handlers,
      });

      await network.enable();
      await use(network);
      await network.disable();
    },
    { auto: true },
  ],
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

export const HYDRATION_TIMEOUT = 10_000;

export async function loginAsUser(
  page: Page,
  { email = "test@mail.com", password = "password" } = {}
): Promise<void> {
  await page.goto("/login");

  const submitButton = page.getByRole("button", { name: /sign in/i });
  await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await submitButton.click();
  await page.waitForURL(/\/dashboard/);
}

export { expect };

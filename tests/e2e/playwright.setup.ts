/* eslint-disable react-hooks/rules-of-hooks -- `use` is Playwright's fixture callback, not a React Hook */
import { expect, Page, test as testBase } from "@playwright/test";

import type { MockHandler } from "./mocks";
import { handlers } from "./mocks";

interface NetworkMock {
  use: (handler: MockHandler) => Promise<void>;
}

interface TestFixtures {
  network: NetworkMock;
}

async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(
    () => document.getElementById("app")?.hasAttribute("data-hydrated"),
    { timeout: 10000 }
  );
}

async function applyHandler(page: Page, handler: MockHandler): Promise<void> {
  await page.route(handler.pattern, async (route) => {
    await route.fulfill({
      status: handler.status,
      contentType: "application/json",
      body: JSON.stringify(handler.body),
    });
  });
}

export const test = testBase.extend<TestFixtures>({
  network: async ({ page }, use) => {
    // Apply default handlers
    for (const handler of handlers) {
      await applyHandler(page, handler);
    }

    const network: NetworkMock = {
      use: async (handler: MockHandler) => {
        // Override with new handler (runs before default due to Playwright's route ordering)
        await applyHandler(page, handler);
      },
    };

    await use(network);

    // Cleanup: unroute all handlers
    for (const handler of handlers) {
      await page.unroute(handler.pattern);
    }
  },
});

export { expect, waitForHydration };

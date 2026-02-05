import type { NetworkFixture } from "@msw/playwright";

import { createNetworkFixture } from "@msw/playwright";
import { expect, Page, test as testBase } from "@playwright/test";

import { handlers } from "./mocks";

interface TestFixtures {
  network: NetworkFixture;
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
});

export { expect, waitForHydration };

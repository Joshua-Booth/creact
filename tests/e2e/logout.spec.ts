import { errorResponses } from "./mocks";
import { expect, loginAsUser, test } from "./playwright.setup";

test.describe("Logout", () => {
  test("authenticated user can logout successfully", async ({
    network: _network,
    page,
  }) => {
    await loginAsUser(page);

    // Navigate to logout
    await page.goto("/logout");

    // Should show the logout confirmation page
    await expect(
      page.getByRole("heading", { name: /signed out/i })
    ).toBeVisible();
    await expect(page.getByText(/safely signed out/i)).toBeVisible();

    // Should have a "Back to login" link
    const backToLogin = page.getByRole("link", { name: /back to login/i });
    await expect(backToLogin).toBeVisible();

    // Clicking "Back to login" should navigate to /login
    await backToLogin.click();
    await page.waitForURL(/\/login/);
  });

  test("clears session and redirects even when the API fails", async ({
    network,
    page,
  }) => {
    await loginAsUser(page);

    // Make the logout endpoint return a 500 so the server-side
    // token invalidation fails. The client should still clear the
    // token locally and show the signed-out page.
    await network.use(errorResponses.logout.serverError());

    await page.goto("/logout");

    // Despite the API error, the user should see the signed-out page
    await expect(
      page.getByRole("heading", { name: /signed out/i })
    ).toBeVisible();
    await expect(page.getByText(/safely signed out/i)).toBeVisible();

    // Navigating to a protected route should redirect to login
    // because the local token was cleared
    const backToLogin = page.getByRole("link", { name: /back to login/i });
    await backToLogin.click();
    await page.waitForURL(/\/login/);
  });

  test("unauthenticated user is redirected to login", async ({
    network: _network,
    page,
  }) => {
    // Navigate directly to /logout without being logged in
    await page.goto("/logout");

    // Should redirect to /login since there's no auth token
    await page.waitForURL(/\/login/);
  });
});

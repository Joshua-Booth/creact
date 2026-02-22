import { expect, HYDRATION_TIMEOUT, test } from "./playwright.setup";

test.describe("Logout", () => {
  test("authenticated user can logout successfully", async ({
    network: _network,
    page,
  }) => {
    // Login first to get an authenticated session
    await page.goto("/login");

    const submitButton = page.getByRole("button", { name: /sign in/i });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    await page.getByLabel("Email").fill("test@mail.com");
    await page.getByLabel("Password").fill("password");
    await submitButton.click();
    await page.waitForURL(/\/dashboard/);

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

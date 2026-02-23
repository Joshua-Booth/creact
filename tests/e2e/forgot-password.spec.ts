import { expect, HYDRATION_TIMEOUT, test } from "./playwright.setup";

test.describe("Forgot Password", () => {
  test("user can request a password reset", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/forgot-password");

    const submitButton = page.getByRole("button", {
      name: /send reset link/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    await page.getByLabel("Email").fill("user@mail.com");
    await submitButton.click();

    // Should show success message (anti-enumeration: always shows success)
    await expect(
      page.getByRole("heading", { name: /check your email/i })
    ).toBeVisible();
    await expect(
      page.getByText(/sent password reset instructions/i)
    ).toBeVisible();
  });

  test("shows validation error for empty email", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/forgot-password");

    const submitButton = page.getByRole("button", {
      name: /send reset link/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    // Submit without filling email
    await submitButton.click();

    // Should show validation error and stay on the page
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("has a link back to login", async ({ network: _network, page }) => {
    await page.goto("/forgot-password");

    const submitButton = page.getByRole("button", {
      name: /send reset link/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    const backToLogin = page.getByRole("link", { name: /back to login/i });
    await expect(backToLogin).toBeVisible();

    await backToLogin.click();
    await page.waitForURL(/\/login/);
  });

  test("success page has link back to login", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/forgot-password");

    const submitButton = page.getByRole("button", {
      name: /send reset link/i,
    });
    await expect(submitButton).toBeEnabled({ timeout: HYDRATION_TIMEOUT });

    await page.getByLabel("Email").fill("user@mail.com");
    await submitButton.click();

    // Wait for success state
    await expect(
      page.getByRole("heading", { name: /check your email/i })
    ).toBeVisible();

    // Click "Back to login" link on success page
    const backToLogin = page.getByRole("link", { name: /back to login/i });
    await expect(backToLogin).toBeVisible();
    await backToLogin.click();
    await page.waitForURL(/\/login/);
  });
});

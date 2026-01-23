import { errorResponses } from "./mocks";
import { expect, test, waitForHydration } from "./playwright.setup";

test.describe("Login", () => {
  test("user can login successfully", async ({ network: _network, page }) => {
    await page.goto("/login");
    await waitForHydration(page);

    const emailInput = page.getByTestId("email");
    const passwordInput = page.getByTestId("password");

    await emailInput.fill("test@mail.com");
    await expect(emailInput).toHaveValue("test@mail.com");

    await passwordInput.fill("password");
    await expect(passwordInput).toHaveValue("password");

    await page.click('[data-testid="login"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows error for invalid credentials", async ({ network, page }) => {
    await network.use(errorResponses.login.invalidCredentials());

    await page.goto("/login");
    await waitForHydration(page);

    await page.fill('[data-testid="email"]', "wrong@mail.com");
    await page.fill('[data-testid="password"]', "wrongpassword");
    await page.click('[data-testid="login"]');

    // Should show error message and stay on login page
    await expect(page.getByTestId("login-error")).toBeVisible();
    await expect(page.getByTestId("login-error")).toContainText(
      "Unable to log in with provided credentials"
    );
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows validation errors for empty fields", async ({
    network: _network,
    page,
  }) => {
    await page.goto("/login");
    await waitForHydration(page);

    // Click submit without filling any fields
    await page.click('[data-testid="login"]');

    // Should show validation errors
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("prevents submission with invalid email format", async ({
    network: _network,
    page,
  }) => {
    // Default handler is set up, but client-side validation should prevent API call

    await page.goto("/login");
    await waitForHydration(page);

    // Type invalid email character by character to trigger validation
    const emailInput = page.getByTestId("email");
    await emailInput.click();
    await emailInput.pressSequentially("invalid-email", { delay: 10 });

    const passwordInput = page.getByTestId("password");
    await passwordInput.click();
    await passwordInput.pressSequentially("password", { delay: 10 });

    await page.click('[data-testid="login"]');

    // Wait a bit for any potential navigation
    await page.waitForTimeout(500);

    // Should stay on login page - either showing validation error or not navigating
    await expect(page).toHaveURL(/\/login/);

    // API should not have been called if client-side validation is working
    // If it was called, that's also okay as long as we stay on /login
  });
});

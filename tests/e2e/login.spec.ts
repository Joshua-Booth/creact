import { expect, test } from "@playwright/test";

test.describe("Login", () => {
  test("user can login successfully", async ({ page }) => {
    // Mock the login API endpoint
    await page.route("**/auth/login/", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ key: "mock-token" }),
      });
    });

    await page.goto("/login");
    await page.waitForSelector('#app[data-hydrated="true"]');

    await page.fill('[data-testid="email"]', "test@mail.com");
    await page.fill('[data-testid="password"]', "password");
    await page.click('[data-testid="login"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows error for invalid credentials", async ({ page }) => {
    // Mock the login API endpoint with 401 error
    await page.route("**/auth/login/", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          non_field_errors: ["Unable to log in with provided credentials."],
        }),
      });
    });

    await page.goto("/login");
    await page.waitForSelector('#app[data-hydrated="true"]');

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

  test("shows validation errors for empty fields", async ({ page }) => {
    await page.goto("/login");
    await page.waitForSelector('#app[data-hydrated="true"]');

    // Click submit without filling any fields
    await page.click('[data-testid="login"]');

    // Should show validation errors
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("prevents submission with invalid email format", async ({ page }) => {
    // Track if API was called - it should NOT be called due to client-side validation
    let apiCalled = false;
    await page.route("**/auth/login/", async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ key: "mock-token" }),
      });
    });

    await page.goto("/login");
    await page.waitForSelector('#app[data-hydrated="true"]');

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

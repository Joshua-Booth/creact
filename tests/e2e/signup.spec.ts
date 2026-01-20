import { expect, test } from "@playwright/test";

test.describe("Signup", () => {
  test("user can signup successfully", async ({ page }) => {
    // Mock the signup API endpoint
    await page.route("**/auth/signup/", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ key: "mock-token" }),
      });
    });

    await page.goto("/signup");
    await page.waitForLoadState("networkidle");

    await page.fill('[data-testid="email"]', "newuser@mail.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.fill('[data-testid="confirm-password"]', "Password123");
    await page.click('[data-testid="signup"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows error when email already exists", async ({ page }) => {
    // Mock the signup API endpoint with 400 error
    await page.route("**/auth/signup/", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          email: ["A user with this email already exists."],
        }),
      });
    });

    await page.goto("/signup");
    await page.waitForLoadState("networkidle");

    await page.fill('[data-testid="email"]', "existing@mail.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.fill('[data-testid="confirm-password"]', "Password123");
    await page.click('[data-testid="signup"]');

    // Should show error message and stay on signup page
    await expect(page.getByTestId("signup-error")).toBeVisible();
    await expect(page.getByTestId("signup-error")).toContainText(
      "A user with this email already exists"
    );
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows validation errors for empty fields", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("networkidle");

    // Click submit without filling any fields
    await page.click('[data-testid="signup"]');

    // Should show validation errors
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("networkidle");

    await page.fill('[data-testid="email"]', "test@mail.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.fill('[data-testid="confirm-password"]', "DifferentPassword123");
    await page.click('[data-testid="signup"]');

    // Should show password mismatch error and stay on signup page
    await expect(page.getByRole("alert")).toContainText(
      "Passwords do not match"
    );
    await expect(page).toHaveURL(/\/signup/);
  });
});

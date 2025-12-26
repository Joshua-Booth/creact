import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('user can login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'test@mail.com')
    await page.fill('[data-testid="password"]', 'password')
    await page.click('[data-testid="login"]')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})

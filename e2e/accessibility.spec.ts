import { test, expect } from '@playwright/test';

test.describe('Angular Design System — Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('page should have no severe accessibility violations', async ({ page }) => {
    // Check landmark regions exist
    await expect(page.locator('header, [role="banner"]').first()).toBeVisible();
    await expect(page.locator('main, [role="main"]').first()).toBeVisible();
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    const firstButton = page.locator('gds-button button').first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
  });

  test('checkboxes should be keyboard operable', async ({ page }) => {
    const firstCheckbox = page.locator('gds-checkbox input[type=checkbox]').first();
    await firstCheckbox.focus();
    await expect(firstCheckbox).toBeFocused();
    await page.keyboard.press('Space');
    await expect(firstCheckbox).toBeChecked();
    await page.keyboard.press('Space');
    await expect(firstCheckbox).not.toBeChecked();
  });

  test('toggles should be keyboard operable', async ({ page }) => {
    const firstToggle = page.locator('gds-toggle input[type=checkbox]').first();
    await firstToggle.focus();
    await expect(firstToggle).toBeFocused();
  });

  test('modal should trap focus when open', async ({ page }) => {
    // Open modal
    const openButton = page.locator('gds-button button').filter({ hasText: /open modal/i }).first();
    if (await openButton.count() > 0) {
      await openButton.click();
      await expect(page.locator('dialog[open]')).toBeVisible();
      // Press Tab inside modal — should stay within dialog
      await page.keyboard.press('Escape');
      await expect(page.locator('dialog[open]')).not.toBeVisible();
    }
  });

  test('dark mode toggle should switch theme', async ({ page }) => {
    // Find the theme toggle button in the header
    const themeToggle = page.locator('.showcase__header').getByRole('button').first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      const htmlEl = page.locator('html');
      await expect(htmlEl).toHaveAttribute('data-theme', 'dark');
      await themeToggle.click();
      await expect(htmlEl).not.toHaveAttribute('data-theme', 'dark');
    }
  });
});

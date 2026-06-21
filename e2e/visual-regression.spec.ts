import { test, expect } from '@playwright/test';

test.describe('Angular Design System — Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // Helper: force light mode before each snapshot
  async function setTheme(page: any, theme: 'light' | 'dark') {
    await page.evaluate((t: string) => {
      if (t === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }, theme);
    // Allow transitions to settle
    await page.waitForTimeout(450);
  }

  test('full page — light mode', async ({ page }) => {
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('full-page-light.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('full page — dark mode', async ({ page }) => {
    await setTheme(page, 'dark');
    await expect(page).toHaveScreenshot('full-page-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test('button section — light', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Button' }).first();
    await expect(section).toHaveScreenshot('section-button-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('button section — dark', async ({ page }) => {
    await setTheme(page, 'dark');
    const section = page.locator('.showcase__section').filter({ hasText: 'Button' }).first();
    await expect(section).toHaveScreenshot('section-button-dark.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('input section — light', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Input' }).first();
    await expect(section).toHaveScreenshot('section-input-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('badge section', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Badge' }).first();
    await expect(section).toHaveScreenshot('section-badge-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('checkbox section — light', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Checkbox' }).first();
    await expect(section).toHaveScreenshot('section-checkbox-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('checkbox section — dark', async ({ page }) => {
    await setTheme(page, 'dark');
    const section = page.locator('.showcase__section').filter({ hasText: 'Checkbox' }).first();
    await expect(section).toHaveScreenshot('section-checkbox-dark.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('toggle section — light', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Toggle' }).first();
    await expect(section).toHaveScreenshot('section-toggle-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('toggle section — dark', async ({ page }) => {
    await setTheme(page, 'dark');
    const section = page.locator('.showcase__section').filter({ hasText: 'Toggle' }).first();
    await expect(section).toHaveScreenshot('section-toggle-dark.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('select section', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Select' }).first();
    await expect(section).toHaveScreenshot('section-select-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('card section', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Card' }).first();
    await expect(section).toHaveScreenshot('section-card-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('navbar section', async ({ page }) => {
    await setTheme(page, 'light');
    const section = page.locator('.showcase__section').filter({ hasText: 'Navbar' }).first();
    await expect(section).toHaveScreenshot('section-navbar-light.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

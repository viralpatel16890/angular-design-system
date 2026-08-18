import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility scans powered by axe-core.
 *
 * These tests exercise the real component markup — the showcase gallery's
 * resting state plus a handful of interactive states (open modal, open
 * select dropdown, focused tooltip) where violations commonly hide because
 * they only exist once a component is expanded/opened.
 *
 * Run locally with `npm run test:a11y`. This spec is NOT wired into CI —
 * it is a local, on-demand check only (see playwright.config.ts / README).
 */
test.describe('Angular Design System — axe-core accessibility scans', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('showcase main page has no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('open modal has no axe violations', async ({ page }) => {
    const openButton = page
      .locator('ds-button button')
      .filter({ hasText: /open modal/i })
      .first();
    await openButton.click();
    await expect(page.locator('dialog[open]')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      // Scope to the open dialog — the rest of the page is inert behind it
      // and is already covered by the main-page scan above.
      .include('dialog[open]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('open select dropdown has no axe violations', async ({ page }) => {
    const trigger = page.getByRole('combobox', { name: /framework/i }).first();
    await trigger.click();
    await expect(page.getByRole('listbox').first()).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('focused tooltip has no axe violations', async ({ page }) => {
    const tooltipTrigger = page.getByRole('button', { name: 'Top', exact: true });
    await tooltipTrigger.focus();
    await expect(page.getByRole('tooltip', { name: /appears above/i })).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

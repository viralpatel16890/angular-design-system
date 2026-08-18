import { test, expect, type Locator, type Page } from '@playwright/test';

// This spec is scoped (via playwright.config.ts `testMatch`/`testIgnore`) to
// run only on the `chromium-mobile-sm` (375px — below the `$breakpoint-sm`
// 640px token) and `chromium-mobile-md` (700px — between `$breakpoint-sm`
// and `$breakpoint-md` 768px) projects. Both widths sit under the navbar's
// `max-width: 768px` collapse breakpoint
// (projects/angular-ds/src/lib/components/navbar/navbar.component.scss),
// so every test below should observe the mobile/collapsed layout.

test.describe('Angular Design System — Mobile / Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  function navbarSection(page: Page): Locator {
    return page.locator('.showcase__section').filter({ hasText: 'Navbar' }).first();
  }

  function firstNavbar(page: Page): Locator {
    return navbarSection(page).locator('ds-navbar').first();
  }

  test('navbar collapses to a hamburger menu below the md breakpoint', async ({ page }) => {
    const navbar = firstNavbar(page);

    // Desktop nav links and actions are hidden by the mobile media query...
    await expect(navbar.locator('.ds-navbar__nav')).toBeHidden();
    await expect(navbar.locator('.ds-navbar__actions')).toBeHidden();

    // ...and the hamburger button takes their place, closed by default.
    const burger = navbar.locator('.ds-navbar__burger');
    await expect(burger).toBeVisible();
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await expect(navbar.locator('#ds-navbar-mobile')).toHaveCount(0);
  });

  test('hamburger opens a mobile menu with visible, usable nav links', async ({ page }) => {
    const navbar = firstNavbar(page);
    const burger = navbar.locator('.ds-navbar__burger');

    await burger.click();

    // The menu state — not just "didn't crash" — actually renders: the
    // panel is visible, aria-expanded flips, and each nav item is a real,
    // visible, clickable link inside it.
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    const mobileMenu = navbar.locator('#ds-navbar-mobile');
    await expect(mobileMenu).toBeVisible();

    const mobileLinks = mobileMenu.locator('.ds-navbar__mobile-link');
    const linkCount = await mobileLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < linkCount; i++) {
      await expect(mobileLinks.nth(i)).toBeVisible();
    }

    // Visual check of the fully expanded mobile drawer.
    await expect(navbar).toHaveScreenshot('navbar-mobile-menu-open.png', {
      maxDiffPixelRatio: 0.02,
    });

    // Selecting a link closes the drawer again.
    await mobileLinks.first().click();
    await expect(mobileMenu).toHaveCount(0);
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  test('mobile menu closes on Escape', async ({ page }) => {
    const navbar = firstNavbar(page);
    const burger = navbar.locator('.ds-navbar__burger');

    await burger.click();
    await expect(navbar.locator('#ds-navbar-mobile')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(navbar.locator('#ds-navbar-mobile')).toHaveCount(0);
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  test('navbar section — collapsed mobile layout screenshot', async ({ page }) => {
    const section = navbarSection(page);
    await expect(section).toHaveScreenshot('section-navbar-mobile-collapsed.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});

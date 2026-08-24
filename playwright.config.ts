import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI'] ? 'github' : 'html',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      // Existing desktop project — behavior/test selection left unchanged.
      // Only explicitly excludes the new mobile-only spec so this project's
      // test set stays identical to what it ran before mobile coverage was
      // added.
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /responsive\.spec\.ts/,
    },
    {
      // Mobile viewport below `$breakpoint-sm` (640px, see
      // projects/angular-ds/src/lib/tokens/_breakpoints.scss) — a typical
      // phone width. Runs only the mobile/responsive spec.
      name: 'chromium-mobile-sm',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
      },
      testMatch: /responsive\.spec\.ts/,
    },
    {
      // Mobile viewport between `$breakpoint-sm` (640px) and
      // `$breakpoint-md` (768px). Components collapse to their mobile
      // layout at `max-width: 768px`, so this width should still render
      // the collapsed/mobile state. Runs only the mobile/responsive spec.
      name: 'chromium-mobile-md',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 700, height: 900 },
      },
      testMatch: /responsive\.spec\.ts/,
    },
  ],

  // Runs showcase dev server before tests when not in CI
  webServer: {
    command: 'npx ng serve showcase --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});

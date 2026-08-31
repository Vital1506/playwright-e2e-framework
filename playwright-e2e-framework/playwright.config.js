// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Scalable Playwright configuration.
 * - Cross-browser: Chromium, Firefox, WebKit
 * - CI-aware: retries, workers, and reporters adapt to local vs CI runs
 * - Full tracing / screenshots / video on failure for fast debugging
 * Docs: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  // Maximum time one test can run.
  timeout: 30 * 1000,

  expect: {
    // Maximum time expect() should wait for a condition to be met.
    timeout: 5000,
  },

  // Fail the build on CI if test.only is accidentally left in the source code.
  forbidOnly: !!process.env.CI,

  // Retry failed tests to guard against flakiness, more aggressively on CI.
  retries: process.env.CI ? 2 : 0,

  // Parallelism: cap workers on CI to keep runs stable/deterministic.
  workers: process.env.CI ? 2 : undefined,
  fullyParallel: true,

  // Multiple reporters: HTML report for humans, list for console, JUnit for CI dashboards.
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],

  // Shared settings applied to every project below.
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Collect a trace on first retry so failures are debuggable via the Trace Viewer.
    trace: 'on-first-retry',

    // Capture a screenshot only when a test fails.
    screenshot: 'only-on-failure',

    // Record video only when retrying a failed test.
    video: 'retain-on-failure',

    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },

  // Cross-browser execution matrix.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Optional mobile viewport coverage — enable as the suite grows.
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      grep: /@mobile/,
    },
  ],

  outputDir: 'test-results/',
});

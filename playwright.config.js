const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  /* Look for test files in the "tests" directory, relative to this configuration file. */
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /*Glob pattern or regular expression to ignore test files. See https://playwright.dev/docs/test-configuration#testignore */
  testignore: ['**/tests/e2e/ignore/**'],
  /*Glob pattern or regular expression to match test files. See https://playwright.dev/docs/test-configuration#testmatch */
  testMatch: '*.spec.ts',
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',

  // path to the global setup files.
  //globalSetup: require.resolve('./global-setup'),

  // path to the global teardown files.
  //globalTeardown: require.resolve('./global-teardown'),

  // Each test is given 30 seconds.
  timeout: 30000,

  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: 5000,

    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different, unset by default.
      maxDiffPixels: 10,
    },

    toMatchSnapshot: {
      // An acceptable ratio of pixels that are different to the
      // total amount of pixels, between 0 and 1.
      maxDiffPixelRatio: 0.1,
    },
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //   /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://demo.playwright.dev/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry', // record traces on first retry of each test

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      viewport: { width: 1280, height: 720 },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      viewport: { width: 1280, height: 720 },
    },

    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});


import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  testMatch: ["**/*.spec.ts", "**/*.spec.js"],
  outputDir: "test-results",
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
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "todo-mvc-chromium",
      testMatch: "**/tests/todo-mvc/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://demo.playwright.dev/",
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "todo-mvc-firefox",
      testMatch: "**/tests/todo-mvc/**/*.spec.ts",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://demo.playwright.dev/",
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "ui-testing-playground-chromium",
      testMatch: "**/tests/ui-testing-playground/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://uitestingplayground.com/",
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "ui-testing-playground-firefox",
      testMatch: "**/tests/ui-testing-playground/**/*.spec.ts",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "http://uitestingplayground.com/",
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "orange-hrm-chromium",
      testMatch: "**/tests/orange-hrm/**/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});

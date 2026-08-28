# Playwright Test Framework

This workspace contains a Playwright-based end-to-end testing setup for web applications. The current configuration uses TypeScript test specs, multi-browser execution, and HTML reporting.

## What’s included

- Playwright Test runner with TypeScript support
- Browser projects for Chromium and Firefox
- HTML report generation and test artifacts in the output folder
- A base URL configured for the demo Playwright site

## Prerequisites

- Node.js 18 or newer
- npm

## Setup

Install the project dependencies:

```bash
npm install
```

Install the browser binaries required by Playwright:

```bash
npx playwright install
```

Optional but recommended: install the VS Code extension "Playwright Test for VS Code".

## Running tests

Run all tests:

```bash
npx playwright test
```

Run a specific spec:

```bash
npx playwright test tests/todo.spec.ts
```

Run a specific browser project:

```bash
npx playwright test --project=chromium
```

Open the HTML report after a run:

```bash
npx playwright show-report
```

## Project structure

- [playwright.config.ts](playwright.config.ts) – main Playwright configuration
- [tests](tests) – test specifications
- [pages](pages) – page objects grouped by application
- [tests/fixtures](tests/fixtures) – custom Playwright fixtures
- [test-plans](test-plans) – test plans and exploratory documentation
- [test-results](test-results) – generated screenshots, traces, and other artifacts
- [playwright-report](playwright-report) – generated HTML report

## Notes

- Test files follow the `*.spec.ts` or `*.spec.js` pattern.
- The default test timeout is 30 seconds and the assertion timeout is 5 seconds.
- Suite-specific projects define the application base URL and browser coverage.
- CI runs all configured projects and uploads the HTML report.

## Reference

- https://playwright.dev/docs/intro

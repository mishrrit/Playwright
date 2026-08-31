# Playwright Test Framework

This workspace contains a Playwright-based end-to-end testing setup for web applications. The framework supports multiple test suites with Page Object Model architecture, custom fixtures, and multi-browser execution.

## What's Included

- **Playwright Test runner** with TypeScript and JavaScript support
- **Multi-browser projects**: Chromium and Firefox for each test suite
- **Page Object Model (POM)** architecture for maintainable tests
- **Custom fixtures** for authentication and test setup
- **HTML report generation** with screenshots, traces, and artifacts
- **Pre-configured base URLs** for demo applications

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

## Running Tests

Run all tests across all projects:

```bash
npm test
# or
npx playwright test
```

### Run Specific Test Suites

```bash
# TodoMVC tests
npm run test:todo-mvc

# UI Testing Playground tests
npm run test:ui-testing-playground

# OrangeHRM tests
npm run test:orange-hrm
```

### Run with Options

```bash
# Run in headed mode (visible browser)
npm run test:headed

# Run with Playwright UI mode
npm run test:ui

# Run specific browser project
npx playwright test --project=todo-mvc-chromium
npx playwright test --project=orange-hrm-chromium

# Open HTML report after a run
npm run test:report
```

## Project Structure

```text
.
├── playwright.config.ts          # Main Playwright configuration
├── package.json                  # Dependencies and npm scripts
├── tests/                        # Test specifications
│   ├── fixtures/                 # Custom Playwright fixtures
│   │   └── orange-hrm.ts         # OrangeHRM login fixture
│   ├── orange-hrm/               # OrangeHRM test specs (JavaScript)
│   │   ├── add-delete-employee.spec.js
│   │   └── testAddDeleteEmployee.spec.js
│   ├── todo-mvc/                 # TodoMVC test specs (TypeScript)
│   │   ├── add-todos.spec.ts
│   │   ├── annotations.spec.ts
│   │   ├── seed.spec.ts
│   │   ├── testCodeGen.spec.ts
│   │   └── todo.spec.ts
│   └── ui-testing-playground/    # UI Testing Playground specs (TypeScript)
│       ├── ajax-data.spec.ts
│       ├── class-attribute.spec.ts
│       ├── click-event.spec.ts
│       ├── client-side-delay.spec.ts
│       ├── dynamic-id.spec.ts
│       ├── dynamic-table.spec.ts
│       ├── hidden-layers-click.spec.ts
│       ├── hidden-layers-not-clickable.spec.ts
│       ├── load-delay.spec.ts
│       ├── mouse-over-button.spec.ts
│       ├── mouse-over-link.spec.ts
│       ├── non-breaking-space.spec.ts
│       ├── overlapped-element.spec.ts
│       ├── pom-refactored.spec.ts
│       ├── progress-bar-start.spec.ts
│       ├── progress-bar-stop.spec.ts
│       ├── sample-app-enter.spec.ts
│       ├── sample-app-login.spec.ts
│       ├── scroll-bar.spec.ts
│       ├── shadow-dom.spec.ts
│       ├── text-input.spec.ts
│       ├── verify-text.spec.ts
│       ├── visibility-overlapped.spec.ts
│       ├── visibility-removed.spec.ts
│       └── visibility-zero-width.spec.ts
├── pages/                        # Page Objects (POM)
│   ├── orange-hrm/               # OrangeHRM Page Objects (JavaScript)
│   │   ├── BasePage.js           # Base page class
│   │   ├── LoginPage.js          # Login page actions
│   │   └── dashboard/
│   │       └── pim/
│   │           ├── AddEmployeePage.js    # Add employee actions
│   │           └── EmployeeInfoPage.js   # Employee list/search/delete
│   └── ui-testing-playground/  # UI Testing Playground Page Objects (TypeScript)
│       ├── BasePage.ts
│       ├── AjaxDataPage.ts
│       ├── ClassAttributePage.ts
│       ├── ClickEventPage.ts
│       ├── ClientSideDelayPage.ts
│       ├── DynamicIdPage.ts
│       ├── DynamicTablePage.ts
│       ├── HiddenLayersPage.ts
│       ├── LoadDelayPage.ts
│       ├── MouseOverPage.ts
│       ├── NonBreakingSpacePage.ts
│       ├── OverlappedElementPage.ts
│       ├── ProgressBarPage.ts
│       ├── SampleAppPage.ts
│       ├── ScrollBarPage.ts
│       ├── ShadowDomPage.ts
│       ├── TextInputPage.ts
│       ├── VerifyTextPage.ts
│       └── VisibilityPage.ts
├── test-plans/                   # Test plans and exploratory documentation
│   ├── basic-operations.md       # TodoMVC basic operations plan
│   └── README.md
├── test-results/                 # Generated screenshots, traces, artifacts
├── playwright-report/            # Generated HTML report
└── support/                      # Global setup/teardown (currently empty)
    ├── global-setup/
    └── global-teardown/
```

## Test Suites Overview

| Suite | Application | Language | Test Files | Browser Projects |
| ------- | ------------- | ---------- | ------------ | ------------------ |
| **todo-mvc** | <https://demo.playwright.dev/todomvc> | TypeScript | 5 | Chromium, Firefox |
| **ui-testing-playground** | <http://uitestingplayground.com> | TypeScript | 21 | Chromium, Firefox |
| **orange-hrm** | <https://opensource-demo.orangehrmlive.com> | JavaScript | 2 | Chromium |

### OrangeHRM Test Suite

- Uses **Page Object Model** with JavaScript
- Custom **login fixture** (`tests/fixtures/orange-hrm.ts`) handles authentication
- Tests cover: Add Employee, Search Employee, Delete Employee
- Base URL: `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`

### UI Testing Playground

- 21 test scenarios covering various UI challenges:
  - Dynamic IDs, AJAX data, Client-side delays
  - Hidden layers, Overlapped elements, Shadow DOM
  - Progress bars, Scroll bars, Mouse interactions
  - Visibility, Text verification, Non-breaking spaces

### TodoMVC

- Basic CRUD operations for todo items
- Filtering (All/Active/Completed)
- Annotations and seed data tests

## Configuration Highlights

- **Test timeout**: 30 seconds
- **Assertion timeout**: 5 seconds
- **Parallel execution**: Enabled (`fullyParallel: true`)
- **Retries**: 2 on CI, 0 locally
- **Trace collection**: On first retry
- **Screenshot diff tolerance**: 10 pixels / 10% pixel ratio

## Notes

- Test files follow the `*.spec.ts` (TypeScript) or `*.spec.js` (JavaScript) pattern
- Suite-specific projects define application base URLs and browser coverage
- CI runs all configured projects and uploads the HTML report
- Page Objects are organized by application under `pages/`

## Reference

- <https://playwright.dev/docs/intro>
- <https://playwright.dev/docs/test-configuration>
- <https://playwright.dev/docs/page-object-models>

# UI Test Architecture & Conventions

Purpose

- Provide a single canonical reference for agents to create UI tests under `./ui/`.
- Enforce a consistent file structure, naming, metadata and test template so generated tests are uniform and machine-readable.

Location

- All UI tests must live under `./ui/`.
  - Recommended subfolders: `./ui/tests/`, `./ui/support/fixtures/`, `./ui/selectors/`, `./ui/helpers/`.

Directory structure (recommended)

- `ui/tests/<suite-name>/<YYYYMMDD>-<short-title>.spec.ts` — test files
- `ui/support/fixtures/*` — data, mocks, seed files
- `ui/selectors/*.ts` — shared selectors (exported page objects or locators)
- `ui/helpers/*.ts` — test helpers and utilities
- `ui/ui_test_architecture.md` — this file

File naming conventions

- Use kebab-case for files and folders.
- Prefix test files with date (YYYYMMDD) when the test is created by an agent, then a concise title: `20261001-login-flow.spec.ts`.
- Test file extension: `.spec.ts` (Playwright TypeScript). If using another stack, keep the same convention but adjust extension.

Test metadata header (top of each test file)

- Every generated test file must start with a JSON metadata block in a single-line comment or a JS/TS block comment to allow parsing by agents and tools. Example:

/*
{
"id": "ui-login-001",
"suite": "auth",
"title": "Login with valid credentials",
"priority": "P1",
"tags": ["smoke","auth"],
"author": "agent/<agent-name>",
"created": "2026-10-01"
}
*/

- Required fields: `id`, `suite`, `title`, `priority`, `tags`.
- Optional: `owner`, `description`, `relatedTicket`.

Test template (Playwright TypeScript)

- Every test must follow this scaffold so tools and reporters can parse intent.

import { test, expect } from '@playwright/test';
// ...existing code...

<!-- METADATA JSON BLOCK -->

test.describe('auth - Login', () => {
test('Login with valid credentials', async ({ page }) => {
// Arrange
await page.goto('/login');

    // Act
    await page.fill('[data-qa="username"]', 'user@example.com');
    await page.fill('[data-qa="password"]', 'P@ssw0rd');
    await page.click('[data-qa="submit"]');

    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-qa="welcome"]')).toContainText('Welcome');

});
});

Selectors and page objects

- Prefer `data-qa` or `data-testid` attributes for stable selectors. Avoid brittle CSS or full-text selectors.
- Centralize reusable selectors in `ui/selectors/*.ts` and import them.

Test data and fixtures

- Keep test data in `ui/support/fixtures/` and load it from tests.
- Do not hardcode secrets; use environment variables for credentials when available (document in the test metadata if env-vars are required).

Retries, timeouts and flakiness

- Default test timeout: follow Playwright `test.setTimeout()` project config.
- Add `test.skip()` or `test.fixme()` only when necessary and annotate the metadata with `flaky: true` and `reason`.
- Use `expect(locator).toBeVisible({ timeout: X })` for explicit waits as needed.

Reporting and attachments

- Tests should capture screenshots on failure and attach logs when possible. Follow project-wide reporter config.

Code style and linting

- Follow repo conventions: TypeScript, Prettier formatting, ESLint rules. Add imports at top and avoid inline helper duplication.

PR checklist for generated tests

- Metadata block is present and correct.
- Selectors reference `data-qa` or central selector file.
- No secrets hardcoded.
- Test passes locally (agent unit-run) and does not modify production data.

Generator guidelines for agents (how to use this file)

- Always create the metadata JSON block first.
- Place the test in `ui/tests/<suite>/` and name it following the naming convention.
- Use `ui/selectors` references when available; create a new selector file entry if needed.
- Add fixture data under `ui/support/fixtures/` and reference it by relative path.
- Run the test locally (playwright test <file>) and capture the result. If failing due to timing, add targeted waits rather than global sleeps.

Example minimal generated file

/*
{
"id": "ui-login-001",
"suite": "auth",
"title": "Login with valid credentials",
"priority": "P1",
"tags": ["smoke","auth"]
}
*/

import { test, expect } from '@playwright/test';

test.describe('auth', () => {
test('Login with valid credentials', async ({ page }) => {
await page.goto('/login');
await page.fill('[data-qa="username"]', process.env.TEST_USER || 'user@example.com');
await page.fill('[data-qa="password"]', process.env.TEST_PASS || 'P@ssw0rd');
await page.click('[data-qa="submit"]');
await expect(page).toHaveURL('/dashboard');
});
});

---

If you need the generator to follow additional rules (naming prefixes, custom metadata fields, or a different test runner), update this file and notify agents.

# API Test Architecture & Conventions

Purpose

- Provide a canonical reference for agents to create API tests under `./api/`.
- Enforce a consistent file structure, naming, metadata and test template so generated API tests are uniform and machine-readable.

Location

- All API tests must live under `./api/`.
  - Recommended subfolders: `./api/tests/`, `./api/support/fixtures/`, `./api/models/`, `./api/helpers/`.

Directory structure (recommended)

- `api/tests/<suite-name>/<YYYYMMDD>-<short-title>.spec.ts` — test files
- `api/support/fixtures/*` — request/response fixtures, mock data, seed files
- `api/models/*.ts` and `api/models/schemas/*` — DTOs and JSON schemas
- `api/helpers/*.ts` — shared helpers (clients, auth helpers, validators)
- `api/api_test_architecture.md` — this file

File naming conventions

- Use kebab-case for files and folders.
- Prefix test files with date (YYYYMMDD) when the test is created by an agent, then a concise title: `20261001-create-user.spec.ts`.
- Test file extension: `.spec.ts` (Playwright TypeScript) — agents should follow the repo's test framework.

Test metadata header (top of each test file)

- Every generated test file must start with a JSON metadata block in a comment so agents and tooling can parse it. Example:

/*
{
  "id": "api-user-001",
  "suite": "user",
  "title": "Create user with valid payload",
  "priority": "P1",
  "tags": ["smoke","user","api"],
  "author": "agent/<agent-name>",
  "created": "2026-10-01"
}
*/

- Required fields: `id`, `suite`, `title`, `priority`, `tags`.
- Optional: `owner`, `description`, `relatedTicket`, `contracts` (list of schema ids to validate against).

Test template (Playwright + request)

- Use Playwright's `request` fixture or the project's HTTP client wrapper in `api/helpers`.
- Follow this scaffold so tools and reporters can parse intent.

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import userSchema from '../models/schemas/user.schema.json';

const ajv = new Ajv();

/*
METADATA JSON BLOCK
*/

test.describe('user - Create', () => {
  test('Create user with valid payload', async ({ request }) => {
    // Arrange
    const payload = {
      name: 'Jane Doe',
      email: `jane.${Date.now()}@example.com`,
      password: 'P@ssw0rd'
    };

    // Act
    const resp = await request.post(`${process.env.API_BASE_URL}/users`, { data: payload });

    // Assert
    expect(resp.status()).toBe(201);
    const body = await resp.json();
    const valid = ajv.validate(userSchema, body);
    expect(valid).toBeTruthy();
  });
});

Selectors and stability (API-specific)

- Prefer explicit contract/schema validation (AJV or equivalent) over brittle body-field assertions alone.
- Centralize JSON schemas under `api/models/schemas` and DTOs under `api/models`.

Test data and fixtures

- Keep fixtures in `api/support/fixtures/` and load them from tests.
- For sensitive credentials, use environment variables and CI secret stores.
- Keep example request/response payloads as `.json` fixtures when helpful.

Retries, timeouts and flakiness

- Use HTTP status + schema checks as primary assertions.
- For eventually-consistent endpoints, implement polling helpers in `api/helpers/retry.ts` rather than using sleeps in tests.

Reporting and attachments

- Capture raw request/response bodies on failure and attach them to the test report.
- Include request ID or correlation IDs when available.

Code style and linting

- Follow TypeScript, Prettier, and ESLint project conventions.
- Avoid duplicating HTTP client logic inside tests; reuse `api/helpers/client.ts`.

PR checklist for generated API tests

- Metadata block present and accurate.
- Uses JSON schema validation for responses when available.
- No secrets hardcoded.
- Test runs locally via `npx playwright test <file>` and passes against the target environment.

Generator guidelines for agents (how to use this file)

- Always create the metadata JSON block first.
- Place the test in `api/tests/<suite>/` and name it following the naming convention.
- Add or reuse JSON schemas under `api/models/schemas` and reference them in `contracts` metadata when applicable.
- Add fixture data under `api/support/fixtures/` and reference it by relative path.
- Run the test locally and capture results; if timing issues appear, add targeted retry helpers.

Example minimal generated file

/*
{
  "id": "api-user-001",
  "suite": "user",
  "title": "Create user with valid payload",
  "priority": "P1",
  "tags": ["smoke","user","api"]
}
*/

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import userSchema from '../models/schemas/user.schema.json';

const ajv = new Ajv();

test('Create user with valid payload', async ({ request }) => {
  const payload = { name: 'Agent User', email: `agent.${Date.now()}@example.com`, password: 'P@ssw0rd' };
  const resp = await request.post(`${process.env.API_BASE_URL}/users`, { data: payload });
  expect(resp.status()).toBe(201);
  const body = await resp.json();
  expect(ajv.validate(userSchema, body)).toBeTruthy();
});

---

If you want agents to enforce additional rules (specific metadata fields, naming prefixes, or a different test runner), update this file and notify agents.
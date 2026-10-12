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

## Multiple API hosts and automatic endpoint routing

Use [apiFixtures.ts](./fixtures/apiFixtures.ts) and [APIClient.ts](./APIClient.ts), not hardcoded hostnames. Each service fixture receives its own API's request context automatically, so Booking and FakeRest suites can run together or in parallel without changing environment variables between tests.

| API target | Host variable | Default host | Service fixtures |
|---|---|---|---|
| `booking` | `BOOKING_API_BASE_URL` | `https://restful-booker.herokuapp.com` | `bookingService` |
| `fakeRest` | `FAKEREST_API_BASE_URL` | `https://fakerestapi.azurewebsites.net` | `fakeRestService`, `booksService`, `authorsService`, `coverPhotosService`, `activitiesService`, `usersService` |
| `default` | `API_BASE_URL` | `https://api.dev.example.com` | Generic `apiRequest`, `authService`, API/UI integration |

Set these variables in the ignored root `.env` file or your CI environment. `NODE_ENV` remains environment metadata; supply the appropriate host variables for each environment. It does not discover hostnames or select an environment file.

- Named targets **do not fall back to `API_BASE_URL`**. Migrate an existing Booking-only configuration to `BOOKING_API_BASE_URL`, or a FakeRest-only configuration to `FAKEREST_API_BASE_URL`.
- Credentials are scoped too: `BOOKING_API_KEY`, `BOOKING_API_USER`, `BOOKING_API_PASS`, and the equivalent `FAKEREST_API_*` variables. Generic `API_KEY`, `API_USER`, and `API_PASS` apply only to `default`. These are available in the configuration; authentication remains API-specific and keys are not automatically sent in an assumed header.
- Per-target `*_TIMEOUT_MS` and `*_RETRY_ATTEMPTS` override the generic settings. The retry configuration remains metadata for retry helpers; the client does not automatically retry requests.
- Request contexts own default headers and cookies and are disposed after each test. Do not mutate shared configuration or `process.env` inside tests.
- Configure a host plus optional gateway prefix, such as `https://gateway.example.test/booking-service`. [BaseAPI.ts](./base/BaseAPI.ts) resolves `/booking/123` as `https://gateway.example.test/booking-service/booking/123`. Trailing slashes are normalized automatically.
- Service resource/version paths remain relative in service classes (for example `/api/v1/Books`). Do not repeat these paths in the configured gateway prefix. Changing hosts does not infer changes to an API's resource names or version.
- Direct context calls must use relative paths **without a leading slash** to preserve a gateway prefix. Built-in Playwright `request` and the project's generic `apiRequest` are different fixtures; use the latter for named routing.

For a raw-request suite, explicitly select the target once:

```typescript
import { test, expect } from "../../fixtures/apiFixtures";

test.use({ apiTarget: "fakeRest" });

test("lists books", async ({ apiRequest }) => {
  const response = await apiRequest.get("api/v1/Books");
  expect(response.status()).toBe(200);
});
```

A test can use `bookingService` and `booksService` together without `test.use`. For direct context access, use `bookingApiRequest` and `fakeRestApiRequest`. `apiTarget` only selects the generic `apiRequest`/`apiConfig`; it never redirects named service fixtures.

When adding an API:

1. Register its name, environment-variable prefix, and default host in `API_TARGETS` in [apiConfig.ts](./config/apiConfig.ts). `APIName` updates automatically.
2. Reuse `apiRequest` with `test.use({ apiTarget: "newTarget" })`, or wire a dedicated request fixture to `APIClient.create("newTarget")` and inject it into the new service.
3. Extend `BaseAPI` and keep endpoint paths relative. Do not construct URLs with `process.env`, embed hostnames, or change the shared `api` project's hostname to switch services.
4. Add a local routing regression to [api-routing.spec.ts](./tests/framework/api-routing.spec.ts). Tests may override the `apiConfigs` fixture with complete per-target configurations; no global environment mutation is needed.

`APIClient.create()` and `API_CONFIG` retain the generic default configuration for legacy callers. Manually created contexts must be disposed in `finally` blocks. Custom configurations passed to `APIClient.create(config)` receive the same base-URL validation and normalization as named targets.

Run the offline regression suite (local servers only; no browser or public API required):

```powershell
npx playwright test --config=api\config\framework.playwright.config.ts
```

Test template (Playwright + request)

- Use the project's `apiRequest` fixture or named service fixtures.
- Follow this scaffold so tools and reporters can parse intent.

import { test, expect } from '../../fixtures/apiFixtures';
import Ajv from 'ajv';
import userSchema from '../../models/schemas/user.schema.json';

const ajv = new Ajv();

/*
METADATA JSON BLOCK
*/

test.describe('user - Create', () => {
  test('Create user with valid payload', async ({ apiRequest }) => {
    // Arrange
    const payload = {
      name: 'Jane Doe',
      email: `jane.${Date.now()}@example.com`,
      password: 'P@ssw0rd'
    };

    // Act
    const resp = await apiRequest.post('users', { data: payload });

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
- Avoid duplicating HTTP client logic inside tests; reuse [APIClient.ts](./APIClient.ts) through [apiFixtures.ts](./fixtures/apiFixtures.ts).

PR checklist for generated API tests

- Metadata block present and accurate.
- Uses JSON schema validation for responses when available.
- No secrets hardcoded.
- Test runs locally via `npx playwright test <file>` and passes against the target environment.

Generator guidelines for agents (how to use this file)

- Always create the metadata JSON block first.
- Use the named service fixture for the target API. For new APIs, follow the registration steps above before generating tests; never embed a hostname in a test or service endpoint.
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

import { test, expect } from '../../fixtures/apiFixtures';
import Ajv from 'ajv';
import userSchema from '../../models/schemas/user.schema.json';

const ajv = new Ajv();

test('Create user with valid payload', async ({ apiRequest }) => {
  const payload = { name: 'Agent User', email: `agent.${Date.now()}@example.com`, password: 'P@ssw0rd' };
  const resp = await apiRequest.post('users', { data: payload });
  expect(resp.status()).toBe(201);
  const body = await resp.json();
  expect(ajv.validate(userSchema, body)).toBeTruthy();
});

---

If you want agents to enforce additional rules (specific metadata fields, naming prefixes, or a different test runner), update this file and notify agents.
---
title: "Restful Booker - Full API flow"
type: "api"
feature: "restful-booker"
author: "agent/playwright-orchestrator"
date: "2026-10-02"
scenarios:
  - id: 1
    title: "Create token"
  - id: 2
    title: "Get booking ids"
  - id: 3
    title: "Get booking by id"
  - id: 4
    title: "Create booking"
  - id: 5
    title: "Update booking"
  - id: 6
    title: "Partial update booking"
  - id: 7
    title: "Delete booking"
  - id: 8
    title: "Healthcheck"
---

# Plan: Restful Booker - Full API flow

Location: `./test-plans/api-restful-booker-books-test-plan.md`

Feature: `restful-booker`
Type: `api`
Author: `agent/playwright-orchestrator`
Date: `2026-10-02`

## Overview

End-to-end API tests for Restful Booker covering auth, CRUD on bookings, and healthcheck.

## Run command

```bash
export API_BASE_URL=https://restful-booker.herokuapp.com
npx playwright test api/tests/booker --project=api --reporter=line,allure-playwright
```

## Goals

1. Validate authentication/token creation and usage.
1. Validate create/read/update/delete lifecycle for bookings.
1. Validate negative scenarios (invalid payloads, invalid IDs, unauthorized operations).
1. Validate edge cases (partial updates, large payloads, concurrency where applicable).

## Naming & Conventions

- Follow `test-plans/<api>-<resource>-test-plan.md` for filenames.
- Service wrapper: `api/services/<Resource>Service.ts` and fixture exposed from `api/fixtures/apiFixtures.ts`.
- Tests: `api/tests/<api-resource>/<resource>.spec.ts`.

## Test cases

1. List booking IDs
- Call `GET /booking` (or `/bookings` per API) and expect `200` with an array of ids.

1. Create token (auth)
- `POST /auth` with valid credentials -> expect `200` and token in response.

1. Create booking (happy path)
- `POST /booking` with valid payload -> expect `200` and returned booking id/object.

1. Get booking by id (happy path)
- `GET /booking/{id}` -> expect `200` and returned object matches created data.

1. Update booking (full update)
- `PUT /booking/{id}` with full payload -> expect `200` and fields updated.

1. Partial update booking (patch)
- `PATCH /booking/{id}` with partial payload -> expect `200` and partial fields updated.

1. Delete booking
- `DELETE /booking/{id}` -> expect `201` or `200` depending on API; then `GET` should return `404`.

1. Negative: get non-existent booking
- `GET /booking/{largeId}` -> expect `404`.

1. Negative: unauthorized update/delete
- Attempt to `PUT`/`DELETE` without valid token -> expect `403` or `401`.

1. Edge: large payloads
- Create booking with very long strings in fields -> observe server behavior; clean up if created.

1. Edge: boundary values
- Use minimal and maximal values for numeric fields where applicable.

## Implementation notes

- Add a `RestfulBookerService` wrapper under `api/services` that uses `BaseAPI`.
- Expose it via `api/fixtures/apiFixtures.ts` as `restfulBookerService`.
- Tests must clean up created resources where possible.
- Map each test to an OpenAPI operation and document the operation id in the test comment.

## CI / Review

- Tests live under `api/tests/booker/` and run with the `api` Playwright project.
- Re-scan Swagger/OpenAPI before adding more scenarios and update this plan if new endpoints are discovered.
